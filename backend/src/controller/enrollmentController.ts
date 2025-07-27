import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Course from "../model/courseModel";
import Enrollment from "../routes/EnrollmentModel";
import Student from "../model/studentProfile";
import { createRazorpayOrder, IRazorder, verifyRazorpayPayment } from "../utils/razorpayOrder";
import Payment from "../model/paymentModel";
import Lesson from "../model/LessonModel";


//  create enrollment

export const createEnrollment = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.body
    const studentId = req.user?._id
    const course = await Course.findOne(
        { _id: courseId},
        { _id: 0, price: 1}
    )
    const amount = course?.price

    const enrollment = await Enrollment.findOneAndUpdate(
        {
            courseId: courseId,
            studentId: studentId,
        },
        {
            courseId: courseId,
            studentId: studentId,
            payment_status: "pending"
        },
        {
            new: true,
            upsert: true
        }
    )

    const user = await Student.findOne(
        { userID: studentId},
        { name: 1, phone: 1}
    )

    const Razoroder = await createRazorpayOrder(
        enrollment._id as unknown as string,
        amount as number
    )
    .then((order) => order)
    .catch((err) => {
        if(err) {
            res.status(500)
            next(Error("Error occured in razorpay"))
        }
    })

    const timestamp = (Razoroder as IRazorder).created_at;
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toISOString();

    await Payment.findOneAndUpdate(
      {
        enrollmentId: enrollment._id,
      },
      {
        paymentId: (Razoroder as IRazorder).id,
        amount: (Razoroder as IRazorder).amount / 100,
        currency: (Razoroder as IRazorder).currency,
        enrollmentId: enrollment._id,
        status: (Razoroder as IRazorder).status,
        created_at: formattedDate,
      },
      {
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      order: Razoroder,
      user,
    });
  }
);

// verify payment

export const verifyPayment = expressAsyncHandler(async(req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

  const isVerified = verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

  if (isVerified) {
      const payment = await Payment.findOne(
        { paymentId: razorpay_order_id },
        { _id: 0, enrollmentId: 1 }
      );

      if (payment) {
        const enrollmentId = payment.enrollmentId;

        await Enrollment.findOneAndUpdate(
          { _id: enrollmentId },
          { payment_status: "completed" }
        );

        res.json({
          success: true,
          message: "payment verified successfull",
        });
      }
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
})


// update progress

export const updateProgress = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { lessonId, courseId } = req.body;
    const userId = req.user?._id;
    const enrollement = await Enrollment.findOne({
      courseId: courseId,
      studentId: userId,
    });
    const lessons = await Lesson.find({ courseId: courseId });
    const progress = await Enrollment.findOneAndUpdate(
      {
        courseId: courseId,
        studentId: userId,
      },
      {
        $addToSet: {
          completed: lessonId,
        },
        isComplete:
          enrollement?.completed?.length === lessons.length - 1 ||
          enrollement?.completed?.length === lessons.length
            ? true
            : false,
      },
      {
        new: true,
      }
    );
    if (progress) {
      res.status(200).json({
        success: true,
        progress: progress.completed,
        isComplete: progress.isComplete,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
  }
)



// get all my courses student

export const getAllMycourse = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {

      const { courseId } = req.body;
    const studentId = req.user?._id;
    const course = await Course.findOne(
      { _id: courseId },
      { _id: 0, price: 1 }
    );
    const amount = course?.price;
    
  const enrollments = await Enrollment.aggregate([
      { $match: { payment_status: "completed", studentId: studentId } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
          pipeline: [
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "courseId",
                as: "lessons",
              },
            },
            {
              $lookup: {
                from: "certificates",
                localField: "_id",
                foreignField: "courseId",
                as: "certificate",
                pipeline: [{ $match: { userId: studentId } }],
              },
            },
            {
              $project: {
                lessons: 1,
                title: 1,
                description: 1,
                coverIMG: 1,
                price: 1,
                language: 1,
                hasCertificate: { $eq: [{ $size: "$certificate" }, 1] },
              },
            },
          ],
        },
      },
      {
        $unwind: { path: "$course", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          courseId: 1,
          completed: 1,
          isComplete: 1,
          "course.title": 1,
          "course.description": 1,
          "course.coverIMG": 1,
          "course.price": 1,
          "course.language": 1,
          "course.hasCertificate": 1,
          "course.lessons.title": 1,
          "course.lessons._id": 1,
          "course.lessons.description": 1,
          "course.lessons.video": 1,
          "course.lessons.duration": 1,
        },
      },
    ]);
    if (enrollments) {
      res.status(200).json({
        success: true,
        enrollments,
      });
    } else {
      res.status(500);
      next(Error("Internal server Error"));
    }
})


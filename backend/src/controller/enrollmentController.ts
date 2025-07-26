import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Course from "../model/courseModel";
import Enrollment from "../routes/EnrollmentModel";
import Student from "../model/studentProfile";
import { createRazorpayOrder, IRazorder } from "../utils/razorpayOrder";
import Payment from "../model/paymentModel";


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

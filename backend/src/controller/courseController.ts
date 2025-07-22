import { NextFunction, Request, RequestHandler, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import { ObjectId } from "mongodb"
import Course from "../model/courseModel"
import mongoose from "mongoose"


// create course
export const createCourse: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    const {
      coverIMG,
      description,
      price,
      teacherId,
      title,
      language,
      category,
    } = req.body

    const newCourse = await Course.create({
      title,
      coverIMG,
      description,
      price,
      language,
      category,
      teacherId: new ObjectId(teacherId),
    })
    if (newCourse) {
        res.status(200).json({
            success: true,
            message: "course added successfully ",
            newCourse
        })
    } else {
        next(Error("internal server error"))
    }
})

// get course

export const getCourse: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const pageSize = 8
    const userId = req.user?._id
    let courses = await Course.aggregate([
        {
            $match: {
                isDelete: false,
            }
        },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "courseId",
                as: "ratings",
                pipeline: [
                    {
                       $match: {
                        $expr: {
                            $and : [{ $gte: ["$rating", 1]}, { $lte: ["$rating", 5]}],
                        },
                       } ,
                    },
                ],
            },
        },
        { 
            $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true},
        },
        {
            $group: {
                _id: "$_id",
                averageRating: { $avg: "$rating.rating"},
            },
        },
        { 
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "courseId",
                as: "enrollment",
                pipeline: [
                    { $match: { studenId: userId, payment_status: "completed"}}
                ]
            }
        },
        {
        $project: {
          "course.title": 1,
          "course.description": 1,
          "course.price": 1,
          "course.coverIMG": 1,
          "course.category": 1,
          "course.language": 1,
          "course.createdAt": 1,
          isEnrolled: { $eq: [{ $size: "$enrollment" }, 1] },
          averageRating: { $ifNull: ["$averageRating", 0] },
        },
      },
    ])

    courses = courses.slice(
        (page - 1) * pageSize,
        Math.min((page - 1) * pageSize + pageSize, courses.length)
    )

    
    if (req.query.search) {
      const query = (req.query.search as string)
        .toLowerCase()
        .replace(/\s/g, "");
      courses = courses.filter((e) => {
        const title = e.course.title.toLowerCase().replace(/\s/g, "");
        if (title.includes(query)) {
          return true;
        } else if (query.includes(title)) {
          return true;
        }
        const language = e.course.language.toLowerCase().replace(/\s/g, "");
        if (language.includes(query)) {
          return true;
        } else if (query.includes(language)) {
          return true;
        }
        const category = e.course.category.toLowerCase().replace(/\s/g, "");

        if (category.includes(query)) {
          return true;
        } else if (query.includes(category)) {
          return true;
        }
      });
    }

    if (req.query.category) {
      courses = courses.filter((e) => e.course.category === req.query.category);
    }
    if (req.query.language) {
      courses = courses.filter((e) => e.course.language === req.query.language);
    }

    const sortQuery = req.query.sort;
    switch (sortQuery) {
      case "low-high":
        courses.sort((a, b) => {
          const priceA = parseFloat(a.course.price);
          const priceB = parseFloat(b.course.price);
          return priceA - priceB;
        });
        break;
      case "high-low":
        courses.sort((a, b) => {
          const priceA = parseFloat(a.course.price);
          const priceB = parseFloat(b.course.price);
          return priceB - priceA;
        });
        break;
      case "new-first":
        courses.sort((a, b) => {
          const createdAtA = new Date(a.course.createdAt);
          const createdAtB = new Date(b.course.createdAt);
          return createdAtB.getTime() - createdAtA.getTime();
        });
        break;
      case "popular":
        courses.sort((a, b) => {
          const ratingA = parseFloat(a.averageRating);
          const ratingB = parseFloat(b.averageRating);
          return ratingB - ratingA;
        });
        break;
      default:
        break;
    }
    let count = await Course.countDocuments();
    count = Math.ceil(count / 8);
    if (courses) {
      res.status(200).json({
        success: true,
        courses,
        count,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
  }
);

// get tutor course
export const getMyCourse = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const teacherId = req.user?._id
    const courses = await Course.find({
        teacherId: teacherId,
        isDelete: false
    })
      if (courses) {
      res.status(200).json({
        success: true,
        courses,
      });
    } else {
      res.status(500);
      next(Error("Internal server Error"));
    }
})


// view course details 


export const viewCourse: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?._id;
    const coursId = req.params.id;
    const course = await Course.aggregate([
      {
        $match: {
          isDelete: false,
          _id: new mongoose.Types.ObjectId(coursId),
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $gte: ["$rating", 1] }, { $lte: ["$rating", 5] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
          pipeline: [
            {
              $lookup: {
                from: "teachers",
                localField: "teacherId",
                foreignField: "userID",
                as: "author",
              },
            },
            {
              $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                _id: 0,
                title: 1,
                description: 1,
                category: 1,
                language: 1,
                price: 1,
                coverIMG: 1,
                "author.name": 1,
                "author.bio": 1,
                "author.profile": 1,
                "author.languages": 1,
                "author.qualification": 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollment",
          pipeline: [
            { $match: { studentId: userId, payment_status: "completed" } },
          ],
        },
      },
      {
        $lookup: {
          from: "lessons",
          foreignField: "courseId",
          localField: "_id",
          as: "lessons",
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
          pipeline: [
            {
              $lookup: {
                from: "students",
                localField: "userId",
                foreignField: "userID",
                as: "student",
              },
            },
            {
              $unwind: {
                path: "$student",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                rating: 1,
                review: 1,
                "student.name": 1,
                "student.profile": 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          course: 1,
          isEnrolled: { $eq: [{ $size: "$enrollment" }, 1] },
          averageRating: { $ifNull: ["$averageRating", 0] },
          "lessons._id": 1,
          "lessons.title": 1,
          "lessons.duration": 1,
          "lessons.video": 1,
          "lessons.description": 1,
          ratings: 1,
          "author.name": 1,
          "author.profile": 1,
          "author.bio": 1,
          "author.qualification": 1,
          "author.languages": 1,
        },
      },
    ]);
    if (course) {
      res.status(200).json({
        success: true,
        course: course[0],
      });
    } else {
      res.status(500);
      next(Error("Internal server Error"));
    }
  }
);

// edit course
export const editCourse: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id
    const {coverIMG, description, price, title, category, language} = req.body

    const updatedCourse = await Course.findOneAndUpdate(
         { _id: courseId },
      {
        coverIMG,
        description,
        price,
        title,
        category,
        language,
      },
      { new: true }
    )
    if (updatedCourse) {
      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        updatedCourse,
      });
    } else {
      res.status(500);
      next(Error("Internal server Error"));
    }
})

// deletecourse
export const deletecourse: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id

     const deletedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        isDelete: true,
      },
      { new: true }
    );
    if (deletedCourse) {
      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } else {
      res.status(500);
      next(Error("Internal server Error"));
    }
  }
)
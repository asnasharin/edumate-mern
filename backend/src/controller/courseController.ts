import { NextFunction, Request, RequestHandler, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import { ObjectId } from "mongodb"
import Course from "../model/courseModel"


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
import { Express, RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import Course from "../model/courseModel";
import Lesson from "../model/LessonModel";
import { ObjectId } from "mongodb";

// create lesson
export const createLesson: RequestHandler = expressAsyncHandler(async(req, res, next) => {
    const { courseId, description, duration, title, video} = req.body
    const isCourseExist = await Course.findOne({ _id: courseId})

    if (!isCourseExist) {
        res.status(404)
        return next(Error("course not found"))
    }

    const newLesson = await Lesson.create({
        courseId: new ObjectId(courseId),
        description,
        title,
        duration,
        video
    })
    if (newLesson) {
        res.status(200).json({
            success: true,
            message: "lesson created successfully",
            newLesson
        })
    } else {
        res.status(500)
        next(Error("internal server error"))
    }
})

// get lessons of a course 

export const getLessons: RequestHandler = expressAsyncHandler(async(req, res, next) => {
    const courseId = req.params.id
    const lesson = await Lesson.find({
        courseId: new ObjectId(courseId),
        isDelete: false
    })
    if(lesson) {
        res.status(200).json({
            success: true,
            lesson
        })
    } else {
        res.status(500)
        next (Error("internal server error"))
    }
})

// edit lesson

export const editLesson: RequestHandler = expressAsyncHandler(async(req, res, next) => {
    const courseId = req.params.id
    const { title, description, video, duration} = req.body
    const updatedLesson = await Lesson.findOneAndUpdate(
        {_id: new ObjectId(courseId)},
        {
            title,
            description,
            video, 
            duration
        },
        { new: true}
    )
    if (updatedLesson) {
        res.status(200).json({
            success: true,
            message: "lesson updated successfully",
            updatedLesson
        })
    } else {
        res.status(500)
        next (Error("internal server error"))
    }
})

// delete lesson

export const deleteLesson: RequestHandler = expressAsyncHandler(async(req, res, next) => {
    const lessonId = req.params.id
    const deleteLesson = await Lesson.findOneAndUpdate(
        {_id: new ObjectId(lessonId)},
        { isDelete: true},
        { new: true}
    )
    if (deleteLesson) {
        res.status(200).json({
            success: true,
            message: "lesson deleted successfully"
        })
    } else {
        res.status(500)
        next(Error("internal server error"))
    }
})
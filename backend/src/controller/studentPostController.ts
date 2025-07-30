import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import StudentPosts from "../model/StudentPostModel";


// create user post

export const createStudentPost = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userID = req.user?._id
    const { subject, title, description, budget, language } = req.body.formDate;
    const udatedUser = await StudentPosts.create({
      studentId: userID,
      title: title,
      description: description,
      subject: subject,
      budget: parseInt(budget, 10),
      language: language,
    });
    if (udatedUser) {
      res.status(200).json({
        success: true,
        message: "Student Post Created Succefully!",
        udatedUser: {
          title: udatedUser.title,
          description: udatedUser.description,
          subject: udatedUser.subject,
          budjet: udatedUser.budget,
          language: udatedUser.language,
        },
      });
    } else {
      next(Error("Something went wrong!"));
    }
})

// update user post

export const updateStudentPost = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const deletedPost = await StudentPosts.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        isDelete: true,
      },
      { new: true }
    );
    if (deletedPost) {
      res.status(200).json({
        success: true,
        message: "Post Deleted Succefully!",
        post: deletedPost,
      });
    } else {
      next(Error("Something went wrong!"));
    }
})

// get all studnet post

export const getAllPost = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const userID = req.user?._id;
    const posts = await StudentPosts.find({
      studentId: userID,
      isDelete: false,
    });

    if (posts) {
      res.status(200).json({
        success: true,
        posts: posts,
      });
    } else {
      next(Error("Something went wrong!"));
    }
})
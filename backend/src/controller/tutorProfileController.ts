import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Teacher from "../model/teacherProfile";
import mongoose from "mongoose";



// get tutor profile
export const getProfile = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id
    const userProfile = await Teacher.findOne({ userID: userId });
    if (userProfile) {
      res.status(200).json({
        success: true,
        userProfile: userProfile,
      });
    } else {
      return next(Error("Somthing went wrong"));
    }
})


// update profile picture

export const updateProfilePicture = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.user?._id;
    const { url } = req.body;
    const updatedUser = await Teacher.findOneAndUpdate(
      { userID: new mongoose.Types.ObjectId(userID) },
      {
        profile: url,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        userProfile: updatedUser,
      });
    } else {
      res.status(400);
      return next(Error("Some Error Occured"));
    }
  }
);

// tutor update profile

export const updateTutorProfile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { name, phone, bio, qualification, languages, pricing } =
      req.body.data;
    const updatedUser = await Teacher.findOneAndUpdate(
      { userID: userId },
      {
        name: name,
        phone: parseInt(phone, 10),
        bio: bio,
        qualification: qualification,
        languages: languages,
        pricing: parseInt(pricing, 10),
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        userProfile: updatedUser,
      });
    } else {
      res.status(400);
      return next(Error("Some Error Occured"));
    }
  }
);

// get student posts

export const getStudentPosts = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  
})
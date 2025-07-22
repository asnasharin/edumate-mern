import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import admin from "../model/adminProfile";
import mongoose from "mongoose";



// get admin profile
export const getAdminProfile = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
     const userId = req.user?._id;
    const userProfile = await admin.findOne({ userID: userId });
    if (userProfile) {
      res.status(200).json({
        success: true,
        userProfile: userProfile,
      });
    } else {
      return next(Error("Somthing went wrong"));
    }
  
})


export const updateProfilePicture = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.user?._id;
    const { url } = req.body;
    const updatedUser = await admin.findOneAndUpdate(
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

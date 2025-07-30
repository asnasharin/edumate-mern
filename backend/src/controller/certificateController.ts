import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Certificate from "../model/certificateModel";
import mongoose from "mongoose";

 
//  create certificate
export const createCertificate = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { courseId, ID } = req.body;
    const certificate = await Certificate.findOneAndUpdate(
      {
        userId: userId,
        courseId: new mongoose.Types.ObjectId(courseId),
      },
      {
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId),
        ID: ID,
      },
      {
        new: true,
        upsert: true,
      }
    );
    if (certificate) {
      res.status(200).json({
        success: true,
        certificate,
      });
    } else {
      res.status(500);
      next(Error("Inernal server Error"));
    }
})


// get certificate

export const getCertificate = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const courseId = req.params.id;
    const certificate = await Certificate.findOne({ userId, courseId });
    if (certificate) {
      res.status(200).json({
        success: true,
        certificate,
      });
    } else {
      res.status(404);
      next(Error("certificate not found"));
    }
})

// verify certificate

export const verifyCertificate = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { ID } = req.body;
    const certificate = await Certificate.aggregate([
      { $match: { ID: ID } },
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "userID",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: { path: "$course", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          ID: 1,
          "user.name": 1,
          "course.title": 1,
          createdAt: 1,
        },
      },
    ]);
    if (certificate) {
      if (certificate.length > 0) {
        res.status(200).json({
          success: true,
          certificate: certificate[0],
        });
      } else {
        res.status(200).json({
          success: false,
        });
      }
    } else {
      res.status(404);
      next(Error("certificate not found"));
    }

})
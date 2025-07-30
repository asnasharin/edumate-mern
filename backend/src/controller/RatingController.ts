import { NextFunction, Request, RequestHandler, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Rating from "../model/RatingModel";

// create tutor rating

export const createTutorRating = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
       const { rating, review, _id } = req.body;
    const user = req.user;
    const createRating = await Rating.findOneAndUpdate(
      {
        userId: user?._id,
        tutorId: _id,
      },
      {
        rating: parseInt(rating, 10),
        review: review,
      },
      {
        new: true,
        upsert: true,
      }
    );
    if (createRating) {
      res.status(200).json({
        success: true,
        rating: createRating,
      });
    } else {
      next(Error("internel Server Error"));
    }
})

// get tutor rating

export const getAllCourseRating: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
   const userId = req.user?._id;
    const getMyRating = await Rating.find({
      userId: userId,
      tutorId: { $ne: null },
    });
    if (getMyRating) {
      res.status(200).json({
        success: true,
        ratings: getMyRating,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
})

// create rating

export const createRating = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const { rating, review, _id } = req.body;
    const user = req.user;
    const createRating = await Rating.findOneAndUpdate(
      {
        userId: user?._id,
        courseId: _id,
      },
      {
        rating: parseInt(rating, 10),
        review: review,
      },
      {
        new: true,
        upsert: true,
      }
    );
    if (createRating) {
      res.status(200).json({
        success: true,
        rating: createRating,
      });
    } else {
      next(Error("internel Server Error"));
    }
})

// get all courserating

export const getMyCourseRating = expressAsyncHandler(async(req: Request, res:Response, next: NextFunction) => {
  const userId = req.user?._id;
    const getMyRating = await Rating.find({
      userId: userId,
      courseId: { $ne: null },
    });
    if (getMyRating) {
      res.status(200).json({
        success: true,
        ratings: getMyRating,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
})
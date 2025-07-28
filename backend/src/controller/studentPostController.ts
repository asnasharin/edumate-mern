import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Rating from "../model/RatingModel";

// create rating

export const createRating = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
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
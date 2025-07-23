import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";


// get all tutors
export const getAllTutors = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const query: {name?: { $regex: RegExp } } = {}
    const page: number = parseInt(req.query.page as string, 10) || 1;
})
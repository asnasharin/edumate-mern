import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const errorHandler = (err: any, req: Request, res: Response,next: NextFunction) => {
   const statuscode: number = res.statusCode == 200 ? 500 : res.statusCode;
   res.status(statuscode);
   res.json({
        status: "error",
        message: err?.message,
   });
};

export { errorHandler, notFound };

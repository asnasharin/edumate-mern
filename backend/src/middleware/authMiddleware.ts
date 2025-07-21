import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../model/userModel";
import mongoose from "mongoose";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}

// export const protect = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.cookies.token;
//     const role = req.headers.authorization?.split(" ")[1];
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
//         const userId = new mongoose.Types.ObjectId(decoded.userId);
//         const user = await User.findOne({ _id: userId });
//         if (!user || user.role !== role) {
//           res.status(401);
//           next(Error("Unauthorized user"));
//         } else if (!user.status) {
//           res.status(401);
//           next(Error("Account has been blocked"));
//         } else {
//           req.user = user;
//         }
//         next();
//       } catch (error) {
//         res.status(401);
//         next(new Error("Not authorized, token failed"));
//       }
//     } else {
//       res.status(401);
//       res.status(401);
//       next(new Error("Not authorized, token failed"));
//     }
//   }
// );


export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, token missing or invalid format");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
        userId: string;
      };

      const userId = new mongoose.Types.ObjectId(decoded.userId);
      const user = await User.findById(userId);

      if (!user) {
        res.status(401);
        throw new Error("Unauthorized user");
      }

      if (!user.status) {
        res.status(401);
        throw new Error("Account has been blocked");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const userId = new mongoose.Types.ObjectId(decoded.userId);
        const user = await User.findOne({ _id: userId });
        console.log("Header:", req.headers.authorization);
console.log("Token:", token);

        if (user) {
          req.user = user;
          next();
        } else {
          next();
        }
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  }
);

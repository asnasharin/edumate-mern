import asyncHandler from "express-async-handler"
import { NextFunction, Request,Response } from "express"
import User, {IUser} from "../model/userModel"
import Student from "../model/studentProfile"
import { generateTocken } from "../utils/genereateToken"
import Teacher from "../model/teacherProfile"
import admin from "../model/adminProfile"


// user signup
export const userSignup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, phone } = req.body
    const isExist = await User.findOne({ email: email})

    if (!isExist) {
        const createUser = await User.create({
            email: email,
            password: password,
            role: role,
        })
        const token = generateTocken(createUser._id)
        if (createUser) {
            if (createUser.role === "STUDENT") {
                await Student.create({
                    userID: createUser._id,
                    phone: phone,
                    name: name
                })
            } else if (createUser.role === "TUTOR") {
                await Teacher.create({
                    userID: createUser._id,
                    phone: phone,
                    name: name
                })
            } else if (createUser.role === "ADMIN") {
                await admin.create({
                    userID: createUser._id,
                    name: name,
                    phone: phone
                })
            }

            res.status(200).json({
                success: true,
                message: "user created successfully",
                user: {
                    _id: createUser._id,
                    email: createUser.email,
                    role: createUser.role,                   
                },
                 token: token
            })
        } else {
            res.status(500)
            throw new Error("something went wrong")
        }
    } else {
        res.status(401)
        throw new Error("Email already exist")
    }
})




// User login
export const userLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne<IUser>({ email });

  if (!user) {
    res.status(401);
    return next(new Error("User not found"));
  }

  if (!user.status) {
    res.status(401);
    return next(new Error("This account has been blocked"));
  }

  if (user.password && (await user.matchPassword(password))) {
    const token = generateTocken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401);
    return next(new Error("Invalid credentials"));
  }
});
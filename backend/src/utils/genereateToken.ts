import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const generateTocken = (userId: ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
  return token;
};

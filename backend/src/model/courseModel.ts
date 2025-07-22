import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface ICourse {
  teacherId: ObjectId;
  title: string;
  description: string;
  price: number;
  coverIMG: string;
  isDelete: boolean;
  category: string;
  language: string;
}

const CourseSchema = new Schema<ICourse>(
  {
    teacherId: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverIMG: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, required: true },
    isDelete: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", CourseSchema);
export default Course;

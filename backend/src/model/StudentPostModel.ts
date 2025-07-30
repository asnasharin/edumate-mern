import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface IstudentPost {
  studentId: ObjectId;
  title: string;
  description: string;
  subject: string;
  budget: number;
  isDelete: boolean;
  language: string;
}

const sturdentPsotSchema = new Schema<IstudentPost>(
  {
    studentId: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isDelete: { type: Boolean, required: true, default: false },
    language: { type: String, required: true },
    subject: { type: String, required: true },
    budget: { type: Number, required: true },
  },
  { timestamps: true }
);

const StudentPosts = model("studentPosts", sturdentPsotSchema);
export default StudentPosts;

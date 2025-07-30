import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface ICertificate {
  ID: string;
  userId: ObjectId;
  courseId: ObjectId;
}

const certificateShema = new Schema<ICertificate>(
  {
    ID: { required: true, type: String },
    userId: { required: true, type: mongoose.Types.ObjectId },
    courseId: { required: true, type: mongoose.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

const Certificate = model("certificate", certificateShema);
export default Certificate;

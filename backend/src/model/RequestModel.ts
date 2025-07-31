import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface IRequest {
  teacherId: ObjectId;
  studentId: ObjectId;
  createdBy: ObjectId;
  status: string;
  read: boolean;
}

const RequestSchema = new Schema<IRequest>(
  {
    studentId: { type: mongoose.Types.ObjectId, required: true },
    teacherId: { type: mongoose.Types.ObjectId, required: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true },
    status: {
      type: String,
      required: true,
      default: "PENDING",
      enum: ["PENDING", "CONNECTED"],
    },
    read: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Requests = model("Request", RequestSchema);
export default Requests;

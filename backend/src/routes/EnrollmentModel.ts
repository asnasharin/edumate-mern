import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface IEnrollement {
  studentId: ObjectId;
  courseId: ObjectId;
  payment_status: string;
  completed?: string[];
  isComplete: boolean;
}

const enrollmentSchema = new Schema<IEnrollement>({
  studentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["pending", "completed"],
  },
  isComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
  completed: {
    type: Array,
    required: true,
    default: [],
  },
});

const Enrollment = model("Enrollment", enrollmentSchema);
export default Enrollment;

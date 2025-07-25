import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface ILesson {
  courseId: ObjectId;
  title: string;
  description: string;
  duration: number;
  video: string;
  isDelete: boolean;
}

const lessonSchema = new Schema<ILesson>({
  courseId: { type: mongoose.Types.ObjectId, required: true, ref: "courses" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  video: { type: String, required: true },
  isDelete: { type: Boolean, required: true, default: false },
});

const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;

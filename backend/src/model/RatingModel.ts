import mongoose, { ObjectId, Schema, model } from "mongoose";
export interface IRating {
  rating: number;
  review: string;
  userId: ObjectId;
  courseId?: ObjectId;
  tutorId?: ObjectId;
}

const ratingSchema = new Schema<IRating>({
  courseId: mongoose.Types.ObjectId,
  tutorId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  rating: { type: Number, required: true },
  review: { type: String, required: true },
});

const Rating = model("Rating", ratingSchema);
export default Rating;

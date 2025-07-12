import mongoose, { Schema, model, ObjectId } from "mongoose";

interface ITeacherProfile {
  userID: ObjectId;
  name: string;
  phone?: number;
  profile?: string;
  bio?: string;
  qualification?: string[];
  languages?: string[];
  pricing: number | null;
  connections?: string[];
}

const teacherProfile = new Schema<ITeacherProfile>({
  userID: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  profile: { type: String, default: "" },
  bio: { type: String, default: "" },
  qualification: { type: Array, default: [] },
  languages: { type: Array, default: [] },
  pricing: { type: Number, default: null },
  connections: { type: Array, default: [] },
});

const Teacher = model<ITeacherProfile>("teacher", teacherProfile);
export default Teacher;

import mongoose, { Schema, model, ObjectId } from "mongoose";

interface IAdminProfile {
  userID: ObjectId;
  name: string;
  phone?: number;
  profile?: string;
}

const adminProfile = new Schema<IAdminProfile>({
  userID: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  profile: { type: String, default: "" }
});

const admin = model<IAdminProfile>("admin", adminProfile);
export default admin;

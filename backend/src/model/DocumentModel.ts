import mongoose, { Schema, model, ObjectId } from "mongoose";

interface IDocument {
  userID: ObjectId;
  name: string;
  document: string;
  isVerified: boolean;
}

const documentSchema = new Schema<IDocument>(
  {
    userID: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    document: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Document = model<IDocument>("document", documentSchema);
export default Document;

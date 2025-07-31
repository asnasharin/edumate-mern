import mongoose, { Schema, model, ObjectId } from "mongoose";

export interface IMessage {
  chatId: ObjectId;
  senderId: ObjectId;
  content: string;
  content_type: string;
  delivered_to: string[];
  isDelete: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: mongoose.Types.ObjectId, required: true },
    senderId: { type: mongoose.Types.ObjectId, required: true },
    delivered_to: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    content: { type: String, required: true },
    content_type: {
      type: "string",
      enum: ["TEXT", "MEDIA"],
      default: "TEXT",
    },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);
export default Message;

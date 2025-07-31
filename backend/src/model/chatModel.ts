import { Schema, model } from "mongoose";
export interface IChat {
  chatName: string;
  isGroupChat: boolean;
  members?: string[];
  isDelete: boolean;
}
const chatSchema = new Schema<IChat>(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean, required: true, default: false },
    members: { type: Array, required: true, default: [] },
    isDelete: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Chat = model("chat", chatSchema);
export default Chat;

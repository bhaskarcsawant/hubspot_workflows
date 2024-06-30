import mongoose from "mongoose";

interface IMessage {
  message: string;
  from: string;
  created_at: Date;
  updated_at: Date;
}

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  from: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
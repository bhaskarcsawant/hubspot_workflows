import mongoose, { Document, Schema, Types } from "mongoose";

interface IForm extends Document {
  formName: string;
  created_at: Date;
  updated_at: Date;
}

const formSchema: Schema<IForm> = new Schema({
  formName: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});


const Form = mongoose.model<IForm>("Form", formSchema);

export default Form;

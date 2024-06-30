import mongoose, { Document, Schema, Types } from "mongoose";

interface IForm extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  formId: string;
  created_at: Date;
  updated_at: Date;
}


const formSubmissionSchema: Schema<IForm> = new Schema({
  formId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});


const FormSubmission = mongoose.model<IForm>("FormSubmission", formSubmissionSchema);

export default FormSubmission;

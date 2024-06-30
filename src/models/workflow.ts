import mongoose, { Document, Schema } from 'mongoose';

interface Trigger {
  type: string;
  app: string;
  data: Record<string, unknown>;
}

interface Workflow extends Document {
  workflowName: string;
  trigger: Trigger;
  actions: Trigger[];
  created_at: Date;
  updated_at: Date;
}

const triggerSchema = new Schema<Trigger>({
  type: { type: String, required: true },
  app: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true } // Mixed type for dynamic data
});

const workflowSchema = new Schema<Workflow>({
  workflowName: { type: String, required: true },
  trigger: { type: triggerSchema, required: true },
  actions: { type: [triggerSchema], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create and export the model
const WorkflowModel = mongoose.model<Workflow>('Workflow', workflowSchema);

export default WorkflowModel;
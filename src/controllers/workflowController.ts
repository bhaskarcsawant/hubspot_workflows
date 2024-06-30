import { Request, Response } from 'express';
import Workflow from '../models/workflow';

interface WorkflowBody {
    workflowName: string;
    trigger: {
        type: string;
        app: string;
        data: Record<string, unknown>;
    };
    actions: {
        type: string;
        app: string;
        data: Record<string, unknown>;
    }[];
}

export const createWorkflow = async (req: Request<{}, {}, WorkflowBody>, res: Response): Promise<void> => {
  try {
    const newWorkflow = new Workflow(req.body);
    await newWorkflow.save();
    res.status(201).json(newWorkflow);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
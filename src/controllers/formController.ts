import { Request, Response } from 'express';
import Form from '../models/form';
import FormSubmission from '../models/formSubmission';
import { sqs } from '../helpers/awsHelper';

interface FormSubmissionBody {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  formId: string;
}
interface FormBody {
  formName: string;
}

type params = {
  MessageBody: string;
  QueueUrl: string;
};

//create form
export const createForm = async (req: Request<{}, {}, FormBody>, res: Response): Promise<void> => {
  try {
    const { formName } = req.body;
    const newForm = new Form({ formName });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFormSubmission = async (req: Request<{}, {}, FormSubmissionBody>, res: Response): Promise<void> => {
  try {
    const { formId, customerName, customerEmail, customerPhone } = req.body;
    const newForm = new FormSubmission({ formId, customerName, customerEmail, customerPhone });
    await newForm.save();

    // Prepare the data to be sent to the workflow
    let workflowData = {
      app: 'forms',
      type: 'new_submission',
      metaData: JSON.stringify({ formId }),
      data: newForm,
    }
    
    let params: params = {
      MessageBody: JSON.stringify(workflowData),
      QueueUrl: process.env.AWS_SQS_URL as string,
    };

    // Send the message
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data.MessageId);
      }
    });
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

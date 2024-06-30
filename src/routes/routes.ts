import express from 'express'
const router = express.Router();
import { createForm, createFormSubmission } from '../controllers/formController'
import { sendMessage, getMessages } from '../controllers/messageController';
import { createWorkflow } from '../controllers/workflowController';

router.route('/create_form').post(createForm);
router.route('/create_form_submission').post(createFormSubmission);

router.route('/get_messages').get(getMessages)
router.route('/send_message').post(sendMessage)

router.route('/create_workflow').post(createWorkflow);

export default router
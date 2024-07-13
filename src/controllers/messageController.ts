import { Request, Response } from 'express';
import Message from '../models/message';

interface MessageBody {
    message: string;
    from: string;
}

export const sendMessage = async (req: Request<{}, {}, MessageBody>, res: Response): Promise<void> => {
  try {
    const { message, from } = req.body;
    console.log(req.body)
    const newMessage = new Message({ message, from });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
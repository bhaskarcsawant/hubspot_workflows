import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = { };

  await mongoose.connect(process.env.MONGO_URI as string, options).then(() => {
    console.log('Connected to the database 🚀');
  });
};

export { connectToDatabase };

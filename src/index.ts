import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './helpers/databaseConnection';
import routes from './routes/routes';
import handelError from './middlewares/error';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '8080');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

app.use(express.json())

app.use("/api/v1", routes)
app.use(handelError)

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});

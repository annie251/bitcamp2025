import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

app.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await cohere.chat({
      model: 'command-r-plus',
      message: message,
    });
    res.json(response);
  } catch (error) {
    console.error('Error with Cohere:', error);
    res.status(500).json({ error: 'Something went wrong with the AI' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
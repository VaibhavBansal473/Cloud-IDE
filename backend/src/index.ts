import dotenv from 'dotenv';
dotenv.config({ path: './.env', override: true });

import express from 'express';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { seedDefaultProblems } from './utils/seedProblems';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cloud-ide.vercel.app"
    ],
    credentials: true,
  })
);

app.use('/api', routes);

app.listen(PORT, async () => {
  await seedDefaultProblems();
  console.log(`Server running on PORT: ${PORT}`);
});

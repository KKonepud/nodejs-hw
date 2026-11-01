import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/notesRoutes.js';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger);
app.use(express.json());
app.use(cors());

await connectMongoDB();

app.use(router);
app.use(authRoutes);
app.use(userRoutes);
// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// Обробка помилок валідації celebrate
app.use(errors());

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

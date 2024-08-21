import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import db from './config/db.mjs';

import authRoutes from './routes/authRoutes.mjs';
import restaurantRoutes from './routes/restaurantRoutes.mjs';
import reviewRoutes from './routes/reviewRoutes.mjs';



const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

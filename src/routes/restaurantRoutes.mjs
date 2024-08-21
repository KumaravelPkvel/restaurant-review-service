import express from 'express';
import { getRestaurantById, updateRestaurant } from '../controllers/restaurantController.mjs';
import authMiddleware from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/:id', authMiddleware, getRestaurantById);

router.put('/:id', authMiddleware, updateRestaurant);

export default router;

import express from 'express';
import { addReview, getReviews } from '../controllers/reviewController.mjs';
import authMiddleware from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/', authMiddleware, addReview);
router.get('/', getReviews);

export default router;

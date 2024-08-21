const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Add review route
router.post('/', authMiddleware, reviewController.addReview);

// Retrieve reviews for a specific restaurant
router.get('/', reviewController.getReviews);

module.exports = router;

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/:id', authMiddleware, restaurantController.getRestaurantById);

router.put('/:id', authMiddleware, restaurantController.updateRestaurant);

module.exports = router;

const express = require('express');
const router = express.Router();
// const integrationController = require('../controllers/integrationController');
const authMiddleware = require('../middleware/authMiddleware');

// router.get('/google/:restaurant_id', authMiddleware, integrationController.getGooglePlacesData);

module.exports = router;

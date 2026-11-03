/**
 * Hall Khoj Finder — Users Routes
 * /api/users
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/profile', authenticate, usersController.getProfile);
router.patch('/profile', authenticate, usersController.updateProfile);
router.get('/favorites', authenticate, usersController.getFavorites);
router.post('/favorites/toggle', authenticate, usersController.toggleFavorite);
router.get('/locations', authenticate, usersController.getSavedLocations);
router.post('/locations', authenticate, usersController.addSavedLocation);

module.exports = router;

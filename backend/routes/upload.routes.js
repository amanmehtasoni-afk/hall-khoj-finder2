/**
 * Hall Khoj Finder — Upload Routes
 * /api/upload
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { uploadImage } = require('../middleware/upload.middleware');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');

router.post('/image', optionalAuthenticate, uploadImage, uploadController.handleImageUpload);

module.exports = router;

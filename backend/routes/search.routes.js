/**
 * Hall Khoj Finder — Search Routes
 * /api/search
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/suggestions', searchController.suggestions);
router.get('/cities', searchController.cities);
router.get('/', searchController.search);

module.exports = router;

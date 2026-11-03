/**
 * Hall Khoj Finder — Categories Routes
 * /api/categories
 * Phase 7: Event Categories Directory
 */

const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');

router.get('/', categoriesController.list);
router.get('/:slug', categoriesController.getBySlug);

module.exports = router;

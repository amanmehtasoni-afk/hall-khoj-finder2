/**
 * Hall Khoj Finder — Halls Routes
 * /api/halls
 */

const express = require('express');
const router = express.Router();
const hallsController = require('../controllers/halls.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.get('/', hallsController.list);
router.get('/:id', hallsController.getById);
router.post('/', authenticate, authorize('owner', 'admin'), hallsController.create);
router.put('/:id', authenticate, authorize('owner', 'admin'), hallsController.update);
router.patch('/:id/status', authenticate, authorize('owner', 'admin'), hallsController.updateStatus);
router.delete('/:id', authenticate, authorize('owner', 'admin'), hallsController.remove);

module.exports = router;

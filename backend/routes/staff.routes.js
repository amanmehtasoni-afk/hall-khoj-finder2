/**
 * Hall Khoj Finder — Staff Routes
 * /api/staff
 */

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.get('/', optionalAuthenticate, staffController.listStaff);
router.post('/', optionalAuthenticate, staffController.addStaff);
router.put('/:id', authenticate, staffController.updateStaff);
router.patch('/:id', authenticate, staffController.updateStaff);
router.delete('/:id', optionalAuthenticate, staffController.removeStaff);

module.exports = router;

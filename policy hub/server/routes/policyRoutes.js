const express = require('express');
const router = express.Router();
const { getPolicies, getPolicyById, createPolicy, updatePolicy } = require('../controllers/policyController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPolicies);
router.get('/:id', getPolicyById);

// Admin-only routes
router.post('/', requireAuth, requireRole('admin'), createPolicy);
router.put('/:id', requireAuth, requireRole('admin'), updatePolicy);

module.exports = router;

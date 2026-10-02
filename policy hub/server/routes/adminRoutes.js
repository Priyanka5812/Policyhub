const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// GET /api/admin/stats
router.get('/stats', requireAuth, requireRole('admin'), getStats);

module.exports = router;

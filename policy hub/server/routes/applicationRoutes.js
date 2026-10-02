const express = require('express');
const router = express.Router();
const {
  applyForPolicy,
  getMyApplications,
  getPendingApplications,
  decideApplication,
} = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', requireAuth, requireRole('customer'), applyForPolicy);
router.get('/my', requireAuth, requireRole('customer'), getMyApplications);

// Agent routes
// NOTE: /pending must be defined before /:id routes to avoid Express matching "pending" as an ID
router.get('/pending', requireAuth, requireRole('agent', 'admin'), getPendingApplications);
router.put('/:id/decision', requireAuth, requireRole('agent', 'admin'), decideApplication);

module.exports = router;

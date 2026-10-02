const express = require('express');
const router = express.Router();
const { fileClaim, getMyClaims, getClaimsQueue, updateClaimStatus } = require('../controllers/claimController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Customer routes
// NOTE: /my must be before /:id to avoid "my" being treated as an ObjectId
router.get('/my', requireAuth, requireRole('customer'), getMyClaims);
router.post(
  '/',
  requireAuth,
  requireRole('customer'),
  upload.array('documents', 5), // field name: "documents", max 5 files
  fileClaim
);

// Agent routes
router.get('/queue', requireAuth, requireRole('agent', 'admin'), getClaimsQueue);
router.put('/:id/status', requireAuth, requireRole('agent', 'admin'), updateClaimStatus);

module.exports = router;

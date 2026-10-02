const Claim = require('../models/Claim');
const Application = require('../models/Application');

// POST /api/claims
// Customer only — file a claim against one of their approved applications
const fileClaim = async (req, res) => {
  try {
    const { applicationId, claimAmount, reason } = req.body;

    if (!applicationId || !claimAmount || !reason) {
      return res.status(400).json({ message: 'applicationId, claimAmount, and reason are required' });
    }

    // Verify the application belongs to this customer and is approved
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This application does not belong to you' });
    }
    if (application.status !== 'approved') {
      return res.status(400).json({ message: 'You can only file a claim against an approved application' });
    }

    // Collect uploaded file paths (relative, so they're portable)
    const documents = req.files ? req.files.map((f) => `uploads/${f.filename}`) : [];

    const claim = await Claim.create({
      user: req.user._id,
      application: applicationId,
      claimAmount,
      reason,
      documents,
    });

    await claim.populate('application', 'policy status');

    res.status(201).json({ message: 'Claim filed successfully', claim });
  } catch (err) {
    console.error('File claim error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid application ID' });
    }
    res.status(500).json({ message: 'Server error filing claim' });
  }
};

// GET /api/claims/my
// Customer only — their own claim history
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id })
      .populate({
        path: 'application',
        populate: { path: 'policy', select: 'title type' },
      })
      .sort({ filedAt: -1 });

    res.json({ count: claims.length, claims });
  } catch (err) {
    console.error('Get my claims error:', err.message);
    res.status(500).json({ message: 'Server error fetching your claims' });
  }
};

// GET /api/claims/queue
// Agent only — all filed or under_review claims
const getClaimsQueue = async (req, res) => {
  try {
    const claims = await Claim.find({ status: { $in: ['filed', 'under_review'] } })
      .populate('user', 'name email phone')
      .populate({
        path: 'application',
        populate: { path: 'policy', select: 'title type coverageAmount' },
      })
      .sort({ filedAt: 1 }); // oldest first

    res.json({ count: claims.length, claims });
  } catch (err) {
    console.error('Get claims queue error:', err.message);
    res.status(500).json({ message: 'Server error fetching claims queue' });
  }
};

// PUT /api/claims/:id/status
// Agent only — update claim status and set resolvedAt when finalized
const updateClaimStatus = async (req, res) => {
  try {
    const { status, agentRemarks } = req.body;

    const validStatuses = ['filed', 'under_review', 'approved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Prevent changes once a claim is finalized
    if (['approved', 'rejected'].includes(claim.status)) {
      return res.status(400).json({ message: `Claim is already ${claim.status} and cannot be changed` });
    }

    claim.status = status;
    claim.agentRemarks = agentRemarks || claim.agentRemarks;

    // Set resolvedAt only when the claim reaches a terminal state
    if (['approved', 'rejected'].includes(status)) {
      claim.resolvedAt = new Date();
    }

    await claim.save();
    await claim.populate('user', 'name email');

    res.json({ message: `Claim status updated to ${status}`, claim });
  } catch (err) {
    console.error('Update claim status error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Claim not found' });
    }
    res.status(500).json({ message: 'Server error updating claim status' });
  }
};

module.exports = { fileClaim, getMyClaims, getClaimsQueue, updateClaimStatus };

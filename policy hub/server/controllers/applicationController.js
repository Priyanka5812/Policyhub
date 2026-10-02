const Application = require('../models/Application');
const Policy = require('../models/Policy');

// POST /api/applications
// Customer only — apply for a policy
const applyForPolicy = async (req, res) => {
  try {
    const { policyId } = req.body;

    if (!policyId) {
      return res.status(400).json({ message: 'policyId is required' });
    }

    // Make sure the policy exists and is active
    const policy = await Policy.findById(policyId);
    if (!policy || !policy.isActive) {
      return res.status(404).json({ message: 'Policy not found or is no longer active' });
    }

    // Prevent duplicate pending applications for the same policy
    const existing = await Application.findOne({
      user: req.user._id,
      policy: policyId,
      status: 'pending',
    });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending application for this policy' });
    }

    const application = await Application.create({
      user: req.user._id,
      policy: policyId,
    });

    await application.populate('policy', 'title type premium durationMonths');

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Apply for policy error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid policy ID' });
    }
    res.status(500).json({ message: 'Server error submitting application' });
  }
};

// GET /api/applications/my
// Customer only — see their own applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('policy', 'title type premium coverageAmount durationMonths')
      .sort({ appliedAt: -1 });

    res.json({ count: applications.length, applications });
  } catch (err) {
    console.error('Get my applications error:', err.message);
    res.status(500).json({ message: 'Server error fetching your applications' });
  }
};

// GET /api/applications/pending
// Agent only — see all pending applications with user and policy details
const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: 'pending' })
      .populate('user', 'name email phone')
      .populate('policy', 'title type premium coverageAmount durationMonths')
      .sort({ appliedAt: 1 }); // oldest first so agents handle in order

    res.json({ count: applications.length, applications });
  } catch (err) {
    console.error('Get pending applications error:', err.message);
    res.status(500).json({ message: 'Server error fetching pending applications' });
  }
};

// PUT /api/applications/:id/decision
// Agent only — approve or reject an application
const decideApplication = async (req, res) => {
  try {
    const { status, agentRemarks } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be approved or rejected' });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: `Application is already ${application.status}` });
    }

    application.status = status;
    application.agentRemarks = agentRemarks || '';
    application.decidedAt = new Date();

    await application.save();
    await application.populate('user', 'name email');
    await application.populate('policy', 'title type');

    res.json({ message: `Application ${status} successfully`, application });
  } catch (err) {
    console.error('Decide application error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error processing decision' });
  }
};

module.exports = { applyForPolicy, getMyApplications, getPendingApplications, decideApplication };

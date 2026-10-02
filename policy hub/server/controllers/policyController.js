const Policy = require('../models/Policy');

// GET /api/policies
// Public — list all active policies, optional ?type=health|vehicle filter
const getPolicies = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.type) {
      const allowedTypes = ['health', 'vehicle'];
      if (!allowedTypes.includes(req.query.type)) {
        return res.status(400).json({ message: 'Invalid type. Must be health or vehicle' });
      }
      filter.type = req.query.type;
    }

    const policies = await Policy.find(filter).sort({ createdAt: -1 });
    res.json({ count: policies.length, policies });
  } catch (err) {
    console.error('Get policies error:', err.message);
    res.status(500).json({ message: 'Server error fetching policies' });
  }
};

// GET /api/policies/:id
// Public — single policy by ID
const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.json(policy);
  } catch (err) {
    console.error('Get policy error:', err.message);
    // Catch invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(500).json({ message: 'Server error fetching policy' });
  }
};

// POST /api/policies
// Admin only — create a new policy
const createPolicy = async (req, res) => {
  try {
    const { title, type, description, coverageAmount, premium, durationMonths } = req.body;

    if (!title || !type || !description || coverageAmount == null || premium == null || durationMonths == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const policy = await Policy.create({
      title,
      type,
      description,
      coverageAmount,
      premium,
      durationMonths,
    });

    res.status(201).json({ message: 'Policy created successfully', policy });
  } catch (err) {
    console.error('Create policy error:', err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating policy' });
  }
};

// PUT /api/policies/:id
// Admin only — update an existing policy
const updatePolicy = async (req, res) => {
  try {
    const allowedFields = ['title', 'type', 'description', 'coverageAmount', 'premium', 'durationMonths', 'isActive'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.json({ message: 'Policy updated successfully', policy });
  } catch (err) {
    console.error('Update policy error:', err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(500).json({ message: 'Server error updating policy' });
  }
};

module.exports = { getPolicies, getPolicyById, createPolicy, updatePolicy };

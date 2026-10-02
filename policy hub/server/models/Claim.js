const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application is required'],
    },
    claimAmount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [1, 'Claim amount must be greater than 0'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    documents: {
      type: [String], // array of file paths
      default: [],
    },
    status: {
      type: String,
      enum: ['filed', 'under_review', 'approved', 'rejected'],
      default: 'filed',
    },
    agentRemarks: {
      type: String,
      trim: true,
    },
    filedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Claim', claimSchema);

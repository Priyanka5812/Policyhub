const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['health', 'vehicle'],
      required: [true, 'Policy type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    coverageAmount: {
      type: Number,
      required: [true, 'Coverage amount is required'],
      min: [0, 'Coverage amount must be positive'],
    },
    premium: {
      type: Number,
      required: [true, 'Premium is required'],
      min: [0, 'Premium must be positive'],
    },
    durationMonths: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 month'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Policy', policySchema);

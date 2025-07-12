const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedSkill: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  offeredSkill: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  scheduledDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  feedback: {
    requesterRating: {
      type: Number,
      min: 1,
      max: 5
    },
    requesterComment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    recipientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    recipientComment: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Swap', swapSchema); 
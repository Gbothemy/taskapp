const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proofData: {
    type: {
      type: String,
      enum: ['image', 'text', 'url', 'file'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    files: [{
      filename: String,
      url: String,
      size: Number
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'auto-approved'],
    default: 'pending'
  },
  payoutDetails: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0
    },
    workerEarning: {
      type: Number,
      required: true,
      min: 0
    }
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      maxlength: 1000
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  autoApprovalAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
taskSubmissionSchema.index({ taskId: 1 });
taskSubmissionSchema.index({ workerId: 1 });
taskSubmissionSchema.index({ employerId: 1 });
taskSubmissionSchema.index({ status: 1 });
taskSubmissionSchema.index({ submittedAt: -1 });

// Compound indexes
taskSubmissionSchema.index({ workerId: 1, status: 1 });
taskSubmissionSchema.index({ employerId: 1, status: 1 });

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
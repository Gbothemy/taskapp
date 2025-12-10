const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  instructions: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['data-entry', 'content', 'review', 'research', 'testing', 'design', 'other']
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payoutPerTask: {
    type: Number,
    required: true,
    min: 0.01
  },
  totalTasksNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  completedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  approvedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  rejectedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  requiredProofType: {
    type: String,
    enum: ['image', 'text', 'url', 'file'],
    required: true
  },
  qualityRequirements: {
    minApprovalRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    workerLevel: {
      type: Number,
      min: 1,
      default: 1
    }
  },
  autoApproval: {
    enabled: {
      type: Boolean,
      default: false
    },
    timeHours: {
      type: Number,
      min: 1,
      max: 168, // 1 week
      default: 24
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ employerId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ payoutPerTask: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual for remaining tasks
taskSchema.virtual('remainingTasks').get(function() {
  return Math.max(0, this.totalTasksNeeded - this.completedTasks);
});

// Virtual for completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  return this.totalTasksNeeded > 0 ? (this.completedTasks / this.totalTasksNeeded) * 100 : 0;
});

module.exports = mongoose.model('Task', taskSchema);
import mongoose from 'mongoose';
const { Schema } = mongoose;

const conditionSchema = new Schema({
  type: {
    type: String,
    required: false,
    enum: ['spend', 'visits', 'inactive', 'purchases', 'location']
  },
  operator: {
    type: String,
    required: false,
    enum: ['>', '<', '=', '>=', '<=', 'contains']
  },
  value: {
    type: String,
    required: false
  }
});

const segmentRuleSchema = new Schema({
  operator: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  },
  conditions: {
    type: [Schema.Types.Mixed],
    default: []
  }
});

const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'social', 'Email', 'SMS', 'Push', 'Social'],
    required: true
  },
  content: {
    subject: String,
    body: String,
    template: String,
    attachments: [{
      name: String,
      url: String,
      type: String
    }]
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    timezone: String,
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly'],
      default: 'once'
    }
  },
  segments: [{
    type: Schema.Types.ObjectId,
    ref: 'Segment'
  }],
  segmentRules: {
    type: segmentRuleSchema,
    default: { operator: 'AND', conditions: [] }
  },
  audienceSize: {
    type: Number,
    default: 0
  },
  metrics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ name: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ type: 1 });
campaignSchema.index({ 'schedule.startDate': 1 });
campaignSchema.index({ createdBy: 1 });

// Methods
campaignSchema.methods.updateMetrics = async function(metric, increment = 1) {
  this.metrics[metric] += increment;
  return this.save();
};

campaignSchema.methods.isActive = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    (!this.schedule.startDate || this.schedule.startDate <= now) &&
    (!this.schedule.endDate || this.schedule.endDate >= now)
  );
};

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign; 
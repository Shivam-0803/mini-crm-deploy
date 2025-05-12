import mongoose from 'mongoose';
const { Schema } = mongoose;

const segmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['static', 'dynamic'],
    default: 'static'
  },
  criteria: [{
    field: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan', 'between', 'in', 'notIn'],
      required: true
    },
    value: Schema.Types.Mixed
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
segmentSchema.index({ name: 1 });
segmentSchema.index({ type: 1 });
segmentSchema.index({ isActive: 1 });
segmentSchema.index({ createdBy: 1 });

// Methods
segmentSchema.methods.updateMemberCount = async function() {
  this.memberCount = this.members.length;
  return this.save();
};

segmentSchema.methods.addMember = async function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    await this.updateMemberCount();
  }
  return this;
};

segmentSchema.methods.removeMember = async function(userId) {
  this.members = this.members.filter(id => id.toString() !== userId.toString());
  await this.updateMemberCount();
  return this;
};

// Static methods
segmentSchema.statics.findByCriteria = async function(criteria) {
  const segments = await this.find({
    type: 'dynamic',
    isActive: true,
    criteria: {
      $elemMatch: criteria
    }
  });
  return segments;
};

const Segment = mongoose.model('Segment', segmentSchema);

export default Segment; 
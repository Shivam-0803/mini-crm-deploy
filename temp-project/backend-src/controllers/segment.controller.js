import Segment from '../models/segment.model.js';
import User from '../models/user.model.js';

// Create a new segment
export const createSegment = async (req, res) => {
  try {
    const segment = new Segment({
      ...req.body,
      createdBy: req.user._id
    });
    await segment.save();
    res.status(201).json(segment);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
};

// Get all segments
export const getSegments = async (req, res) => {
  try {
    const segments = await Segment.find()
      .populate('createdBy', 'displayName email')
      .sort({ createdAt: -1 });
    res.json(segments);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

// Get segment by ID
export const getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('members', 'displayName email')
      .populate('createdBy', 'displayName email')
      .populate('updatedBy', 'displayName email');
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    res.json(segment);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

// Update segment
export const updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    // Update segment fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'members') { // Handle members separately
        segment[key] = req.body[key];
      }
    });
    
    segment.updatedBy = req.user._id;
    await segment.save();
    
    res.json(segment);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
};

// Delete segment
export const deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    await segment.remove();
    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

// Add member to segment
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }
    
    await segment.addMember(userId);
    res.json(segment);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
};

// Remove member from segment
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    await segment.removeMember(userId);
    res.json(segment);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
};

// Get segment members
export const getMembers = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('members', 'displayName email');
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    res.json(segment.members);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        status: 500
      }
    });
  }
};

// Update segment criteria
export const updateCriteria = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({
        error: {
          message: 'Segment not found',
          status: 404
        }
      });
    }
    
    segment.criteria = req.body.criteria;
    segment.updatedBy = req.user._id;
    await segment.save();
    
    res.json(segment);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
};

export default {
  createSegment,
  getSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
  addMember,
  removeMember,
  getMembers,
  updateCriteria
}; 
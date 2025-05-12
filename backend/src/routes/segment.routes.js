import express from 'express';
import { createSegment, getSegments, getSegmentById, updateSegment, deleteSegment, addMember, removeMember, getMembers, updateCriteria } from '../controllers/segment.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Segment routes
router.post('/', createSegment);
router.get('/', getSegments);
router.get('/:id', getSegmentById);
router.put('/:id', updateSegment);
router.delete('/:id', deleteSegment);

// Segment members management
router.post('/:id/members', addMember);
router.delete('/:id/members', removeMember);
router.get('/:id/members', getMembers);

// Segment criteria
router.patch('/:id/criteria', updateCriteria);

export default router; 
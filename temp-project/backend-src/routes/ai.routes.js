import express from 'express';
import { generateSegmentRules, generateMessageSuggestions, aiRateLimiter } from '../controllers/ai.controller.js';

const router = express.Router();

// Apply rate limiter to all AI routes
router.use(aiRateLimiter);

router.post('/segment-rules', generateSegmentRules);
router.post('/message-suggestions', generateMessageSuggestions);

export default router; 
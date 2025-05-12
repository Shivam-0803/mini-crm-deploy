import express from 'express';
import { handleDeliveryReceipt, forceProcessQueue } from '../controllers/delivery-receipt.controller.js';

const router = express.Router();

// POST /api/delivery-receipts - Receive delivery receipt from vendor API
router.post('/', handleDeliveryReceipt);

// POST /api/delivery-receipts/process - Force processing of receipt queue (for testing)
router.post('/process', forceProcessQueue);

export default router; 
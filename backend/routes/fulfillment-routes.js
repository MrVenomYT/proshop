import express from 'express';
import {
	getOrderFulfillment,
	updateFulfillmentStatus,
} from '../controllers/fulfillment-controller.js';
import { protect, isAdmin } from '../middleware/auth-middleware.js';

const router = express.Router();

router.route('/order/:orderId').get(protect, getOrderFulfillment);
router.route('/:id/status').put(protect, isAdmin, updateFulfillmentStatus);

export default router;

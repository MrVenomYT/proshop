import express from 'express';
import { getInventory, adjustStock } from '../controllers/inventory-controller.js';
import { protect, isAdmin } from '../middleware/auth-middleware.js';

const router = express.Router();

router.route('/').get(protect, isAdmin, getInventory);
router.route('/:sku/adjust').post(protect, isAdmin, adjustStock);

export default router;

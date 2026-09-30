import express from 'express';
import { getUserCart, syncUserCart } from '../controllers/cart-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = express.Router();

router.route('/').get(protect, getUserCart).post(protect, syncUserCart);

export default router;

import asyncHandler from 'express-async-handler';
import CartModel from '../models/cart-model.js';
import { isDbConnected, memDb } from '../config/in-memory-db.js';

// @description     Get logged-in user cart
// @route           GET /api/cart
// @access          Private
export const getUserCart = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	if (isDbConnected()) {
		let cart = await CartModel.findOne({ user: userId }).populate('items.product');
		if (!cart) {
			cart = await CartModel.create({
				user: userId,
				items: [],
				subtotal: 0,
				taxPrice: 0,
				shippingPrice: 0,
				totalPrice: 0,
			});
		}
		res.json(cart);
	} else {
		// in-memory fallback
		res.json({
			user: userId,
			items: [],
			subtotal: 0,
			taxPrice: 0,
			shippingPrice: 0,
			totalPrice: 0,
		});
	}
});

// @description     Sync or update user cart
// @route           POST /api/cart
// @access          Private
export const syncUserCart = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { items, couponCode, discountAmount } = req.body;

	if (isDbConnected()) {
		let cart = await CartModel.findOne({ user: userId });
		if (!cart) {
			cart = new CartModel({ user: userId });
		}
		cart.items = items || [];
		if (couponCode !== undefined) cart.couponCode = couponCode;
		if (discountAmount !== undefined) cart.discountAmount = discountAmount;
		cart.lastActive = new Date();

		const updatedCart = await cart.save();
		res.json(updatedCart);
	} else {
		const subtotal = (items || []).reduce((acc, item) => acc + item.price * item.qty, 0);
		res.json({
			user: userId,
			items: items || [],
			subtotal: Number(subtotal.toFixed(2)),
			shippingPrice: subtotal > 100 || (items || []).length === 0 ? 0 : 10.0,
			taxPrice: Number((subtotal * 0.08).toFixed(2)),
			totalPrice: Number((subtotal + (subtotal > 100 ? 0 : 10) + subtotal * 0.08).toFixed(2)),
		});
	}
});

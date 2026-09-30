import asyncHandler from 'express-async-handler';
import FulfillmentModel from '../models/fulfillment-model.js';
import OrderModel from '../models/order-model.js';
import { isDbConnected } from '../config/in-memory-db.js';

// @description     Get fulfillment details for an order
// @route           GET /api/fulfillment/order/:orderId
// @access          Private
export const getOrderFulfillment = asyncHandler(async (req, res) => {
	const { orderId } = req.params;

	if (isDbConnected()) {
		let fulfillment = await FulfillmentModel.findOne({ order: orderId });
		if (!fulfillment) {
			const order = await OrderModel.findById(orderId);
			if (order) {
				fulfillment = await FulfillmentModel.create({
					order: order._id,
					user: order.user,
					shippingAddress: order.shippingAddress,
					items: order.orderItems,
					status: order.isDelivered ? 'delivered' : 'processing',
					carrier: 'ProShop Express Logistics',
					trackingNumber: 'TRK-' + Date.now().toString().slice(-8),
					statusHistory: [
						{
							status: 'Order Placed',
							location: 'Fulfillment Center',
							description: 'Order received and being prepared for fulfillment',
							timestamp: order.createdAt || new Date(),
						},
					],
				});
			}
		}
		res.json(fulfillment || {});
	} else {
		res.json({
			order: orderId,
			status: 'processing',
			carrier: 'ProShop Express Logistics',
			trackingNumber: 'TRK-88492015',
			statusHistory: [
				{
					status: 'Processing',
					location: 'Central Fulfillment Hub',
					description: 'Items packaged and ready for dispatch',
					timestamp: new Date().toISOString(),
				},
			],
		});
	}
});

// @description     Update order fulfillment status (Admin / Warehouse)
// @route           PUT /api/fulfillment/:id/status
// @access          Private/Admin
export const updateFulfillmentStatus = asyncHandler(async (req, res) => {
	const { status, carrier, trackingNumber, note, location } = req.body;

	if (isDbConnected()) {
		const fulfillment = await FulfillmentModel.findById(req.params.id);
		if (fulfillment) {
			fulfillment.status = status || fulfillment.status;
			if (carrier) fulfillment.carrier = carrier;
			if (trackingNumber) fulfillment.trackingNumber = trackingNumber;
			if (status === 'shipped') fulfillment.dispatchedAt = new Date();
			if (status === 'delivered') fulfillment.deliveredAt = new Date();

			fulfillment.statusHistory.push({
				status: status || fulfillment.status,
				location: location || 'Transit Node',
				description: note || `Status updated to ${status}`,
				timestamp: new Date(),
			});

			const updated = await fulfillment.save();
			res.json(updated);
		} else {
			res.status(404);
			throw new Error('Fulfillment record not found');
		}
	} else {
		res.json({ message: 'Fulfillment status updated successfully' });
	}
});

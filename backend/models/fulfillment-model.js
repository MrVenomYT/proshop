import mongoose from 'mongoose';

const fulfillmentItemSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Product',
	},
	name: {
		type: String,
		required: true,
	},
	qty: {
		type: Number,
		required: true,
		min: 1,
	},
	sku: {
		type: String,
	},
});

const statusHistorySchema = mongoose.Schema({
	status: {
		type: String,
		required: true,
	},
	location: {
		type: String,
	},
	description: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const fulfillmentSchema = mongoose.Schema(
	{
		order: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'Order',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		status: {
			type: String,
			enum: [
				'unfulfilled',
				'processing',
				'label_created',
				'shipped',
				'out_for_delivery',
				'delivered',
				'returned',
				'cancelled',
			],
			default: 'unfulfilled',
		},
		carrier: {
			type: String,
			default: 'ProShop Express Logistics',
		},
		trackingNumber: {
			type: String,
			trim: true,
		},
		trackingUrl: {
			type: String,
			trim: true,
		},
		estimatedDeliveryDate: {
			type: Date,
		},
		dispatchedAt: {
			type: Date,
		},
		deliveredAt: {
			type: Date,
		},
		shippingAddress: {
			recipientName: { type: String },
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
			phone: { type: String },
		},
		items: [fulfillmentItemSchema],
		statusHistory: [statusHistorySchema],
	},
	{
		timestamps: true,
	}
);

const Fulfillment = mongoose.model('Fulfillment', fulfillmentSchema);

export default Fulfillment;

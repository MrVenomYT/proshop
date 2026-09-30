import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Product',
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		qty: {
			type: Number,
			required: true,
			min: 1,
			default: 1,
		},
		sku: {
			type: String,
		},
	},
	{
		_id: true,
	}
);

const cartSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'User',
		},
		items: [cartItemSchema],
		subtotal: {
			type: Number,
			required: true,
			default: 0.0,
			min: 0,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
			min: 0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
			min: 0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
			min: 0,
		},
		couponCode: {
			type: String,
			trim: true,
		},
		discountAmount: {
			type: Number,
			default: 0.0,
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Recalculate cart totals before saving
cartSchema.pre('save', function (next) {
	const subtotal = this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
	this.subtotal = Number(subtotal.toFixed(2));
	this.shippingPrice = this.subtotal > 100 || this.items.length === 0 ? 0 : 10.0;
	this.taxPrice = Number((0.08 * this.subtotal).toFixed(2));
	this.totalPrice = Number(
		Math.max(0, this.subtotal + this.shippingPrice + this.taxPrice - (this.discountAmount || 0)).toFixed(2)
	);
	next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

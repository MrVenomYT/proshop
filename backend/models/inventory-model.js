import mongoose from 'mongoose';

const stockMovementSchema = mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['restock', 'sale', 'adjustment', 'return', 'damaged'],
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		previousStock: {
			type: Number,
			required: true,
		},
		newStock: {
			type: Number,
			required: true,
		},
		referenceId: {
			type: String, // Order ID or PO number
		},
		note: {
			type: String,
			trim: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		_id: true,
	}
);

const inventorySchema = mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'Product',
		},
		sku: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		productName: {
			type: String,
			required: true,
		},
		quantityOnHand: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		quantityReserved: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		reorderPoint: {
			type: Number,
			default: 5,
			min: 0,
		},
		reorderQuantity: {
			type: Number,
			default: 20,
			min: 1,
		},
		warehouseLocation: {
			warehouseCode: { type: String, default: 'MAIN-WH-01' },
			zone: { type: String, default: 'A' },
			aisle: { type: String, default: '01' },
			shelf: { type: String, default: '1' },
		},
		stockMovements: [stockMovementSchema],
		lastRestockedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Virtual for available stock (on hand minus reserved)
inventorySchema.virtual('quantityAvailable').get(function () {
	return Math.max(0, this.quantityOnHand - this.quantityReserved);
});

// Check if stock is low
inventorySchema.methods.isLowStock = function () {
	return this.quantityOnHand <= this.reorderPoint;
};

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;

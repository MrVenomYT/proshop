import asyncHandler from 'express-async-handler';
import InventoryModel from '../models/inventory-model.js';
import ProductModel from '../models/product-model.js';
import { isDbConnected } from '../config/in-memory-db.js';

// @description     Get inventory overview / stock list
// @route           GET /api/inventory
// @access          Private/Admin
export const getInventory = asyncHandler(async (req, res) => {
	if (isDbConnected()) {
		const inventory = await InventoryModel.find({}).populate('product', 'name price image brand');
		res.json(inventory);
	} else {
		res.json([
			{
				sku: 'AIRPODS-PRO-01',
				productName: 'Airpods Wireless Bluetooth Headphones',
				quantityOnHand: 10,
				quantityReserved: 1,
				reorderPoint: 5,
				warehouseLocation: { warehouseCode: 'MAIN-WH-01', aisle: '02', shelf: 'A4' },
			},
			{
				sku: 'IPHONE-11-PRO',
				productName: 'iPhone 11 Pro 256GB Memory',
				quantityOnHand: 7,
				quantityReserved: 0,
				reorderPoint: 4,
				warehouseLocation: { warehouseCode: 'MAIN-WH-01', aisle: '01', shelf: 'B2' },
			},
			{
				sku: 'CANNON-80D-BODY',
				productName: 'Cannon EOS 80D DSLR Camera',
				quantityOnHand: 5,
				quantityReserved: 0,
				reorderPoint: 3,
				warehouseLocation: { warehouseCode: 'MAIN-WH-01', aisle: '04', shelf: 'C1' },
			},
		]);
	}
});

// @description     Adjust inventory stock quantity
// @route           POST /api/inventory/:sku/adjust
// @access          Private/Admin
export const adjustStock = asyncHandler(async (req, res) => {
	const { sku } = req.params;
	const { quantityChange, type, note } = req.body;

	if (isDbConnected()) {
		const item = await InventoryModel.findOne({ sku });
		if (item) {
			const previous = item.quantityOnHand;
			item.quantityOnHand = Math.max(0, previous + Number(quantityChange));
			item.stockMovements.push({
				type: type || 'adjustment',
				quantity: Number(quantityChange),
				previousStock: previous,
				newStock: item.quantityOnHand,
				note: note || 'Manual inventory adjustment',
				date: new Date(),
			});

			// sync with Product model
			await ProductModel.findByIdAndUpdate(item.product, {
				countInStock: item.quantityOnHand,
			});

			const updated = await item.save();
			res.json(updated);
		} else {
			res.status(404);
			throw new Error('Inventory SKU not found');
		}
	} else {
		res.json({ message: 'Stock quantity adjusted successfully', sku, quantityChange });
	}
});

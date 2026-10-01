import asyncHandler from 'express-async-handler';
import ProductModel from '../models/product-model.js';
import { isDbConnected, memDb } from '../config/in-memory-db.js';

// In-memory price alert store
const activePriceAlerts = [];

// @description     Fetch all products
// @route           GET /api/products
// @access          Public
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	// get item from query string
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const Product = isDbConnected() ? ProductModel : memDb.Product;

	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({
		products,
		page,
		pages: Math.max(1, Math.ceil(count / pageSize)),
	});
});

// @description     Fetch single product
// @route           GET /api/products/:id
// @access          Public
const getProductById = asyncHandler(async (req, res) => {
	const Product = isDbConnected() ? ProductModel : memDb.Product;
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @description     Delete a product
// @route           DELETE /api/products/:id
// @access          Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const Product = isDbConnected() ? ProductModel : memDb.Product;
	const product = await Product.findById(req.params.id);

	if (product) {
		if (typeof product.remove === 'function') {
			await product.remove();
		} else if (typeof product.deleteOne === 'function') {
			await product.deleteOne();
		}
		res.json({ message: 'Product removed' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @description     Create a product
// @route           POST /api/products
// @access          Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	if (isDbConnected()) {
		const product = new ProductModel({
			name: 'Sample Name',
			price: 0,
			user: req.user._id,
			image: '/images/sample.jpg',
			brand: 'Sample brand',
			category: 'Sample Category',
			countInStock: 0,
			numReviews: 0,
			description: 'Sample description',
		});
		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} else {
		const product = memDb.Product.createInstance({
			name: 'Sample Name',
			price: 0,
			user: req.user._id,
			image: '/images/sample.jpg',
			brand: 'Sample brand',
			category: 'Sample Category',
			countInStock: 0,
			numReviews: 0,
			description: 'Sample description',
		});
		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	}
});

// @description     Update a product & check price drop alerts
// @route           PUT /api/products/:id
// @access          Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
	} = req.body;

	const Product = isDbConnected() ? ProductModel : memDb.Product;
	const product = await Product.findById(req.params.id);

	if (product) {
		const oldPrice = product.price;
		const newPrice = Number(price);

		product.name = name;
		product.price = newPrice;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;

		const updatedProduct = await product.save();

		// Trigger price drop alert check if price reduced
		if (newPrice < oldPrice) {
			const matchingAlerts = activePriceAlerts.filter(
				(alert) => alert.productId === req.params.id && newPrice <= alert.targetPrice
			);
			if (matchingAlerts.length > 0) {
				console.log(
					`[PRICE DROP ALERT] Triggered for ${product.name}! New price: $${newPrice}. Notifying ${matchingAlerts.length} subscriber(s).`
				);
			}
		}

		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @description     Create price drop alert subscription
// @route           POST /api/products/:id/price-alert
// @access          Public
const createPriceAlert = asyncHandler(async (req, res) => {
	const { email, targetPrice, productName } = req.body;

	if (!email || !email.includes('@')) {
		res.status(400);
		throw new Error('Please enter a valid email address');
	}

	activePriceAlerts.push({
		productId: req.params.id,
		productName: productName || 'Hardware Product',
		email,
		targetPrice: Number(targetPrice) || 0,
		createdAt: new Date(),
	});

	res.status(201).json({
		success: true,
		message: `Price alert subscribed for ${email} at $${targetPrice}`,
	});
});

// @description     Create new review
// @route           POST /api/products/:id/reviews
// @access          Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const Product = isDbConnected() ? ProductModel : memDb.Product;
	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = (product.reviews || []).find(
			(r) => (r.user?._id || r.user)?.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewed');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};

		if (!product.reviews) product.reviews = [];
		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		res.status(201).json({ message: 'Review added' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @description     GET top rated products
// @route           GET /api/products/top
// @access          Public
const getTopProducts = asyncHandler(async (req, res) => {
	const Product = isDbConnected() ? ProductModel : memDb.Product;
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);

	res.json(products);
});

export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createPriceAlert,
	createProductReview,
	getTopProducts,
};

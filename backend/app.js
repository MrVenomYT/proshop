import path from 'path';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import productRoutes from './routes/product-routes.js';
import userRoutes from './routes/user-routes.js';
import orderRoutes from './routes/order-routes.js';
import paymentRoutes from './routes/payment-routes.js';
import uploadRoutes from './routes/upload-routes.js';
import cartRoutes from './routes/cart-routes.js';
import inventoryRoutes from './routes/inventory-routes.js';
import fulfillmentRoutes from './routes/fulfillment-routes.js';
import { errorHandler } from './middleware/error-middleware.js';

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);

// Newsletter Subscriber API
const subscribersList = new Set();
app.post('/api/newsletter/subscribe', (req, res) => {
	const { email } = req.body;
	if (!email || !email.includes('@')) {
		return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
	}
	subscribersList.add(email.toLowerCase().trim());
	res.json({
		success: true,
		message: 'Thank you for subscribing! Check your inbox for exclusive ProShop hardware drops.',
		subscriberCount: subscribersList.size,
	});
});

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'production',
	});
});

// Custom error handling middleware
app.use(errorHandler);

export default app;

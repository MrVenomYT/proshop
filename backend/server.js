import path from 'path';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDb from './config/db.js';
import productRoutes from './routes/product-routes.js';
import userRoutes from './routes/user-routes.js';
import orderRoutes from './routes/order-routes.js';
import paymentRoutes from './routes/payment-routes.js';
import uploadRoutes from './routes/upload-routes.js';
import { notFound, errorHandler } from './middleware/error-middleware.js';

// define environment variables
dotenv.config();

// start connection
connectDb();

// create api server
const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// accept json data in the body
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static images
const publicImagesDir = path.join(__dirname, 'public', 'images');
const frontendImagesDir = path.join(__dirname, 'frontend', 'public', 'images');
const distImagesDir = path.join(__dirname, 'dist', 'images');

if (fs.existsSync(publicImagesDir)) {
	app.use('/images', express.static(publicImagesDir));
}
if (fs.existsSync(frontendImagesDir)) {
	app.use('/images', express.static(frontendImagesDir));
}
if (fs.existsSync(distImagesDir)) {
	app.use('/images', express.static(distImagesDir));
}

// Serve dist / static frontend
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
	app.use(express.static(distDir));
}
const frontendBuildDir = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(frontendBuildDir)) {
	app.use(express.static(frontendBuildDir));
}

// SPA fallback
app.get('*', (req, res, next) => {
	if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
		return next();
	}
	const distIndex = path.join(distDir, 'index.html');
	const frontendIndex = path.join(frontendBuildDir, 'index.html');

	if (fs.existsSync(distIndex)) {
		return res.sendFile(distIndex);
	} else if (fs.existsSync(frontendIndex)) {
		return res.sendFile(frontendIndex);
	} else {
		return res.send('Frontend is building. Please refresh in a moment.');
	}
});

// not found middleware
app.use(notFound);

// custom error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(
	PORT,
	'0.0.0.0',
	() => {
		console.log(
			`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} at http://0.0.0.0:${PORT}`.yellow.bold
		);
	}
);

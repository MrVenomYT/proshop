import path from 'path';
import fs from 'fs';
import express from 'express';
import app from './app.js';
import connectDb from './config/db.js';
import { notFound } from './middleware/error-middleware.js';

// Connect DB
connectDb();

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

// not found middleware for unmatched api routes
app.use(notFound);

const PORT = process.env.PORT || 3000;

app.listen(
	PORT,
	'0.0.0.0',
	() => {
		console.log(
			`Server running on port ${PORT} at http://0.0.0.0:${PORT}`.yellow.bold
		);
	}
);

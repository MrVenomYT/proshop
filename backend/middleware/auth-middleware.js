import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/user-model.js';
import { isDbConnected, memDb } from '../config/in-memory-db.js';

// asyncHandler for handling exceptions and prevent hanging on request!
const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET || 'proshop_default_secret_key_2026');

			const User = isDbConnected() ? UserModel : memDb.User;
			req.user = await User.findById(decoded.id).select('-password');

			if (!req.user) {
				res.status(401);
				throw new Error('Not authorized, user not found');
			}

			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('Not authorized, token failed');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
});

const isAdmin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error('Not authorized as an admin');
	}
};

export { protect, isAdmin };

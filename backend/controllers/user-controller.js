import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generate-token.js';
import UserModel from '../models/user-model.js';
import AuthSessionModel from '../models/auth-session-model.js';
import { isDbConnected, memDb } from '../config/in-memory-db.js';

// @description     Auth user & get token (Sign In)
// @route           POST /api/users/login
// @access          Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const User = isDbConnected() ? UserModel : memDb.User;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		const token = generateToken(user._id);

		// Record active sign-in session
		if (isDbConnected()) {
			try {
				await AuthSessionModel.create({
					user: user._id,
					token,
					ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
					userAgent: req.headers['user-agent'] || 'Web Browser',
					signedInAt: new Date(),
					isActive: true,
				});
			} catch (e) {
				console.warn('Session logging note:', e.message);
			}
		}

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @description     Sign out & terminate session
// @route           POST /api/users/logout
// @access          Private
const logoutUser = asyncHandler(async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (isDbConnected() && token) {
		try {
			await AuthSessionModel.updateMany(
				{ user: req.user._id, token, isActive: true },
				{ isActive: false, signedOutAt: new Date() }
			);
		} catch (e) {
			console.warn('Session logout note:', e.message);
		}
	}
	res.json({ message: 'Signed out successfully' });
});

// @description     Register a new user
// @route           POST /api/users
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const User = isDbConnected() ? UserModel : memDb.User;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		const token = generateToken(user._id);

		if (isDbConnected()) {
			try {
				await AuthSessionModel.create({
					user: user._id,
					token,
					ipAddress: req.ip || '127.0.0.1',
					userAgent: req.headers['user-agent'] || 'Web Browser',
					signedInAt: new Date(),
					isActive: true,
				});
			} catch (e) {
				console.warn('Session note:', e.message);
			}
		}

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @description     Get user profile
// @route           GET /api/users/profile
// @access          Private
const getUserProfile = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Update user profile
// @route           PUT /api/users/profile
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Get all users
// @route           GET /api/users
// @access          Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const users = await User.find({});
	res.json(users);
});

// @description     Delete user
// @route           DELETE /api/users/:id
// @access          Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id);

	if (user) {
		if (typeof user.remove === 'function') {
			await user.remove();
		} else if (typeof user.deleteOne === 'function') {
			await user.deleteOne();
		}
		res.json({ message: 'User removed' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Get user by Id
// @route           GET /api/users/:id
// @access          Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Update user
// @route           PUT /api/users/:id
// @access          Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin =
			req.body.isAdmin === undefined || req.body.isAdmin === null
				? user.isAdmin
				: req.body.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Add new Favorite Product
// @route           POST /api/users/:id/favorites
// @access          Private
const addFavoriteProduct = asyncHandler(async (req, res) => {
	const { productId, name, image, price, numReviews, rating } = req.body;
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id);

	if (user) {
		const favorite = {
			name,
			image,
			price,
			numReviews,
			rating,
			product: productId,
		};

		if (!user.favorites) user.favorites = [];
		user.favorites.push(favorite);
		await user.save();
		res.status(201).json({
			favorites: user.favorites,
			message: 'Product is added to favorites',
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @description     Delete Favorite Product
// @route           DELETE /api/users/:id/favorites/:productId
// @access          Private
const removeFavoriteProduct = asyncHandler(async (req, res) => {
	const productId = req.params.productId;
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id);

	if (user && user.favorites) {
		user.favorites = user.favorites.filter(
			(favorite) => (favorite.product?._id || favorite.product)?.toString() !== productId.toString()
		);
		await user.save();
		res.status(202).json({
			message: 'Product is removed from favorites',
		});
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @description     Get Favorite Products
// @route           GET /api/users/:id/favorites
// @access          Private
const getFavoriteProducts = asyncHandler(async (req, res) => {
	const User = isDbConnected() ? UserModel : memDb.User;
	const user = await User.findById(req.params.id);

	if (user) {
		res.status(200).json({ favorites: user.favorites || [] });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

export {
	authUser,
	logoutUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
	addFavoriteProduct,
	removeFavoriteProduct,
	getFavoriteProducts,
};

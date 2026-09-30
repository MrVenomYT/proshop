import mongoose from 'mongoose';

const authSessionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		token: {
			type: String,
			required: true,
			trim: true,
		},
		ipAddress: {
			type: String,
			default: '127.0.0.1',
		},
		userAgent: {
			type: String,
			default: 'Web Browser',
		},
		deviceType: {
			type: String,
			enum: ['desktop', 'mobile', 'tablet', 'unknown'],
			default: 'desktop',
		},
		signedInAt: {
			type: Date,
			default: Date.now,
		},
		signedOutAt: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		expiresAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

authSessionSchema.methods.terminate = async function () {
	this.isActive = false;
	this.signedOutAt = new Date();
	return await this.save();
};

const AuthSession = mongoose.model('AuthSession', authSessionSchema);

export default AuthSession;

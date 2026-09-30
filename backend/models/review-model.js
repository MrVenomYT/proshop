import mongoose from 'mongoose';

export const reviewSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		title: {
			type: String,
			trim: true,
		},
		comment: {
			type: String,
			required: true,
			trim: true,
		},
		verifiedPurchase: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'approved',
		},
		helpfulVotes: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;

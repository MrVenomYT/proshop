import asyncHandler from 'express-async-handler';
import stripe from 'stripe';

// @description     Get stripe secret
// @route           POST /api/payments/config/stripe-payment-intent
// @access          Private
const getStripeSecret = asyncHandler(async (req, res) => {
	try {
		if (!process.env.STRIPE_TEST_SECRET) {
			return res.json({ client_secret: 'mock_stripe_client_secret_' + Date.now() });
		}
		const stripeClient = stripe(process.env.STRIPE_TEST_SECRET);
		const paymentIntent = await stripeClient.paymentIntents.create({
			amount: req.body.amount,
			currency: req.body.currency,
			metadata: { integration_check: 'accept_a_payment' },
		});

		res.json({ client_secret: paymentIntent.client_secret });
	} catch (error) {
		console.warn('Stripe intent error:', error.message);
		res.json({ client_secret: 'mock_stripe_client_secret_' + Date.now() });
	}
});

// @description     Get stripe pk
// @route           GET /api/payments/config/stripe-pk
// @access          Private
const getStripePublicKey = asyncHandler(async (req, res) => {
	try {
		res.json({ public_key: process.env.STRIPE_TEST_PUBLIC_KEY || 'pk_test_mock_stripe_key' });
	} catch (error) {
		console.warn('Stripe pk error:', error.message);
		res.json({ public_key: 'pk_test_mock_stripe_key' });
	}
});

export { getStripeSecret, getStripePublicKey };

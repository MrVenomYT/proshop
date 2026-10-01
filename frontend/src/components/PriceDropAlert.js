import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const PriceDropAlert = ({ product, userInfo }) => {
	const [email, setEmail] = useState(userInfo?.email || '');
	const [targetPrice, setTargetPrice] = useState(
		product ? (Number(product.price) * 0.9).toFixed(2) : ''
	);
	const [submitted, setSubscribed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	if (!product) return null;

	const handleSubscribeAlert = async (e) => {
		e.preventDefault();
		if (!email || !email.includes('@')) {
			setError('Please enter a valid email address.');
			return;
		}

		try {
			setLoading(true);
			setError('');
			await axios.post(`/api/products/${product._id}/price-alert`, {
				email,
				targetPrice: Number(targetPrice),
				productName: product.name,
			});
			setSubscribed(true);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to set alert. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='p-4 my-4 border-0 shadow-sm' style={{ background: '#f8fafc', borderRadius: '16px' }}>
			<div className='d-flex align-items-center gap-2 mb-2'>
				<i className='fas fa-bell text-danger fa-lg mr-1'></i>
				<h3 className='mb-0' style={{ fontSize: '1.1rem', fontWeight: '800' }}>
					Notify Me on Price Drop
				</h3>
			</div>
			<p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>
				Get an automated email notification as soon as {product.name}&apos;s price drops below your target.
			</p>

			{submitted ? (
				<Alert variant='success' className='mb-0 font-weight-bold' style={{ borderRadius: '10px' }}>
					<i className='fas fa-check-circle mr-2'></i> Price drop alert activated for {email}! We will email you if price drops below ${targetPrice}.
				</Alert>
			) : (
				<Form onSubmit={handleSubscribeAlert}>
					<div className='row g-2 align-items-center'>
						<div className='col-md-5 mb-2 mb-md-0'>
							<Form.Control
								type='email'
								placeholder='Your email address...'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								style={{ borderRadius: '8px', fontSize: '0.85rem' }}
							/>
						</div>
						<div className='col-md-4 mb-2 mb-md-0'>
							<div className='input-group'>
								<div className='input-group-prepend'>
									<span className='input-group-text font-weight-bold' style={{ borderRadius: '8px 0 0 8px', fontSize: '0.85rem' }}>
										Target $
									</span>
								</div>
								<Form.Control
									type='number'
									step='1'
									value={targetPrice}
									onChange={(e) => setTargetPrice(e.target.value)}
									required
									style={{ borderRadius: '0 8px 8px 0', fontSize: '0.85rem' }}
								/>
							</div>
						</div>
						<div className='col-md-3'>
							<Button
								type='submit'
								disabled={loading}
								className='btn-accent btn-block font-weight-bold'
								style={{ borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
							>
								{loading ? 'Setting Alert...' : 'Set Price Alert'}
							</Button>
						</div>
					</div>
					{error && <div className='text-danger mt-2' style={{ fontSize: '0.78rem' }}>{error}</div>}
				</Form>
			)}
		</Card>
	);
};

export default PriceDropAlert;

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const ExitIntentModal = () => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState('');
	const [subscribed, setSubscribed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const isDismissed = sessionStorage.getItem('proshop_exit_intent_dismissed');
		if (isDismissed) return;

		const handleMouseLeave = (e) => {
			if (e.clientY <= 15) {
				setShow(true);
				sessionStorage.setItem('proshop_exit_intent_dismissed', 'true');
			}
		};

		document.addEventListener('mouseleave', handleMouseLeave);
		return () => document.removeEventListener('mouseleave', handleMouseLeave);
	}, []);

	const handleClose = () => {
		setShow(false);
		sessionStorage.setItem('proshop_exit_intent_dismissed', 'true');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !email.includes('@')) {
			setError('Please enter a valid email address.');
			return;
		}

		try {
			setLoading(true);
			setError('');
			const { data } = await axios.post('/api/newsletter/subscribe', { email });
			if (data.success) {
				setSubscribed(true);
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Subscription failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			centered
			className='exit-intent-modal'
			contentClassName='bg-transparent border-0 shadow-none'
		>
			<div
				className='p-4 p-md-5 text-white position-relative overflow-hidden'
				style={{
					background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #dc2626 120%)',
					borderRadius: '24px',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
				}}
			>
				<button
					type='button'
					onClick={handleClose}
					className='btn text-white position-absolute'
					style={{ top: '16px', right: '16px', fontSize: '1.2rem', opacity: 0.8 }}
				>
					&times;
				</button>

				<div className='text-center max-w-md mx-auto'>
					<div
						className='mx-auto mb-3 d-flex align-items-center justify-content-center'
						style={{
							width: '60px',
							height: '60px',
							borderRadius: '50%',
							background: 'rgba(220, 38, 38, 0.2)',
							border: '1px solid #ef4444',
							color: '#ef4444',
							fontSize: '1.5rem',
						}}
					>
						<i className='fas fa-gift'></i>
					</div>

					<h2 className='text-white mb-2' style={{ fontSize: '1.75rem', fontWeight: '800' }}>
						Wait! Claim 15% Off Your First Order
					</h2>
					<p className='text-slate-300 mb-4' style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
						Join 25,000+ tech enthusiasts receiving early flash drops, creator gear guides, and instant discount codes.
					</p>

					{subscribed ? (
						<div className='p-3 rounded-16 bg-success text-white font-weight-bold mb-3' style={{ borderRadius: '12px' }}>
							<i className='fas fa-check-circle mr-2'></i> Voucher Code Activated! Use <strong className='text-warning'>PROTECH15</strong> at checkout.
						</div>
					) : (
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId='exitIntentEmail' className='mb-3'>
								<Form.Control
									type='email'
									placeholder='Enter your best email address...'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									style={{
										borderRadius: '12px',
										padding: '0.75rem 1rem',
										fontSize: '0.92rem',
										border: 'none',
									}}
								/>
							</Form.Group>

							<Button
								type='submit'
								disabled={loading}
								className='btn-accent btn-block font-weight-bold py-3'
								style={{ borderRadius: '12px', fontSize: '0.95rem', letterSpacing: '0.02em' }}
							>
								{loading ? 'Activating Offer...' : 'Claim 15% Off Voucher →'}
							</Button>

							{error && <div className='text-danger mt-2 font-weight-bold' style={{ fontSize: '0.8rem' }}>{error}</div>}
						</Form>
					)}

					<span className='d-block mt-3 text-muted' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
						No spam ever. Unsubscribe with 1-click anytime.
					</span>
				</div>
			</div>
		</Modal>
	);
};

export default ExitIntentModal;

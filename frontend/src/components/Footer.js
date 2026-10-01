import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
	const [email, setEmail] = useState('');
	const [subscribedMsg, setSubscribedMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const handleSubscribe = async (e) => {
		e.preventDefault();
		if (!email || !email.includes('@')) {
			setErrorMsg('Please enter a valid email address.');
			return;
		}

		try {
			setLoading(true);
			setErrorMsg('');
			const { data } = await axios.post('/api/newsletter/subscribe', { email });
			if (data.success) {
				setSubscribedMsg(data.message || 'Successfully subscribed!');
				setEmail('');
			}
		} catch (err) {
			setErrorMsg(err.response?.data?.message || 'Subscription failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<footer>
			<Container>
				{/* 1. Four Pillar Trust Guarantee Bar */}
				<Row className='py-4 mb-5 border-bottom border-slate-800 g-3 text-white' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
					<Col md={3} sm={6} className='d-flex align-items-center gap-3 mb-3 mb-md-0'>
						<div
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '50%',
								background: 'rgba(220, 38, 38, 0.15)',
								color: '#ef4444',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								flexShrink: 0,
							}}
						>
							<i className='fas fa-truck'></i>
						</div>
						<div>
							<h4 className='text-white mb-0' style={{ fontSize: '0.9rem' }}>Free Express Shipping</h4>
							<span className='text-muted' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>On all orders over $50</span>
						</div>
					</Col>

					<Col md={3} sm={6} className='d-flex align-items-center gap-3 mb-3 mb-md-0'>
						<div
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '50%',
								background: 'rgba(16, 185, 129, 0.15)',
								color: '#34d399',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								flexShrink: 0,
							}}
						>
							<i className='fas fa-shield-alt'></i>
						</div>
						<div>
							<h4 className='text-white mb-0' style={{ fontSize: '0.9rem' }}>30-Day Money Back</h4>
							<span className='text-muted' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hassle-free return policy</span>
						</div>
					</Col>

					<Col md={3} sm={6} className='d-flex align-items-center gap-3 mb-3 mb-md-0'>
						<div
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '50%',
								background: 'rgba(245, 158, 11, 0.15)',
								color: '#fbbf24',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								flexShrink: 0,
							}}
						>
							<i className='fas fa-headset'></i>
						</div>
						<div>
							<h4 className='text-white mb-0' style={{ fontSize: '0.9rem' }}>24/7 Creator Support</h4>
							<span className='text-muted' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live expert assistance</span>
						</div>
					</Col>

					<Col md={3} sm={6} className='d-flex align-items-center gap-3'>
						<div
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '50%',
								background: 'rgba(59, 130, 246, 0.15)',
								color: '#60a5fa',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								flexShrink: 0,
							}}
						>
							<i className='fas fa-lock'></i>
						</div>
						<div>
							<h4 className='text-white mb-0' style={{ fontSize: '0.9rem' }}>Secure Payments</h4>
							<span className='text-muted' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>256-Bit bank grade SSL</span>
						</div>
					</Col>
				</Row>

				{/* 2. Newsletter Subscription Card */}
				<div
					className='p-4 p-md-5 mb-5 rounded-20 text-white'
					style={{
						backgroundColor: '#1e293b',
						border: '1px solid rgba(255,255,255,0.1)',
						borderRadius: '20px',
					}}
				>
					<Row className='align-items-center'>
						<Col lg={6} className='mb-3 mb-lg-0'>
							<div className='d-flex align-items-center gap-3'>
								<i className='fas fa-paper-plane fa-2x text-danger mr-3'></i>
								<div>
									<h3 className='text-white mb-1' style={{ fontSize: '1.35rem' }}>Join the ProShop Tech Community</h3>
									<p className='text-slate-400 mb-0' style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
										Get exclusive hardware drops, early flash deal invites, and setup guides delivered to your inbox.
									</p>
								</div>
							</div>
						</Col>

						<Col lg={6}>
							{subscribedMsg ? (
								<div className='p-3 rounded font-weight-bold text-center' style={{ background: '#064e3b', color: '#6ee7b7', borderRadius: '12px' }}>
									<i className='fas fa-check-circle mr-2'></i> {subscribedMsg}
								</div>
							) : (
								<Form onSubmit={handleSubscribe}>
									<div className='d-flex gap-2'>
										<Form.Control
											type='email'
											placeholder='Enter your email address...'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											style={{
												background: '#090e1a',
												borderColor: 'rgba(255,255,255,0.15)',
												color: '#ffffff',
												borderRadius: '10px',
											}}
										/>
										<Button
											type='submit'
											disabled={loading}
											className='btn-accent font-weight-bold px-4'
											style={{ borderRadius: '10px', whiteSpace: 'nowrap', background: '#dc2626', borderColor: '#dc2626' }}
										>
											{loading ? 'Subscribing...' : 'Subscribe'}
										</Button>
									</div>
									{errorMsg && <div className='text-danger mt-2' style={{ fontSize: '0.8rem' }}>{errorMsg}</div>}
								</Form>
							)}
						</Col>
					</Row>
				</div>

				{/* 3. Main Footer Links Column Grid */}
				<Row className='gy-4 mb-4'>
					{/* Brand Column */}
					<Col lg={4} md={6} className='mb-4 mb-lg-0'>
						<div className='footer-brand d-flex align-items-center mb-2'>
							<i className='fas fa-cube text-danger mr-2'></i>
							<span>PRO<span style={{ color: '#dc2626' }}>SHOP</span></span>
						</div>
						<p className='text-muted' style={{ fontSize: '0.875rem', maxWidth: '320px', lineHeight: '1.6' }}>
							Premium electronics, high-fidelity acoustics, and hardware essentials built for creator workflows.
						</p>
						<div className='d-flex gap-3 text-muted mt-3' style={{ fontSize: '1.2rem' }}>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-twitter'></i></span>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-github'></i></span>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-instagram'></i></span>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-youtube'></i></span>
						</div>
					</Col>

					{/* Shop Categories */}
					<Col lg={2} md={6} sm={6} className='mb-4 mb-lg-0'>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>CATEGORIES</h3>
						<div className='d-flex flex-column gap-2' style={{ fontSize: '0.85rem' }}>
							<Link to='/search/Smartphones' className='footer-link mb-2'>Smartphones</Link>
							<Link to='/search/Laptops' className='footer-link mb-2'>Laptops & PCs</Link>
							<Link to='/search/Audio' className='footer-link mb-2'>Audio & Headphones</Link>
							<Link to='/search/Wearables' className='footer-link mb-2'>Smartwatches</Link>
							<Link to='/search/Gaming' className='footer-link mb-2'>Gaming Gear</Link>
						</div>
					</Col>

					{/* Customer Support */}
					<Col lg={3} md={6} sm={6} className='mb-4 mb-lg-0'>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>SUPPORT</h3>
						<div className='d-flex flex-column gap-2' style={{ fontSize: '0.85rem' }}>
							<Link to='/profile' className='footer-link mb-2'>Track Order Status</Link>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>Shipping & Return Policy</span>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>2-Year Hardware Warranty</span>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>Help Center & FAQ</span>
						</div>
					</Col>

					{/* Payment Methods */}
					<Col lg={3} md={6}>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>PAYMENT METHODS</h3>
						<p className='text-muted' style={{ fontSize: '0.85rem' }}>
							Protected with 256-bit bank grade encryption.
						</p>
						<div className='d-flex gap-3 text-muted mb-3' style={{ fontSize: '1.6rem' }}>
							<i className='fab fa-cc-visa mr-2 text-white'></i>
							<i className='fab fa-cc-mastercard mr-2 text-white'></i>
							<i className='fab fa-cc-apple-pay mr-2 text-white'></i>
							<i className='fab fa-cc-paypal mr-2 text-white'></i>
						</div>
					</Col>
				</Row>

				<hr className='footer-divider' />

				<div className='d-flex flex-column flex-md-row align-items-center justify-content-between' style={{ fontSize: '0.8rem', color: '#64748b' }}>
					<div>&copy; {new Date().getFullYear()} PROSHOP Inc. All rights reserved. Designed for all devices.</div>
					<div className='mt-2 mt-md-0'>
						<span className='mr-3 text-muted' style={{ cursor: 'pointer' }}>Privacy Policy</span>
						<span className='mr-3 text-muted' style={{ cursor: 'pointer' }}>Terms of Service</span>
						<span className='text-muted' style={{ cursor: 'pointer' }}>Sitemap</span>
					</div>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row className='gy-4'>
					{/* Brand Column */}
					<Col lg={4} md={6} className='mb-4 mb-lg-0'>
						<div className='footer-brand d-flex align-items-center mb-2'>
							<i className='fas fa-cube text-primary mr-2'></i>
							<span>PRO<span style={{ color: '#60a5fa' }}>SHOP</span></span>
						</div>
						<p className='text-muted' style={{ fontSize: '0.875rem', maxWidth: '300px' }}>
							Premium electronics, high-fidelity acoustics, and hardware essentials built for creator workflows.
						</p>
						<div className='d-flex gap-3 text-muted mt-3' style={{ fontSize: '1.1rem' }}>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-twitter'></i></span>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-github'></i></span>
							<span className='mr-3' style={{ cursor: 'pointer' }}><i className='fab fa-instagram'></i></span>
						</div>
					</Col>

					{/* Quick Links */}
					<Col lg={2} md={6} sm={6} className='mb-4 mb-lg-0'>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>STORE</h3>
						<div className='d-flex flex-column gap-2' style={{ fontSize: '0.85rem' }}>
							<Link to='/' className='footer-link mb-2'>All Products</Link>
							<Link to='/search/Electronics' className='footer-link mb-2'>Electronics</Link>
							<Link to='/search/Audio' className='footer-link mb-2'>Audio & Sound</Link>
							<Link to='/search/Apple' className='footer-link mb-2'>Apple Gear</Link>
						</div>
					</Col>

					{/* Customer Support */}
					<Col lg={3} md={6} sm={6} className='mb-4 mb-lg-0'>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>CUSTOMER SERVICE</h3>
						<div className='d-flex flex-column gap-2' style={{ fontSize: '0.85rem' }}>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>Track Your Order</span>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>Shipping & Returns Policy</span>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>1-Year Hardware Warranty</span>
							<span className='footer-link mb-2' style={{ cursor: 'pointer' }}>Help Center & FAQ</span>
						</div>
					</Col>

					{/* Trust & Guarantee */}
					<Col lg={3} md={6}>
						<h3 style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.05em' }}>PAYMENT & TRUST</h3>
						<p className='text-muted' style={{ fontSize: '0.85rem' }}>
							Guaranteed 100% secure payment checkout protected with Stripe 256-bit encryption.
						</p>
						<div className='d-flex gap-2 text-muted' style={{ fontSize: '1.4rem' }}>
							<i className='fab fa-cc-stripe mr-2'></i>
							<i className='fab fa-cc-visa mr-2'></i>
							<i className='fab fa-cc-mastercard mr-2'></i>
							<i className='fab fa-cc-apple-pay mr-2'></i>
						</div>
					</Col>
				</Row>

				<hr className='footer-divider' />

				<div className='d-flex flex-column flex-md-row align-items-center justify-content-between' style={{ fontSize: '0.8rem' }}>
					<div>&copy; {new Date().getFullYear()} PROSHOP Inc. All rights reserved.</div>
					<div className='mt-2 mt-md-0'>
						<span className='mr-3 text-muted'>Privacy Policy</span>
						<span className='text-muted'>Terms of Service</span>
					</div>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;

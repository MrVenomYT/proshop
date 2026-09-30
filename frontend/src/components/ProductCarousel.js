import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import Rating from './Rating';
import { listTopProducts } from '../actions/product-actions';

const ProductCarousel = () => {
	const dispatch = useDispatch();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const productTopRated = useSelector((state) => state.productTopRated);
	const { loading, error, products } = productTopRated;

	useEffect(() => {
		dispatch(listTopProducts());
	}, [dispatch]);

	useEffect(() => {
		if (!products || products.length === 0 || isPaused) return;

		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % products.length);
		}, 6500);

		return () => clearInterval(timer);
	}, [products, isPaused]);

	if (loading) return <Loader />;
	if (error) return <Message variant='danger'>{error}</Message>;
	if (!products || products.length === 0) return null;

	const currentProduct = products[currentIndex];

	const hasDiscount = currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price;
	const discountPercent =
		currentProduct.discountPercent ||
		(hasDiscount
			? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
			: 0);

	return (
		<div
			className='hero-showcase-container mb-4'
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			style={{
				background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 50%, #1e1b4b 100%)',
				border: '1px solid rgba(255, 255, 255, 0.12)',
				borderRadius: '24px',
				overflow: 'hidden',
				boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
			}}
		>
			<div className='p-4 p-md-5'>
				<Row className='align-items-center g-4'>
					{/* Left Column: Text Info */}
					<Col lg={7} md={6}>
						<div className='d-flex align-items-center gap-2 mb-3 flex-wrap'>
							<span
								style={{
									background: 'rgba(99, 102, 241, 0.2)',
									border: '1px solid rgba(99, 102, 241, 0.4)',
									color: '#818cf8',
									padding: '4px 12px',
									borderRadius: '9999px',
									fontSize: '0.75rem',
									fontWeight: '800',
									letterSpacing: '0.08em',
									textTransform: 'uppercase',
								}}
							>
								NEXT-GEN FLAGSHIP
							</span>
							{discountPercent > 0 && (
								<span
									style={{
										background: '#ef4444',
										color: '#ffffff',
										padding: '4px 10px',
										borderRadius: '9999px',
										fontSize: '0.75rem',
										fontWeight: '800',
									}}
								>
									SAVE {discountPercent}%
								</span>
							)}
						</div>

						<h1
							className='hero-title mb-2'
							style={{
								fontSize: '2.4rem',
								fontWeight: '800',
								color: '#ffffff',
								lineHeight: '1.2',
								letterSpacing: '-0.03em',
							}}
						>
							Smarter Devices.<br />
							<span style={{ color: '#38bdf8' }}>Brighter Days.</span>
						</h1>

						<h3 className='text-white font-weight-bold mb-2' style={{ fontSize: '1.25rem' }}>
							{currentProduct.name}
						</h3>

						<p className='text-slate-300 mb-3' style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '520px' }}>
							{currentProduct.description}
						</p>

						<div className='d-flex align-items-center mb-3'>
							<Rating value={currentProduct.rating} text={`${currentProduct.numReviews} verified ratings`} />
						</div>

						{/* Pricing & CTA */}
						<div className='d-flex flex-wrap align-items-center gap-3 mb-4'>
							<div className='d-flex align-items-baseline mr-3'>
								<span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
									${Number(currentProduct.price).toFixed(2)}
								</span>
								{hasDiscount && (
									<span style={{ fontSize: '1.2rem', color: '#64748b', textDecoration: 'line-through', marginLeft: '10px' }}>
										${Number(currentProduct.originalPrice).toFixed(2)}
									</span>
								)}
							</div>

							<Link to={`/product/${currentProduct._id}`} className='btn btn-accent px-4 py-3 font-weight-bold'>
								Shop Flagship <i className='fas fa-arrow-right ml-2'></i>
							</Link>
							<Link to='/search/sale' className='btn btn-outline-light px-4 py-3 font-weight-bold'>
								Explore Deals
							</Link>
						</div>

						{/* 3 Pillar Sub-Badges */}
						<div className='d-flex flex-wrap align-items-center gap-4 pt-3' style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
							<div className='d-flex align-items-center mr-3 mb-2 mb-md-0'>
								<i className='fas fa-bolt text-warning mr-2'></i> Innovative Technology
							</div>
							<div className='d-flex align-items-center mr-3 mb-2 mb-md-0'>
								<i className='fas fa-check-circle text-success mr-2'></i> Official Warranty
							</div>
							<div className='d-flex align-items-center mb-2 mb-md-0'>
								<i className='fas fa-truck text-primary mr-2'></i> Express Delivery
							</div>
						</div>
					</Col>

					{/* Right Column: Clean Responsive Real Product Photo Card */}
					<Col lg={5} md={6}>
						<div
							className='p-4 rounded-24 d-flex align-items-center justify-content-center position-relative'
							style={{
								background: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
								border: '1px solid rgba(255, 255, 255, 0.12)',
								borderRadius: '20px',
								minHeight: '300px',
								maxHeight: '380px',
								boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
							}}
						>
							<img
								src={currentProduct.image}
								alt={currentProduct.name}
								style={{
									maxHeight: '320px',
									maxWidth: '100%',
									objectFit: 'cover',
									borderRadius: '16px',
									boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
									transition: 'transform 0.4s ease',
								}}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/images/sample.png';
								}}
							/>
						</div>
					</Col>
				</Row>
			</div>

			{/* Slide Navigation Controls Bar (Fixed Button Styling) */}
			<div className='px-4 py-3 d-flex align-items-center justify-content-between border-top' style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
				<div className='d-flex align-items-center gap-2'>
					{products.map((item, idx) => (
						<button
							key={item._id}
							type='button'
							className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
							onClick={() => setCurrentIndex(idx)}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>

				<div className='d-flex gap-2'>
					<button
						type='button'
						onClick={() =>
							setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
						}
						style={{
							width: '38px',
							height: '38px',
							borderRadius: '50%',
							background: 'rgba(255, 255, 255, 0.12)',
							border: '1px solid rgba(255, 255, 255, 0.25)',
							color: '#ffffff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: '0.9rem',
						}}
					>
						<i className='fas fa-chevron-left'></i>
					</button>
					<button
						type='button'
						onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)}
						style={{
							width: '38px',
							height: '38px',
							borderRadius: '50%',
							background: 'rgba(255, 255, 255, 0.12)',
							border: '1px solid rgba(255, 255, 255, 0.25)',
							color: '#ffffff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: '0.9rem',
						}}
					>
						<i className='fas fa-chevron-right'></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCarousel;

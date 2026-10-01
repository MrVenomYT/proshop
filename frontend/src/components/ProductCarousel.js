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
				background: 'radial-gradient(circle at 85% 50%, rgba(220, 38, 38, 0.08) 0%, #ffffff 65%)',
				border: '1px solid #e2e8f0',
				borderRadius: '24px',
				overflow: 'hidden',
				boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
			}}
		>
			<div className='p-4 p-md-5'>
				<Row className='align-items-center g-4'>
					{/* Left Column: TechVerse / ProShop Style Headline & CTAs */}
					<Col lg={7} md={6}>
						<div className='d-flex align-items-center gap-2 mb-2 flex-wrap'>
							<span
								style={{
									color: '#dc2626',
									fontSize: '0.85rem',
									fontWeight: '800',
									letterSpacing: '0.06em',
									textTransform: 'uppercase',
								}}
							>
								Discover. Shop. Upgrade.
							</span>
							{discountPercent > 0 && (
								<span
									style={{
										background: '#dc2626',
										color: '#ffffff',
										padding: '3px 10px',
										borderRadius: '9999px',
										fontSize: '0.72rem',
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
								fontSize: '2.6rem',
								fontWeight: '900',
								color: '#0f172a',
								lineHeight: '1.15',
								letterSpacing: '-0.03em',
							}}
						>
							Latest Tech &<br />
							<span style={{ color: '#dc2626' }}>Gadget Hardware</span>
						</h1>

						<h3 className='text-dark font-weight-bold mb-2' style={{ fontSize: '1.2rem', color: '#1e293b' }}>
							{currentProduct.name}
						</h3>

						<p className='text-muted mb-3' style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: '1.6', maxWidth: '520px' }}>
							{currentProduct.description}
						</p>

						<div className='d-flex align-items-center mb-3'>
							<Rating value={currentProduct.rating} text={`${currentProduct.numReviews} verified reviews`} />
						</div>

						{/* Price Display */}
						<div className='d-flex align-items-baseline mb-3'>
							<span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
								${Number(currentProduct.price).toFixed(2)}
							</span>
							{hasDiscount && (
								<span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '12px' }}>
									${Number(currentProduct.originalPrice).toFixed(2)}
								</span>
							)}
						</div>

						{/* Separate Dual Action Buttons Container with Spacing */}
						<div className='d-flex flex-wrap align-items-center mb-4'>
							<Link
								to={`/product/${currentProduct._id}`}
								className='btn font-weight-bold px-4 py-3 mr-3 mb-2'
								style={{
									background: '#dc2626',
									color: '#ffffff',
									borderRadius: '12px',
									boxShadow: '0 8px 18px rgba(220, 38, 38, 0.3)',
									display: 'inline-flex',
									alignItems: 'center',
								}}
							>
								Shop Now <i className='fas fa-arrow-right ml-2'></i>
							</Link>
							<Link
								to='/search/sale'
								className='btn btn-light font-weight-bold px-4 py-3 border mb-2'
								style={{
									borderRadius: '12px',
									display: 'inline-flex',
									alignItems: 'center',
								}}
							>
								Browse Collection
							</Link>
						</div>

						{/* Region Flags & Delivery Pill */}
						<div className='d-flex flex-wrap align-items-center gap-3 pt-3 border-top' style={{ borderColor: '#f1f5f9', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
							<span className='mr-2'>🇺🇸 US &nbsp; 🇬🇧 UK &nbsp; 🇦🇪 UAE</span>
							<span className='text-muted'>|</span>
							<span><i className='fas fa-truck text-danger mr-1.5'></i> Fast Express Shipping Worldwide</span>
						</div>
					</Col>

					{/* Right Column: High-Res Real Product Showcase */}
					<Col lg={5} md={6}>
						<div
							className='p-4 d-flex align-items-center justify-content-center position-relative'
							style={{
								background: 'radial-gradient(circle, rgba(220, 38, 38, 0.12) 0%, rgba(248, 250, 252, 0.5) 70%)',
								borderRadius: '20px',
								minHeight: '320px',
								border: '1px solid #f1f5f9',
							}}
						>
							<img
								src={currentProduct.image}
								alt={currentProduct.name}
								style={{
									maxHeight: '300px',
									maxWidth: '100%',
									objectFit: 'contain',
									borderRadius: '16px',
									filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.12))',
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

			{/* Slide Navigation Controls Bar */}
			<div className='px-4 py-3 d-flex align-items-center justify-content-between border-top bg-light' style={{ borderColor: '#f1f5f9' }}>
				<div className='d-flex align-items-center gap-2'>
					{products.map((item, idx) => (
						<button
							key={item._id}
							type='button'
							className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
							style={{
								width: idx === currentIndex ? '24px' : '10px',
								height: '8px',
								borderRadius: '9999px',
								background: idx === currentIndex ? '#dc2626' : '#cbd5e1',
								border: 'none',
								padding: 0,
								cursor: 'pointer',
								transition: 'all 0.2s ease',
							}}
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
							width: '36px',
							height: '36px',
							borderRadius: '50%',
							background: '#ffffff',
							border: '1px solid #cbd5e1',
							color: '#0f172a',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: '0.85rem',
						}}
					>
						<i className='fas fa-chevron-left'></i>
					</button>
					<button
						type='button'
						onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)}
						style={{
							width: '36px',
							height: '36px',
							borderRadius: '50%',
							background: '#ffffff',
							border: '1px solid #cbd5e1',
							color: '#0f172a',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: '0.85rem',
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

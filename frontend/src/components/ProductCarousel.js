import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
		}, 5500);

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
			className='hero-showcase-container mb-5'
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div className='hero-slide'>
				<div className='hero-slide-content'>
					<div className='d-flex align-items-center gap-2 mb-3'>
						<span className='hero-kicker'>
							<i className='fas fa-fire mr-1 text-warning'></i> FLAGSHIP SPOTLIGHT
						</span>
						{discountPercent > 0 && (
							<span className='badge-pill sale'>SAVE {discountPercent}%</span>
						)}
					</div>

					<h1 className='hero-title'>{currentProduct.name}</h1>
					<p className='hero-description'>{currentProduct.description}</p>

					<div className='mb-4'>
						<Rating value={currentProduct.rating} text={`${currentProduct.numReviews} verified reviews`} />
					</div>

					<div className='hero-price-row'>
						<div className='d-flex align-items-baseline mr-4'>
							<div className='hero-price'>${Number(currentProduct.price).toFixed(2)}</div>
							{hasDiscount && (
								<div className='hero-original-price ml-2'>
									${Number(currentProduct.originalPrice).toFixed(2)}
								</div>
							)}
						</div>
						<Link to={`/product/${currentProduct._id}`} className='btn btn-accent px-4 py-2 font-weight-bold'>
							Shop Now <i className='fas fa-arrow-right ml-2'></i>
						</Link>
					</div>
				</div>

				<div className='hero-image-wrapper'>
					<img
						src={currentProduct.image}
						alt={currentProduct.name}
						style={{
							filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.25))',
						}}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = '/images/sample.png';
						}}
					/>
				</div>
			</div>

			{/* Custom Slide Controls */}
			<div className='hero-controls'>
				<button
					type='button'
					className='hero-nav-btn prev'
					onClick={() =>
						setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
					}
					aria-label='Previous slide'
				>
					<i className='fas fa-chevron-left'></i>
				</button>

				<div className='hero-dots'>
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

				<button
					type='button'
					className='hero-nav-btn next'
					onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)}
					aria-label='Next slide'
				>
					<i className='fas fa-chevron-right'></i>
				</button>
			</div>
		</div>
	);
};

export default ProductCarousel;

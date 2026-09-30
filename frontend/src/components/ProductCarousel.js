import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import Rating from './Rating';
import { listTopProducts } from '../actions/product-actions';

const ProductCarousel = () => {
	const dispatch = useDispatch();

	const productTopRated = useSelector((state) => state.productTopRated);
	const { loading, error, products } = productTopRated;

	useEffect(() => {
		dispatch(listTopProducts());
	}, [dispatch]);

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<Carousel pause='hover' className='hero-carousel' interval={5000}>
			{products.map((product) => (
				<Carousel.Item key={product._id}>
					<div className='hero-slide'>
						<div className='hero-slide-content'>
							<div className='hero-kicker'>
								<i className='fas fa-fire mr-1 text-warning'></i> Featured Flagship
							</div>
							<h1 className='hero-title'>{product.name}</h1>
							<p className='hero-description'>{product.description}</p>

							<div className='mb-3'>
								<Rating value={product.rating} text={`${product.numReviews} ratings`} />
							</div>

							<div className='hero-price-row'>
								<div className='hero-price'>${Number(product.price).toFixed(2)}</div>
								<Link to={`/product/${product._id}`} className='btn btn-accent'>
									Explore Details <i className='fas fa-arrow-right ml-1'></i>
								</Link>
							</div>
						</div>

						<div className='hero-image-wrapper'>
							<img
								src={product.image}
								alt={product.name}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/images/sample.jpg';
								}}
							/>
						</div>
					</div>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default ProductCarousel;

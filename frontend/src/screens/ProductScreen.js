import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Card,
	Button,
	Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import {
	listProductDetails,
	createProductReview,
} from '../actions/product-actions';
import {
	addToFavorites,
	removeFavorite,
	getFavorites,
} from '../actions/user-actions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/product-constants';
import useIsMounted from '../hooks/useIsMounted';

const ProductScreen = ({ history, match }) => {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [isFavorite, setIsFavorite] = useState(false);
	const [reviewSubmitted, setReviewSubmitted] = useState(false);

	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	const productReviewCreate = useSelector((state) => state.productReviewCreate);
	const {
		success: successProductReview,
		error: errorProductReview,
	} = productReviewCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites } = userFavorites;

	useEffect(() => {
		if (successProductReview) {
			setReviewSubmitted(true);
			setRating(5);
			setComment('');
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}

		dispatch(listProductDetails(match.params.id));

		if (userInfo) {
			dispatch(getFavorites(userInfo._id));
		}
	}, [dispatch, match, userInfo, successProductReview]);

	const isMounted = useIsMounted();

	useEffect(() => {
		if (isMounted.current && favorites) {
			setIsFavorite(favorites.some((x) => (x.product?._id || x.product)?.toString() === match.params.id));
		}
	}, [isMounted, favorites, match.params.id]);

	const addToCartHandler = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			createProductReview(match.params.id, {
				rating,
				comment,
			})
		);
	};

	const toggleFavoriteHandler = () => {
		if (!userInfo) {
			history.push('/login');
			return;
		}
		if (isFavorite) {
			dispatch(removeFavorite(product._id, userInfo._id));
			setIsFavorite(false);
		} else {
			dispatch(addToFavorites(product, userInfo._id));
			setIsFavorite(true);
		}
	};

	return (
		<>
			<div className='mb-4'>
				<Link className='btn btn-light' to='/'>
					<i className='fas fa-arrow-left mr-2'></i> Back to Catalog
				</Link>
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Meta title={`${product.name} | ProShop`} />

					<Row className='mb-5'>
						{/* Product Image Stage */}
						<Col lg={7} md={6} className='mb-4 mb-md-0'>
							<div className='pdp-gallery-container'>
								<img
									src={product.image}
									alt={product.name}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/images/sample.jpg';
									}}
								/>
							</div>
						</Col>

						{/* Product Contiguous Purchase Module */}
						<Col lg={5} md={6}>
							<div className='pdp-info-card'>
								<div className='d-flex align-items-center justify-content-between mb-2'>
									<span className='product-category-kicker mb-0'>{product.brand || 'Electronics'}</span>
									<button
										type='button'
										onClick={toggleFavoriteHandler}
										className={`product-favorite-btn ${isFavorite ? 'favorited' : ''}`}
										style={{ position: 'static', width: '40px', height: '40px' }}
										title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
									>
										<i className={isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart'}></i>
									</button>
								</div>

								<h1 style={{ fontSize: '1.75rem', lineHeight: '1.3' }}>{product.name}</h1>

								<div className='d-flex align-items-center mb-3 pb-3 border-bottom'>
									<Rating value={product.rating} text={`${product.numReviews} customer reviews`} />
								</div>

								<div className='d-flex align-items-baseline justify-content-between mb-4'>
									<div className='d-flex align-items-baseline gap-2'>
										<span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
											${Number(product.price).toFixed(2)}
										</span>
									</div>

									<span className={`status-pill ${product.countInStock > 0 ? 'success' : 'danger'}`}>
										<span className='stock-dot'></span>
										{product.countInStock > 0 ? `${product.countInStock} Units in Stock` : 'Out of Stock'}
									</span>
								</div>

								<p className='text-muted mb-4' style={{ fontSize: '0.95rem' }}>
									{product.description}
								</p>

								{product.countInStock > 0 && (
									<div className='d-flex align-items-center gap-3 mb-4'>
										<label className='mb-0 font-weight-bold mr-2' style={{ fontSize: '0.9rem' }}>
											Quantity:
										</label>
										<Form.Control
											as='select'
											value={qty}
											onChange={(e) => setQty(Number(e.target.value))}
											style={{ maxWidth: '100px' }}
										>
											{[...Array(product.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</div>
								)}

								<Button
									onClick={addToCartHandler}
									className='btn-block btn-accent py-3 font-weight-bold mb-3'
									type='button'
									disabled={product.countInStock === 0}
									style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
								>
									<i className='fas fa-shopping-bag mr-2'></i>
									{product.countInStock > 0 ? 'Add to Shopping Bag' : 'Currently Unavailable'}
								</Button>

								{/* Trust Badges */}
								<div className='trust-badge-row'>
									<div className='trust-badge-item'>
										<i className='fas fa-shipping-fast text-primary'></i>
										<span>Free Express Delivery</span>
									</div>
									<div className='trust-badge-item'>
										<i className='fas fa-shield-alt text-primary'></i>
										<span>1-Year Warranty</span>
									</div>
									<div className='trust-badge-item'>
										<i className='fas fa-undo text-primary'></i>
										<span>30-Day Returns</span>
									</div>
								</div>
							</div>
						</Col>
					</Row>

					{/* Customer Reviews Section */}
					<Row className='mt-4'>
						<Col lg={7} md={12} className='mb-4'>
							<Card className='p-4'>
								<h2 className='mb-3'>Customer Reviews ({product.reviews ? product.reviews.length : 0})</h2>

								{product.reviews && product.reviews.length === 0 && (
									<div className='p-4 text-center text-muted bg-light rounded'>
										<i className='far fa-comment-dots fa-2x mb-2'></i>
										<p className='mb-0'>No reviews yet. Be the first to share your experience!</p>
									</div>
								)}

								<div className='reviews-list'>
									{product.reviews &&
										product.reviews.map((review) => (
											<div key={review._id} className='border-bottom py-3'>
												<div className='d-flex align-items-center justify-content-between mb-1'>
													<strong style={{ fontSize: '0.95rem' }}>{review.name}</strong>
													<span className='text-muted' style={{ fontSize: '0.8rem' }}>
														{review.createdAt ? review.createdAt.substring(0, 10) : 'Recent'}
													</span>
												</div>
												<div className='mb-2'>
													<Rating value={review.rating} />
												</div>
												<p className='text-muted mb-0' style={{ fontSize: '0.9rem' }}>
													{review.comment}
												</p>
											</div>
										))}
								</div>
							</Card>
						</Col>

						<Col lg={5} md={12}>
							<Card className='p-4'>
								<h2 className='mb-3'>Write a Review</h2>

								{reviewSubmitted && (
									<Message variant='success'>Thank you! Your review has been recorded.</Message>
								)}
								{errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

								{userInfo ? (
									<Form onSubmit={submitHandler}>
										<Form.Group controlId='rating' className='mb-3'>
											<Form.Label className='font-weight-bold'>Overall Rating</Form.Label>
											<Form.Control
												as='select'
												value={rating}
												onChange={(e) => setRating(Number(e.target.value))}
											>
												<option value='5'>5 - Excellent ★★★★★</option>
												<option value='4'>4 - Very Good ★★★★☆</option>
												<option value='3'>3 - Average ★★★☆☆</option>
												<option value='2'>2 - Fair ★★☆☆☆</option>
												<option value='1'>1 - Poor ★☆☆☆☆</option>
											</Form.Control>
										</Form.Group>

										<Form.Group controlId='comment' className='mb-3'>
											<Form.Label className='font-weight-bold'>Your Feedback</Form.Label>
											<Form.Control
												as='textarea'
												rows={4}
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												placeholder='What did you like or dislike about this product?'
												required
											/>
										</Form.Group>

										<Button type='submit' className='btn-primary btn-block py-2'>
											Submit Review
										</Button>
									</Form>
								) : (
									<div className='text-center p-4 bg-light rounded'>
										<p className='text-muted mb-3'>Sign in to share your verified review.</p>
										<Link to='/login' className='btn btn-primary btn-sm'>
											Sign In to Review
										</Link>
									</div>
								)}
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default ProductScreen;

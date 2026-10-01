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
import Message from '../components/Message';
import Meta from '../components/Meta';
import PriceDropAlert from '../components/PriceDropAlert';
import ProductFaqAccordion from '../components/ProductFaqAccordion';
import ProductImageZoom from '../components/ProductImageZoom';
import SocialShareButtons from '../components/SocialShareButtons';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
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

	const hasDiscount = product && product.originalPrice && product.originalPrice > product.price;
	const discountPercent =
		product &&
		(product.discountPercent ||
			(hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0));

	return (
		<>
			<div className='mb-4'>
				<Link className='btn btn-light font-weight-bold' to='/'>
					<i className='fas fa-arrow-left mr-2'></i> Back to Catalog
				</Link>
			</div>

			{loading ? (
				<ProductDetailSkeleton />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : !product || !product.name ? (
				<Message variant='danger'>Product Not Found</Message>
			) : (
				<>
					<Meta title={`${product.name} | ProShop`} />

					<Row className='mb-5'>
						{/* Product Image Stage with Interactive Zoom */}
						<Col lg={7} md={6} className='mb-4 mb-md-0'>
							<ProductImageZoom src={product.image} alt={product.name} />

							{/* Social Sharing Buttons */}
							<SocialShareButtons product={product} />
						</Col>

						{/* Product Purchase Module */}
						<Col lg={5} md={6}>
							<div className='pdp-info-card'>
								<div className='d-flex align-items-center justify-content-between mb-2'>
									<div className='d-flex align-items-center gap-2'>
										<span className='product-category-kicker mb-0'>{product.brand || 'Hardware'}</span>
										{product.isHot && <span className='badge-pill hot'>HOT DEAL</span>}
										{discountPercent > 0 && <span className='badge-pill sale'>-{discountPercent}% OFF</span>}
									</div>
									<button
										type='button'
										onClick={toggleFavoriteHandler}
										className={`product-favorite-btn ${isFavorite ? 'favorited' : ''}`}
										style={{ position: 'static', width: '40px', height: '40px' }}
										title={isFavorite ? 'Remove from favorites' : 'Save to wishlist'}
									>
										<i className={isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart'}></i>
									</button>
								</div>

								<h1 style={{ fontSize: '1.75rem', lineHeight: '1.3' }}>{product.name}</h1>

								<div className='d-flex align-items-center mb-3 pb-3 border-bottom'>
									<Rating value={product.rating} text={`${product.numReviews} verified customer reviews`} />
								</div>

								<div className='d-flex align-items-baseline justify-content-between mb-4'>
									<div className='d-flex align-items-baseline gap-2'>
										<span style={{ fontSize: '2.1rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
											${Number(product.price).toFixed(2)}
										</span>
										{hasDiscount && (
											<span className='product-original-price ml-2' style={{ fontSize: '1.2rem' }}>
												${Number(product.originalPrice).toFixed(2)}
											</span>
										)}
									</div>

									<span className={`status-pill ${product.countInStock > 0 ? 'success' : 'danger'}`}>
										<span className='stock-dot'></span>
										{product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Sold Out'}
									</span>
								</div>

								<p className='text-muted mb-4' style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
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
											style={{ width: '90px', borderRadius: '8px' }}
										>
											{[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</div>
								)}

								<Button
									onClick={addToCartHandler}
									className='btn-accent btn-block py-3 mb-3'
									type='button'
									disabled={product.countInStock === 0}
									style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
								>
									<i className='fas fa-shopping-bag mr-2'></i>
									{product.countInStock > 0 ? 'Add to Bag' : 'Temporarily Out of Stock'}
								</Button>

								{/* Trust Indicators */}
								<div className='row pt-3 text-muted text-center' style={{ fontSize: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
									<div className='col-4'>
										<i className='fas fa-shield-alt fa-lg mb-1 d-block text-primary'></i>
										2-Yr Warranty
									</div>
									<div className='col-4'>
										<i className='fas fa-truck fa-lg mb-1 d-block text-primary'></i>
										Free Express
									</div>
									<div className='col-4'>
										<i className='fas fa-undo fa-lg mb-1 d-block text-primary'></i>
										30-Day Return
									</div>
								</div>
							</div>
						</Col>
					</Row>

					{/* Price Drop Alert Notification Form */}
					<PriceDropAlert product={product} userInfo={userInfo} />

					{/* Frequently Bought Together Bundle Engine */}
					<FrequentlyBoughtTogether currentProduct={product} />

					{/* Collapsible FAQ Accordion Section */}
					<ProductFaqAccordion />

					{/* Customer Reviews Section */}
					<Row>
						<Col md={7}>
							<div className='d-flex align-items-center justify-content-between mb-3'>
								<h2 style={{ fontSize: '1.4rem' }}>Verified Customer Reviews</h2>
								<span className='text-muted' style={{ fontSize: '0.85rem' }}>
									{product.reviews.length} total review{product.reviews.length !== 1 ? 's' : ''}
								</span>
							</div>

							{product.reviews.length === 0 && (
								<Message variant='info'>No reviews yet. Be the first to review this product!</Message>
							)}

							<div className='d-flex flex-column gap-3'>
								{product.reviews.map((rev) => (
									<Card key={rev._id} className='p-3 mb-3 border-0' style={{ background: '#f8fafc', borderRadius: '12px' }}>
										<div className='d-flex justify-content-between align-items-center mb-2'>
											<div className='d-flex align-items-center'>
												<div
													style={{
														width: '32px',
														height: '32px',
														borderRadius: '50%',
														background: '#0f172a',
														color: '#fff',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: '0.85rem',
														fontWeight: '700',
														marginRight: '10px',
													}}
												>
													{rev.name.charAt(0).toUpperCase()}
												</div>
												<div>
													<strong className='d-block' style={{ fontSize: '0.9rem' }}>{rev.name}</strong>
													<span className='text-muted' style={{ fontSize: '0.75rem' }}>
														{rev.createdAt ? rev.createdAt.substring(0, 10) : 'Recent'}
													</span>
												</div>
											</div>
											<Rating value={rev.rating} />
										</div>
										<p className='mb-0 text-dark' style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
											{rev.comment}
										</p>
									</Card>
								))}
							</div>
						</Col>

						<Col md={5}>
							<Card className='p-4 border-0' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
								<h3 style={{ fontSize: '1.2rem' }}>Write a Review</h3>

								{reviewSubmitted && (
									<Message variant='success'>Thank you! Your review has been submitted.</Message>
								)}
								{errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

								{userInfo ? (
									<Form onSubmit={submitHandler}>
										<Form.Group controlId='rating' className='mb-3'>
											<Form.Label className='font-weight-bold'>Rating</Form.Label>
											<Form.Control
												as='select'
												value={rating}
												onChange={(e) => setRating(Number(e.target.value))}
											>
												<option value='5'>5 - ★★★★★ Exceptional</option>
												<option value='4'>4 - ★★★★☆ Very Good</option>
												<option value='3'>3 - ★★★☆☆ Average</option>
												<option value='2'>2 - ★★☆☆☆ Fair</option>
												<option value='1'>1 - ★☆☆☆☆ Poor</option>
											</Form.Control>
										</Form.Group>

										<Form.Group controlId='comment' className='mb-4'>
											<Form.Label className='font-weight-bold'>Feedback / Comments</Form.Label>
											<Form.Control
												as='textarea'
												row='4'
												value={comment}
												placeholder='Share your experience with build quality, battery life, performance...'
												onChange={(e) => setComment(e.target.value)}
												required
											/>
										</Form.Group>

										<Button type='submit' className='btn-accent btn-block py-2 font-weight-bold'>
											Submit Verified Review
										</Button>
									</Form>
								) : (
									<Message>
										Please <Link to='/login' className='font-weight-bold'>Sign In</Link> to post a product review.
									</Message>
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

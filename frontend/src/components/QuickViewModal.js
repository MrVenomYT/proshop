import React, { useState } from 'react';
import { Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Rating from './Rating';
import { addToCart } from '../actions/cart-actions';
import { addToFavorites, removeFavorite } from '../actions/user-actions';

const QuickViewModal = ({ product, show, onClose }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [qty, setQty] = useState(1);
	const [addToast, setAddToast] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites } = userFavorites;

	if (!product) return null;

	const productId = product._id;
	const isFavorited = favorites && favorites.some((f) => (f.product?._id || f.product)?.toString() === productId?.toString());

	const hasDiscount = product.originalPrice && product.originalPrice > product.price;
	const discountPercent =
		product.discountPercent ||
		(hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

	const handleAddToCart = () => {
		dispatch(addToCart(productId, Number(qty)));
		setAddToast(true);
		setTimeout(() => {
			setAddToast(false);
			onClose();
			history.push('/cart');
		}, 600);
	};

	const handleToggleFavorite = () => {
		if (!userInfo) {
			history.push('/login');
			return;
		}
		if (isFavorited) {
			dispatch(removeFavorite(productId, userInfo._id));
		} else {
			dispatch(addToFavorites(product, userInfo._id));
		}
	};

	return (
		<Modal show={show} onHide={onClose} size='lg' centered className='quick-view-modal'>
			<Modal.Header closeButton className='border-0 pb-0'>
				<Modal.Title style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
					Quick Product Details
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className='p-4'>
				<Row className='align-items-center g-4'>
					{/* Product Image Stage */}
					<Col md={6}>
						<div
							className='p-4 d-flex align-items-center justify-content-center position-relative'
							style={{
								background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)',
								border: '1px solid #e2e8f0',
								borderRadius: '20px',
								minHeight: '280px',
							}}
						>
							{discountPercent > 0 && (
								<span
									style={{
										position: 'absolute',
										top: '12px',
										left: '12px',
										background: '#dc2626',
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

							<img
								src={product.image}
								alt={product.name}
								style={{
									maxHeight: '260px',
									maxWidth: '100%',
									objectFit: 'contain',
									filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.1))',
								}}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/images/sample.png';
								}}
							/>
						</div>
					</Col>

					{/* Product Specs & Add to Bag */}
					<Col md={6}>
						<div className='d-flex align-items-center gap-2 mb-1 text-muted' style={{ fontSize: '0.8rem', fontWeight: '600' }}>
							<span className='text-danger text-uppercase' style={{ letterSpacing: '0.05em' }}>{product.brand || 'ProShop'}</span>
							<span>·</span>
							<span>{product.category}</span>
						</div>

						<h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.25' }}>
							{product.name}
						</h2>

						<div className='d-flex align-items-center my-2 gap-2'>
							<Rating value={product.rating} text={`${product.numReviews} ratings`} />
						</div>

						{/* Price Row */}
						<div className='d-flex align-items-baseline gap-3 my-3'>
							<span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
								${Number(product.price).toFixed(2)}
							</span>
							{hasDiscount && (
								<span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
									${Number(product.originalPrice).toFixed(2)}
								</span>
							)}
						</div>

						{/* Stock Tag */}
						<div className='mb-3'>
							<span className={`stock-tag ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
								<span className='stock-dot'></span>
								{product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Currently Sold Out'}
							</span>
						</div>

						<p className='text-muted mb-4' style={{ fontSize: '0.88rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
							{product.description}
						</p>

						{/* Add to Cart Actions */}
						{product.countInStock > 0 && (
							<div className='d-flex align-items-center gap-3 mb-3'>
								<Form.Control
									as='select'
									value={qty}
									onChange={(e) => setQty(e.target.value)}
									style={{ width: '80px', borderRadius: '10px', fontWeight: '700' }}
								>
									{[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
										<option key={x + 1} value={x + 1}>
											{x + 1}
										</option>
									))}
								</Form.Control>

								<Button
									type='button'
									onClick={handleAddToCart}
									className='flex-grow-1 font-weight-bold py-2.5'
									style={{
										background: addToast ? '#10b981' : '#dc2626',
										borderColor: addToast ? '#10b981' : '#dc2626',
										borderRadius: '10px',
									}}
								>
									<i className={`fas ${addToast ? 'fa-check' : 'fa-shopping-bag'} mr-2`}></i>
									{addToast ? 'Added to Bag!' : 'Add to Bag'}
								</Button>

								<Button
									type='button'
									variant='light'
									onClick={handleToggleFavorite}
									className='border'
									style={{ borderRadius: '10px', width: '44px', height: '42px', color: isFavorited ? '#dc2626' : '#64748b' }}
									title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
								>
									<i className={isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
								</Button>
							</div>
						)}

						<div className='pt-2 border-top'>
							<Link to={`/product/${productId}`} onClick={onClose} className='text-primary font-weight-bold' style={{ fontSize: '0.85rem' }}>
								View Full Specifications & Reviews &rarr;
							</Link>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

export default QuickViewModal;

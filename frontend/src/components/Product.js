import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from './Rating';
import { addToFavorites, removeFavorite } from '../actions/user-actions';
import { addToCart } from '../actions/cart-actions';

const Product = ({ product, isFavorite: isFavoriteProp, removeFromFavorites }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites } = userFavorites;

	const productId = isFavoriteProp ? product.product : product._id;
	const isFavorited =
		isFavoriteProp ||
		(favorites && favorites.some((f) => (f.product?._id || f.product)?.toString() === productId?.toString()));

	const toggleFavoriteHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!userInfo) {
			window.location.href = '/login';
			return;
		}
		if (isFavorited) {
			if (removeFromFavorites) {
				removeFromFavorites(productId);
			} else {
				dispatch(removeFavorite(productId, userInfo._id));
			}
		} else {
			dispatch(addToFavorites(product, userInfo._id));
		}
	};

	const quickAddToCartHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (product.countInStock > 0) {
			dispatch(addToCart(productId, 1));
			history.push('/cart');
		}
	};

	const hasDiscount = product.originalPrice && product.originalPrice > product.price;
	const discountPercent =
		product.discountPercent ||
		(hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

	return (
		<div className='product-card my-3 position-relative'>
			{/* Sales / Hot Badges */}
			<div className='product-badge-stack'>
				{product.isHot && <span className='badge-pill hot'>HOT</span>}
				{discountPercent > 0 && <span className='badge-pill sale'>-{discountPercent}%</span>}
				{product.badge && !product.isHot && discountPercent === 0 && (
					<span className='badge-pill highlight'>{product.badge}</span>
				)}
			</div>

			<div className='product-image-container'>
				<Link
					to={`/product/${productId}`}
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '1.25rem',
					}}
				>
					<img
						src={product.image}
						alt={product.name}
						loading='lazy'
						style={{
							maxHeight: '100%',
							maxWidth: '100%',
							objectFit: 'contain',
							filter: 'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.08))',
							transition: 'transform 0.35s ease',
						}}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = '/images/sample.png';
						}}
					/>
				</Link>

				<button
					type='button'
					onClick={toggleFavoriteHandler}
					className={`product-favorite-btn ${isFavorited ? 'favorited' : ''}`}
					title={isFavorited ? 'Remove from favorites' : 'Save to wishlist'}
					aria-label='Toggle favorite'
				>
					<i className={isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
				</button>
			</div>

			<div className='product-body'>
				{/* Clean unboxed metadata with typographic separators */}
				<div className='d-flex align-items-center gap-1 mb-1 text-muted' style={{ fontSize: '0.75rem', fontWeight: '600' }}>
					<span style={{ color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
						{product.brand || 'Hardware'}
					</span>
					<span aria-hidden='true'>·</span>
					<span>{product.category}</span>
				</div>

				<Link to={`/product/${productId}`}>
					<div className='product-title' title={product.name}>
						{product.name}
					</div>
				</Link>

				<div className='my-2 d-flex align-items-center justify-content-between'>
					<Rating value={product.rating} text={`${product.numReviews}`} />
					{product.countInStock !== undefined && (
						<span className={`stock-tag ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
							<span className='stock-dot'></span>
							{product.countInStock > 0 ? `${product.countInStock} Left` : 'Sold Out'}
						</span>
					)}
				</div>

				<div className='product-price-row mt-2 d-flex align-items-center justify-content-between'>
					<div className='d-flex align-items-baseline gap-2'>
						<span className='product-current-price'>${Number(product.price).toFixed(2)}</span>
						{hasDiscount && (
							<span className='product-original-price'>
								${Number(product.originalPrice).toFixed(2)}
							</span>
						)}
					</div>

					<button
						type='button'
						onClick={quickAddToCartHandler}
						disabled={product.countInStock === 0}
						className='btn btn-accent btn-sm font-weight-bold d-inline-flex align-items-center'
						style={{ borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
						title={product.countInStock > 0 ? 'Quick Add to Bag' : 'Sold Out'}
					>
						<i className='fas fa-shopping-bag mr-1'></i> Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default Product;

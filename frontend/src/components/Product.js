import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from './Rating';
import { addToFavorites, removeFavorite } from '../actions/user-actions';

const Product = ({ product, isFavorite: isFavoriteProp, removeFromFavorites }) => {
	const dispatch = useDispatch();
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

	return (
		<div className='product-card my-3'>
			<div className='product-image-container'>
				<Link to={`/product/${productId}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<img
						src={product.image}
						alt={product.name}
						loading='lazy'
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = '/images/sample.jpg';
						}}
					/>
				</Link>

				<button
					type='button'
					onClick={toggleFavoriteHandler}
					className={`product-favorite-btn ${isFavorited ? 'favorited' : ''}`}
					title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
					aria-label='Toggle favorite'
				>
					<i className={isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
				</button>
			</div>

			<div className='product-body'>
				<div className='product-category-kicker'>{product.brand || product.category || 'Tech'}</div>

				<Link to={`/product/${productId}`}>
					<div className='product-title' title={product.name}>
						{product.name}
					</div>
				</Link>

				<div className='my-2'>
					<Rating value={product.rating} text={`${product.numReviews}`} />
				</div>

				<div className='product-price'>
					<span>${Number(product.price).toFixed(2)}</span>
					{product.countInStock !== undefined && (
						<span className={`stock-tag ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
							<span className='stock-dot'></span>
							{product.countInStock > 0 ? 'In Stock' : 'Sold Out'}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default Product;

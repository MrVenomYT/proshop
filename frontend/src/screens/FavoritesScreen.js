import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import QuickViewModal from '../components/QuickViewModal';
import { getFavorites, removeFavorite } from '../actions/user-actions';

const FavoritesScreen = ({ history }) => {
	const dispatch = useDispatch();
	const [quickViewProduct, setQuickViewProduct] = useState(null);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites, loading, error } = userFavorites;

	const userRemoveFavorite = useSelector((state) => state.userRemoveFavorite);
	const {
		loading: removeFavoriteLoading,
		success: successRemoveFavorite,
		error: errorRemoveFavorite,
	} = userRemoveFavorite;

	useEffect(() => {
		if (!userInfo) {
			history.push('/login');
		} else {
			dispatch(getFavorites(userInfo._id));
		}
	}, [dispatch, history, userInfo, successRemoveFavorite]);

	const removeFromFavoritesHandler = (productId) => {
		if (userInfo) {
			dispatch(removeFavorite(productId, userInfo._id));
		}
	};

	return (
		<>
			<Meta title='Saved Wishlist | ProShop' />

			<div className='d-flex align-items-center justify-content-between mb-4'>
				<div>
					<h1 className='mb-1'>Saved Wishlist</h1>
					<p className='text-muted mb-0'>Items you bookmarked for later purchase and price tracking.</p>
				</div>
				{favorites && favorites.length > 0 && (
					<Link to='/' className='btn btn-light btn-sm font-weight-bold'>
						<i className='fas fa-plus mr-1'></i> Browse More Tech
					</Link>
				)}
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : !favorites || favorites.length === 0 ? (
				<Card className='p-5 text-center my-4' style={{ background: '#ffffff', borderRadius: '16px' }}>
					<div className='mb-3'>
						<i className='far fa-heart fa-4x text-muted opacity-50'></i>
					</div>
					<h3>Your Wishlist is Empty</h3>
					<p className='text-muted mx-auto' style={{ maxWidth: '400px' }}>
						Click the heart icon on any hardware card to bookmark items and track special promotions.
					</p>
					<div>
						<Link to='/' className='btn btn-accent px-4 py-2 mt-2 font-weight-bold'>
							Discover Flagship Gear
						</Link>
					</div>
				</Card>
			) : (
				<>
					{errorRemoveFavorite && <Message variant='danger'>{errorRemoveFavorite}</Message>}
					{removeFavoriteLoading && <Loader />}
					<Row>
						{favorites.map((product) => (
							<Col key={product.product || product._id} sm={12} md={6} lg={4} xl={3}>
								<Product
									product={product}
									isFavorite={true}
									removeFromFavorites={removeFromFavoritesHandler}
									onQuickView={(prod) => setQuickViewProduct(prod)}
								/>
							</Col>
						))}
					</Row>

					<QuickViewModal
						product={quickViewProduct}
						show={!!quickViewProduct}
						onClose={() => setQuickViewProduct(null)}
					/>
				</>
			)}
		</>
	);
};

export default FavoritesScreen;

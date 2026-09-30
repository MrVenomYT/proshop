import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/product-actions';

const HomeScreen = ({ match, history }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;
	const [activeCategory, setActiveCategory] = useState('all');

	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
	}, [dispatch, keyword, pageNumber]);

	const categories = [
		{ id: 'all', label: 'All Tech' },
		{ id: 'Electronics', label: 'Electronics', keyword: 'Electronics' },
		{ id: 'Apple', label: 'Apple', keyword: 'Apple' },
		{ id: 'Audio', label: 'Audio & Sound', keyword: 'Airpods' },
		{ id: 'Gaming', label: 'Gaming & Gear', keyword: 'Playstation' },
		{ id: 'Camera', label: 'Cameras & Optics', keyword: 'Camera' },
	];

	const handleCategoryClick = (cat) => {
		setActiveCategory(cat.id);
		if (cat.id === 'all') {
			history.push('/');
		} else {
			history.push(`/search/${cat.keyword || cat.id}`);
		}
	};

	return (
		<>
			<Meta />

			{!keyword ? (
				<ProductCarousel />
			) : (
				<div className='d-flex align-items-center justify-content-between mb-4'>
					<Link to='/' className='btn btn-light'>
						<i className='fas fa-arrow-left mr-2'></i> Back to All Products
					</Link>
					<span className='text-muted'>
						Results for &ldquo;<strong className='text-dark'>{keyword}</strong>&rdquo;
					</span>
				</div>
			)}

			<div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3'>
				<div>
					<h1 className='mb-1' style={{ fontSize: '1.75rem' }}>
						{keyword ? `Search Results` : 'Curated Products'}
					</h1>
					<p className='text-muted mb-0' style={{ fontSize: '0.9rem' }}>
						Discover cutting-edge consumer hardware, precision audio, and mobile accessories.
					</p>
				</div>

				{!keyword && (
					<div className='category-filter-bar mt-3 mt-md-0'>
						{categories.map((cat) => (
							<button
								key={cat.id}
								type='button'
								onClick={() => handleCategoryClick(cat)}
								className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
							>
								{cat.label}
							</button>
						))}
					</div>
				)}
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : products.length === 0 ? (
				<div className='text-center py-5'>
					<i className='fas fa-search fa-3x text-muted mb-3'></i>
					<h3>No Products Found</h3>
					<p className='text-muted'>Try adjusting your search keyword or browse all catalog items.</p>
					<Link to='/' className='btn btn-primary mt-2'>
						View All Products
					</Link>
				</div>
			) : (
				<>
					<Row>
						{products.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate
						pages={pages}
						page={page}
						keyword={keyword ? keyword : ''}
					/>
				</>
			)}
		</>
	);
};

export default HomeScreen;

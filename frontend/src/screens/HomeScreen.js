import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import BentoCollections from '../components/BentoCollections';
import BrandLogosRow from '../components/BrandLogosRow';
import Meta from '../components/Meta';
import { listProducts } from '../actions/product-actions';

const HomeScreen = ({ match, history }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;
	const [activeFilter, setActiveFilter] = useState('all');
	const [sortBy, setSortBy] = useState('featured');

	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
	}, [dispatch, keyword, pageNumber]);

	const departmentFilters = [
		{ id: 'all', label: 'All Catalog' },
		{ id: 'hot', label: '🔥 Trending Now' },
		{ id: 'sale', label: '🏷️ Best Deals' },
		{ id: 'Smartphones & Tablets', label: 'Smartphones' },
		{ id: 'Laptops & Handhelds', label: 'Laptops & PCs' },
		{ id: 'PC Components & Desktops', label: 'PC & GPUs' },
		{ id: 'Wearables & Smart Glasses', label: 'Wearables' },
		{ id: 'Monitors & Displays', label: 'Monitors' },
		{ id: 'Keyboards & Controllers', label: 'Peripherals' },
		{ id: 'Audio & Creator Gear', label: 'Audio & Studio' },
		{ id: 'Power & Charging Hubs', label: 'Power & Charging' },
		{ id: 'Storage & Backup', label: 'Storage & SSDs' },
		{ id: 'Networking & Smart Home', label: 'Networking' },
	];

	// Client-side filtering & sorting
	const filteredProducts = useMemo(() => {
		if (!products) return [];
		let result = [...products];

		if (activeFilter === 'hot') {
			result = result.filter((p) => p.isHot);
		} else if (activeFilter === 'sale') {
			result = result.filter((p) => p.isSale || (p.originalPrice && p.originalPrice > p.price));
		} else if (activeFilter !== 'all') {
			result = result.filter(
				(p) =>
					p.category?.toLowerCase() === activeFilter.toLowerCase() ||
					p.brand?.toLowerCase() === activeFilter.toLowerCase()
			);
		}

		if (sortBy === 'price-low') {
			result.sort((a, b) => a.price - b.price);
		} else if (sortBy === 'price-high') {
			result.sort((a, b) => b.price - a.price);
		} else if (sortBy === 'rating') {
			result.sort((a, b) => b.rating - a.rating);
		} else if (sortBy === 'discount') {
			result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
		}

		return result;
	}, [products, activeFilter, sortBy]);

	return (
		<>
			<Meta />

			{!keyword ? (
				<>
					{/* 1. Flagship Hero Showcase (from Voltix, TechNova & 19.76) */}
					<ProductCarousel />

					{/* 2. Shop by Brand Row (from TechNova) */}
					<BrandLogosRow />

					{/* 3. Featured Bento Collections & Category Icons (from Voltix, TechVerse & 19.76) */}
					<BentoCollections />
				</>
			) : (
				<div className='d-flex align-items-center justify-content-between mb-4'>
					<Link to='/' className='btn btn-light font-weight-bold'>
						<i className='fas fa-arrow-left mr-2'></i> Back to Full Catalog
					</Link>
					<span className='text-muted'>
						Results for &ldquo;<strong className='text-dark'>{keyword}</strong>&rdquo;
					</span>
				</div>
			)}

			{/* 4. Main Catalog Header & Filter Bar (from TechNova & Voltix) */}
			<div className='d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-3 gap-3'>
				<div>
					<h2 className='mb-1' style={{ fontSize: '1.6rem' }}>
						{keyword ? `Search Results` : 'Trending Hardware & Best Deals'}
					</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.88rem' }}>
						Discover top-rated flagship devices with transparent visuals, verified reviews, and instant stock availability.
					</p>
				</div>

				{/* Sort control */}
				<div className='d-flex align-items-center'>
					<span className='text-muted mr-2 font-weight-bold' style={{ fontSize: '0.85rem' }}>Sort By:</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className='form-control form-control-sm'
						style={{ width: '180px', borderRadius: '8px', fontWeight: '600' }}
					>
						<option value='featured'>Featured & Top Rated</option>
						<option value='price-low'>Price: Low to High</option>
						<option value='price-high'>Price: High to Low</option>
						<option value='rating'>Customer Rating</option>
						<option value='discount'>Biggest Discount %</option>
					</select>
				</div>
			</div>

			{/* Department Filter Pills (from TechVerse) */}
			{!keyword && (
				<div className='category-filter-bar mb-4'>
					{departmentFilters.map((dept) => (
						<button
							key={dept.id}
							type='button'
							onClick={() => setActiveFilter(dept.id)}
							className={`category-pill ${activeFilter === dept.id ? 'active' : ''}`}
						>
							{dept.label}
						</button>
					))}
				</div>
			)}

			{/* Products Grid */}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : filteredProducts.length === 0 ? (
				<div className='text-center py-5 bg-white rounded-16 p-4 border border-slate-200'>
					<i className='fas fa-search fa-3x text-muted mb-3'></i>
					<h3>No Products Match Your Selection</h3>
					<p className='text-muted'>Try adjusting your department tab or resetting your filter.</p>
					<button
						type='button'
						onClick={() => setActiveFilter('all')}
						className='btn btn-primary mt-2 font-weight-bold'
					>
						Show All Hardware Catalog
					</button>
				</div>
			) : (
				<>
					<Row className='g-3'>
						{filteredProducts.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3} className='mb-4'>
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

import React, { useEffect, useState, useMemo } from 'react';
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
	const [activeFilter, setActiveFilter] = useState('all');
	const [sortBy, setSortBy] = useState('featured');

	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
	}, [dispatch, keyword, pageNumber]);

	const departmentFilters = [
		{ id: 'all', label: 'All Catalog', icon: 'fas fa-th-large' },
		{ id: 'hot', label: '🔥 Hot Deals', special: 'hot' },
		{ id: 'sale', label: '🏷️ On Sale', special: 'sale' },
		{ id: 'Smartphones & Tablets', label: 'Smartphones & Tablets', icon: 'fas fa-mobile-alt' },
		{ id: 'Laptops & Handhelds', label: 'Laptops & Handhelds', icon: 'fas fa-laptop' },
		{ id: 'PC Components & Desktops', label: 'PC Components & GPUs', icon: 'fas fa-microchip' },
		{ id: 'Wearables & Smart Glasses', label: 'Wearables & Glasses', icon: 'fas fa-clock' },
		{ id: 'Monitors & Displays', label: 'Monitors & Displays', icon: 'fas fa-desktop' },
		{ id: 'Keyboards & Controllers', label: 'Input Peripherals', icon: 'fas fa-keyboard' },
		{ id: 'Audio & Creator Gear', label: 'Audio & Studio', icon: 'fas fa-headphones' },
		{ id: 'Power & Charging Hubs', label: 'Power & Charging', icon: 'fas fa-bolt' },
		{ id: 'Storage & Backup', label: 'Storage & SSDs', icon: 'fas fa-hdd' },
		{ id: 'Networking & Smart Home', label: 'Networking & Smart Home', icon: 'fas fa-wifi' },
	];

	// Filter and sort products client-side for ultra-fast response
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

	const handleFilterClick = (filterId) => {
		setActiveFilter(filterId);
	};

	return (
		<>
			<Meta />

			{!keyword ? (
				<>
					{/* Sales Flash Announcement Banner */}
					<div
						className='p-3 mb-4 rounded d-flex flex-column flex-md-row align-items-center justify-content-between text-white'
						style={{
							background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
							border: '1px solid rgba(255, 255, 255, 0.12)',
							boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
						}}
					>
						<div className='d-flex align-items-center mb-2 mb-md-0'>
							<span
								style={{
									background: '#f59e0b',
									color: '#000000',
									fontWeight: '800',
									fontSize: '0.75rem',
									padding: '3px 8px',
									borderRadius: '4px',
									marginRight: '12px',
									letterSpacing: '0.05em',
								}}
							>
								LIMITED SALE
							</span>
							<div>
								<span className='font-weight-bold'>Spring Hardware Fest:</span> Up to 40% OFF GPUs, Smart Watches & Studio Audio.
							</div>
						</div>
						<div className='d-flex gap-2'>
							<button
								type='button'
								onClick={() => setActiveFilter('sale')}
								className='btn btn-warning btn-sm font-weight-bold mr-2'
								style={{ borderRadius: '6px' }}
							>
								<i className='fas fa-tags mr-1'></i> Browse Deals
							</button>
							<button
								type='button'
								onClick={() => setActiveFilter('hot')}
								className='btn btn-outline-light btn-sm font-weight-bold'
								style={{ borderRadius: '6px' }}
							>
								🔥 Hot Items
							</button>
						</div>
					</div>

					<ProductCarousel />
				</>
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

			{/* Main Catalog Header & Filter Bar */}
			<div className='d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-3 gap-3'>
				<div>
					<h1 className='mb-1' style={{ fontSize: '1.75rem' }}>
						{keyword ? `Search Results` : 'Curated Tech Hardware'}
					</h1>
					<p className='text-muted mb-0' style={{ fontSize: '0.9rem' }}>
						Transparent background visuals, genuine creator gear, and enterprise-grade hardware.
					</p>
				</div>

				{/* Sort dropdown */}
				<div className='d-flex align-items-center'>
					<span className='text-muted mr-2 font-weight-bold' style={{ fontSize: '0.85rem' }}>Sort By:</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className='form-control form-control-sm'
						style={{ width: '180px', borderRadius: '8px', fontWeight: '500' }}
					>
						<option value='featured'>Featured & Top Picks</option>
						<option value='price-low'>Price: Low to High</option>
						<option value='price-high'>Price: High to Low</option>
						<option value='rating'>Highest Customer Rating</option>
						<option value='discount'>Biggest Discount %</option>
					</select>
				</div>
			</div>

			{/* Department Filter Pills */}
			{!keyword && (
				<div className='category-filter-bar mb-4'>
					{departmentFilters.map((dept) => (
						<button
							key={dept.id}
							type='button'
							onClick={() => handleFilterClick(dept.id)}
							className={`category-pill ${activeFilter === dept.id ? 'active' : ''}`}
						>
							{dept.label}
						</button>
					))}
				</div>
			)}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : filteredProducts.length === 0 ? (
				<div className='text-center py-5'>
					<i className='fas fa-search fa-3x text-muted mb-3'></i>
					<h3>No Products Match Your Filter</h3>
					<p className='text-muted'>Try selecting a different department tab or resetting your search filter.</p>
					<button
						type='button'
						onClick={() => setActiveFilter('all')}
						className='btn btn-primary mt-2 font-weight-bold'
					>
						Reset Department Filter
					</button>
				</div>
			) : (
				<>
					<Row>
						{filteredProducts.map((product) => (
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

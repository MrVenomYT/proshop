import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import BentoCollections from '../components/BentoCollections';
import BrandLogosRow from '../components/BrandLogosRow';
import PromoBanner from '../components/PromoBanner';
import QuickViewModal from '../components/QuickViewModal';
import FilterSidebar from '../components/FilterSidebar';
import ProductCompareModal from '../components/ProductCompareModal';
import Meta from '../components/Meta';
import { listProducts } from '../actions/product-actions';
import { getFavorites } from '../actions/user-actions';

const HomeScreen = ({ match, history }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;

	// Active Filters State
	const [activeFilter, setActiveFilter] = useState('all');
	const [sortBy, setSortBy] = useState('featured');
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [priceRange, setPriceRange] = useState(4000);
	const [inStockOnly, setInStockOnly] = useState(false);
	const [onSaleOnly, setOnSaleOnly] = useState(false);
	const [hotOnly, setHotOnly] = useState(false);
	const [minRating, setMinRating] = useState(0);

	// Modal States
	const [quickViewProduct, setQuickViewProduct] = useState(null);
	const [compareItems, setCompareItems] = useState([]);
	const [showCompareModal, setShowCompareModal] = useState(false);

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
		if (userInfo && userInfo._id) {
			dispatch(getFavorites(userInfo._id));
		}
	}, [dispatch, keyword, pageNumber, userInfo]);

	// Extract unique brands list from catalog
	const allBrands = useMemo(() => {
		if (!products) return [];
		const brandSet = new Set(products.map((p) => p.brand).filter(Boolean));
		return Array.from(brandSet).sort();
	}, [products]);

	// Active Filters Count
	const activeFiltersCount =
		(selectedBrands.length > 0 ? 1 : 0) +
		(priceRange < 4000 ? 1 : 0) +
		(inStockOnly ? 1 : 0) +
		(onSaleOnly ? 1 : 0) +
		(hotOnly ? 1 : 0) +
		(minRating > 0 ? 1 : 0) +
		(activeFilter !== 'all' ? 1 : 0);

	// Toggle Brand Handler
	const handleBrandChange = (brand) => {
		setSelectedBrands((prev) =>
			prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
		);
	};

	// Reset All Filters
	const handleResetFilters = () => {
		setSelectedBrands([]);
		setPriceRange(4000);
		setInStockOnly(false);
		setOnSaleOnly(false);
		setHotOnly(false);
		setMinRating(0);
		setActiveFilter('all');
	};

	// Toggle Compare Handler
	const handleToggleCompare = (product) => {
		setCompareItems((prev) => {
			const exists = prev.some((item) => item._id === product._id);
			if (exists) {
				return prev.filter((item) => item._id !== product._id);
			} else {
				if (prev.length >= 4) {
					alert('You can compare a maximum of 4 hardware products at once.');
					return prev;
				}
				return [...prev, product];
			}
		});
	};

	// Advanced Multi-Criteria Filter Logic
	const filteredProducts = useMemo(() => {
		if (!products) return [];
		let result = [...products];

		// Category pill filter
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

		// Sidebar Filters
		if (selectedBrands.length > 0) {
			result = result.filter((p) => selectedBrands.includes(p.brand));
		}
		if (priceRange < 4000) {
			result = result.filter((p) => p.price <= priceRange);
		}
		if (inStockOnly) {
			result = result.filter((p) => p.countInStock > 0);
		}
		if (onSaleOnly) {
			result = result.filter((p) => p.isSale || (p.originalPrice && p.originalPrice > p.price));
		}
		if (hotOnly) {
			result = result.filter((p) => p.isHot);
		}
		if (minRating > 0) {
			result = result.filter((p) => p.rating >= minRating);
		}

		// Sorting
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
	}, [
		products,
		activeFilter,
		selectedBrands,
		priceRange,
		inStockOnly,
		onSaleOnly,
		hotOnly,
		minRating,
		sortBy,
	]);

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

	return (
		<>
			<Meta />

			{!keyword ? (
				<>
					{/* 1. Flagship Hero Showcase */}
					<ProductCarousel />

					{/* 2. Full-Width Homepage Hero Promotional Banner */}
					<PromoBanner />

					{/* 3. Shop by Brand Row */}
					<BrandLogosRow />

					{/* 4. Featured Bento Collections & Category Icons */}
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

			{/* 5. Main Catalog Header & Filter Bar */}
			<div id='catalog-grid' className='d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-3 gap-3 pt-3'>
				<div>
					<h2 className='mb-1' style={{ fontSize: '1.6rem' }}>
						{keyword ? `Search Results` : 'Trending Hardware & Best Deals'}
					</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.88rem' }}>
						Showing {filteredProducts.length} flagship devices matching your filter criteria.
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

			{/* Department Filter Pills */}
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

			{/* Layout Row: Sidebar Filter + Product Cards Grid */}
			<Row className='g-4'>
				{/* Sidebar Filter Column */}
				<Col lg={3} md={4} className='mb-4'>
					<FilterSidebar
						brands={allBrands}
						selectedBrands={selectedBrands}
						onBrandChange={handleBrandChange}
						priceRange={priceRange}
						onPriceRangeChange={setPriceRange}
						inStockOnly={inStockOnly}
						onInStockChange={setInStockOnly}
						onSaleOnly={onSaleOnly}
						onSaleChange={setOnSaleOnly}
						hotOnly={hotOnly}
						onHotChange={setHotOnly}
						minRating={minRating}
						onRatingChange={setMinRating}
						onResetFilters={handleResetFilters}
						activeFiltersCount={activeFiltersCount}
					/>
				</Col>

				{/* Products Grid Column */}
				<Col lg={9} md={8}>
					{loading ? (
						<Loader />
					) : error ? (
						<Message variant='danger'>{error}</Message>
					) : filteredProducts.length === 0 ? (
						<div className='text-center py-5 bg-white rounded-16 p-4 border border-slate-200'>
							<i className='fas fa-search fa-3x text-muted mb-3'></i>
							<h3>No Products Match Your Selection</h3>
							<p className='text-muted'>Try adjusting your brand/price filters or resetting search parameters.</p>
							<Button
								type='button'
								onClick={handleResetFilters}
								className='btn-accent mt-2 font-weight-bold'
							>
								Reset All Filters
							</Button>
						</div>
					) : (
						<>
							<Row className='g-3'>
								{filteredProducts.map((product) => {
									const isCompared = compareItems.some((item) => item._id === product._id);
									return (
										<Col key={product._id} sm={12} md={6} lg={4} className='mb-4'>
											<Product
												product={product}
												onQuickView={(prod) => setQuickViewProduct(prod)}
												isCompared={isCompared}
												onToggleCompare={handleToggleCompare}
											/>
										</Col>
									);
								})}
							</Row>
							<Paginate
								pages={pages}
								page={page}
								keyword={keyword ? keyword : ''}
							/>
						</>
					)}
				</Col>
			</Row>

			{/* Floating Side-by-Side Comparison Dock Bar */}
			{compareItems.length > 0 && (
				<div
					className='position-fixed p-3 bg-dark text-white rounded-20 shadow-lg d-flex align-items-center justify-content-between gap-3'
					style={{
						bottom: '20px',
						right: '20px',
						left: '20px',
						maxWidth: '720px',
						margin: '0 auto',
						zIndex: 1050,
						border: '1px solid rgba(255, 255, 255, 0.2)',
						borderRadius: '20px',
						backdropFilter: 'blur(10px)',
					}}
				>
					<div className='d-flex align-items-center gap-2 overflow-auto' style={{ scrollbarWidth: 'none' }}>
						<span className='font-weight-bold mr-2 text-danger' style={{ fontSize: '0.85rem' }}>COMPARE ({compareItems.length}/4):</span>
						{compareItems.map((prod) => (
							<div key={prod._id} className='position-relative d-inline-block mr-2'>
								<img
									src={prod.image}
									alt={prod.name}
									style={{ width: '38px', height: '38px', objectFit: 'contain', background: '#ffffff', borderRadius: '8px', padding: '2px' }}
								/>
								<button
									type='button'
									onClick={() => handleToggleCompare(prod)}
									style={{
										position: 'absolute',
										top: '-6px',
										right: '-6px',
										background: '#dc2626',
										color: '#ffffff',
										border: 'none',
										borderRadius: '50%',
										width: '18px',
										height: '18px',
										fontSize: '0.65rem',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									&times;
								</button>
							</div>
						))}
					</div>

					<div className='d-flex align-items-center gap-2'>
						<Button
							type='button'
							onClick={() => setShowCompareModal(true)}
							className='btn-danger font-weight-bold btn-sm text-nowrap'
							style={{ borderRadius: '10px' }}
						>
							<i className='fas fa-columns mr-1'></i> Compare Specs
						</Button>
						<button
							type='button'
							onClick={() => setCompareItems([])}
							className='btn btn-link text-white btn-sm p-0 ml-1'
							title='Clear'
						>
							<i className='fas fa-times'></i>
						</button>
					</div>
				</div>
			)}

			{/* Quick View Modal */}
			<QuickViewModal
				product={quickViewProduct}
				show={!!quickViewProduct}
				onClose={() => setQuickViewProduct(null)}
			/>

			{/* Side-by-Side Product Comparison Modal */}
			<ProductCompareModal
				compareItems={compareItems}
				show={showCompareModal}
				onClose={() => setShowCompareModal(false)}
				onRemoveFromCompare={(id) => setCompareItems((prev) => prev.filter((p) => p._id !== id))}
				onClearCompare={() => {
					setCompareItems([]);
					setShowCompareModal(false);
				}}
			/>
		</>
	);
};

export default HomeScreen;

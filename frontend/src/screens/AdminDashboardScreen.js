import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Form, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listOrders } from '../actions/order-actions';
import { listProducts, updateProduct, deleteProduct, createProduct } from '../actions/product-actions';
import { listUsers } from '../actions/user-actions';

const AdminDashboardScreen = ({ history }) => {
	const dispatch = useDispatch();

	const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'inventory' | 'analytics'
	const [stockEditMap, setStockEditMap] = useState({});
	const [priceEditMap, setPriceEditMap] = useState({});
	const [saveSuccessMsg, setSaveSuccessMap] = useState('');

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderList = useSelector((state) => state.orderList);
	const { loading: loadingOrders, error: errorOrders, orders } = orderList;

	const productList = useSelector((state) => state.productList);
	const { loading: loadingProducts, error: errorProducts, products } = productList;

	const userList = useSelector((state) => state.userList);
	const { loading: loadingUsers, users } = userList;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listOrders());
			dispatch(listProducts());
			dispatch(listUsers());
		} else {
			history.push('/login');
		}
	}, [dispatch, history, userInfo]);

	// Initialize local edit maps when products load
	useEffect(() => {
		if (products && products.length > 0) {
			const initialStock = {};
			const initialPrice = {};
			products.forEach((p) => {
				initialStock[p._id] = p.countInStock !== undefined ? p.countInStock : 10;
				initialPrice[p._id] = p.price;
			});
			setStockEditMap(initialStock);
			setPriceEditMap(initialPrice);
		}
	}, [products]);

	// Live Metrics Calculations
	const totalRevenue = orders ? orders.reduce((acc, item) => acc + (item.isPaid ? item.totalPrice : 0), 0) : 48250;
	const totalOrdersCount = orders ? orders.length : 1482;
	const activeUsersCount = users ? users.length : 892;
	const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : 32.56;

	// Quick CRUD Handlers
	const handleStockChange = (productId, val) => {
		setStockEditMap((prev) => ({ ...prev, [productId]: Number(val) }));
	};

	const handlePriceChange = (productId, val) => {
		setPriceEditMap((prev) => ({ ...prev, [productId]: Number(val) }));
	};

	const handleQuickSaveInventory = (product) => {
		const newStock = stockEditMap[product._id];
		const newPrice = priceEditMap[product._id];

		dispatch(
			updateProduct({
				_id: product._id,
				name: product.name,
				price: newPrice,
				image: product.image,
				brand: product.brand,
				category: product.category,
				countInStock: newStock,
				description: product.description,
			})
		);

		setSaveSuccessMap(`Updated inventory for ${product.name}`);
		setTimeout(() => setSaveSuccessMap(''), 3000);
	};

	const handleDeleteHandler = (id) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			dispatch(deleteProduct(id));
			dispatch(listProducts());
		}
	};

	const handleCreateProductHandler = () => {
		dispatch(createProduct());
		history.push('/admin/productlist');
	};

	return (
		<>
			<Meta title='Ecommerce Admin Dashboard | ProStore' />

			{/* Top Bar Navigation for Admin */}
			<div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3'>
				<div>
					<h1 className='mb-1' style={{ fontSize: '1.8rem', fontWeight: '800' }}>
						Ecommerce Dashboard
					</h1>
					<p className='text-muted mb-0' style={{ fontSize: '0.88rem' }}>
						Sales, inventory CRUD, customer analytics, and order fulfillment at a glance.
					</p>
				</div>

				<div className='d-flex align-items-center gap-2'>
					<button
						type='button'
						onClick={() => setActiveTab('overview')}
						className={`btn btn-sm font-weight-bold ${activeTab === 'overview' ? 'btn-accent' : 'btn-light'}`}
						style={{ borderRadius: '10px' }}
					>
						<i className='fas fa-chart-pie mr-1'></i> Analytics Summary
					</button>

					<button
						type='button'
						onClick={() => setActiveTab('inventory')}
						className={`btn btn-sm font-weight-bold ${activeTab === 'inventory' ? 'btn-accent' : 'btn-light'}`}
						style={{ borderRadius: '10px' }}
					>
						<i className='fas fa-boxes mr-1'></i> Inventory CRUD Data Table
					</button>

					<Button onClick={handleCreateProductHandler} className='btn-sm btn-primary font-weight-bold' style={{ borderRadius: '10px' }}>
						<i className='fas fa-plus mr-1'></i> New Hardware
					</Button>
				</div>
			</div>

			{saveSuccessMsg && (
				<Message variant='success' dismissible>
					<i className='fas fa-check-circle mr-2'></i> {saveSuccessMsg}
				</Message>
			)}

			{/* 1. TOP KPI SUMMARY CARDS WITH MINI SPARKLINE CHARTS (From ShopNova SS 2) */}
			<Row className='g-3 mb-4'>
				{/* Total Revenue KPI Card */}
				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-2'>
							<div className='d-flex align-items-center gap-2'>
								<div
									style={{
										width: '36px',
										height: '36px',
										borderRadius: '10px',
										background: 'rgba(79, 70, 229, 0.12)',
										color: '#4f46e5',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '1rem',
									}}
								>
									<i className='fas fa-dollar-sign'></i>
								</div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.8rem' }}>Total Revenue</span>
							</div>
							<span className='text-success font-weight-bold' style={{ fontSize: '0.75rem' }}>
								<i className='fas fa-arrow-up mr-1'></i> 12.5%
							</span>
						</div>
						<h2 className='mb-1 font-weight-bold' style={{ fontSize: '1.75rem', fontVariantNumeric: 'tabular-nums' }}>
							${Number(totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</h2>
						{/* Mini Sparkline SVG */}
						<svg viewBox='0 0 120 28' width='100%' height='28' style={{ overflow: 'visible' }}>
							<path d='M0 22 Q15 18 30 14 T60 8 T90 12 T120 4' fill='none' stroke='#4f46e5' strokeWidth='2.5' />
						</svg>
					</Card>
				</Col>

				{/* Total Orders KPI Card */}
				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-2'>
							<div className='d-flex align-items-center gap-2'>
								<div
									style={{
										width: '36px',
										height: '36px',
										borderRadius: '10px',
										background: 'rgba(99, 102, 241, 0.12)',
										color: '#6366f1',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '1rem',
									}}
								>
									<i className='fas fa-shopping-cart'></i>
								</div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.8rem' }}>Total Orders</span>
							</div>
							<span className='text-success font-weight-bold' style={{ fontSize: '0.75rem' }}>
								<i className='fas fa-arrow-up mr-1'></i> 8.3%
							</span>
						</div>
						<h2 className='mb-1 font-weight-bold' style={{ fontSize: '1.75rem', fontVariantNumeric: 'tabular-nums' }}>
							{totalOrdersCount.toLocaleString()}
						</h2>
						{/* Mini Sparkline SVG */}
						<svg viewBox='0 0 120 28' width='100%' height='28' style={{ overflow: 'visible' }}>
							<path d='M0 24 Q20 12 40 18 T80 8 T120 2' fill='none' stroke='#6366f1' strokeWidth='2.5' />
						</svg>
					</Card>
				</Col>

				{/* Active Customers KPI Card */}
				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-2'>
							<div className='d-flex align-items-center gap-2'>
								<div
									style={{
										width: '36px',
										height: '36px',
										borderRadius: '10px',
										background: 'rgba(245, 158, 11, 0.12)',
										color: '#f59e0b',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '1rem',
									}}
								>
									<i className='fas fa-users'></i>
								</div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.8rem' }}>Active Customers</span>
							</div>
							<span className='text-success font-weight-bold' style={{ fontSize: '0.75rem' }}>
								<i className='fas fa-arrow-up mr-1'></i> 16.7%
							</span>
						</div>
						<h2 className='mb-1 font-weight-bold' style={{ fontSize: '1.75rem', fontVariantNumeric: 'tabular-nums' }}>
							{activeUsersCount.toLocaleString()}
						</h2>
						{/* Mini Sparkline SVG */}
						<svg viewBox='0 0 120 28' width='100%' height='28' style={{ overflow: 'visible' }}>
							<path d='M0 20 Q15 22 30 10 T60 14 T90 6 T120 2' fill='none' stroke='#f59e0b' strokeWidth='2.5' />
						</svg>
					</Card>
				</Col>

				{/* Avg Order Value KPI Card */}
				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-2'>
							<div className='d-flex align-items-center gap-2'>
								<div
									style={{
										width: '36px',
										height: '36px',
										borderRadius: '10px',
										background: 'rgba(16, 185, 129, 0.12)',
										color: '#10b981',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '1rem',
									}}
								>
									<i className='fas fa-receipt'></i>
								</div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.8rem' }}>Avg. Order Value</span>
							</div>
							<span className='text-success font-weight-bold' style={{ fontSize: '0.75rem' }}>
								<i className='fas fa-arrow-up mr-1'></i> 5.4%
							</span>
						</div>
						<h2 className='mb-1 font-weight-bold' style={{ fontSize: '1.75rem', fontVariantNumeric: 'tabular-nums' }}>
							${avgOrderValue}
						</h2>
						{/* Mini Sparkline SVG */}
						<svg viewBox='0 0 120 28' width='100%' height='28' style={{ overflow: 'visible' }}>
							<path d='M0 18 Q20 20 40 10 T80 12 T120 4' fill='none' stroke='#10b981' strokeWidth='2.5' />
						</svg>
					</Card>
				</Col>
			</Row>

			{/* TAB 1: OVERVIEW & ANALYTICS VISUALIZATIONS */}
			{activeTab === 'overview' && (
				<>
					{/* Sales Revenue Chart & Orders Overview Row */}
					<Row className='g-3 mb-4'>
						{/* Interactive Sales Revenue Area Chart */}
						<Col lg={8} className='mb-3'>
							<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
								<div className='d-flex align-items-center justify-content-between mb-3'>
									<div>
										<h3 className='mb-0' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Sales Revenue</h3>
										<span className='text-muted' style={{ fontSize: '0.8rem' }}>Daily revenue performance tracking</span>
									</div>
									<div className='d-flex align-items-center gap-2'>
										<span className='badge bg-light text-dark border p-2' style={{ fontSize: '0.75rem' }}>
											<i className='far fa-calendar-alt mr-1'></i> May 1, 2026 – May 31, 2026
										</span>
									</div>
								</div>

								{/* SVG Area Chart Graphic */}
								<div className='position-relative my-2'>
									<svg viewBox='0 0 600 180' width='100%' height='180' style={{ overflow: 'visible' }}>
										<defs>
											<linearGradient id='salesGrad' x1='0' y1='0' x2='0' y2='1'>
												<stop offset='0%' stopColor='#4f46e5' stopOpacity='0.35' />
												<stop offset='100%' stopColor='#4f46e5' stopOpacity='0.0' />
											</linearGradient>
										</defs>
										{/* Horizontal gridlines */}
										<line x1='0' y1='30' x2='600' y2='30' stroke='#f1f5f9' strokeWidth='1' />
										<line x1='0' y1='80' x2='600' y2='80' stroke='#f1f5f9' strokeWidth='1' />
										<line x1='0' y1='130' x2='600' y2='130' stroke='#f1f5f9' strokeWidth='1' />

										{/* Area fill */}
										<path
											d='M0 130 Q75 100 150 110 T300 30 T450 70 T600 40 L600 160 L0 160 Z'
											fill='url(#salesGrad)'
										/>

										{/* Line curve */}
										<path
											d='M0 130 Q75 100 150 110 T300 30 T450 70 T600 40'
											fill='none'
											stroke='#4f46e5'
											strokeWidth='3.5'
										/>

										{/* Active Tooltip Dot */}
										<circle cx='300' cy='30' r='6' fill='#4f46e5' stroke='#ffffff' strokeWidth='2' />
										<rect x='250' y='0' width='100' height='24' rx='6' fill='#0f172a' />
										<text x='300' y='16' fill='#ffffff' fontSize='11' fontWeight='700' textAnchor='middle'>
											May 18: $6,240
										</text>
									</svg>
								</div>

								<div className='d-flex align-items-center justify-content-between text-muted pt-2' style={{ fontSize: '0.78rem' }}>
									<span>May 1</span>
									<span>May 7</span>
									<span>May 14</span>
									<span>May 21</span>
									<span>May 28</span>
								</div>
							</Card>
						</Col>

						{/* Orders Breakdown Donut Chart */}
						<Col lg={4} className='mb-3'>
							<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
								<div className='d-flex align-items-center justify-content-between mb-3'>
									<h3 className='mb-0' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Orders Overview</h3>
									<span className='text-primary font-weight-bold' style={{ fontSize: '0.8rem', cursor: 'pointer' }}>View All</span>
								</div>

								{/* Donut Chart Visual */}
								<div className='d-flex justify-content-center my-3 position-relative'>
									<svg viewBox='0 0 120 120' width='130' height='120'>
										<circle cx='60' cy='60' r='46' fill='none' stroke='#e2e8f0' strokeWidth='12' />
										<circle cx='60' cy='60' r='46' fill='none' stroke='#10b981' strokeWidth='12' strokeDasharray='200 80' strokeDashoffset='30' />
										<circle cx='60' cy='60' r='46' fill='none' stroke='#4f46e5' strokeWidth='12' strokeDasharray='40 240' strokeDashoffset='-170' />
										<circle cx='60' cy='60' r='46' fill='none' stroke='#f59e0b' strokeWidth='12' strokeDasharray='25 255' strokeDashoffset='-210' />
									</svg>
									<div className='position-absolute text-center' style={{ top: '34px' }}>
										<div className='font-weight-bold text-dark' style={{ fontSize: '1.2rem', lineHeight: '1' }}>{totalOrdersCount}</div>
										<span className='text-muted' style={{ fontSize: '0.65rem' }}>Total Orders</span>
									</div>
								</div>

								{/* Donut Legend List */}
								<div className='d-flex flex-column gap-2 mt-2' style={{ fontSize: '0.82rem' }}>
									<div className='d-flex align-items-center justify-content-between'>
										<span><span className='mr-2' style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>Delivered</span>
										<span className='font-weight-bold'>1,026 (69%)</span>
									</div>
									<div className='d-flex align-items-center justify-content-between'>
										<span><span className='mr-2' style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5' }}></span>Processing</span>
										<span className='font-weight-bold'>241 (16%)</span>
									</div>
									<div className='d-flex align-items-center justify-content-between'>
										<span><span className='mr-2' style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>Shipped</span>
										<span className='font-weight-bold'>124 (8%)</span>
									</div>
									<div className='d-flex align-items-center justify-content-between text-muted'>
										<span><span className='mr-2' style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>Cancelled</span>
										<span className='font-weight-bold'>91 (6%)</span>
									</div>
								</div>
							</Card>
						</Col>
					</Row>

					{/* Traffic Sources & Conversion Funnel */}
					<Row className='g-3 mb-4'>
						<Col md={6} className='mb-3'>
							<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
								<h3 className='mb-3' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Traffic Acquisition Sources</h3>
								<div className='d-flex flex-column gap-3'>
									<div>
										<div className='d-flex justify-content-between mb-1' style={{ fontSize: '0.85rem' }}>
											<span className='font-weight-bold'>Direct Search</span>
											<span>34%</span>
										</div>
										<ProgressBar now={34} variant='primary' style={{ height: '8px', borderRadius: '4px' }} />
									</div>
									<div>
										<div className='d-flex justify-content-between mb-1' style={{ fontSize: '0.85rem' }}>
											<span className='font-weight-bold'>Organic Search (Google)</span>
											<span>28%</span>
										</div>
										<ProgressBar now={28} variant='info' style={{ height: '8px', borderRadius: '4px' }} />
									</div>
									<div>
										<div className='d-flex justify-content-between mb-1' style={{ fontSize: '0.85rem' }}>
											<span className='font-weight-bold'>Social Commerce</span>
											<span>18%</span>
										</div>
										<ProgressBar now={18} variant='warning' style={{ height: '8px', borderRadius: '4px' }} />
									</div>
									<div>
										<div className='d-flex justify-content-between mb-1' style={{ fontSize: '0.85rem' }}>
											<span className='font-weight-bold'>Paid Ads Campaign</span>
											<span>12%</span>
										</div>
										<ProgressBar now={12} variant='danger' style={{ height: '8px', borderRadius: '4px' }} />
									</div>
								</div>
							</Card>
						</Col>

						<Col md={6} className='mb-3'>
							<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
								<h3 className='mb-3' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Conversion Funnel Progress</h3>
								<div className='row text-center align-items-center py-3 g-2'>
									<Col className='p-2 bg-light rounded-12 mr-1'>
										<i className='fas fa-eye text-primary fa-lg mb-1'></i>
										<div className='font-weight-bold' style={{ fontSize: '1.1rem' }}>12,450</div>
										<span className='text-muted' style={{ fontSize: '0.72rem' }}>Site Visitors</span>
									</Col>
									<Col className='p-2 bg-light rounded-12 mr-1'>
										<i className='fas fa-box text-info fa-lg mb-1'></i>
										<div className='font-weight-bold' style={{ fontSize: '1.1rem' }}>3,240</div>
										<span className='text-muted' style={{ fontSize: '0.72rem' }}>Product Views</span>
									</Col>
									<Col className='p-2 bg-light rounded-12 mr-1'>
										<i className='fas fa-shopping-bag text-warning fa-lg mb-1'></i>
										<div className='font-weight-bold' style={{ fontSize: '1.1rem' }}>742</div>
										<span className='text-muted' style={{ fontSize: '0.72rem' }}>Add to Cart</span>
									</Col>
									<Col className='p-2 bg-light rounded-12'>
										<i className='fas fa-check-circle text-success fa-lg mb-1'></i>
										<div className='font-weight-bold text-success' style={{ fontSize: '1.1rem' }}>311</div>
										<span className='text-muted' style={{ fontSize: '0.72rem' }}>Purchases</span>
									</Col>
								</div>
							</Card>
						</Col>
					</Row>
				</>
			)}

			{/* TAB 2: INVENTORY CRUD DATA TABLE WITH STOCK LEVEL & PRICE MANAGEMENT */}
			{(activeTab === 'inventory' || activeTab === 'overview') && (
				<Card className='p-4 border-0 mb-4' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
					<div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2'>
						<div>
							<h3 className='mb-0' style={{ fontSize: '1.3rem', fontWeight: '800' }}>Product Inventory CRUD Data Table</h3>
							<span className='text-muted' style={{ fontSize: '0.85rem' }}>
								Inline CRUD: Manage stock levels, pricing, and active status
							</span>
						</div>
						<div className='d-flex gap-2'>
							<Button onClick={handleCreateProductHandler} className='btn-accent btn-sm font-weight-bold'>
								<i className='fas fa-plus mr-1'></i> Create Hardware
							</Button>
						</div>
					</div>

					{loadingProducts ? (
						<Loader />
					) : errorProducts ? (
						<Message variant='danger'>{errorProducts}</Message>
					) : (
						<div className='table-responsive'>
							<Table hover className='mb-0 align-middle'>
								<thead>
									<tr>
										<th>HARDWARE ITEM</th>
										<th>CATEGORY</th>
										<th>STOCK QUANTITY</th>
										<th>STOCK STATUS</th>
										<th>UNIT PRICE ($)</th>
										<th>ACTIONS</th>
									</tr>
								</thead>
								<tbody>
									{products &&
										products.map((prod) => (
											<tr key={prod._id}>
												<td>
													<div className='d-flex align-items-center gap-2'>
														<img
															src={prod.image}
															alt={prod.name}
															style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', background: '#f8fafc' }}
														/>
														<div>
															<div className='font-weight-bold text-dark' style={{ fontSize: '0.9rem' }}>
																{prod.name}
															</div>
															<span className='text-muted' style={{ fontSize: '0.75rem' }}>{prod.brand}</span>
														</div>
													</div>
												</td>

												<td className='text-muted' style={{ fontSize: '0.85rem' }}>
													{prod.category}
												</td>

												{/* Inline Stock Quantity Input */}
												<td style={{ width: '130px' }}>
													<Form.Control
														type='number'
														min='0'
														value={stockEditMap[prod._id] !== undefined ? stockEditMap[prod._id] : prod.countInStock}
														onChange={(e) => handleStockChange(prod._id, e.target.value)}
														style={{ fontSize: '0.85rem', fontWeight: '700', padding: '0.35rem 0.6rem' }}
													/>
												</td>

												{/* Stock Status Pill */}
												<td>
													{(stockEditMap[prod._id] ?? prod.countInStock) > 5 ? (
														<span className='status-pill success'><i className='fas fa-check-circle mr-1'></i> In Stock</span>
													) : (stockEditMap[prod._id] ?? prod.countInStock) > 0 ? (
														<span className='status-pill' style={{ background: '#fef3c7', color: '#92400e' }}><i className='fas fa-exclamation-triangle mr-1'></i> Low Stock</span>
													) : (
														<span className='status-pill danger'><i className='fas fa-times-circle mr-1'></i> Out of Stock</span>
													)}
												</td>

												{/* Inline Price Input */}
												<td style={{ width: '130px' }}>
													<Form.Control
														type='number'
														step='0.01'
														value={priceEditMap[prod._id] !== undefined ? priceEditMap[prod._id] : prod.price}
														onChange={(e) => handlePriceChange(prod._id, e.target.value)}
														style={{ fontSize: '0.85rem', fontWeight: '700', padding: '0.35rem 0.6rem' }}
													/>
												</td>

												{/* CRUD Action Buttons */}
												<td>
													<div className='d-flex align-items-center gap-1'>
														<button
															type='button'
															onClick={() => handleQuickSaveInventory(prod)}
															className='btn btn-success btn-sm font-weight-bold mr-1'
															title='Save Stock & Price Changes'
														>
															<i className='fas fa-save'></i> Save
														</button>

														<Link
															to={`/admin/product/${prod._id}/edit`}
															className='btn btn-light btn-sm font-weight-bold mr-1'
															title='Full Edit'
														>
															<i className='fas fa-edit'></i>
														</Link>

														<button
															type='button'
															onClick={() => handleDeleteHandler(prod._id)}
															className='btn btn-danger btn-sm font-weight-bold'
															title='Delete Product'
														>
															<i className='fas fa-trash'></i>
														</button>
													</div>
												</td>
											</tr>
										))}
								</tbody>
							</Table>
						</div>
					)}
				</Card>
			)}

			{/* RECENT ORDERS FEED & BEST SELLING PRODUCTS */}
			<Row className='g-3 mb-4'>
				<Col lg={7} className='mb-3'>
					<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-3'>
							<h3 className='mb-0' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Recent Customer Orders</h3>
							<Link to='/admin/orderlist' className='text-primary font-weight-bold' style={{ fontSize: '0.85rem' }}>View All Orders &rarr;</Link>
						</div>

						{loadingOrders ? (
							<Loader />
						) : errorOrders ? (
							<Message variant='danger'>{errorOrders}</Message>
						) : (
							<div className='table-responsive'>
								<Table hover className='mb-0 align-middle' style={{ fontSize: '0.85rem' }}>
									<thead>
										<tr>
											<th>ORDER ID</th>
											<th>CUSTOMER</th>
											<th>TOTAL</th>
											<th>STATUS</th>
											<th>ACTION</th>
										</tr>
									</thead>
									<tbody>
										{orders &&
											orders.slice(0, 5).map((order) => (
												<tr key={order._id}>
													<td className='font-weight-bold'>#{order._id.slice(-6).toUpperCase()}</td>
													<td>{order.user ? order.user.name : 'Customer'}</td>
													<td className='font-weight-bold'>${Number(order.totalPrice).toFixed(2)}</td>
													<td>
														{order.isPaid ? (
															<span className='status-pill success'>Paid</span>
														) : (
															<span className='status-pill danger'>Pending</span>
														)}
													</td>
													<td>
														<Link to={`/order/${order._id}`} className='btn btn-light btn-sm font-weight-bold'>View</Link>
													</td>
												</tr>
											))}
									</tbody>
								</Table>
							</div>
						)}
					</Card>
				</Col>

				<Col lg={5} className='mb-3'>
					<Card className='p-4 border-0 h-100' style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between mb-3'>
							<h3 className='mb-0' style={{ fontSize: '1.2rem', fontWeight: '800' }}>Top Selling Products</h3>
							<span className='text-muted' style={{ fontSize: '0.8rem' }}>By Revenue</span>
						</div>

						<div className='d-flex flex-column gap-3'>
							{products &&
								products.slice(0, 5).map((p, idx) => (
									<div key={p._id} className='d-flex align-items-center justify-content-between p-2 bg-light rounded-12'>
										<div className='d-flex align-items-center gap-2'>
											<span className='font-weight-bold text-muted mr-2' style={{ width: '18px' }}>#{idx + 1}</span>
											<img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
											<div>
												<div className='font-weight-bold text-dark' style={{ fontSize: '0.85rem' }}>{p.name.substring(0, 24)}...</div>
												<span className='text-muted' style={{ fontSize: '0.72rem' }}>{p.brand}</span>
											</div>
										</div>
										<div className='text-right'>
											<div className='font-weight-bold text-success' style={{ fontSize: '0.88rem' }}>${Number(p.price).toFixed(2)}</div>
											<span className='text-muted' style={{ fontSize: '0.72rem' }}>In Stock: {p.countInStock}</span>
										</div>
									</div>
								))}
						</div>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AdminDashboardScreen;

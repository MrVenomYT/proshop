import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listOrders } from '../actions/order-actions';
import { listProducts } from '../actions/product-actions';
import { listUsers } from '../actions/user-actions';

const AdminDashboardScreen = ({ history }) => {
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderList = useSelector((state) => state.orderList);
	const { loading: loadingOrders, error: errorOrders, orders } = orderList;

	const productList = useSelector((state) => state.productList);
	const { loading: loadingProducts, products } = productList;

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

	// Calculate live metrics
	const totalRevenue = orders ? orders.reduce((acc, item) => acc + (item.isPaid ? item.totalPrice : 0), 0) : 0;
	const paidOrdersCount = orders ? orders.filter((o) => o.isPaid).length : 0;
	const deliveredOrdersCount = orders ? orders.filter((o) => o.isDelivered).length : 0;

	return (
		<>
			<Meta title='Admin Control Center | ProStore' />

			{/* Page Header */}
			<div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3'>
				<div>
					<h1 className='mb-1' style={{ fontSize: '1.8rem' }}>Store Control Center</h1>
					<p className='text-muted mb-0' style={{ fontSize: '0.9rem' }}>
						Manage products, customer orders, user accounts, and store settings.
					</p>
				</div>
				<div className='d-flex gap-2'>
					<Link to='/admin/productlist' className='btn btn-primary font-weight-bold'>
						<i className='fas fa-plus mr-2'></i> Add New Product
					</Link>
					<Link to='/admin/orderlist' className='btn btn-light font-weight-bold'>
						<i className='fas fa-receipt mr-2'></i> Manage Orders
					</Link>
				</div>
			</div>

			{/* KPI Metric Summary Cards */}
			<Row className='g-3 mb-4'>
				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between'>
							<div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
									Total Sales Revenue
								</span>
								<h2 className='mb-0 mt-1' style={{ fontSize: '1.6rem', color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
									${totalRevenue.toFixed(2)}
								</h2>
								<span className='text-success' style={{ fontSize: '0.75rem', fontWeight: '600' }}>
									<i className='fas fa-arrow-up mr-1'></i> +18.4% from last month
								</span>
							</div>
							<div
								style={{
									width: '48px',
									height: '48px',
									borderRadius: '12px',
									background: 'rgba(16, 185, 129, 0.12)',
									color: '#10b981',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1.3rem',
								}}
							>
								<i className='fas fa-dollar-sign'></i>
							</div>
						</div>
					</Card>
				</Col>

				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between'>
							<div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
									Total Store Orders
								</span>
								<h2 className='mb-0 mt-1' style={{ fontSize: '1.6rem', color: '#4f46e5', fontVariantNumeric: 'tabular-nums' }}>
									{orders ? orders.length : 0}
								</h2>
								<span className='text-muted' style={{ fontSize: '0.75rem' }}>
									{paidOrdersCount} Paid · {deliveredOrdersCount} Delivered
								</span>
							</div>
							<div
								style={{
									width: '48px',
									height: '48px',
									borderRadius: '12px',
									background: 'rgba(79, 70, 229, 0.12)',
									color: '#4f46e5',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1.3rem',
								}}
							>
								<i className='fas fa-shopping-cart'></i>
							</div>
						</div>
					</Card>
				</Col>

				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between'>
							<div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
									Active Products
								</span>
								<h2 className='mb-0 mt-1' style={{ fontSize: '1.6rem', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
									{products ? products.length : 0}
								</h2>
								<span className='text-muted' style={{ fontSize: '0.75rem' }}>Across 10 Departments</span>
							</div>
							<div
								style={{
									width: '48px',
									height: '48px',
									borderRadius: '12px',
									background: 'rgba(15, 23, 42, 0.08)',
									color: '#0f172a',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1.3rem',
								}}
							>
								<i className='fas fa-boxes'></i>
							</div>
						</div>
					</Card>
				</Col>

				<Col lg={3} md={6} className='mb-3'>
					<Card className='p-3 border-0 h-100' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center justify-content-between'>
							<div>
								<span className='text-muted font-weight-bold' style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
									Registered Customers
								</span>
								<h2 className='mb-0 mt-1' style={{ fontSize: '1.6rem', color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
									{users ? users.length : 0}
								</h2>
								<span className='text-muted' style={{ fontSize: '0.75rem' }}>Active Accounts</span>
							</div>
							<div
								style={{
									width: '48px',
									height: '48px',
									borderRadius: '12px',
									background: 'rgba(245, 158, 11, 0.12)',
									color: '#f59e0b',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1.3rem',
								}}
							>
								<i className='fas fa-users'></i>
							</div>
						</div>
					</Card>
				</Col>
			</Row>

			{/* Quick Store Options Modules */}
			<h2 className='mb-3' style={{ fontSize: '1.3rem' }}>Store Management Modules</h2>
			<Row className='g-3 mb-4'>
				<Col lg={4} md={6} className='mb-3'>
					<Card className='p-4 h-100 border-0' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center mb-3'>
							<i className='fas fa-box-open fa-2x text-primary mr-3'></i>
							<div>
								<h3 className='mb-0' style={{ fontSize: '1.1rem' }}>Catalog & Stock</h3>
								<span className='text-muted' style={{ fontSize: '0.8rem' }}>Inventory, pricing & specs</span>
							</div>
						</div>
						<p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>
							Update hardware descriptions, adjust stock quantities, and configure sale discounts.
						</p>
						<Link to='/admin/productlist' className='btn btn-light btn-sm font-weight-bold mt-auto'>
							Manage Products &rarr;
						</Link>
					</Card>
				</Col>

				<Col lg={4} md={6} className='mb-3'>
					<Card className='p-4 h-100 border-0' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center mb-3'>
							<i className='fas fa-shipping-fast fa-2x text-success mr-3'></i>
							<div>
								<h3 className='mb-0' style={{ fontSize: '1.1rem' }}>Order Fulfillment</h3>
								<span className='text-muted' style={{ fontSize: '0.8rem' }}>Shipments & payments</span>
							</div>
						</div>
						<p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>
							Review pending customer orders, update tracking status, and confirm payments.
						</p>
						<Link to='/admin/orderlist' className='btn btn-light btn-sm font-weight-bold mt-auto'>
							Manage Orders &rarr;
						</Link>
					</Card>
				</Col>

				<Col lg={4} md={6} className='mb-3'>
					<Card className='p-4 h-100 border-0' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
						<div className='d-flex align-items-center mb-3'>
							<i className='fas fa-user-shield fa-2x text-warning mr-3'></i>
							<div>
								<h3 className='mb-0' style={{ fontSize: '1.1rem' }}>Users & Privileges</h3>
								<span className='text-muted' style={{ fontSize: '0.8rem' }}>User roles & profiles</span>
							</div>
						</div>
						<p className='text-muted mb-3' style={{ fontSize: '0.85rem' }}>
							Manage customer accounts, grant admin privileges, or delete inactive profiles.
						</p>
						<Link to='/admin/userlist' className='btn btn-light btn-sm font-weight-bold mt-auto'>
							Manage Users &rarr;
						</Link>
					</Card>
				</Col>
			</Row>

			{/* Recent Store Orders Feed */}
			<Card className='p-4 border-0 mb-4' style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
				<div className='d-flex align-items-center justify-content-between mb-3'>
					<h3 className='mb-0' style={{ fontSize: '1.2rem' }}>Recent Store Transactions</h3>
					<Link to='/admin/orderlist' className='text-primary font-weight-bold' style={{ fontSize: '0.85rem' }}>
						View All Orders &rarr;
					</Link>
				</div>

				{loadingOrders ? (
					<Loader />
				) : errorOrders ? (
					<Message variant='danger'>{errorOrders}</Message>
				) : orders && orders.length === 0 ? (
					<div className='p-4 text-center text-muted'>
						<i className='fas fa-receipt fa-2x mb-2'></i>
						<p>No transactions recorded yet.</p>
					</div>
				) : (
					<div className='table-responsive'>
						<Table hover className='mb-0 align-middle'>
							<thead>
								<tr>
									<th>ORDER ID</th>
									<th>CUSTOMER</th>
									<th>DATE</th>
									<th>TOTAL</th>
									<th>PAYMENT</th>
									<th>DELIVERY</th>
									<th>ACTION</th>
								</tr>
							</thead>
							<tbody>
								{orders &&
									orders.slice(0, 6).map((order) => (
										<tr key={order._id}>
											<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
												#{order._id.slice(-6).toUpperCase()}
											</td>
											<td>{order.user ? order.user.name : 'Guest Customer'}</td>
											<td className='text-muted'>{order.createdAt ? order.createdAt.substring(0, 10) : 'Recent'}</td>
											<td className='font-weight-bold'>${Number(order.totalPrice).toFixed(2)}</td>
											<td>
												{order.isPaid ? (
													<span className='status-pill success'><i className='fas fa-check mr-1'></i> Paid</span>
												) : (
													<span className='status-pill danger'><i className='fas fa-clock mr-1'></i> Pending</span>
												)}
											</td>
											<td>
												{order.isDelivered ? (
													<span className='status-pill success'><i className='fas fa-truck mr-1'></i> Shipped</span>
												) : (
													<span className='status-pill' style={{ background: '#fef3c7', color: '#92400e' }}>Processing</span>
												)}
											</td>
											<td>
												<Link to={`/order/${order._id}`} className='btn btn-light btn-sm font-weight-bold'>
													Details
												</Link>
											</td>
										</tr>
									))}
							</tbody>
						</Table>
					</div>
				)}
			</Card>
		</>
	);
};

export default AdminDashboardScreen;

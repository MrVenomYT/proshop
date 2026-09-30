import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listOrders } from '../actions/order-actions';

const OrderListScreen = ({ history }) => {
	const dispatch = useDispatch();

	const orderList = useSelector((state) => state.orderList);
	const { loading, error, orders } = orderList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listOrders());
		} else {
			history.push('/login');
		}
	}, [dispatch, history, userInfo]);

	return (
		<>
			<Meta title='Manage Orders | ProShop Admin' />

			<div className='d-flex align-items-center justify-content-between mb-4'>
				<div>
					<h1 className='mb-1'>Customer Orders</h1>
					<p className='text-muted mb-0'>Monitor store transactions, payment verification, and order deliveries.</p>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Card className='p-0 overflow-hidden' style={{ borderRadius: '16px' }}>
					<div className='table-responsive'>
						<Table hover className='mb-0'>
							<thead>
								<tr>
									<th>ORDER ID</th>
									<th>CUSTOMER</th>
									<th>DATE</th>
									<th>TOTAL</th>
									<th>PAYMENT</th>
									<th>DELIVERY</th>
									<th>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
											#{order._id.slice(-6).toUpperCase()}
										</td>
										<td>{order.user ? order.user.name : 'Guest User'}</td>
										<td className='text-muted' style={{ fontVariantNumeric: 'tabular-nums' }}>
											{order.createdAt ? order.createdAt.substring(0, 10) : 'Recent'}
										</td>
										<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
											${Number(order.totalPrice).toFixed(2)}
										</td>
										<td>
											{order.isPaid ? (
												<span className='status-pill success'>
													<i className='fas fa-check-circle mr-1'></i> Paid ({order.paidAt?.substring(0, 10)})
												</span>
											) : (
												<span className='status-pill danger'>
													<i className='fas fa-times-circle mr-1'></i> Unpaid
												</span>
											)}
										</td>
										<td>
											{order.isDelivered ? (
												<span className='status-pill success'>
													<i className='fas fa-truck mr-1'></i> Delivered
												</span>
											) : (
												<span className='status-pill' style={{ background: '#fef3c7', color: '#92400e' }}>
													<i className='fas fa-clock mr-1'></i> Processing
												</span>
											)}
										</td>
										<td>
											<Link to={`/order/${order._id}`} className='btn btn-light btn-sm font-weight-bold'>
												Review
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				</Card>
			)}
		</>
	);
};

export default OrderListScreen;

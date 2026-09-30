import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getUserDetails, updateUserProfile } from '../actions/user-actions';
import { listMyOrders } from '../actions/order-actions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/user-constants';

const ProfileScreen = ({ location, history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, error, user } = userDetails;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
	const { success } = userUpdateProfile;

	const orderGetMyOrders = useSelector((state) => state.orderGetMyOrders);
	const {
		loading: loadingOrders,
		error: errorOrders,
		orders,
	} = orderGetMyOrders;

	useEffect(() => {
		if (!userInfo) {
			history.push('/login');
		} else {
			if (!user || !user.name || success) {
				dispatch({ type: USER_UPDATE_PROFILE_RESET });
				dispatch(getUserDetails('profile'));
				dispatch(listMyOrders());
			} else {
				setName(user.name);
				setEmail(user.email);
			}
		}
	}, [dispatch, history, userInfo, user, success]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else {
			dispatch(updateUserProfile({ id: user._id, name, email, password }));
		}
	};

	return (
		<>
			<Meta title='User Account | ProShop' />

			<h1 className='mb-4'>Account Dashboard</h1>

			<Row>
				{/* Profile Settings Card */}
				<Col lg={4} md={5} className='mb-4'>
					<Card className='p-4'>
						<div className='d-flex align-items-center mb-3'>
							<div
								style={{
									width: '48px',
									height: '48px',
									borderRadius: '50%',
									background: '#0f172a',
									color: '#ffffff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: '700',
									fontSize: '1.2rem',
									marginRight: '1rem',
								}}
							>
								{name ? name.charAt(0).toUpperCase() : 'U'}
							</div>
							<div>
								<h3 className='mb-0' style={{ fontSize: '1.1rem' }}>{name || 'User Profile'}</h3>
								<div className='text-muted' style={{ fontSize: '0.8rem' }}>{email}</div>
							</div>
						</div>

						<h2 className='mb-3' style={{ fontSize: '1.2rem' }}>Personal Info</h2>

						{message && <Message variant='danger'>{message}</Message>}
						{error && <Message variant='danger'>{error}</Message>}
						{success && <Message variant='success'>Profile Updated Successfully</Message>}
						{loading && <Loader />}

						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name' className='mb-3'>
								<Form.Label className='font-weight-bold' style={{ fontSize: '0.85rem' }}>Name</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Form.Group>

							<Form.Group controlId='email' className='mb-3'>
								<Form.Label className='font-weight-bold' style={{ fontSize: '0.85rem' }}>Email Address</Form.Label>
								<Form.Control
									type='email'
									placeholder='Enter email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Form.Group>

							<Form.Group controlId='password' className='mb-3'>
								<Form.Label className='font-weight-bold' style={{ fontSize: '0.85rem' }}>New Password (Optional)</Form.Label>
								<Form.Control
									type='password'
									placeholder='Leave blank to keep same'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>

							<Form.Group controlId='confirmPassword' className='mb-4'>
								<Form.Label className='font-weight-bold' style={{ fontSize: '0.85rem' }}>Confirm New Password</Form.Label>
								<Form.Control
									type='password'
									placeholder='Confirm password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</Form.Group>

							<Button type='submit' className='btn-accent btn-block py-2'>
								Save Profile Changes
							</Button>
						</Form>
					</Card>
				</Col>

				{/* Order History Table */}
				<Col lg={8} md={7}>
					<Card className='p-4'>
						<div className='d-flex align-items-center justify-content-between mb-3'>
							<h2 className='mb-0' style={{ fontSize: '1.35rem' }}>Order History</h2>
							<span className='text-muted' style={{ fontSize: '0.85rem' }}>
								{orders ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : ''}
							</span>
						</div>

						{loadingOrders ? (
							<Loader />
						) : errorOrders ? (
							<Message variant='danger'>{errorOrders}</Message>
						) : orders && orders.length === 0 ? (
							<div className='p-4 text-center text-muted bg-light rounded'>
								<i className='fas fa-box-open fa-3x mb-3 opacity-50'></i>
								<h4>No Orders Placed Yet</h4>
								<p className='mb-0'>When you place an order, tracking and invoice details will appear here.</p>
							</div>
						) : (
							<div className='table-responsive'>
								<Table hover className='mb-0'>
									<thead>
										<tr>
											<th>ORDER ID</th>
											<th>DATE</th>
											<th>TOTAL</th>
											<th>PAYMENT</th>
											<th>DELIVERY</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{orders &&
											orders.map((order) => (
												<tr key={order._id}>
													<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
														#{order._id.slice(-6).toUpperCase()}
													</td>
													<td className='text-muted' style={{ fontVariantNumeric: 'tabular-nums' }}>
														{order.createdAt ? order.createdAt.substring(0, 10) : 'Recent'}
													</td>
													<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
														${Number(order.totalPrice).toFixed(2)}
													</td>
													<td>
														{order.isPaid ? (
															<span className='status-pill success'>
																<i className='fas fa-check-circle mr-1'></i> Paid
															</span>
														) : (
															<span className='status-pill danger'>
																<i className='fas fa-clock mr-1'></i> Pending
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
																<i className='fas fa-box mr-1'></i> Processing
															</span>
														)}
													</td>
													<td className='text-right'>
														<Link to={`/order/${order._id}`} className='btn btn-light btn-sm font-weight-bold'>
															View Details
														</Link>
													</td>
												</tr>
											))}
									</tbody>
								</Table>
							</div>
						)}
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default ProfileScreen;

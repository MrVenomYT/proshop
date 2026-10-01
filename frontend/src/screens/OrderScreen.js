import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import OrderStatusTracker from '../components/OrderStatusTracker';
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from '../actions/order-actions';
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from '../constants/order-constants';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = axios
	.get('/api/payments/config/stripe-pk')
	.then((res) => res.data)
	.then((data) => loadStripe(data.public_key));

const OrderScreen = ({ match, history }) => {
	const orderId = match.params.id;

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const orderDeliver = useSelector((state) => state.orderDeliver);
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

	if (!loading) {
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2);
		};
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);
	}

	useEffect(() => {
		if (!userInfo) {
			history.push('/login');
		}

		if (successPay || !order || order._id !== orderId || successDeliver) {
			dispatch({ type: ORDER_PAY_RESET }); // to prevent keep refreshing after payment
			dispatch({ type: ORDER_DELIVER_RESET });
			dispatch(getOrderDetails(orderId));
		}
	}, [dispatch, order, orderId, successPay, successDeliver]);

	// call pay order
	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult);
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(order));
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<Meta title='Order Status & Details | ProShop' />

			{/* Real-Time Order Tracking Dashboard Banner */}
			<OrderStatusTracker order={order} />

			<Row>
				<Col md={7}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping Destination</h2>
							<p>
								<strong>Recipient: </strong> {order.user.name}
							</p>
							<p>
								<strong>Contact Email: </strong>{' '}
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Delivery Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city}{' '}
								{order.shippingAddress.postalCode},{' '}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.deliveredAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='info'>
									Package In Transit · Estimated Arrival in 2-3 Business Days
								</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Information</h2>
							<p>
								<strong>Payment Gateway: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>
									Verified Payment on {order.paidAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='danger'>Payment Pending</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Hardware Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row className='align-items-center'>
												<Col md={2}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
														style={{ width: '50px', height: '50px', objectFit: 'contain' }}
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`} className='font-weight-bold text-dark'>
														{item.name}
													</Link>
												</Col>
												<Col md={4} className='text-right font-weight-bold'>
													{item.qty} x ${item.price} = $
													{Number(item.qty * item.price).toFixed(2)}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>

				<Col md={5}>
					<Card className='p-3 border-0 shadow-sm' style={{ borderRadius: '16px' }}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Cost Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items Subtotal</Col>
									<Col className='text-right font-weight-bold'>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Express Shipping</Col>
									<Col className='text-right font-weight-bold'>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Estimated Tax</Col>
									<Col className='text-right font-weight-bold'>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col style={{ fontSize: '1.1rem', fontWeight: '800' }}>Order Total</Col>
									<Col className='text-right font-weight-bold text-danger' style={{ fontSize: '1.25rem' }}>
										${order.totalPrice}
									</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									<Elements stripe={stripePromise}>
										<CheckoutForm
											totalPrice={order.totalPrice}
											paymentHandler={successPaymentHandler}
										/>
									</Elements>
								</ListGroup.Item>
							)}
							{loadingDeliver && <Loader />}
							{userInfo &&
								userInfo.isAdmin &&
								order.isPaid &&
								!order.isDelivered && (
									<ListGroup.Item>
										<Button
											type='button'
											className='btn-accent btn-block font-weight-bold py-2.5'
											onClick={deliverHandler}
										>
											<i className='fas fa-truck-loading mr-2'></i> Mark As Delivered
										</Button>
									</ListGroup.Item>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;

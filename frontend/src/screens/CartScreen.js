import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart, removeFromCart } from '../actions/cart-actions';

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;
	const qty = location.search ? Number(location.search.split('=')[1]) : 1;

	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, [dispatch, productId, qty]);

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		history.push('/login?redirect=shipping');
	};

	const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
	const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
	const freeShipping = subtotal > 100 || totalItems === 0;

	return (
		<>
			<Meta title='Shopping Bag | ProShop' />

			<div className='d-flex align-items-center justify-content-between mb-4'>
				<div>
					<h1 className='mb-1'>Shopping Bag</h1>
					<p className='text-muted mb-0'>
						{totalItems > 0 ? `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your bag` : 'Your bag is empty'}
					</p>
				</div>
				{totalItems > 0 && (
					<Link to='/' className='btn btn-light btn-sm'>
						<i className='fas fa-plus mr-1'></i> Continue Shopping
					</Link>
				)}
			</div>

			{cartItems.length === 0 ? (
				<Card className='p-5 text-center my-4' style={{ background: '#ffffff', borderRadius: '16px' }}>
					<div className='mb-3'>
						<i className='fas fa-shopping-bag fa-4x text-muted opacity-50'></i>
					</div>
					<h3>Your Shopping Bag is Empty</h3>
					<p className='text-muted mx-auto' style={{ maxWidth: '400px' }}>
						Looks like you haven&apos;t added any tech essentials yet. Explore our curated flagship hardware!
					</p>
					<div>
						<Link to='/' className='btn btn-primary px-4 py-2 mt-2'>
							Explore Catalog
						</Link>
					</div>
				</Card>
			) : (
				<Row>
					<Col lg={8} md={12} className='mb-4'>
						<Card className='p-0 overflow-hidden' style={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
							<div className='p-3 bg-light border-bottom font-weight-bold text-muted d-none d-md-flex align-items-center' style={{ fontSize: '0.85rem' }}>
								<div style={{ flex: '3' }}>PRODUCT</div>
								<div style={{ flex: '1', textAlign: 'center' }}>PRICE</div>
								<div style={{ flex: '1', textAlign: 'center' }}>QTY</div>
								<div style={{ flex: '1', textAlign: 'right' }}>TOTAL</div>
								<div style={{ width: '40px' }}></div>
							</div>

							{cartItems.map((item) => (
								<div
									key={item.product}
									className='p-3 border-bottom d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3'
								>
									{/* Product Info */}
									<div className='d-flex align-items-center' style={{ flex: '3' }}>
										<div
											style={{
												width: '70px',
												height: '70px',
												borderRadius: '10px',
												background: '#f1f5f9',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '8px',
												marginRight: '1rem',
												flexShrink: 0,
											}}
										>
											<img
												src={item.image}
												alt={item.name}
												style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = '/images/sample.jpg';
												}}
											/>
										</div>
										<div>
											<Link
												to={`/product/${item.product}`}
												style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-main)' }}
											>
												{item.name}
											</Link>
											<div className='text-muted' style={{ fontSize: '0.8rem' }}>
												${Number(item.price).toFixed(2)} each
											</div>
										</div>
									</div>

									{/* Unit Price */}
									<div
										className='d-none d-md-block text-center font-weight-bold'
										style={{ flex: '1', fontFamily: 'var(--font-heading)', fontVariantNumeric: 'tabular-nums' }}
									>
										${Number(item.price).toFixed(2)}
									</div>

									{/* Quantity Stepper */}
									<div className='d-flex align-items-center justify-content-center' style={{ flex: '1' }}>
										<Form.Control
											as='select'
											value={item.qty}
											onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
											style={{ maxWidth: '80px', textAlign: 'center' }}
										>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</div>

									{/* Total Item Price */}
									<div
										className='text-right font-weight-bold'
										style={{
											flex: '1',
											fontFamily: 'var(--font-heading)',
											fontSize: '1.05rem',
											fontVariantNumeric: 'tabular-nums',
										}}
									>
										${(item.qty * item.price).toFixed(2)}
									</div>

									{/* Delete Button */}
									<div style={{ width: '40px', textAlign: 'right' }}>
										<Button
											type='button'
											variant='light'
											size='sm'
											onClick={() => removeFromCartHandler(item.product)}
											title='Remove Item'
											style={{ color: '#ef4444', border: 'none', background: 'transparent' }}
										>
											<i className='fas fa-trash-alt'></i>
										</Button>
									</div>
								</div>
							))}
						</Card>
					</Col>

					{/* Summary Sidebar */}
					<Col lg={4} md={12}>
						<Card className='p-4' style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
							<h2 className='mb-3' style={{ fontSize: '1.35rem' }}>Order Summary</h2>

							<div className='d-flex justify-content-between py-2 border-bottom'>
								<span className='text-muted'>Subtotal ({totalItems} items)</span>
								<span className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
									${subtotal.toFixed(2)}
								</span>
							</div>

							<div className='d-flex justify-content-between py-2 border-bottom'>
								<span className='text-muted'>Shipping</span>
								<span className={`font-weight-bold ${freeShipping ? 'text-success' : ''}`}>
									{freeShipping ? 'FREE' : '$10.00'}
								</span>
							</div>

							<div className='d-flex justify-content-between py-3 mb-3 border-bottom' style={{ fontSize: '1.2rem' }}>
								<span className='font-weight-bold'>Estimated Total</span>
								<span
									className='font-weight-bold'
									style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', fontVariantNumeric: 'tabular-nums' }}
								>
									${(subtotal + (freeShipping ? 0 : 10)).toFixed(2)}
								</span>
							</div>

							<Button
								type='button'
								className='btn-block btn-accent py-3 font-weight-bold mb-3'
								disabled={cartItems.length === 0}
								onClick={checkoutHandler}
								style={{ fontSize: '1rem' }}
							>
								Proceed to Checkout <i className='fas fa-arrow-right ml-2'></i>
							</Button>

							<div className='text-center text-muted' style={{ fontSize: '0.8rem' }}>
								<i className='fas fa-lock mr-1'></i> 256-Bit Bank-Grade Encrypted Checkout
							</div>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
};

export default CartScreen;

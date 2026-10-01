import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const OrderStatusTracker = ({ order }) => {
	if (!order) return null;

	// Determine step status
	const isPaid = order.isPaid;
	const isDelivered = order.isDelivered;

	const steps = [
		{ id: 1, title: 'Order Placed', icon: 'fas fa-receipt', active: true, completed: true, time: order.createdAt?.substring(0, 10) || 'Recent' },
		{ id: 2, title: 'Payment Confirmed', icon: 'fas fa-credit-card', active: isPaid, completed: isPaid, time: isPaid ? (order.paidAt?.substring(0, 10) || 'Verified') : 'Pending' },
		{ id: 3, title: 'Processing & Packing', icon: 'fas fa-box-open', active: isPaid, completed: isPaid, time: isPaid ? 'In Warehouse' : 'Queued' },
		{ id: 4, title: 'Shipped & In Transit', icon: 'fas fa-truck-loading', active: isPaid, completed: isDelivered, time: isPaid ? (order.trackingNumber || 'FedEx #FX-9840281') : 'Awaiting' },
		{ id: 5, title: 'Delivered', icon: 'fas fa-home', active: isDelivered, completed: isDelivered, time: isDelivered ? (order.deliveredAt?.substring(0, 10) || 'Completed') : 'Estimated 2-3 Days' },
	];

	return (
		<Card className='p-4 mb-4 border-0 shadow-sm' style={{ background: '#ffffff', borderRadius: '20px' }}>
			<div className='d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 flex-wrap gap-2'>
				<div>
					<h3 className='mb-1' style={{ fontSize: '1.25rem', fontWeight: '800' }}>
						<i className='fas fa-route text-danger mr-2'></i> Real-Time Shipment Tracking
					</h3>
					<span className='text-muted' style={{ fontSize: '0.85rem' }}>
						Carrier: <strong className='text-dark'>FedEx Express Air</strong> · Tracking ID: <span className='font-weight-bold text-danger'>FX-894201948</span>
					</span>
				</div>
				<Badge bg={isDelivered ? 'success' : isPaid ? 'primary' : 'warning'} className='p-2.5 px-3' style={{ borderRadius: '9999px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
					{isDelivered ? '✓ Delivered to Destination' : isPaid ? '⚡ Shipped & In Transit' : '⌛ Awaiting Payment'}
				</Badge>
			</div>

			{/* Progress Pipeline */}
			<div className='position-relative my-2 px-2'>
				<Row className='align-items-center text-center g-2 position-relative' style={{ zIndex: 2 }}>
					{steps.map((step) => {
						const isDone = step.completed;
						const isActive = step.active;

						return (
							<Col key={step.id} className='mb-3 mb-md-0'>
								<div className='d-flex flex-column align-items-center'>
									<div
										style={{
											width: '44px',
											height: '44px',
											borderRadius: '50%',
											background: isDone ? '#dc2626' : isActive ? '#0f172a' : '#f1f5f9',
											color: isDone || isActive ? '#ffffff' : '#94a3b8',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '1.1rem',
											fontWeight: '800',
											boxShadow: isDone ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
											transition: 'all 0.3s ease',
										}}
									>
										<i className={isDone ? 'fas fa-check' : step.icon}></i>
									</div>
									<strong className='mt-2 d-block' style={{ fontSize: '0.82rem', color: isDone ? '#0f172a' : '#64748b' }}>
										{step.title}
									</strong>
									<span className='text-muted' style={{ fontSize: '0.72rem' }}>
										{step.time}
									</span>
								</div>
							</Col>
						);
					})}
				</Row>
			</div>
		</Card>
	);
};

export default OrderStatusTracker;

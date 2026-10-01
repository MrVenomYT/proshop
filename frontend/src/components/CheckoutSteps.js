import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
	const steps = [
		{ number: 1, title: 'Sign In', link: '/login', completed: step2 || step3 || step4, active: step1 && !step2 },
		{ number: 2, title: 'Shipping', link: '/shipping', completed: step3 || step4, active: step2 && !step3 },
		{ number: 3, title: 'Payment', link: '/payment', completed: step4, active: step3 && !step4 },
		{ number: 4, title: 'Review Order', link: '/placeorder', completed: false, active: step4 },
	];

	// Calculate overall percentage progress for the line bar
	const completedCount = steps.filter((s) => s.completed || s.active).length;
	const progressPercent = Math.min(100, Math.max(15, ((completedCount - 1) / (steps.length - 1)) * 100));

	return (
		<div className='my-4 p-4 bg-white rounded-20 border shadow-sm' style={{ borderRadius: '20px' }}>
			{/* Multi-Step Header Indicator */}
			<div className='position-relative mx-auto' style={{ maxWidth: '680px' }}>
				{/* Background Connecting Bar */}
				<div
					className='position-absolute'
					style={{
						top: '18px',
						left: '40px',
						right: '40px',
						height: '4px',
						background: '#e2e8f0',
						zIndex: 1,
						borderRadius: '9999px',
					}}
				/>
				{/* Active Crimson Progress Connector */}
				<div
					className='position-absolute'
					style={{
						top: '18px',
						left: '40px',
						width: `calc(${progressPercent}% - 80px)`,
						height: '4px',
						background: '#dc2626',
						zIndex: 2,
						borderRadius: '9999px',
						transition: 'width 0.4s ease',
					}}
				/>

				{/* Steps Nodes Row */}
				<div className='d-flex align-items-center justify-content-between position-relative' style={{ zIndex: 3 }}>
					{steps.map((step) => {
						const isDone = step.completed;
						const isActive = step.active;
						const isAccessible = step.completed || step.active;

						return (
							<div key={step.number} className='d-flex flex-column align-items-center text-center'>
								{isAccessible ? (
									<Link
										to={step.link}
										className='d-flex align-items-center justify-content-center text-decoration-none'
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											background: isDone || isActive ? '#dc2626' : '#ffffff',
											color: isDone || isActive ? '#ffffff' : '#0f172a',
											border: `2px solid ${isDone || isActive ? '#dc2626' : '#cbd5e1'}`,
											fontWeight: '800',
											fontSize: '0.9rem',
											boxShadow: isActive ? '0 0 0 4px rgba(220, 38, 38, 0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
											transition: 'all 0.25s ease',
										}}
									>
										{isDone ? <i className='fas fa-check'></i> : step.number}
									</Link>
								) : (
									<div
										className='d-flex align-items-center justify-content-center'
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											background: '#f8fafc',
											color: '#94a3b8',
											border: '2px solid #e2e8f0',
											fontWeight: '700',
											fontSize: '0.9rem',
										}}
									>
										{step.number}
									</div>
								)}

								<span
									className='mt-2 font-weight-bold'
									style={{
										fontSize: '0.82rem',
										color: isActive ? '#dc2626' : isDone ? '#0f172a' : '#94a3b8',
									}}
								>
									{step.title}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CheckoutSteps;

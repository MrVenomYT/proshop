import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
	const steps = [
		{ number: 1, title: 'Sign In', link: '/login', active: step1 },
		{ number: 2, title: 'Shipping', link: '/shipping', active: step2 },
		{ number: 3, title: 'Payment', link: '/payment', active: step3 },
		{ number: 4, title: 'Place Order', link: '/placeorder', active: step4 },
	];

	return (
		<div className='checkout-steps-bar'>
			{steps.map((step, idx) => (
				<React.Fragment key={step.number}>
					{step.active ? (
						<Link
							to={step.link}
							className={`checkout-step-item ${step.active ? 'active' : ''}`}
						>
							<span className='step-number'>{step.number}</span>
							<span>{step.title}</span>
						</Link>
					) : (
						<div className='checkout-step-item'>
							<span className='step-number'>{step.number}</span>
							<span>{step.title}</span>
						</div>
					)}
					{idx < steps.length - 1 && <span className='step-divider'>&rsaquo;</span>}
				</React.Fragment>
			))}
		</div>
	);
};

export default CheckoutSteps;

import React, { useState, useMemo } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addToCart } from '../actions/cart-actions';

const FrequentlyBoughtTogether = ({ currentProduct }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const productList = useSelector((state) => state.productList);
	const { products } = productList;

	// Intelligent Category Affinity Map based on Purchase Trends
	const categoryAffinity = {
		'Smartphones & Tablets': ['Wearables & Smart Glasses', 'Power & Charging Hubs', 'Audio & Creator Gear'],
		'Laptops & Handhelds': ['Keyboards & Controllers', 'Audio & Creator Gear', 'Storage & Backup', 'Monitors & Displays'],
		'PC Components & Desktops': ['Monitors & Displays', 'Keyboards & Controllers', 'Power & Charging Hubs'],
		'Audio & Creator Gear': ['Power & Charging Hubs', 'Keyboards & Controllers'],
		'Wearables & Smart Glasses': ['Power & Charging Hubs', 'Smartphones & Tablets'],
	};

	// Pick 2 complementary items based on category trends & purchase patterns
	const complementaryItems = useMemo(() => {
		if (!products || !currentProduct) return [];

		const candidates = products.filter((p) => p._id !== currentProduct._id);
		const targetCategories = categoryAffinity[currentProduct.category] || [];

		// Primary picks: Items matching affinity categories
		let primaryPicks = candidates.filter((p) => targetCategories.includes(p.category));

		// Sort by customer rating
		primaryPicks.sort((a, b) => b.rating - a.rating);

		if (primaryPicks.length >= 2) {
			return primaryPicks.slice(0, 2);
		}

		// Fill remaining spots with top-rated general items
		const remaining = candidates.filter((p) => !primaryPicks.some((pick) => pick._id === p._id));
		remaining.sort((a, b) => b.rating - a.rating);

		return [...primaryPicks, ...remaining].slice(0, 2);
	}, [products, currentProduct]);

	// Track which bundle items are selected (default: all selected)
	const [selectedItems, setSelectedItems] = useState([true, true, true]);

	if (!currentProduct || complementaryItems.length < 2) return null;

	const allBundleProducts = [currentProduct, complementaryItems[0], complementaryItems[1]];

	// Calculate bundle pricing
	const rawTotal = allBundleProducts.reduce((acc, item, idx) => {
		return selectedItems[idx] ? acc + Number(item.price) : acc;
	}, 0);

	const discountPercent = selectedItems.filter(Boolean).length === 3 ? 10 : 0;
	const finalTotal = rawTotal * (1 - discountPercent / 100);

	const handleToggleItem = (index) => {
		setSelectedItems((prev) => {
			const next = [...prev];
			next[index] = !next[index];
			return next;
		});
	};

	const handleAddBundleToCart = () => {
		allBundleProducts.forEach((item, idx) => {
			if (selectedItems[idx]) {
				dispatch(addToCart(item._id, 1));
			}
		});
		history.push('/cart');
	};

	return (
		<Card className='p-4 my-5 border-0 shadow-sm' style={{ background: '#ffffff', borderRadius: '24px' }}>
			<div className='d-flex align-items-center gap-2 mb-4'>
				<i className='fas fa-layer-group text-danger fa-lg mr-1'></i>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.35rem', fontWeight: '800' }}>
						Frequently Bought Together
					</h2>
					<span className='text-muted' style={{ fontSize: '0.85rem' }}>
						Recommended based on common purchasing trends. Bundle & save <strong className='text-danger'>10% extra discount</strong>.
					</span>
				</div>
			</div>

			<div className='row align-items-center g-3'>
				{/* Visual Product Nodes Row */}
				<div className='col-lg-8'>
					<div className='d-flex align-items-center justify-content-between gap-2 overflow-auto py-2' style={{ scrollbarWidth: 'none' }}>
						{allBundleProducts.map((prod, idx) => (
							<React.Fragment key={prod._id}>
								{idx > 0 && <div className='font-weight-bold text-muted px-2' style={{ fontSize: '1.4rem' }}>+</div>}

								<div
									className={`p-3 text-center rounded-16 border transition-all ${selectedItems[idx] ? 'border-danger bg-white' : 'border-slate-200 bg-light opacity-50'}`}
									style={{
										width: '180px',
										borderRadius: '16px',
										cursor: 'pointer',
										boxShadow: selectedItems[idx] ? '0 4px 14px rgba(220, 38, 38, 0.12)' : 'none',
									}}
									onClick={() => handleToggleItem(idx)}
								>
									<img
										src={prod.image}
										alt={prod.name}
										style={{ width: '80px', height: '80px', objectFit: 'contain', margin: '0 auto 8px' }}
									/>
									<h6 style={{ fontSize: '0.82rem', fontWeight: '800', height: '2.5em', overflow: 'hidden', lineHeight: '1.3' }}>
										{prod.name}
									</h6>
									<div className='font-weight-bold text-danger' style={{ fontSize: '0.9rem' }}>
										${Number(prod.price).toFixed(2)}
									</div>
								</div>
							</React.Fragment>
						))}
					</div>

					{/* Item Checkbox Controls */}
					<div className='mt-3'>
						{allBundleProducts.map((prod, idx) => (
							<Form.Check
								key={prod._id}
								type='checkbox'
								id={`bundle-check-${prod._id}`}
								checked={selectedItems[idx]}
								onChange={() => handleToggleItem(idx)}
								label={
									<span style={{ fontSize: '0.88rem' }}>
										<strong className='text-dark'>{idx === 0 ? 'This Item: ' : ''}{prod.name}</strong> –{' '}
										<span className='font-weight-bold text-danger'>${Number(prod.price).toFixed(2)}</span>
									</span>
								}
								className='mb-2 font-weight-bold text-dark'
							/>
						))}
					</div>
				</div>

				{/* Bundle Summary Card */}
				<div className='col-lg-4 border-left pl-lg-4 mt-4 mt-lg-0'>
					<div className='p-3 rounded-16 bg-light text-center border' style={{ borderRadius: '16px' }}>
						<span className='text-muted d-block mb-1' style={{ fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: '700' }}>
							Bundle Total ({selectedItems.filter(Boolean).length} items)
						</span>

						<div className='d-flex align-items-baseline justify-content-center gap-2 my-2'>
							<span style={{ fontSize: '2rem', fontWeight: '900', color: '#dc2626' }}>
								${finalTotal.toFixed(2)}
							</span>
							{discountPercent > 0 && (
								<span className='text-muted' style={{ textDecoration: 'line-through', fontSize: '1.1rem' }}>
									${rawTotal.toFixed(2)}
								</span>
							)}
						</div>

						{discountPercent > 0 && (
							<span className='badge bg-danger text-white mb-3 p-1.5 px-3' style={{ borderRadius: '9999px', fontSize: '0.75rem' }}>
								✓ SAVING ${(rawTotal - finalTotal).toFixed(2)} (10% BUNDLE DISCOUNT)
							</span>
						)}

						<Button
							type='button'
							onClick={handleAddBundleToCart}
							disabled={selectedItems.filter(Boolean).length === 0}
							className='btn-accent btn-block font-weight-bold py-2.5 mt-2'
							style={{ borderRadius: '10px', fontSize: '0.92rem' }}
						>
							<i className='fas fa-shopping-bag mr-2'></i> Add Bundle to Bag
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default FrequentlyBoughtTogether;

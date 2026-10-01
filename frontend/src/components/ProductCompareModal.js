import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Rating from './Rating';
import { addToCart } from '../actions/cart-actions';

const ProductCompareModal = ({ compareItems, show, onClose, onRemoveFromCompare, onClearCompare }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	if (!compareItems || compareItems.length === 0) return null;

	const handleAddToCart = (productId) => {
		dispatch(addToCart(productId, 1));
		onClose();
		history.push('/cart');
	};

	return (
		<Modal show={show} onHide={onClose} size='xl' centered className='product-compare-modal'>
			<Modal.Header closeButton className='border-bottom'>
				<Modal.Title style={{ fontSize: '1.25rem', fontWeight: '800' }}>
					<i className='fas fa-columns text-danger mr-2'></i> Side-by-Side Product Comparison ({compareItems.length})
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className='p-4 overflow-auto'>
				<Table responsive bordered className='mb-0 align-middle text-center' style={{ minWidth: '700px' }}>
					<thead>
						<tr>
							<th style={{ width: '180px', background: '#f8fafc', textTransform: 'uppercase', fontSize: '0.8rem' }}>Specifications</th>
							{compareItems.map((prod) => (
								<th key={prod._id} style={{ minWidth: '220px', verticalAlign: 'top' }}>
									<div className='position-relative p-2'>
										<button
											type='button'
											onClick={() => onRemoveFromCompare(prod._id)}
											className='btn btn-light btn-sm text-danger position-absolute'
											style={{ top: '0', right: '0', borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
											title='Remove from comparison'
										>
											<i className='fas fa-times'></i>
										</button>
										<img
											src={prod.image}
											alt={prod.name}
											style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto 10px' }}
										/>
										<h5 style={{ fontSize: '0.95rem', fontWeight: '800', height: '2.8em', overflow: 'hidden' }}>{prod.name}</h5>
										<div className='font-weight-bold text-danger my-1' style={{ fontSize: '1.2rem' }}>${Number(prod.price).toFixed(2)}</div>
										<Button
											type='button'
											onClick={() => handleAddToCart(prod._id)}
											disabled={prod.countInStock === 0}
											className='btn-accent btn-sm w-100 font-weight-bold mt-2'
											style={{ borderRadius: '8px' }}
										>
											<i className='fas fa-shopping-bag mr-1'></i> Add to Bag
										</Button>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='font-weight-bold text-muted bg-light' style={{ fontSize: '0.82rem' }}>BRAND</td>
							{compareItems.map((prod) => (
								<td key={prod._id} className='font-weight-bold text-dark'>{prod.brand || 'ProShop'}</td>
							))}
						</tr>
						<tr>
							<td className='font-weight-bold text-muted bg-light' style={{ fontSize: '0.82rem' }}>CATEGORY</td>
							{compareItems.map((prod) => (
								<td key={prod._id}>{prod.category}</td>
							))}
						</tr>
						<tr>
							<td className='font-weight-bold text-muted bg-light' style={{ fontSize: '0.82rem' }}>RATING & REVIEWS</td>
							{compareItems.map((prod) => (
								<td key={prod._id}>
									<Rating value={prod.rating} text={`${prod.numReviews}`} />
								</td>
							))}
						</tr>
						<tr>
							<td className='font-weight-bold text-muted bg-light' style={{ fontSize: '0.82rem' }}>AVAILABILITY</td>
							{compareItems.map((prod) => (
								<td key={prod._id}>
									{prod.countInStock > 0 ? (
										<span className='status-pill success'><i className='fas fa-check-circle mr-1'></i> In Stock ({prod.countInStock})</span>
									) : (
										<span className='status-pill danger'>Out of Stock</span>
									)}
								</td>
							))}
						</tr>
						<tr>
							<td className='font-weight-bold text-muted bg-light' style={{ fontSize: '0.82rem' }}>DESCRIPTION</td>
							{compareItems.map((prod) => (
								<td key={prod._id} className='text-muted' style={{ fontSize: '0.82rem', textAlign: 'left', lineHeight: '1.5' }}>
									{prod.description}
								</td>
							))}
						</tr>
					</tbody>
				</Table>
			</Modal.Body>
			<Modal.Footer className='d-flex justify-content-between border-top'>
				<Button variant='outline-danger' onClick={onClearCompare} className='btn-sm font-weight-bold'>
					<i className='fas fa-trash mr-1'></i> Clear Comparison
				</Button>
				<Button variant='light' onClick={onClose} className='btn-sm font-weight-bold border'>
					Close Window
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ProductCompareModal;

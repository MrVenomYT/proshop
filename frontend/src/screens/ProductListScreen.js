import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import {
	listProducts,
	deleteProduct,
	createProduct,
} from '../actions/product-actions';
import { PRODUCT_CREATE_RESET } from '../constants/product-constants';

const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	const productDelete = useSelector((state) => state.productDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = productDelete;

	const productCreate = useSelector((state) => state.productCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: createdProduct,
	} = productCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });

		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login');
		}

		if (successCreate) {
			history.push(`/admin/product/${createdProduct._id}/edit`);
		} else {
			dispatch(listProducts('', pageNumber));
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdProduct,
		pageNumber,
	]);

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			dispatch(deleteProduct(id));
		}
	};

	const createProductHandler = () => {
		dispatch(createProduct());
	};

	return (
		<>
			<Meta title='Manage Catalog | ProShop Admin' />

			<div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4'>
				<div>
					<h1 className='mb-1'>Catalog Inventory</h1>
					<p className='text-muted mb-0'>Create, update, and manage products and inventory stock.</p>
				</div>
				<Button className='btn-accent mt-3 mt-md-0 font-weight-bold' onClick={createProductHandler}>
					<i className='fas fa-plus mr-2'></i> Add New Product
				</Button>
			</div>

			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Card className='p-0 overflow-hidden' style={{ borderRadius: '16px' }}>
						<div className='table-responsive'>
							<Table hover className='mb-0'>
								<thead>
									<tr>
										<th>PREVIEW</th>
										<th>NAME</th>
										<th>PRICE</th>
										<th>CATEGORY</th>
										<th>BRAND</th>
										<th>ACTIONS</th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr key={product._id}>
											<td style={{ width: '60px' }}>
												<div
													style={{
														width: '44px',
														height: '44px',
														borderRadius: '8px',
														background: '#f1f5f9',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														padding: '4px',
													}}
												>
													<img
														src={product.image}
														alt={product.name}
														style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
														onError={(e) => {
															e.target.onerror = null;
															e.target.src = '/images/sample.png';
														}}
													/>
												</div>
											</td>
											<td className='font-weight-bold'>
												<Link to={`/product/${product._id}`} className='text-dark'>
													{product.name}
												</Link>
											</td>
											<td className='font-weight-bold' style={{ fontVariantNumeric: 'tabular-nums' }}>
												${Number(product.price).toFixed(2)}
											</td>
											<td>
												<span className='status-pill' style={{ background: '#f1f5f9', color: '#475569' }}>
													{product.category}
												</span>
											</td>
											<td>{product.brand}</td>
											<td>
												<div className='d-flex align-items-center gap-2'>
													<Link
														to={`/admin/product/${product._id}/edit`}
														className='btn btn-light btn-sm mr-2'
														title='Edit Product'
													>
														<i className='fas fa-edit'></i>
													</Link>
													<Button
														variant='light'
														className='btn-sm text-danger'
														onClick={() => deleteHandler(product._id)}
														title='Delete Product'
													>
														<i className='fas fa-trash-alt'></i>
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					</Card>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	);
};

export default ProductListScreen;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/product-actions';
import { PRODUCT_UPDATE_RESET } from '../constants/product-constants';

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id;

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState('');
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = productUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product.name || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				setName(product.name);
				setPrice(product.price);
				setImage(product.image);
				setBrand(product.brand);
				setCategory(product.category);
				setCountInStock(product.countInStock);
				setDescription(product.description);
			}
		}
	}, [dispatch, history, productId, product, successUpdate]);

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);

		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (error) {
			console.log(error);
			setUploading(false);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			updateProduct({
				_id: productId,
				name,
				price,
				image,
				brand,
				category,
				countInStock,
				description,
			})
		);
	};

	return (
		<>
			<div className='mb-3'>
				<Link to='/admin/productlist' className='btn btn-light'>
					<i className='fas fa-arrow-left mr-2'></i> Back to Products
				</Link>
			</div>

			<FormContainer>
				<h1 className='mb-4'>Edit Product</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<>
						<Meta title={`Edit | ${name}`} />
						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name' className='mb-3'>
								<Form.Label className='font-weight-bold'>Product Title</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter product name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId='price' className='mb-3'>
								<Form.Label className='font-weight-bold'>Price ($)</Form.Label>
								<Form.Control
									type='number'
									step='0.01'
									placeholder='Enter price'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId='image' className='mb-3'>
								<Form.Label className='font-weight-bold'>Image URL (.png transparent)</Form.Label>
								<Form.Control
									type='text'
									placeholder='e.g. /images/iphone15pro.png'
									value={image}
									onChange={(e) => setImage(e.target.value)}
									required
								/>
								<Form.File
									id='image-file'
									label='Upload PNG File'
									custom
									className='mt-2'
									onChange={uploadFileHandler}
								/>
								{uploading && <Loader />}
							</Form.Group>

							<Form.Group controlId='brand' className='mb-3'>
								<Form.Label className='font-weight-bold'>Brand / Manufacturer</Form.Label>
								<Form.Control
									type='text'
									placeholder='e.g. Apple, Samsung, Sony, ASUS'
									value={brand}
									onChange={(e) => setBrand(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId='category' className='mb-3'>
								<Form.Label className='font-weight-bold'>Department / Category</Form.Label>
								<Form.Control
									type='text'
									placeholder='e.g. Smartphones & Tablets, PC Components & Desktops'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId='countInStock' className='mb-3'>
								<Form.Label className='font-weight-bold'>Inventory Count</Form.Label>
								<Form.Control
									type='number'
									placeholder='Available stock units'
									value={countInStock}
									onChange={(e) => setCountInStock(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId='description' className='mb-4'>
								<Form.Label className='font-weight-bold'>Specifications & Description</Form.Label>
								<Form.Control
									as='textarea'
									rows={4}
									placeholder='Hardware specs and details'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								/>
							</Form.Group>

							<Button type='submit' className='btn-accent btn-block py-2 font-weight-bold'>
								Save Product Changes
							</Button>
						</Form>
					</>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;

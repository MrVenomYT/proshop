import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/user-actions';

const LoginScreen = ({ location, history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { loading, error, userInfo } = userLogin;

	const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	const fillDemoUser = (userEmail, userPass) => {
		setEmail(userEmail);
		setPassword(userPass);
		dispatch(login(userEmail, userPass));
	};

	return (
		<FormContainer>
			<Meta title='Sign In | ProShop' />

			<div className='text-center mb-4'>
				<i className='fas fa-lock text-primary fa-2x mb-2'></i>
				<h1 className='mb-1'>Welcome Back</h1>
				<p className='text-muted' style={{ fontSize: '0.9rem' }}>
					Sign in to access your orders, saved items, and account settings.
				</p>
			</div>

			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}

			<Form onSubmit={submitHandler}>
				<Form.Group controlId='email' className='mb-3'>
					<Form.Label className='font-weight-bold'>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='name@example.com'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId='password' className='mb-4'>
					<Form.Label className='font-weight-bold'>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='••••••••'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Button type='submit' className='btn-accent btn-block py-2 mb-3'>
					Sign In to Account
				</Button>
			</Form>

			{/* Demo Quick-Login Pills */}
			<div className='p-3 bg-light rounded mt-3 text-center' style={{ fontSize: '0.85rem' }}>
				<div className='font-weight-bold text-muted mb-2'>1-Click Quick Demo Sign-In:</div>
				<div className='d-flex justify-content-center gap-2'>
					<button
						type='button'
						onClick={() => fillDemoUser('admin@example.com', '123456')}
						className='btn btn-light btn-sm mr-2'
						style={{ fontSize: '0.78rem' }}
					>
						<i className='fas fa-shield-alt text-warning mr-1'></i> Admin (`admin@example.com`)
					</button>
					<button
						type='button'
						onClick={() => fillDemoUser('john@example.com', '123456')}
						className='btn btn-light btn-sm'
						style={{ fontSize: '0.78rem' }}
					>
						<i className='fas fa-user text-primary mr-1'></i> Customer (`john@example.com`)
					</button>
				</div>
			</div>

			<Row className='pt-3 text-center'>
				<Col className='text-muted' style={{ fontSize: '0.875rem' }}>
					Don&apos;t have an account?{' '}
					<Link
						to={redirect ? `/register?redirect=${redirect}` : '/register'}
						className='font-weight-bold text-primary'
					>
						Create Account
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default LoginScreen;

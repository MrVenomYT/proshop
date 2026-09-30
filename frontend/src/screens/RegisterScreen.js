import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/user-actions';

const RegisterScreen = ({ location, history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const dispatch = useDispatch();

	const userRegister = useSelector((state) => state.userRegister);
	const { loading, error, userInfo } = userRegister;

	const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else {
			dispatch(register(name, email, password));
		}
	};

	return (
		<FormContainer>
			<Meta title='Create Account | ProShop' />

			<div className='text-center mb-4'>
				<i className='fas fa-user-plus text-primary fa-2x mb-2'></i>
				<h1 className='mb-1'>Create Account</h1>
				<p className='text-muted' style={{ fontSize: '0.9rem' }}>
					Join ProShop to track orders, save favorites, and enjoy fast checkout.
				</p>
			</div>

			{message && <Message variant='danger'>{message}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}

			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name' className='mb-3'>
					<Form.Label className='font-weight-bold'>Full Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='e.g. Alex Taylor'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</Form.Group>

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

				<Form.Group controlId='password' className='mb-3'>
					<Form.Label className='font-weight-bold'>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='At least 6 characters'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Form.Group controlId='confirmPassword' className='mb-4'>
					<Form.Label className='font-weight-bold'>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Re-type password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</Form.Group>

				<Button type='submit' className='btn-accent btn-block py-2 mb-3'>
					Create ProShop Account
				</Button>
			</Form>

			<Row className='pt-3 text-center'>
				<Col className='text-muted' style={{ fontSize: '0.875rem' }}>
					Already have an account?{' '}
					<Link
						to={redirect ? `/login?redirect=${redirect}` : '/login'}
						className='font-weight-bold text-primary'
					>
						Sign In
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default RegisterScreen;

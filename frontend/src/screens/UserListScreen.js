import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listUsers, deleteUser } from '../actions/user-actions';

const UserListScreen = ({ history }) => {
	const dispatch = useDispatch();

	const userList = useSelector((state) => state.userList);
	const { loading, error, users } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	const { success: successDelete } = userDelete;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listUsers());
		} else {
			history.push('/login');
		}
	}, [dispatch, history, successDelete, userInfo]);

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			dispatch(deleteUser(id));
		}
	};

	return (
		<>
			<Meta title='Manage Users | ProShop Admin' />

			<div className='d-flex align-items-center justify-content-between mb-4'>
				<div>
					<h1 className='mb-1'>User Directory</h1>
					<p className='text-muted mb-0'>Manage registered customer profiles and administrator roles.</p>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Card className='p-0 overflow-hidden' style={{ borderRadius: '16px' }}>
					<div className='table-responsive'>
						<Table hover className='mb-0'>
							<thead>
								<tr>
									<th>USER ID</th>
									<th>FULL NAME</th>
									<th>EMAIL</th>
									<th>ROLE</th>
									<th>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user._id}>
										<td className='text-muted' style={{ fontVariantNumeric: 'tabular-nums' }}>
											#{user._id.slice(-6).toUpperCase()}
										</td>
										<td className='font-weight-bold'>{user.name}</td>
										<td>
											<a href={`mailto:${user.email}`} className='text-primary'>
												{user.email}
											</a>
										</td>
										<td>
											{user.isAdmin ? (
												<span className='status-pill' style={{ background: '#fef3c7', color: '#92400e' }}>
													<i className='fas fa-shield-alt mr-1'></i> Admin
												</span>
											) : (
												<span className='status-pill' style={{ background: '#f1f5f9', color: '#475569' }}>
													<i className='fas fa-user mr-1'></i> Customer
												</span>
											)}
										</td>
										<td>
											<div className='d-flex align-items-center gap-2'>
												<Link
													to={`/admin/user/${user._id}/edit`}
													className='btn btn-light btn-sm mr-2'
													title='Edit User'
												>
													<i className='fas fa-edit'></i>
												</Link>
												<Button
													variant='light'
													className='btn-sm text-danger'
													onClick={() => deleteHandler(user._id)}
													title='Delete User'
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
			)}
		</>
	);
};

export default UserListScreen;

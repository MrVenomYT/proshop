import React, { useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/user-actions';

const Header = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [activeCategoryTab, setActiveCategoryTab] = useState('gadgets');

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites } = userFavorites;
	const favoritesCount = favorites ? favorites.length : 0;

	const logoutHandler = () => {
		dispatch(logout());
		history.push('/login');
	};

	const categoryTabs = [
		{ id: 'gadgets', label: 'Gadgets', icon: 'fas fa-mobile-alt', query: '' },
		{ id: 'smarthome', label: 'Smart Home', icon: 'fas fa-home', query: 'Networking' },
		{ id: 'audio', label: 'Audio', icon: 'fas fa-headphones', query: 'Audio' },
		{ id: 'wearables', label: 'Wearables', icon: 'fas fa-clock', query: 'Wearables' },
		{ id: 'accessories', label: 'Accessories', icon: 'fas fa-keyboard', query: 'Keyboards' },
		{ id: 'sale', label: 'Sale', icon: 'fas fa-tags', query: 'sale', isRed: true },
	];

	const handleTabClick = (tab) => {
		setActiveCategoryTab(tab.id);
		if (!tab.query) history.push('/');
		else history.push(`/search/${tab.query}`);
	};

	return (
		<header className='sticky-top shadow-sm bg-white'>
			{/* Main Navbar (ProShop Style) */}
			<Navbar expand='lg' className='py-2 border-bottom bg-white'>
				<Container>
					{/* Brand Logo Lockup */}
					<Link to='/' className='navbar-brand d-flex align-items-center text-decoration-none'>
						<div
							style={{
								width: '38px',
								height: '38px',
								borderRadius: '10px',
								background: '#dc2626',
								color: '#ffffff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								fontWeight: '900',
								marginRight: '10px',
								boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
							}}
						>
							<i className='fas fa-cube'></i>
						</div>
						<div>
							<div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: '800', lineHeight: '1', color: '#0f172a', letterSpacing: '-0.03em' }}>
								Pro<span style={{ color: '#dc2626' }}>Shop</span>
							</div>
							<div className='text-muted' style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.04em' }}>
								Discover. Shop. Upgrade.
							</div>
						</div>
					</Link>

					<Navbar.Toggle aria-controls='proshop-navbar-nav' />

					<Navbar.Collapse id='proshop-navbar-nav'>
						{/* Search Bar */}
						<div className='mx-auto my-2 my-lg-0 w-100 d-flex justify-content-center' style={{ maxWidth: '420px' }}>
							<Route render={({ history: routeHistory }) => <SearchBox history={routeHistory} />} />
						</div>

						{/* Right Actions */}
						<Nav className='ml-auto align-items-center gap-3'>
							<Link to='/' className='nav-link font-weight-bold text-dark px-2'>Home</Link>
							<Link to='/search/all' className='nav-link font-weight-bold text-dark px-2'>Shop</Link>

							{userInfo && userInfo.isAdmin && (
								<Link to='/admin/dashboard' className='btn btn-sm btn-outline-danger font-weight-bold mx-1' style={{ borderRadius: '8px' }}>
									<i className='fas fa-chart-line mr-1'></i> Admin Dashboard
								</Link>
							)}

							{/* Region Flags */}
							<div className='d-none d-xl-flex align-items-center gap-2 text-muted px-2' style={{ fontSize: '0.78rem', fontWeight: '600' }}>
								<span>US | UK | UAE</span>
							</div>

							{/* Saved Wishlist */}
							<Link to='/favorites' className='mobistore-icon-btn position-relative' title='Saved Wishlist'>
								<i className='far fa-heart'></i>
								{favoritesCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#dc2626' }}>
										{favoritesCount}
									</span>
								)}
							</Link>

							{/* Shopping Bag */}
							<Link to='/cart' className='mobistore-icon-btn position-relative' title='Shopping Bag'>
								<i className='fas fa-shopping-bag'></i>
								{cartCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#dc2626' }}>
										{cartCount}
									</span>
								)}
							</Link>

							{/* User Profile */}
							{userInfo ? (
								<NavDropdown
									title={
										<div className='mobistore-icon-btn' title={userInfo.name}>
											<i className='fas fa-user-circle' style={{ color: '#dc2626' }}></i>
										</div>
									}
									id='proshop-user-dropdown'
									alignRight
								>
									<NavDropdown.Item onClick={() => history.push('/profile')}>
										<i className='fas fa-id-card mr-2 text-muted'></i>My Profile
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/favorites')}>
										<i className='fas fa-heart mr-2 text-muted'></i>Saved Items
									</NavDropdown.Item>

									{userInfo.isAdmin && (
										<>
											<NavDropdown.Divider />
											<div className='dropdown-header text-muted' style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
												Admin Tools
											</div>
											<NavDropdown.Item onClick={() => history.push('/admin/dashboard')}>
												<i className='fas fa-chart-pie mr-2 text-danger'></i>Admin Dashboard
											</NavDropdown.Item>
											<NavDropdown.Item onClick={() => history.push('/admin/productlist')}>
												<i className='fas fa-boxes mr-2 text-muted'></i>Manage Products
											</NavDropdown.Item>
											<NavDropdown.Item onClick={() => history.push('/admin/orderlist')}>
												<i className='fas fa-receipt mr-2 text-muted'></i>Manage Orders
											</NavDropdown.Item>
											<NavDropdown.Item onClick={() => history.push('/admin/userlist')}>
												<i className='fas fa-users mr-2 text-muted'></i>Manage Users
											</NavDropdown.Item>
										</>
									)}

									<NavDropdown.Divider />
									<NavDropdown.Item onClick={logoutHandler} className='text-danger'>
										<i className='fas fa-sign-out-alt mr-2'></i>Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Link to='/login' className='mobistore-icon-btn' title='Sign In'>
									<i className='far fa-user'></i>
								</Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			{/* Sub-Header Category Tabs Bar with Crimson Red Active Line */}
			<div className='border-bottom bg-white overflow-auto' style={{ scrollbarWidth: 'none' }}>
				<Container className='d-flex align-items-center gap-2 py-1'>
					{categoryTabs.map((tab) => (
						<button
							key={tab.id}
							type='button'
							onClick={() => handleTabClick(tab)}
							className='btn btn-link text-decoration-none px-3 py-2 text-dark font-weight-bold position-relative'
							style={{
								fontSize: '0.88rem',
								color: activeCategoryTab === tab.id ? '#dc2626' : '#334155',
							}}
						>
							<i className={`${tab.icon} mr-1.5`} style={{ color: tab.isRed ? '#dc2626' : 'inherit' }}></i>
							<span style={{ color: tab.isRed ? '#dc2626' : 'inherit' }}>{tab.label}</span>
							{activeCategoryTab === tab.id && (
								<span
									style={{
										position: 'absolute',
										bottom: '-4px',
										left: '12px',
										right: '12px',
										height: '3px',
										background: '#dc2626',
										borderRadius: '9999px',
									}}
								/>
							)}
						</button>
					))}
				</Container>
			</div>
		</header>
	);
};

export default Header;

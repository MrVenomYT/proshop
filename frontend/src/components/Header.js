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
		{ id: 'gadgets', label: 'All Catalog', icon: 'fas fa-th-large', query: '' },
		{ id: 'smartphones', label: 'Smartphones', icon: 'fas fa-mobile-alt', query: 'Smartphones' },
		{ id: 'laptops', label: 'Laptops & PCs', icon: 'fas fa-laptop', query: 'Laptops' },
		{ id: 'audio', label: 'Audio & Studio', icon: 'fas fa-headphones', query: 'Audio' },
		{ id: 'wearables', label: 'Wearables', icon: 'fas fa-clock', query: 'Wearables' },
		{ id: 'peripherals', label: 'Peripherals', icon: 'fas fa-keyboard', query: 'Keyboards' },
		{ id: 'networking', label: 'Smart Home', icon: 'fas fa-wifi', query: 'Networking' },
		{ id: 'sale', label: '🔥 Flash Sale', icon: 'fas fa-tags', query: 'sale', isRed: true },
	];

	const handleTabClick = (tab) => {
		setActiveCategoryTab(tab.id);
		if (!tab.query) history.push('/');
		else history.push(`/search/${tab.query}`);
	};

	return (
		<header className='sticky-top shadow-sm bg-white'>
			{/* Top Announcement & Utility Bar */}
			<div className='bg-dark text-white py-1.5' style={{ fontSize: '0.78rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
				<Container className='d-flex align-items-center justify-content-between py-1'>
					<div className='d-flex align-items-center gap-2'>
						<span className='badge bg-danger text-white font-weight-bold px-2 py-0.5' style={{ borderRadius: '4px', fontSize: '0.68rem' }}>PROSHOP</span>
						<span style={{ color: '#cbd5e1' }}>Free Express Shipping on Orders over $50 · 2-Year Official Warranty</span>
					</div>

					<div className='d-none d-md-flex align-items-center gap-3 text-slate-300 font-weight-bold' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
						<span className='mr-3'><i className='fas fa-globe mr-1 text-danger'></i> Global Store (US / UK / UAE)</span>
						<span className='mr-3'><i className='fas fa-headset mr-1 text-danger'></i> 24/7 Creator Support</span>
						<Link to='/profile' className='text-white text-decoration-none'>Track Order</Link>
					</div>
				</Container>
			</div>

			{/* Main Navbar */}
			<Navbar expand='lg' className='py-3 border-bottom bg-white'>
				<Container className='d-flex align-items-center justify-content-between'>
					{/* Brand Logo Lockup */}
					<Link to='/' className='navbar-brand d-flex align-items-center text-decoration-none mr-4'>
						<div
							style={{
								width: '42px',
								height: '42px',
								borderRadius: '12px',
								background: '#dc2626',
								color: '#ffffff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.3rem',
								fontWeight: '900',
								marginRight: '12px',
								boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
							}}
						>
							<i className='fas fa-cube'></i>
						</div>
						<div>
							<div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1', color: '#0f172a', letterSpacing: '-0.03em' }}>
								Pro<span style={{ color: '#dc2626' }}>Shop</span>
							</div>
							<div className='text-muted' style={{ fontSize: '0.68rem', fontWeight: '600', letterSpacing: '0.04em', marginTop: '2px' }}>
								Flagship Technology & Gear
							</div>
						</div>
					</Link>

					<Navbar.Toggle aria-controls='proshop-navbar-nav' className='border-0' />

					<Navbar.Collapse id='proshop-navbar-nav'>
						{/* Search Bar Container */}
						<div className='mx-lg-4 my-2 my-lg-0 flex-grow-1' style={{ maxWidth: '480px' }}>
							<Route render={({ history: routeHistory }) => <SearchBox history={routeHistory} />} />
						</div>

						{/* Right Actions */}
						<Nav className='ml-auto align-items-center gap-3' style={{ gap: '0.85rem' }}>
							<Link to='/' className='nav-link font-weight-bold text-dark px-2 mr-2' style={{ fontSize: '0.92rem' }}>
								Home
							</Link>
							<Link to='/search/all' className='nav-link font-weight-bold text-dark px-2 mr-2' style={{ fontSize: '0.92rem' }}>
								Catalog
							</Link>

							{userInfo && userInfo.isAdmin && (
								<Link
									to='/admin/dashboard'
									className='btn btn-sm btn-outline-danger font-weight-bold mx-2 px-3 py-1.5'
									style={{ borderRadius: '8px', fontSize: '0.82rem' }}
								>
									<i className='fas fa-chart-line mr-1.5'></i> Admin Dashboard
								</Link>
							)}

							{/* Saved Wishlist Icon Button */}
							<Link
								to='/favorites'
								className='mobistore-icon-btn position-relative ml-2'
								title='Saved Wishlist'
								style={{ width: '42px', height: '42px' }}
							>
								<i className='far fa-heart' style={{ fontSize: '1.15rem' }}></i>
								{favoritesCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#dc2626' }}>
										{favoritesCount}
									</span>
								)}
							</Link>

							{/* Shopping Bag Icon Button */}
							<Link
								to='/cart'
								className='mobistore-icon-btn position-relative ml-2'
								title='Shopping Bag'
								style={{ width: '42px', height: '42px' }}
							>
								<i className='fas fa-shopping-bag' style={{ fontSize: '1.15rem' }}></i>
								{cartCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#dc2626' }}>
										{cartCount}
									</span>
								)}
							</Link>

							{/* User Profile Dropdown */}
							{userInfo ? (
								<NavDropdown
									title={
										<div className='mobistore-icon-btn ml-2' title={userInfo.name} style={{ width: '42px', height: '42px' }}>
											<i className='fas fa-user-circle' style={{ color: '#dc2626', fontSize: '1.3rem' }}></i>
										</div>
									}
									id='proshop-user-dropdown'
									alignRight
									className='ml-1'
								>
									<div className='px-3 py-2 border-bottom bg-light'>
										<div className='font-weight-bold text-dark' style={{ fontSize: '0.88rem' }}>{userInfo.name}</div>
										<div className='text-muted' style={{ fontSize: '0.75rem' }}>{userInfo.email}</div>
									</div>
									<NavDropdown.Item onClick={() => history.push('/profile')}>
										<i className='fas fa-id-card mr-2 text-muted'></i>My Account Profile
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/favorites')}>
										<i className='fas fa-heart mr-2 text-muted'></i>Saved Wishlist
									</NavDropdown.Item>

									{userInfo.isAdmin && (
										<>
											<NavDropdown.Divider />
											<div className='dropdown-header text-muted' style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
												Admin Tools
											</div>
											<NavDropdown.Item onClick={() => history.push('/admin/dashboard')}>
												<i className='fas fa-chart-pie mr-2 text-danger'></i>Dashboard Overview
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
									<NavDropdown.Item onClick={logoutHandler} className='text-danger font-weight-bold'>
										<i className='fas fa-sign-out-alt mr-2'></i>Sign Out
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Link to='/login' className='mobistore-icon-btn ml-2' title='Sign In' style={{ width: '42px', height: '42px' }}>
									<i className='far fa-user' style={{ fontSize: '1.15rem' }}></i>
								</Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			{/* Sub-Header Category Tabs Bar with Red Active Line */}
			<div className='border-bottom bg-white overflow-auto' style={{ scrollbarWidth: 'none' }}>
				<Container className='d-flex align-items-center gap-1 py-1'>
					{categoryTabs.map((tab) => (
						<button
							key={tab.id}
							type='button'
							onClick={() => handleTabClick(tab)}
							className='btn btn-link text-decoration-none px-3 py-2 text-dark font-weight-bold position-relative mr-1'
							style={{
								fontSize: '0.88rem',
								color: activeCategoryTab === tab.id ? '#dc2626' : '#334155',
								whiteSpace: 'nowrap',
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

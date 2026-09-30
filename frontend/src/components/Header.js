import React, { useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/user-actions';

const Header = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [activeNav, setActiveNav] = useState('home');
	const [showSearchModal, setShowSearchModal] = useState(false);

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

	const shopCategories = [
		{ label: 'All Catalog Products', query: '' },
		{ label: 'Smartphones & Handhelds', query: 'Smartphones' },
		{ label: 'Laptops & Portable PCs', query: 'Laptops' },
		{ label: 'PC Components & GPUs', query: 'Components' },
		{ label: 'Smartwatches & Wearables', query: 'Wearables' },
		{ label: 'Audio & Studio Headphones', query: 'Audio' },
		{ label: 'Monitors & Displays', query: 'Monitors' },
		{ label: 'Power & GaN Fast Chargers', query: 'Power' },
		{ label: 'Storage & Portable SSDs', query: 'Storage' },
		{ label: 'Networking & Smart Home', query: 'Networking' },
	];

	const handleNavClick = (navKey, path) => {
		setActiveNav(navKey);
		history.push(path);
	};

	return (
		<header className='sticky-top shadow-sm'>
			{/* Top Announcement Bar (from MobiStore reference) */}
			<div
				style={{
					background: 'linear-gradient(90deg, #090e1a 0%, #1a103c 50%, #2e0854 100%)',
					color: '#ffffff',
					fontSize: '0.8rem',
					padding: '7px 0',
				}}
			>
				<Container className='d-flex align-items-center justify-content-between'>
					<div className='d-flex align-items-center gap-2'>
						<span className='font-weight-bold text-white' style={{ letterSpacing: '0.04em' }}>
							FOR PREMIUM HARDWARE & EXCLUSIVE OFFERS, SHOP PROSHOP!
						</span>
					</div>
					<div>
						<Link
							to='/search/sale'
							className='btn btn-sm font-weight-bold'
							style={{
								background: '#7c3aed',
								color: '#ffffff',
								borderRadius: '9999px',
								padding: '2px 14px',
								fontSize: '0.75rem',
							}}
						>
							EXPLORE DEALS <i className='fas fa-arrow-right ml-1'></i>
						</Link>
					</div>
				</Container>
			</div>

			{/* Sub-ticker Bar with Trust Icons (from MobiStore reference) */}
			<div
				style={{
					background: '#ffffff',
					borderBottom: '1px solid #f1f5f9',
					color: '#475569',
					fontSize: '0.78rem',
					padding: '6px 0',
				}}
			>
				<Container className='d-flex align-items-center justify-content-between flex-wrap gap-2'>
					<div className='d-flex align-items-center gap-2'>
						<i className='fas fa-truck text-primary'></i>
						<span>Free Shipping on Orders Over $50</span>
					</div>
					<div className='d-flex align-items-center gap-2'>
						<i className='fas fa-check-circle text-success'></i>
						<span>100% Original Authentic Products</span>
					</div>
					<div className='d-none d-md-flex align-items-center gap-2'>
						<i className='fas fa-shield-alt text-warning'></i>
						<span>2-Year Hardware Warranty</span>
					</div>
					<div className='d-none d-lg-flex align-items-center gap-2'>
						<i className='fas fa-headset text-info'></i>
						<span>24/7 Creator Customer Support</span>
					</div>
				</Container>
			</div>

			{/* Main MobiStore-Style Clean White Navbar */}
			<Navbar
				expand='lg'
				style={{
					background: '#ffffff',
					borderBottom: '1px solid #e2e8f0',
					padding: '0.75rem 0',
				}}
			>
				<Container>
					{/* Brand Logo */}
					<Link to='/' className='navbar-brand d-flex align-items-center text-decoration-none' onClick={() => setActiveNav('home')}>
						<div
							style={{
								width: '36px',
								height: '36px',
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
								color: '#ffffff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2rem',
								fontWeight: '800',
								marginRight: '10px',
							}}
						>
							<i className='fas fa-cube'></i>
						</div>
						<div>
							<div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', lineHeight: '1', color: '#0f172a', letterSpacing: '-0.03em' }}>
								Pro<span style={{ color: '#6366f1' }}>Store</span>
							</div>
							<div className='text-muted' style={{ fontSize: '0.68rem', fontWeight: '600', letterSpacing: '0.04em' }}>
								Your Hardware, Connected
							</div>
						</div>
					</Link>

					<Navbar.Toggle aria-controls='mobistore-navbar-nav' />

					<Navbar.Collapse id='mobistore-navbar-nav'>
						{/* Center Menu Links (from MobiStore reference) */}
						<Nav className='mx-auto align-items-center gap-1 my-2 my-lg-0' style={{ fontSize: '0.92rem', fontWeight: '600' }}>
							<button
								type='button'
								onClick={() => handleNavClick('home', '/')}
								className={`mobistore-nav-link ${activeNav === 'home' ? 'active' : ''}`}
							>
								Home
							</button>

							<NavDropdown
								title={
									<span className={`mobistore-nav-link ${activeNav === 'shop' ? 'active' : ''}`}>
										Shop <i className='fas fa-chevron-down ml-1' style={{ fontSize: '0.7rem' }}></i>
									</span>
								}
								id='shop-mobistore-dropdown'
							>
								{shopCategories.map((cat) => (
									<NavDropdown.Item
										key={cat.label}
										onClick={() => {
											setActiveNav('shop');
											if (!cat.query) history.push('/');
											else history.push(`/search/${cat.query}`);
										}}
									>
										{cat.label}
									</NavDropdown.Item>
								))}
							</NavDropdown>

							<button
								type='button'
								onClick={() => handleNavClick('brands', '/search/Apple')}
								className={`mobistore-nav-link ${activeNav === 'brands' ? 'active' : ''}`}
							>
								Brands
							</button>

							<button
								type='button'
								onClick={() => handleNavClick('accessories', '/search/Keyboards')}
								className={`mobistore-nav-link ${activeNav === 'accessories' ? 'active' : ''}`}
							>
								Accessories
							</button>

							<button
								type='button'
								onClick={() => handleNavClick('deals', '/search/sale')}
								className={`mobistore-nav-link ${activeNav === 'deals' ? 'active' : ''}`}
								style={{ color: '#ef4444' }}
							>
								Deals
							</button>

							<button
								type='button'
								onClick={() => handleNavClick('support', '/favorites')}
								className={`mobistore-nav-link ${activeNav === 'support' ? 'active' : ''}`}
							>
								Saved
							</button>
						</Nav>

						{/* Right Control Icons (from MobiStore reference) */}
						<div className='d-flex align-items-center gap-2 ml-lg-auto'>
							{/* Search Box Trigger */}
							<div className='position-relative' style={{ minWidth: '220px' }}>
								<Route render={({ history: routeHistory }) => <SearchBox history={routeHistory} />} />
							</div>

							{/* Account Icon */}
							{userInfo ? (
								<NavDropdown
									title={
										<div className='mobistore-icon-btn' title={userInfo.name}>
											<i className='fas fa-user-circle' style={{ color: '#4f46e5' }}></i>
										</div>
									}
									id='mobistore-user-dropdown'
									alignRight
								>
									<NavDropdown.Item onClick={() => history.push('/profile')}>
										<i className='fas fa-id-card mr-2 text-muted'></i>My Profile
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/favorites')}>
										<i className='fas fa-heart mr-2 text-muted'></i>Saved Items
									</NavDropdown.Item>
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

							{/* Wishlist Heart Icon */}
							<Link to='/favorites' className='mobistore-icon-btn position-relative' title='Saved Wishlist'>
								<i className='far fa-heart'></i>
								{favoritesCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#ef4444' }}>
										{favoritesCount}
									</span>
								)}
							</Link>

							{/* Cart Shopping Bag Icon */}
							<Link to='/cart' className='mobistore-icon-btn position-relative' title='Shopping Bag'>
								<i className='fas fa-shopping-bag'></i>
								{cartCount > 0 && (
									<span className='mobistore-badge' style={{ background: '#4f46e5' }}>
										{cartCount}
									</span>
								)}
							</Link>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;

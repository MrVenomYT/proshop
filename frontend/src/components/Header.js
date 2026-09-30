import React from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/user-actions';

const Header = () => {
	const dispatch = useDispatch();
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

	const userFavorites = useSelector((state) => state.userGetFavorites);
	const { favorites } = userFavorites;
	const favoritesCount = favorites ? favorites.length : 0;

	const history = useHistory();

	const logoutHandler = () => {
		dispatch(logout());
		history.push('/login');
	};

	const categories = [
		{ label: 'All Catalog Products', icon: 'fas fa-th-large', query: '' },
		{ label: 'Smartphones, Tablets & Handhelds', icon: 'fas fa-mobile-alt', query: 'Smartphones' },
		{ label: 'Laptops & Portable Computing', icon: 'fas fa-laptop', query: 'Laptops' },
		{ label: 'PC Components, GPUs & Desktops', icon: 'fas fa-microchip', query: 'Components' },
		{ label: 'Smartwatches, Trackers & Glasses', icon: 'fas fa-clock', query: 'Wearables' },
		{ label: 'Monitors & Displays', icon: 'fas fa-desktop', query: 'Monitors' },
		{ label: 'Keyboards, Mice & Controllers', icon: 'fas fa-keyboard', query: 'Keyboards' },
		{ label: 'Audio, Streaming & Studio Gear', icon: 'fas fa-headphones', query: 'Audio' },
		{ label: 'Power, Charging & GaN Hubs', icon: 'fas fa-bolt', query: 'Power' },
		{ label: 'External Storage & Backup SSDs', icon: 'fas fa-hdd', query: 'Storage' },
		{ label: 'Networking, Wi-Fi 7 & Smart Home', icon: 'fas fa-wifi', query: 'Networking' },
	];

	const handleCategorySelect = (query) => {
		if (!query) {
			history.push('/');
		} else {
			history.push(`/search/${query}`);
		}
	};

	return (
		<header>
			<Navbar className='custom-navbar' variant='dark' expand='lg' collapseOnSelect>
				<Container>
					<Link to='/' className='navbar-brand brand-logo'>
						<i className='fas fa-cube text-primary mr-2'></i>
						<span>PRO<span style={{ color: '#60a5fa' }}>SHOP</span></span>
						<span className='brand-dot'></span>
					</Link>

					<Navbar.Toggle aria-controls='basic-navbar-nav' />

					<Navbar.Collapse id='basic-navbar-nav'>
						{/* Categories Dropdown in Navbar */}
						<Nav className='mr-auto d-none d-lg-flex align-items-center ml-3'>
							<NavDropdown
								title={
									<span className='d-inline-flex align-items-center text-light font-weight-bold'>
										<i className='fas fa-th-large mr-2 text-primary'></i>
										Departments
										<i className='fas fa-chevron-down ml-2' style={{ fontSize: '0.75rem', opacity: 0.7 }}></i>
									</span>
								}
								id='categories-nav-dropdown'
							>
								<div className='dropdown-header text-muted' style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
									Shop by Hardware Category
								</div>
								{categories.map((cat) => (
									<NavDropdown.Item
										key={cat.label}
										onClick={() => handleCategorySelect(cat.query)}
										className='d-flex align-items-center py-2'
									>
										<i className={`${cat.icon} mr-2 text-primary`} style={{ width: '18px', textAlign: 'center' }}></i>
										<span>{cat.label}</span>
									</NavDropdown.Item>
								))}
							</NavDropdown>
						</Nav>

						{/* Search bar */}
						<div className='mx-auto my-2 my-lg-0 w-100 d-flex justify-content-center' style={{ maxWidth: '420px' }}>
							<Route render={({ history: routeHistory }) => <SearchBox history={routeHistory} />} />
						</div>

						{/* Right Action Icons */}
						<Nav className='ml-auto align-items-center'>
							{/* Mobile category button */}
							<NavDropdown
								title={
									<span className='d-inline-flex align-items-center'>
										<i className='fas fa-list mr-1'></i>
										<span>Departments</span>
									</span>
								}
								id='mobile-categories'
								className='d-lg-none custom-nav-link'
							>
								{categories.map((cat) => (
									<NavDropdown.Item
										key={cat.label}
										onClick={() => handleCategorySelect(cat.query)}
									>
										<i className={`${cat.icon} mr-2 text-primary`}></i>
										{cat.label}
									</NavDropdown.Item>
								))}
							</NavDropdown>

							<Link to='/cart' className='nav-link custom-nav-link'>
								<i className='fas fa-shopping-bag'></i>
								<span>Bag</span>
								{cartCount > 0 && <span className='cart-badge'>{cartCount}</span>}
							</Link>

							{userInfo && (
								<Link to='/favorites' className='nav-link custom-nav-link'>
									<i className='far fa-heart'></i>
									<span>Saved</span>
									{favoritesCount > 0 && (
										<span className='cart-badge' style={{ background: '#ef4444' }}>
											{favoritesCount}
										</span>
									)}
								</Link>
							)}

							{userInfo ? (
								<NavDropdown
									title={
										<span className='d-inline-flex align-items-center'>
											<i className='fas fa-user-circle mr-1'></i>
											{userInfo.name.split(' ')[0]}
										</span>
									}
									id='username'
									className='custom-nav-link'
								>
									<NavDropdown.Item onClick={() => history.push('/profile')}>
										<i className='fas fa-id-card mr-2 text-muted'></i>My Account
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/favorites')}>
										<i className='fas fa-heart mr-2 text-muted'></i>Favorites
									</NavDropdown.Item>
									<NavDropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
									<NavDropdown.Item onClick={logoutHandler} className='text-danger'>
										<i className='fas fa-sign-out-alt mr-2'></i>Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Link to='/login' className='nav-link custom-nav-link'>
									<i className='fas fa-user'></i>
									<span>Sign In</span>
								</Link>
							)}

							{userInfo && userInfo.isAdmin && (
								<NavDropdown
									title={
										<span className='d-inline-flex align-items-center text-warning'>
											<i className='fas fa-shield-alt mr-1'></i>
											Admin
										</span>
									}
									id='adminmenu'
								>
									<NavDropdown.Item onClick={() => history.push('/admin/userlist')}>
										<i className='fas fa-users mr-2 text-muted'></i>Manage Users
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/admin/productlist')}>
										<i className='fas fa-boxes mr-2 text-muted'></i>Manage Products
									</NavDropdown.Item>
									<NavDropdown.Item onClick={() => history.push('/admin/orderlist')}>
										<i className='fas fa-receipt mr-2 text-muted'></i>Manage Orders
									</NavDropdown.Item>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;

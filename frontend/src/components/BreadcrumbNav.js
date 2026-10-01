import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Breadcrumb } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const BreadcrumbNav = () => {
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter((x) => x);

	const productDetails = useSelector((state) => state.productDetails);
	const { product } = productDetails;

	// Don't render breadcrumbs on home page root
	if (location.pathname === '/') {
		return null;
	}

	const routeNameMap = {
		cart: 'Shopping Bag',
		favorites: 'Saved Wishlist',
		login: 'Sign In',
		register: 'Create Account',
		profile: 'User Account Profile',
		shipping: 'Shipping Address',
		payment: 'Payment Method',
		placeorder: 'Place Order',
		order: 'Order Receipt',
		search: 'Catalog Search',
		admin: 'Admin Console',
		dashboard: 'Analytics Dashboard',
		userlist: 'User Management',
		productlist: 'Inventory Management',
		orderlist: 'Order Management',
	};

	return (
		<div className='bg-light py-2 border-bottom' style={{ background: '#f8fafc', fontSize: '0.82rem' }}>
			<Container className='d-flex align-items-center'>
				<Breadcrumb className='mb-0 p-0 bg-transparent'>
					<Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }} className='font-weight-bold'>
						<i className='fas fa-home mr-1 text-danger'></i> Home
					</Breadcrumb.Item>

					{pathnames.map((name, index) => {
						const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
						const isLast = index === pathnames.length - 1;

						// Dynamic labels
						let displayName = routeNameMap[name.toLowerCase()] || name;

						if (pathnames[0] === 'product' && index === 1 && product && product._id === name) {
							displayName = product.name || 'Product Details';
						}

						if (pathnames[0] === 'search' && index === 1) {
							displayName = decodeURIComponent(name);
						}

						return isLast ? (
							<Breadcrumb.Item active key={name} className='text-dark font-weight-bold'>
								{displayName}
							</Breadcrumb.Item>
						) : (
							<Breadcrumb.Item key={name} linkAs={Link} linkProps={{ to: routeTo }}>
								{displayName}
							</Breadcrumb.Item>
						);
					})}
				</Breadcrumb>
			</Container>
		</div>
	);
};

export default BreadcrumbNav;

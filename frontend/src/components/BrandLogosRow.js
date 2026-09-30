import React from 'react';
import { useHistory } from 'react-router-dom';

const BrandLogosRow = () => {
	const history = useHistory();

	const brands = [
		{ name: 'Apple', icon: 'fab fa-apple', query: 'Apple' },
		{ name: 'Samsung', icon: 'fas fa-mobile-alt', query: 'Samsung' },
		{ name: 'Google', icon: 'fab fa-google', query: 'Google' },
		{ name: 'Sony', icon: 'fas fa-headphones', query: 'Sony' },
		{ name: 'ASUS', icon: 'fas fa-laptop-code', query: 'ASUS' },
		{ name: 'NVIDIA', icon: 'fas fa-microchip', query: 'NVIDIA' },
		{ name: 'Logitech', icon: 'fas fa-mouse', query: 'Logitech' },
		{ name: 'Anker', icon: 'fas fa-bolt', query: 'Anker' },
		{ name: 'Dell', icon: 'fas fa-desktop', query: 'Dell' },
		{ name: 'Razer', icon: 'fas fa-gamepad', query: 'Razer' },
	];

	const handleBrandClick = (query) => {
		history.push(`/search/${query}`);
	};

	return (
		<div
			className='my-4 p-4 bg-white rounded-20 border'
			style={{
				borderRadius: '20px',
				borderColor: '#e2e8f0',
				boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
			}}
		>
			<div className='d-flex align-items-center justify-content-between mb-3 px-1'>
				<span
					className='font-weight-bold text-slate-700'
					style={{
						fontSize: '0.82rem',
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
						color: '#475569',
					}}
				>
					SHOP BY TOP HARDWARE BRAND
				</span>
				<span className='text-muted' style={{ fontSize: '0.78rem' }}>10+ Official Partners</span>
			</div>

			<div className='d-flex align-items-center gap-2 overflow-auto py-1' style={{ scrollbarWidth: 'none', paddingBottom: '4px' }}>
				{brands.map((b) => (
					<button
						key={b.name}
						type='button'
						onClick={() => handleBrandClick(b.query)}
						className='btn btn-light d-inline-flex align-items-center gap-2 px-3 py-2'
						style={{
							background: '#f8fafc',
							border: '1px solid #e2e8f0',
							borderRadius: '12px',
							fontSize: '0.88rem',
							fontWeight: '700',
							color: '#0f172a',
							whiteSpace: 'nowrap',
							flexShrink: 0,
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = '#4f46e5';
							e.currentTarget.style.color = '#ffffff';
							e.currentTarget.style.borderColor = '#4f46e5';
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = '#f8fafc';
							e.currentTarget.style.color = '#0f172a';
							e.currentTarget.style.borderColor = '#e2e8f0';
							e.currentTarget.style.transform = 'translateY(0)';
						}}
					>
						<i className={`${b.icon} mr-1`} style={{ fontSize: '1rem', color: 'inherit' }}></i>
						<span>{b.name}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default BrandLogosRow;

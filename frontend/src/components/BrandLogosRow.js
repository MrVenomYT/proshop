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
	];

	const handleBrandClick = (query) => {
		history.push(`/search/${query}`);
	};

	return (
		<div className='my-4 p-3 bg-white rounded-16 border border-slate-200' style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
			<div className='d-flex align-items-center justify-content-between mb-2 px-2'>
				<span className='font-weight-bold text-muted' style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
					Shop by Top Hardware Brand
				</span>
			</div>
			<div className='d-flex align-items-center justify-content-between overflow-auto gap-2 py-1' style={{ scrollbarWidth: 'none' }}>
				{brands.map((b) => (
					<button
						key={b.name}
						type='button'
						onClick={() => handleBrandClick(b.query)}
						className='btn btn-light d-flex align-items-center gap-2 px-3 py-2 border-0'
						style={{
							background: '#f8fafc',
							borderRadius: '12px',
							fontSize: '0.85rem',
							fontWeight: '600',
							color: '#0f172a',
							whiteSpace: 'nowrap',
							transition: 'all 0.15s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = '#0f172a';
							e.currentTarget.style.color = '#ffffff';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = '#f8fafc';
							e.currentTarget.style.color = '#0f172a';
						}}
					>
						<i className={`${b.icon} text-primary`}></i>
						<span>{b.name}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default BrandLogosRow;

import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
	if (pages <= 1) return null;

	return (
		<div className='d-flex justify-content-center my-4'>
			<ul className='pagination mb-0'>
				{[...Array(pages).keys()].map((x) => {
					const pageNum = x + 1;
					const targetUrl = !isAdmin
						? keyword
							? `/search/${keyword}/page/${pageNum}`
							: `/page/${pageNum}`
						: `/admin/productlist/${pageNum}`;

					const isActive = pageNum === Number(page);

					return (
						<li key={pageNum} className={`page-item ${isActive ? 'active' : ''}`}>
							<Link
								to={targetUrl}
								className='page-link'
								style={{
									background: isActive ? '#0f172a' : '#ffffff',
									borderColor: '#e2e8f0',
									color: isActive ? '#ffffff' : '#0f172a',
									fontWeight: '600',
									borderRadius: '8px',
									margin: '0 3px',
									padding: '0.45rem 0.85rem',
								}}
							>
								{pageNum}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Paginate;

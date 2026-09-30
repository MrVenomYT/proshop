import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';

const BentoCollections = () => {
	const categoryIcons = [
		{ name: 'Laptops', query: 'Laptops', icon: '/images/macbookm3.png', count: '14 Models' },
		{ name: 'Smartphones', query: 'Smartphones', icon: '/images/iphone15pro.png', count: '22 Models' },
		{ name: 'Audio', query: 'Audio', icon: '/images/sonywh1000xm5.png', count: '18 Models' },
		{ name: 'Wearables', query: 'Wearables', icon: '/images/applewatchultra.png', count: '12 Models' },
		{ name: 'Gaming', query: 'Gaming', icon: '/images/rogally.png', count: '16 Models' },
		{ name: 'Monitors', query: 'Monitors', icon: '/images/samsungg9.png', count: '10 Models' },
		{ name: 'Smart Home', query: 'Networking', icon: '/images/asusgtbe98.png', count: '15 Models' },
	];

	return (
		<div className='my-5'>
			{/* 1. Shop by Category Grid (from Voltix & TechVerse) */}
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.4rem' }}>Shop by Category</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>Browse hardware by device type</p>
				</div>
				<Link to='/search/all' className='text-primary font-weight-bold' style={{ fontSize: '0.85rem' }}>
					View All Categories <i className='fas fa-arrow-right ml-1'></i>
				</Link>
			</div>

			<div className='row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-7 g-3 mb-5'>
				{categoryIcons.map((cat) => (
					<div key={cat.name} className='col mb-3'>
						<Link
							to={`/search/${cat.query}`}
							className='d-flex flex-column align-items-center p-3 text-center h-100 rounded-12 text-decoration-none'
							style={{
								background: '#ffffff',
								border: '1px solid #e2e8f0',
								borderRadius: '16px',
								transition: 'all 0.2s ease',
								boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-4px)';
								e.currentTarget.style.borderColor = '#3b82f6';
								e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.borderColor = '#e2e8f0';
								e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
							}}
						>
							<div
								style={{
									width: '70px',
									height: '70px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: '8px',
								}}
							>
								<img
									src={cat.icon}
									alt={cat.name}
									style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/images/sample.png';
									}}
								/>
							</div>
							<span className='font-weight-bold text-dark' style={{ fontSize: '0.9rem' }}>
								{cat.name} <i className='fas fa-chevron-right ml-1 text-muted' style={{ fontSize: '0.65rem' }}></i>
							</span>
							<span className='text-muted' style={{ fontSize: '0.75rem' }}>{cat.count}</span>
						</Link>
					</div>
				))}
			</div>

			{/* 2. Featured Bento Collections (from Voltix, TechVerse & 19.76) */}
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.4rem' }}>Featured Collections</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>Handpicked hardware bundles and seasonal promotions</p>
				</div>
			</div>

			<Row className='g-3 mb-5'>
				{/* Bento 1: Laptops */}
				<Col md={4} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 position-relative overflow-hidden'
						style={{
							background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
							borderRadius: '20px',
							minHeight: '220px',
						}}
					>
						<div style={{ zIndex: 2, maxWidth: '60%' }}>
							<span className='text-primary font-weight-bold uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								PRO PERFORMANCE
							</span>
							<h3 className='text-white mt-1 mb-2' style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
								Everyday Workstation Laptops
							</h3>
							<p className='text-slate-400 mb-3' style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
								Power through code, 4K rendering, and AI workflows.
							</p>
							<Link to='/search/Laptops' className='btn btn-light btn-sm font-weight-bold'>
								Explore Laptops &rarr;
							</Link>
						</div>
						<img
							src='/images/macbookm3.png'
							alt='MacBook'
							style={{
								position: 'absolute',
								right: '-20px',
								bottom: '-10px',
								maxHeight: '180px',
								objectFit: 'contain',
								filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
							}}
						/>
					</Card>
				</Col>

				{/* Bento 2: Studio Audio */}
				<Col md={4} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 position-relative overflow-hidden'
						style={{
							background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
							borderRadius: '20px',
							minHeight: '220px',
						}}
					>
						<div style={{ zIndex: 2, maxWidth: '60%' }}>
							<span className='text-warning font-weight-bold uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								STUDIO ACOUSTICS
							</span>
							<h3 className='text-white mt-1 mb-2' style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
								Sound Reimagined
							</h3>
							<p className='text-slate-400 mb-3' style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
								High-res LDAC acoustics and active noise cancellation.
							</p>
							<Link to='/search/Audio' className='btn btn-warning btn-sm font-weight-bold text-dark'>
								Shop Audio &rarr;
							</Link>
						</div>
						<img
							src='/images/sonywh1000xm5.png'
							alt='Audio'
							style={{
								position: 'absolute',
								right: '-10px',
								bottom: '0px',
								maxHeight: '170px',
								objectFit: 'contain',
								filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
							}}
						/>
					</Card>
				</Col>

				{/* Bento 3: Limited Sale Banner */}
				<Col md={4} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 position-relative overflow-hidden'
						style={{
							background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
							borderRadius: '20px',
							minHeight: '220px',
						}}
					>
						<div style={{ zIndex: 2, maxWidth: '60%' }}>
							<span className='text-danger font-weight-bold uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								LIMITED OFFER
							</span>
							<h3 className='text-white mt-1 mb-2' style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
								Up to 40% Off Flagships
							</h3>
							<p className='text-slate-300 mb-3' style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
								Save on smartphones, smartwatches, and chargers.
							</p>
							<Link to='/search/sale' className='btn btn-danger btn-sm font-weight-bold'>
								Shop Deals &rarr;
							</Link>
						</div>
						<img
							src='/images/iphone15pro.png'
							alt='iPhone Deal'
							style={{
								position: 'absolute',
								right: '0px',
								bottom: '-20px',
								maxHeight: '180px',
								objectFit: 'contain',
								filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
							}}
						/>
					</Card>
				</Col>
			</Row>

			{/* 3. Setup Inspiration Cards (from TechVerse) */}
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.4rem' }}>Ideas for Your Next Upgrade</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>Curated setup guides and creator gear collections</p>
				</div>
			</div>

			<Row className='g-3 mb-4'>
				<Col md={4} className='mb-3'>
					<div
						className='p-4 rounded-16 text-white position-relative d-flex flex-column justify-content-end'
						style={{
							background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%), url("/images/samsungg9.png") center/cover no-repeat',
							minHeight: '180px',
							borderRadius: '16px',
							border: '1px solid #e2e8f0',
						}}
					>
						<h4 className='text-white mb-0' style={{ fontSize: '1.1rem' }}>Minimal Desk Setup</h4>
						<span className='text-slate-300' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>87 Ideas & Accessories</span>
					</div>
				</Col>
				<Col md={4} className='mb-3'>
					<div
						className='p-4 rounded-16 text-white position-relative d-flex flex-column justify-content-end'
						style={{
							background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%), url("/images/rogally.png") center/cover no-repeat',
							minHeight: '180px',
							borderRadius: '16px',
							border: '1px solid #e2e8f0',
						}}
					>
						<h4 className='text-white mb-0' style={{ fontSize: '1.1rem' }}>Gaming Rig Essentials</h4>
						<span className='text-slate-300' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>155 Ideas & Gear</span>
					</div>
				</Col>
				<Col md={4} className='mb-3'>
					<div
						className='p-4 rounded-16 text-white position-relative d-flex flex-column justify-content-end'
						style={{
							background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%), url("/images/shuresm7b.png") center/cover no-repeat',
							minHeight: '180px',
							borderRadius: '16px',
							border: '1px solid #e2e8f0',
						}}
					>
						<h4 className='text-white mb-0' style={{ fontSize: '1.1rem' }}>Studio Audio & Streaming</h4>
						<span className='text-slate-300' style={{ fontSize: '0.75rem', color: '#94a3b8' }}>96 Studio Essentials</span>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default BentoCollections;

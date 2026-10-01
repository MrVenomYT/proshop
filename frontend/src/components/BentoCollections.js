import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';

const BentoCollections = () => {
	const categoryIcons = [
		{ name: 'Smartphones', query: 'Smartphones', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80', count: '10+ Brands' },
		{ name: 'Laptops', query: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80', count: 'Pro & Gaming' },
		{ name: 'GPUs & CPUs', query: 'Components', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80', count: 'NVIDIA / AMD' },
		{ name: 'Wearables', query: 'Wearables', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=300&q=80', count: 'Watches & VR' },
		{ name: 'Monitors', query: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80', count: 'OLED & 4K' },
		{ name: 'Peripherals', query: 'Keyboards', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=80', count: 'Keyboards & Mice' },
		{ name: 'Audio', query: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', count: 'ANC & Studio' },
	];

	return (
		<div className='my-5'>
			{/* 1. Shop by Category Grid */}
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.4rem' }}>Shop by Department</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>Browse top-tier hardware across all departments</p>
				</div>
				<Link to='/search/all' className='text-danger font-weight-bold' style={{ fontSize: '0.85rem' }}>
					View All <i className='fas fa-arrow-right ml-1'></i>
				</Link>
			</div>

			<Row className='row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-7 g-3 mb-5'>
				{categoryIcons.map((cat) => (
					<Col key={cat.name} className='mb-3'>
						<Link
							to={`/search/${cat.query}`}
							className='d-flex flex-column align-items-center p-3 text-center h-100 rounded-16 text-decoration-none'
							style={{
								background: '#ffffff',
								border: '1px solid #e2e8f0',
								borderRadius: '16px',
								transition: 'all 0.2s ease',
								boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-4px)';
								e.currentTarget.style.borderColor = '#dc2626';
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
									width: '64px',
									height: '64px',
									borderRadius: '12px',
									overflow: 'hidden',
									marginBottom: '8px',
								}}
							>
								<img
									src={cat.image}
									alt={cat.name}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = '/images/sample.png';
									}}
								/>
							</div>
							<span className='font-weight-bold text-dark' style={{ fontSize: '0.88rem' }}>
								{cat.name}
							</span>
							<span className='text-muted' style={{ fontSize: '0.72rem' }}>{cat.count}</span>
						</Link>
					</Col>
				))}
			</Row>

			{/* 2. Featured Collections */}
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div>
					<h2 className='mb-0' style={{ fontSize: '1.4rem' }}>Featured Collections & Workstation Bundles</h2>
					<p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>Curated gear for creators, engineers, and competitive gamers</p>
				</div>
			</div>

			<Row className='g-3 mb-5'>
				{/* Bento 1: Laptops */}
				<Col md={4} sm={12} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 shadow-sm'
						style={{
							backgroundColor: '#0f172a',
							borderRadius: '20px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<div>
							<span className='text-danger font-weight-bold text-uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								PRO COMPUTING
							</span>
							<h3 className='text-white mt-2 mb-2' style={{ fontSize: '1.3rem', fontWeight: '800', wordBreak: 'normal', wordWrap: 'break-word' }}>
								Workstations & Ultrabooks
							</h3>
							<p className='mb-3' style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
								Apple M3 Max, Dell XPS, ThinkPad & ROG Gaming.
							</p>
						</div>

						<div className='d-flex align-items-center justify-content-between mt-3 pt-3 border-top border-slate-800' style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
							<Link to='/search/Laptops' className='btn btn-light btn-sm font-weight-bold px-3' style={{ borderRadius: '8px' }}>
								Explore Laptops &rarr;
							</Link>
							<img
								src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80'
								alt='Workstation Laptop'
								style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
							/>
						</div>
					</Card>
				</Col>

				{/* Bento 2: Studio Audio */}
				<Col md={4} sm={12} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 shadow-sm'
						style={{
							backgroundColor: '#18181b',
							borderRadius: '20px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<div>
							<span className='text-warning font-weight-bold text-uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								STUDIO ACOUSTICS
							</span>
							<h3 className='text-white mt-2 mb-2' style={{ fontSize: '1.3rem', fontWeight: '800', wordBreak: 'normal', wordWrap: 'break-word' }}>
								Hi-Res Audio & Studio Mics
							</h3>
							<p className='mb-3' style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
								Sony, Sennheiser, Shure & Elgato Acoustics.
							</p>
						</div>

						<div className='d-flex align-items-center justify-content-between mt-3 pt-3 border-top' style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
							<Link to='/search/Audio' className='btn btn-warning btn-sm font-weight-bold text-dark px-3' style={{ borderRadius: '8px' }}>
								Shop Studio Gear &rarr;
							</Link>
							<img
								src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'
								alt='Studio Audio'
								style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
							/>
						</div>
					</Card>
				</Col>

				{/* Bento 3: Limited Sale Banner */}
				<Col md={4} sm={12} className='mb-3'>
					<Card
						className='p-4 h-100 text-white border-0 shadow-sm'
						style={{
							backgroundColor: '#1e1b4b',
							borderRadius: '20px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<div>
							<span className='text-danger font-weight-bold text-uppercase' style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
								SEASONAL OFFERS
							</span>
							<h3 className='text-white mt-2 mb-2' style={{ fontSize: '1.3rem', fontWeight: '800', wordBreak: 'normal', wordWrap: 'break-word' }}>
								Up to 40% Off Flagships
							</h3>
							<p className='mb-3' style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
								Smartphones, SSDs & GaN Fast Chargers.
							</p>
						</div>

						<div className='d-flex align-items-center justify-content-between mt-3 pt-3 border-top' style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
							<Link to='/search/sale' className='btn btn-danger btn-sm font-weight-bold px-3' style={{ borderRadius: '8px' }}>
								Shop All Deals &rarr;
							</Link>
							<img
								src='https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=150&q=80'
								alt='Flagship Deal'
								style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BentoCollections;

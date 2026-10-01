import React, { useState, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';

const PromoBanner = () => {
	const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });
	const [copied, setCopied] = useState(false);

	// Countdown Timer Effect
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
				if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
				if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
				return { hours: 12, minutes: 0, seconds: 0 };
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const copyVoucherCode = () => {
		navigator.clipboard.writeText('PROTECH15');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className='position-relative my-4 p-4 p-md-5 overflow-hidden text-white shadow-lg'
			style={{
				backgroundColor: '#0f172a',
				borderRadius: '24px',
				border: '1px solid rgba(255, 255, 255, 0.12)',
			}}
		>
			<Row className='align-items-center position-relative' style={{ zIndex: 2 }}>
				<Col lg={7} className='mb-4 mb-lg-0'>
					<div className='d-flex align-items-center gap-2 mb-2 flex-wrap'>
						<Badge bg='danger' className='p-2 px-3' style={{ borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.05em' }}>
							🔥 FLASH SALE
						</Badge>
						<span className='text-slate-300 font-weight-bold' style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
							ENDS IN:{' '}
							<span className='text-white font-weight-extrabold bg-dark px-2 py-1 rounded' style={{ letterSpacing: '0.05em' }}>
								{String(timeLeft.hours).padStart(2, '0')}H : {String(timeLeft.minutes).padStart(2, '0')}M : {String(timeLeft.seconds).padStart(2, '0')}S
							</span>
						</span>
					</div>

					<h2 className='text-white mb-2' style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.2' }}>
						Up to 25% Off Flagship Laptops & Audio
					</h2>
					<p className='text-slate-300 mb-4' style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '540px' }}>
						Upgrade your workflow with Apple M3 Max MacBooks, Sony WH-1000XM5 ANC Headphones, and NVIDIA RTX 4090 GPUs.
					</p>

					<div className='d-flex align-items-center gap-3 flex-wrap'>
						<div
							onClick={copyVoucherCode}
							className='d-inline-flex align-items-center gap-2 p-2 px-3 bg-dark border border-slate-700 rounded-12'
							style={{ cursor: 'pointer', borderRadius: '12px', border: '1px dashed #ef4444' }}
							title='Click to copy voucher code'
						>
							<span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>USE CODE:</span>
							<strong className='text-danger' style={{ fontSize: '1rem', letterSpacing: '0.08em' }}>PROTECH15</strong>
							<i className={`fas ${copied ? 'fa-check text-success' : 'fa-copy text-slate-400'} ml-1`}></i>
						</div>

						{copied && <span className='text-success font-weight-bold' style={{ fontSize: '0.82rem' }}>Copied to clipboard!</span>}
					</div>
				</Col>

				<Col lg={5} className='text-lg-right'>
					<a href='#catalog-grid' className='btn btn-accent btn-lg font-weight-bold px-4 py-3 shadow' style={{ borderRadius: '12px', fontSize: '1rem' }}>
						Explore Flash Deals &rarr;
					</a>
				</Col>
			</Row>
		</div>
	);
};

export default PromoBanner;

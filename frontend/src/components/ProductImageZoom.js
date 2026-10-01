import React, { useState, useRef } from 'react';

const ProductImageZoom = ({ src, alt }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [transformOrigin, setTransformOrigin] = useState('center center');
	const containerRef = useRef(null);

	const handleMouseMove = (e) => {
		if (!containerRef.current) return;
		const { left, top, width, height } = containerRef.current.getBoundingClientRect();
		const x = ((e.clientX - left) / width) * 100;
		const y = ((e.clientY - top) / height) * 100;

		setTransformOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
	};

	return (
		<div
			ref={containerRef}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={handleMouseMove}
			className='pdp-gallery-container position-relative overflow-hidden'
			style={{
				cursor: 'crosshair',
				borderRadius: '24px',
				background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)',
				border: '1px solid #e2e8f0',
				height: '420px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem',
			}}
		>
			<img
				src={src}
				alt={alt}
				style={{
					maxHeight: '100%',
					maxWidth: '100%',
					objectFit: 'contain',
					filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.12))',
					transform: isHovered ? 'scale(2.2)' : 'scale(1)',
					transformOrigin: transformOrigin,
					transition: isHovered ? 'transform-origin 0.05s ease, transform 0.2s ease-out' : 'transform 0.3s ease',
				}}
				onError={(e) => {
					e.target.onerror = null;
					e.target.src = '/images/sample.png';
				}}
			/>

			{/* Zoom Helper Badge */}
			<div
				className='position-absolute p-1.5 px-3 bg-dark text-white rounded-9999 font-weight-bold d-flex align-items-center gap-1.5'
				style={{
					bottom: '16px',
					right: '16px',
					fontSize: '0.72rem',
					opacity: isHovered ? 0 : 0.85,
					transition: 'opacity 0.2s ease',
					borderRadius: '9999px',
					pointerEvents: 'none',
				}}
			>
				<i className='fas fa-search-plus text-danger mr-1'></i> Hover to Zoom Details
			</div>
		</div>
	);
};

export default ProductImageZoom;

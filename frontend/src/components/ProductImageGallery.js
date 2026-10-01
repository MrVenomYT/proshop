import React, { useState } from 'react';
import ProductImageZoom from './ProductImageZoom';

const ProductImageGallery = ({ product }) => {
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	if (!product) return null;

	// Generate multi-angle views using clean product image sources
	const images = [
		product.image || '/images/sample.png',
		product.image || '/images/sample.png',
		product.image || '/images/sample.png',
	];

	const angleLabels = ['Main View', 'Side Angle', 'Detail Shot'];

	return (
		<div>
			{/* Active Image Zoom Stage */}
			<ProductImageZoom src={images[activeImageIndex]} alt={`${product.name} - View ${activeImageIndex + 1}`} />

			{/* Thumbnail Angle Selector Row */}
			<div className='d-flex align-items-center justify-content-center gap-3 mt-3'>
				{images.map((imgSrc, idx) => {
					const isActive = activeImageIndex === idx;
					return (
						<div
							key={idx}
							onClick={() => setActiveImageIndex(idx)}
							className={`p-2 border transition-all ${isActive ? 'border-danger shadow-sm' : 'border-slate-200 opacity-70'}`}
							style={{
								width: '72px',
								height: '72px',
								borderRadius: '12px',
								cursor: 'pointer',
								background: '#ffffff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderColor: isActive ? '#dc2626' : '#e2e8f0',
							}}
							title={angleLabels[idx]}
						>
							<img
								src={imgSrc}
								alt={`Angle ${idx + 1}`}
								style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/images/sample.png';
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ProductImageGallery;

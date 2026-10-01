import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export const ProductSkeleton = () => {
	return (
		<Card className='h-100 border-0 p-3 shadow-sm' style={{ borderRadius: '20px', background: '#ffffff' }}>
			{/* Image Placeholder */}
			<div
				className='skeleton-pulse mb-3'
				style={{
					height: '180px',
					borderRadius: '16px',
					background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
					backgroundSize: '200% 100%',
					animation: 'skeletonPulse 1.5s infinite',
				}}
			/>

			{/* Kicker Placeholder */}
			<div
				className='skeleton-pulse mb-2'
				style={{
					height: '12px',
					width: '40%',
					borderRadius: '6px',
					background: '#f1f5f9',
				}}
			/>

			{/* Title Placeholder */}
			<div
				className='skeleton-pulse mb-3'
				style={{
					height: '20px',
					width: '85%',
					borderRadius: '6px',
					background: '#f1f5f9',
				}}
			/>

			{/* Price Placeholder */}
			<div className='d-flex align-items-center justify-content-between mt-auto pt-2'>
				<div
					className='skeleton-pulse'
					style={{
						height: '24px',
						width: '35%',
						borderRadius: '6px',
						background: '#f1f5f9',
					}}
				/>
				<div
					className='skeleton-pulse'
					style={{
						height: '36px',
						width: '36px',
						borderRadius: '50%',
						background: '#f1f5f9',
					}}
				/>
			</div>
		</Card>
	);
};

export const ProductGridSkeleton = ({ count = 6 }) => {
	return (
		<Row className='g-3'>
			{[...Array(count)].map((_, idx) => (
				<Col key={idx} sm={12} md={6} lg={4} className='mb-4'>
					<ProductSkeleton />
				</Col>
			))}
		</Row>
	);
};

export default ProductGridSkeleton;

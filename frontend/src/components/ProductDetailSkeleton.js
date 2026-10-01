import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const ProductDetailSkeleton = () => {
	return (
		<Row className='mb-5'>
			<Col lg={7} md={6} className='mb-4 mb-md-0'>
				<div
					style={{
						height: '420px',
						borderRadius: '24px',
						background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
						backgroundSize: '200% 100%',
						animation: 'skeletonPulse 1.5s infinite',
					}}
				/>
			</Col>

			<Col lg={5} md={6}>
				<Card className='p-4 border-0 shadow-sm' style={{ borderRadius: '24px', background: '#ffffff' }}>
					<div className='mb-3' style={{ height: '14px', width: '30%', background: '#f1f5f9', borderRadius: '6px' }} />
					<div className='mb-3' style={{ height: '32px', width: '90%', background: '#f1f5f9', borderRadius: '8px' }} />
					<div className='mb-4' style={{ height: '20px', width: '50%', background: '#f1f5f9', borderRadius: '6px' }} />
					<div className='mb-4' style={{ height: '40px', width: '40%', background: '#f1f5f9', borderRadius: '8px' }} />
					<div className='mb-4' style={{ height: '80px', width: '100%', background: '#f1f5f9', borderRadius: '12px' }} />
					<div style={{ height: '52px', width: '100%', background: '#f1f5f9', borderRadius: '12px' }} />
				</Card>
			</Col>
		</Row>
	);
};

export default ProductDetailSkeleton;

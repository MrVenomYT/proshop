import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const ProductFaqAccordion = () => {
	const [activeKey, setActiveKey] = useState('0');

	const faqs = [
		{
			id: '0',
			question: '🛡️ What is included in the ProShop 2-Year Hardware Warranty?',
			answer:
				'Every hardware item sold on ProShop comes standard with our 2-Year Official Comprehensive Warranty. This covers all internal component defects, screen malfunctions, power supply issues, and manufacturing flaws with zero deductible fees.',
		},
		{
			id: '1',
			question: '🚚 How fast is Express Shipping & what are the delivery times?',
			answer:
				'Orders placed before 2 PM EST ship the same day via FedEx Air / DHL Express. Standard US delivery takes 1-3 business days, while UK, Europe, and UAE orders arrive in 2-4 business days with full real-time tracking.',
		},
		{
			id: '2',
			question: '🔄 What is the 30-Day Return & Money-Back Policy?',
			answer:
				'If you are not 100% satisfied with your tech purchase, you may return it within 30 days of delivery in its original condition for a full refund or direct exchange. We provide pre-paid return shipping labels for all domestic orders.',
		},
		{
			id: '3',
			question: '📦 Are products authentic, factory-sealed, and original?',
			answer:
				'Yes! We source directly from authorized tier-1 brand distributors (Apple, Sony, Samsung, NVIDIA, ASUS, Dell, Logitech, Shure). All shipments arrive factory-sealed in official brand retail packaging with complete original accessories.',
		},
	];

	return (
		<div className='my-5'>
			<div className='d-flex align-items-center gap-2 mb-3'>
				<i className='fas fa-question-circle text-danger fa-lg mr-1'></i>
				<h2 className='mb-0' style={{ fontSize: '1.4rem', fontWeight: '800' }}>
					Frequently Asked Questions
				</h2>
			</div>

			<div className='d-flex flex-column gap-2'>
				{faqs.map((faq) => {
					const isOpen = activeKey === faq.id;
					return (
						<Card
							key={faq.id}
							className='border-0 shadow-sm overflow-hidden mb-2'
							style={{ borderRadius: '12px', background: '#ffffff' }}
						>
							<div
								onClick={() => setActiveKey(isOpen ? null : faq.id)}
								className='p-3.5 d-flex align-items-center justify-content-between font-weight-bold text-dark'
								style={{ cursor: 'pointer', background: isOpen ? '#f8fafc' : '#ffffff', fontSize: '0.95rem' }}
							>
								<span>{faq.question}</span>
								<i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-danger ml-2`}></i>
							</div>
							{isOpen && (
								<div className='p-3 pt-2 text-muted border-top' style={{ fontSize: '0.88rem', lineHeight: '1.6', background: '#f8fafc' }}>
									{faq.answer}
								</div>
							)}
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default ProductFaqAccordion;

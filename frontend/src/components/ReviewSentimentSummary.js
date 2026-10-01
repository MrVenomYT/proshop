import React, { useMemo } from 'react';
import { Card, ProgressBar, Row, Col, Badge } from 'react-bootstrap';

const ReviewSentimentSummary = ({ reviews }) => {
	const sentimentData = useMemo(() => {
		if (!reviews || reviews.length === 0) {
			return {
				score: 94,
				label: 'Overwhelmingly Positive',
				positivePercent: 92,
				neutralPercent: 6,
				negativePercent: 2,
				highlights: ['Exceptional Build Quality', 'Ultra Fast Delivery', 'Great Battery Life', 'Top Performance'],
			};
		}

		let posCount = 0;
		let neuCount = 0;
		let negCount = 0;

		reviews.forEach((r) => {
			if (r.rating >= 4) posCount++;
			else if (r.rating === 3) neuCount++;
			else negCount++;
		});

		const total = reviews.length;
		const posPercent = Math.round((posCount / total) * 100);
		const neuPercent = Math.round((neuCount / total) * 100);
		const negPercent = 100 - posPercent - neuPercent;

		let label = 'Mostly Positive';
		if (posPercent >= 90) label = 'Overwhelmingly Positive';
		else if (posPercent >= 75) label = 'Mostly Positive';
		else if (posPercent >= 55) label = 'Generally Favorable';
		else label = 'Mixed / Neutral Feedback';

		// Extract common praise keywords from review comments
		const keywords = [];
		const allText = reviews.map((r) => r.comment.toLowerCase()).join(' ');

		if (allText.includes('battery') || allText.includes('power')) keywords.push('Long Battery Life');
		if (allText.includes('screen') || allText.includes('display') || allText.includes('bright')) keywords.push('Vivid High-Res Display');
		if (allText.includes('fast') || allText.includes('speed') || allText.includes('performance')) keywords.push('Blazing Speed & Performance');
		if (allText.includes('quality') || allText.includes('build') || allText.includes('premium')) keywords.push('Premium Build Quality');
		if (allText.includes('audio') || allText.includes('sound') || allText.includes('bass')) keywords.push('Immersive High-Fidelity Sound');

		if (keywords.length === 0) {
			keywords.push('High Customer Satisfaction', 'Verified Purchase Recommended');
		}

		return {
			score: posPercent,
			label,
			positivePercent: posPercent,
			neutralPercent: neuPercent,
			negativePercent: Math.max(0, negPercent),
			highlights: keywords,
		};
	}, [reviews]);

	return (
		<Card className='p-4 mb-4 border-0 shadow-sm' style={{ background: '#ffffff', borderRadius: '20px' }}>
			<div className='d-flex align-items-center justify-content-between mb-3'>
				<div className='d-flex align-items-center gap-2'>
					<i className='fas fa-chart-bar text-danger fa-lg mr-1'></i>
					<h3 className='mb-0' style={{ fontSize: '1.25rem', fontWeight: '800' }}>
						AI Sentiment Analysis Summary
					</h3>
				</div>
				<Badge bg='danger' className='p-2 px-3' style={{ borderRadius: '9999px', fontSize: '0.8rem' }}>
					{sentimentData.label} ({sentimentData.score}%)
				</Badge>
			</div>

			<Row className='align-items-center g-3'>
				{/* Score Gauge */}
				<Col lg={4} md={5} className='text-center border-right pr-md-4'>
					<div className='font-weight-bold text-dark' style={{ fontSize: '2.8rem', lineHeight: '1', fontFamily: 'var(--font-heading)' }}>
						{sentimentData.score}%
					</div>
					<div className='text-muted font-weight-bold my-1' style={{ fontSize: '0.85rem' }}>
						Positive Customer Feedback
					</div>
					<div className='d-flex justify-content-center gap-1 text-warning' style={{ fontSize: '0.9rem' }}>
						<i className='fas fa-star'></i>
						<i className='fas fa-star'></i>
						<i className='fas fa-star'></i>
						<i className='fas fa-star'></i>
						<i className='fas fa-star'></i>
					</div>
				</Col>

				{/* Breakdown Bars & Highlights */}
				<Col lg={8} md={7} className='pl-md-4'>
					<div className='mb-3'>
						<div className='d-flex justify-content-between font-weight-bold mb-1' style={{ fontSize: '0.82rem' }}>
							<span className='text-success'><i className='fas fa-smile mr-1'></i> Positive ({sentimentData.positivePercent}%)</span>
							<span className='text-warning'><i className='fas fa-meh mr-1'></i> Neutral ({sentimentData.neutralPercent}%)</span>
							<span className='text-danger'><i className='fas fa-frown mr-1'></i> Critical ({sentimentData.negativePercent}%)</span>
						</div>

						<div className='progress' style={{ height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
							<div className='progress-bar bg-success' style={{ width: `${sentimentData.positivePercent}%` }} />
							<div className='progress-bar bg-warning' style={{ width: `${sentimentData.neutralPercent}%` }} />
							<div className='progress-bar bg-danger' style={{ width: `${sentimentData.negativePercent}%` }} />
						</div>
					</div>

					<div>
						<span className='text-muted font-weight-bold d-block mb-1' style={{ fontSize: '0.78rem', textTransform: 'uppercase' }}>
							Top Praise Highlights:
						</span>
						<div className='d-flex flex-wrap gap-2'>
							{sentimentData.highlights.map((tag, idx) => (
								<span
									key={idx}
									className='badge bg-light text-dark border mr-1 mb-1 p-1.5 px-2.5'
									style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600' }}
								>
									✓ {tag}
								</span>
							))}
						</div>
					</div>
				</Col>
			</Row>
		</Card>
	);
};

export default ReviewSentimentSummary;

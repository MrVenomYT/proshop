import React from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';

const FilterSidebar = ({
	brands,
	selectedBrands,
	onBrandChange,
	priceRange,
	onPriceRangeChange,
	inStockOnly,
	onInStockChange,
	onSaleOnly,
	onSaleChange,
	hotOnly,
	onHotChange,
	minRating,
	onRatingChange,
	onResetFilters,
	activeFiltersCount,
}) => {
	return (
		<Card className='p-4 border-0 mb-4 shadow-sm' style={{ background: '#ffffff', borderRadius: '20px' }}>
			<div className='d-flex align-items-center justify-content-between mb-3 border-bottom pb-2'>
				<div className='d-flex align-items-center gap-2'>
					<i className='fas fa-sliders-h text-danger mr-1'></i>
					<h3 className='mb-0' style={{ fontSize: '1.15rem', fontWeight: '800' }}>Filter Catalog</h3>
				</div>
				{activeFiltersCount > 0 && (
					<Badge bg='danger' className='p-2' style={{ borderRadius: '9999px', fontSize: '0.72rem' }}>
						{activeFiltersCount} Active
					</Badge>
				)}
			</div>

			{/* 1. Price Range Filter */}
			<div className='mb-4'>
				<h4 className='mb-2' style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
					Max Price: ${priceRange}
				</h4>
				<Form.Control
					type='range'
					min='50'
					max='4000'
					step='50'
					value={priceRange}
					onChange={(e) => onPriceRangeChange(Number(e.target.value))}
					className='form-range w-100'
					style={{ accentColor: '#dc2626', cursor: 'pointer' }}
				/>
				<div className='d-flex justify-content-between text-muted mt-1' style={{ fontSize: '0.75rem', fontWeight: '600' }}>
					<span>$50</span>
					<span>$2,000</span>
					<span>$4,000</span>
				</div>
			</div>

			{/* 2. Stock & Promotion Flags Filter */}
			<div className='mb-4 border-top pt-3'>
				<h4 className='mb-2' style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
					Availability & Offers
				</h4>
				<Form.Check
					type='checkbox'
					id='in-stock-filter'
					label='In Stock Items Only'
					checked={inStockOnly}
					onChange={(e) => onInStockChange(e.target.checked)}
					className='mb-2 font-weight-bold text-dark'
					style={{ fontSize: '0.88rem' }}
				/>
				<Form.Check
					type='checkbox'
					id='on-sale-filter'
					label='🏷️ Discounted Deals Only'
					checked={onSaleOnly}
					onChange={(e) => onSaleChange(e.target.checked)}
					className='mb-2 font-weight-bold text-dark'
					style={{ fontSize: '0.88rem' }}
				/>
				<Form.Check
					type='checkbox'
					id='hot-flagship-filter'
					label='🔥 Trending Flagships Only'
					checked={hotOnly}
					onChange={(e) => onHotChange(e.target.checked)}
					className='mb-2 font-weight-bold text-dark'
					style={{ fontSize: '0.88rem' }}
				/>
			</div>

			{/* 3. Rating Stars Filter */}
			<div className='mb-4 border-top pt-3'>
				<h4 className='mb-2' style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
					Customer Rating
				</h4>
				{[
					{ value: 0, label: 'All Ratings' },
					{ value: 4.8, label: '★ 4.8 & Above' },
					{ value: 4.5, label: '★ 4.5 & Above' },
					{ value: 4.0, label: '★ 4.0 & Above' },
				].map((rt) => (
					<Form.Check
						key={rt.value}
						type='radio'
						name='rating-filter'
						id={`rating-${rt.value}`}
						label={rt.label}
						checked={minRating === rt.value}
						onChange={() => onRatingChange(rt.value)}
						className='mb-1 text-muted font-weight-bold'
						style={{ fontSize: '0.85rem' }}
					/>
				))}
			</div>

			{/* 4. Brand Checkboxes Filter */}
			<div className='mb-4 border-top pt-3'>
				<h4 className='mb-2' style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
					Top Hardware Brands
				</h4>
				<div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
					{brands &&
						brands.map((b) => (
							<Form.Check
								key={b}
								type='checkbox'
								id={`brand-${b}`}
								label={b}
								checked={selectedBrands.includes(b)}
								onChange={() => onBrandChange(b)}
								className='mb-1 text-dark'
								style={{ fontSize: '0.85rem', fontWeight: '600' }}
							/>
						))}
				</div>
			</div>

			{/* Clear All Reset Button */}
			<Button
				variant='light'
				onClick={onResetFilters}
				disabled={activeFiltersCount === 0}
				className='w-100 font-weight-bold border'
				style={{ borderRadius: '10px', fontSize: '0.85rem' }}
			>
				<i className='fas fa-undo mr-1'></i> Reset All Filters
			</Button>
		</Card>
	);
};

export default FilterSidebar;

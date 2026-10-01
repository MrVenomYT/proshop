import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const productList = useSelector((state) => state.productList);
	const { products } = productList;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Filter autocomplete suggestions based on keyword
	const suggestions = React.useMemo(() => {
		if (!keyword || keyword.trim().length < 2 || !products) return [];

		const q = keyword.toLowerCase().trim();
		const matchedProducts = products.filter(
			(p) =>
				p.name?.toLowerCase().includes(q) ||
				p.brand?.toLowerCase().includes(q) ||
				p.category?.toLowerCase().includes(q)
		).slice(0, 5);

		return matchedProducts;
	}, [keyword, products]);

	// Extract matching categories
	const categorySuggestions = React.useMemo(() => {
		if (!keyword || keyword.trim().length < 2 || !products) return [];

		const q = keyword.toLowerCase().trim();
		const categories = new Set();
		products.forEach((p) => {
			if (p.category?.toLowerCase().includes(q)) {
				categories.add(p.category);
			}
		});
		return Array.from(categories).slice(0, 3);
	}, [keyword, products]);

	const submitHandler = (e) => {
		e.preventDefault();
		setShowDropdown(false);
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};

	const handleSelectSuggestion = (prod) => {
		setShowDropdown(false);
		setKeyword('');
		history.push(`/product/${prod._id}`);
	};

	const handleSelectCategory = (cat) => {
		setShowDropdown(false);
		setKeyword('');
		history.push(`/search/${cat}`);
	};

	return (
		<div className='position-relative w-100' ref={dropdownRef}>
			<Form onSubmit={submitHandler} className='header-search-form'>
				<i className='fas fa-search header-search-icon'></i>
				<Form.Control
					type='text'
					name='q'
					value={keyword}
					onChange={(e) => {
						setKeyword(e.target.value);
						setShowDropdown(true);
					}}
					onFocus={() => setShowDropdown(true)}
					placeholder='Search products, brands, audio...'
					className='header-search-input'
					autoComplete='off'
				/>
				{keyword && (
					<button
						type='button'
						onClick={() => {
							setKeyword('');
							setShowDropdown(false);
							history.push('/');
						}}
						style={{
							position: 'absolute',
							right: '12px',
							background: 'none',
							border: 'none',
							color: '#94a3b8',
							cursor: 'pointer',
							padding: '4px',
						}}
					>
						<i className='fas fa-times'></i>
					</button>
				)}
			</Form>

			{/* Autocomplete Suggestions Dropdown */}
			{showDropdown && keyword.trim().length >= 2 && (suggestions.length > 0 || categorySuggestions.length > 0) && (
				<div
					className='position-absolute w-100 bg-white border rounded-16 shadow-lg overflow-hidden'
					style={{
						top: '110%',
						left: 0,
						zIndex: 1100,
						borderRadius: '16px',
						maxHeight: '380px',
						overflowY: 'auto',
					}}
				>
					{/* Category Quick Filters */}
					{categorySuggestions.length > 0 && (
						<div className='p-2 bg-light border-bottom' style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>
							DEPARTMENT CATEGORIES
							<div className='d-flex flex-wrap gap-1 mt-1'>
								{categorySuggestions.map((cat) => (
									<button
										key={cat}
										type='button'
										onClick={() => handleSelectCategory(cat)}
										className='btn btn-light btn-sm text-dark font-weight-bold border p-1 px-2'
										style={{ fontSize: '0.72rem', borderRadius: '6px' }}
									>
										<i className='fas fa-tag text-danger mr-1'></i> {cat}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Product Suggestions List */}
					<div className='p-2' style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>
						MATCHING HARDWARE ({suggestions.length})
					</div>
					{suggestions.map((item) => (
						<div
							key={item._id}
							onClick={() => handleSelectSuggestion(item)}
							className='d-flex align-items-center justify-content-between p-2.5 border-bottom px-3 style-item-hover'
							style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
						>
							<div className='d-flex align-items-center gap-2'>
								<img
									src={item.image}
									alt={item.name}
									style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc' }}
								/>
								<div>
									<div className='font-weight-bold text-dark' style={{ fontSize: '0.85rem' }}>{item.name}</div>
									<span className='text-muted' style={{ fontSize: '0.72rem' }}>{item.brand} · {item.category}</span>
								</div>
							</div>
							<div className='font-weight-bold text-danger' style={{ fontSize: '0.9rem' }}>
								${Number(item.price).toFixed(2)}
							</div>
						</div>
					))}

					<div
						onClick={submitHandler}
						className='p-2 text-center bg-light text-primary font-weight-bold'
						style={{ cursor: 'pointer', fontSize: '0.8rem' }}
					>
						See all results for &ldquo;{keyword}&rdquo; &rarr;
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchBox;

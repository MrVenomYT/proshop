import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};

	return (
		<Form onSubmit={submitHandler} className='header-search-form'>
			<i className='fas fa-search header-search-icon'></i>
			<Form.Control
				type='text'
				name='q'
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
				placeholder='Search products, audio, electronics...'
				className='header-search-input'
			/>
			{keyword && (
				<button
					type='button'
					onClick={() => {
						setKeyword('');
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
	);
};

export default SearchBox;

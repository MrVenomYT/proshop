import { useState, useEffect } from 'react';

export const useCompareList = () => {
	const [compareItems, setCompareItems] = useState(() => {
		try {
			const stored = localStorage.getItem('proshop_compare_items');
			return stored ? JSON.parse(stored) : [];
		} catch (err) {
			console.error('Failed to parse compare items from localStorage', err);
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('proshop_compare_items', JSON.stringify(compareItems));
		} catch (err) {
			console.error('Failed to save compare items to localStorage', err);
		}
	}, [compareItems]);

	const toggleCompare = (product) => {
		if (!product || !product._id) return;

		setCompareItems((prev) => {
			const exists = prev.some((item) => item._id === product._id);
			if (exists) {
				return prev.filter((item) => item._id !== product._id);
			} else {
				if (prev.length >= 4) {
					alert('You can compare a maximum of 4 hardware products at once.');
					return prev;
				}
				return [...prev, product];
			}
		});
	};

	const removeFromCompare = (productId) => {
		setCompareItems((prev) => prev.filter((item) => item._id !== productId));
	};

	const clearCompare = () => {
		setCompareItems([]);
	};

	const isCompared = (productId) => {
		return compareItems.some((item) => item._id === productId);
	};

	return {
		compareItems,
		toggleCompare,
		removeFromCompare,
		clearCompare,
		isCompared,
	};
};

export default useCompareList;

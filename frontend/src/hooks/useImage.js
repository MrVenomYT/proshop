import { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = '/images/sample.png';

/**
 * Custom React Hook to handle product image preloading, loading states,
 * and seamless fallback handling to guarantee zero broken images or layout shifts.
 */
export const useImage = (src, fallbackSrc = DEFAULT_FALLBACK) => {
	const [imageState, setImageState] = useState({
		loaded: false,
		error: false,
		currentSrc: src || fallbackSrc,
	});

	useEffect(() => {
		if (!src) {
			setImageState({
				loaded: true,
				error: true,
				currentSrc: fallbackSrc,
			});
			return;
		}

		let isMounted = true;
		const img = new Image();
		img.src = src;

		img.onload = () => {
			if (isMounted) {
				setImageState({
					loaded: true,
					error: false,
					currentSrc: src,
				});
			}
		};

		img.onerror = () => {
			if (isMounted) {
				setImageState({
					loaded: true,
					error: true,
					currentSrc: fallbackSrc,
				});
			}
		};

		return () => {
			isMounted = false;
		};
	}, [src, fallbackSrc]);

	return imageState;
};

export default useImage;

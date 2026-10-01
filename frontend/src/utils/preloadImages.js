/**
 * Global image preloader utility that caches product images in memory
 * to eliminate layout shifts and delay as the user scrolls through catalog pages.
 */
export const preloadProductImages = (products = []) => {
	if (!Array.isArray(products) || products.length === 0) return;

	products.forEach((product) => {
		if (product && product.image) {
			const img = new Image();
			img.src = product.image;
		}
	});
};

export default preloadProductImages;

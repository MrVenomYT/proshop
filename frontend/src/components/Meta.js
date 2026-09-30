import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({
	title = 'ProShop | Curated Hardware & Electronics',
	description = 'Discover cutting-edge consumer hardware, precision audio, and mobile accessories.',
	keywords = 'electronics, audio, headphones, gadgets, pro hardware',
}) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
		</Helmet>
	);
};

export default Meta;

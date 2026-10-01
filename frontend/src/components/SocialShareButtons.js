import React, { useState } from 'react';

const SocialShareButtons = ({ product }) => {
	const [copied, setCopied] = useState(false);

	if (!product) return null;

	const shareUrl = window.location.href;
	const shareTitle = `Check out ${product.name} on ProShop!`;

	const handleCopyLink = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className='d-flex align-items-center gap-2 mt-4 pt-3 border-top' style={{ fontSize: '0.85rem' }}>
			<span className='font-weight-bold text-muted mr-2' style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
				Share Product:
			</span>

			{/* Twitter / X */}
			<a
				href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
				target='_blank'
				rel='noopener noreferrer'
				className='mobistore-icon-btn'
				style={{ width: '36px', height: '36px', fontSize: '0.95rem', color: '#1da1f2' }}
				title='Share on Twitter / X'
			>
				<i className='fab fa-twitter'></i>
			</a>

			{/* Facebook */}
			<a
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
				target='_blank'
				rel='noopener noreferrer'
				className='mobistore-icon-btn'
				style={{ width: '36px', height: '36px', fontSize: '0.95rem', color: '#1877f2' }}
				title='Share on Facebook'
			>
				<i className='fab fa-facebook-f'></i>
			</a>

			{/* Pinterest */}
			<a
				href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(shareTitle)}`}
				target='_blank'
				rel='noopener noreferrer'
				className='mobistore-icon-btn'
				style={{ width: '36px', height: '36px', fontSize: '0.95rem', color: '#e60023' }}
				title='Pin on Pinterest'
			>
				<i className='fab fa-pinterest-p'></i>
			</a>

			{/* WhatsApp */}
			<a
				href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`}
				target='_blank'
				rel='noopener noreferrer'
				className='mobistore-icon-btn'
				style={{ width: '36px', height: '36px', fontSize: '0.95rem', color: '#25d366' }}
				title='Share on WhatsApp'
			>
				<i className='fab fa-whatsapp'></i>
			</a>

			{/* Direct Copy Link Button */}
			<button
				type='button'
				onClick={handleCopyLink}
				className='mobistore-icon-btn'
				style={{ width: '36px', height: '36px', fontSize: '0.95rem', color: copied ? '#10b981' : '#64748b' }}
				title='Copy link to clipboard'
			>
				<i className={`fas ${copied ? 'fa-check' : 'fa-link'}`}></i>
			</button>

			{copied && <span className='text-success font-weight-bold ml-1' style={{ fontSize: '0.78rem' }}>Link copied!</span>}
		</div>
	);
};

export default SocialShareButtons;

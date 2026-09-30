import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDirs = [
	path.resolve('public', 'images'),
	path.resolve('frontend', 'public', 'images'),
	path.resolve('dist', 'images'),
];

for (const dir of outputDirs) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

async function createTransparentPng(filename, svgContent, width = 600, height = 600) {
	const svgBuffer = Buffer.from(svgContent);
	for (const dir of outputDirs) {
		const outPath = path.join(dir, filename);
		try {
			await sharp(svgBuffer, { density: 300 })
				.resize(width, height)
				.png({ compressionLevel: 9, quality: 100 })
				.toFile(outPath);
			console.log(`Saved transparent PNG: ${filename}`);
		} catch (e) {
			console.error(`Error saving ${filename}:`, e.message);
		}
	}
}

const productsToGenerate = [
	{
		filename: 'iphone15pro.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="tiBody" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#475569" />
					<stop offset="50%" stop-color="#334155" />
					<stop offset="100%" stop-color="#1e293b" />
				</linearGradient>
				<linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#020617" />
					<stop offset="100%" stop-color="#0f172a" />
				</linearGradient>
			</defs>
			<rect x="150" y="50" width="200" height="400" rx="36" fill="url(#tiBody)" stroke="#64748b" stroke-width="3" />
			<rect x="158" y="58" width="184" height="384" rx="30" fill="url(#screenGrad)" />
			<rect x="215" y="70" width="70" height="20" rx="10" fill="#000000" />
			<circle cx="265" cy="80" r="4" fill="#1e293b" />
			<circle cx="250" cy="240" r="70" fill="#3b82f6" opacity="0.25" filter="blur(15px)" />
			<text x="250" y="210" fill="#ffffff" font-size="28" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">9:41</text>
			<text x="250" y="235" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif" text-anchor="middle">Wednesday, Sep 30</text>
		</svg>`,
	},
	{
		filename: 's24ultra.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="s24Body" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#1e293b" />
					<stop offset="50%" stop-color="#0f172a" />
					<stop offset="100%" stop-color="#020617" />
				</linearGradient>
			</defs>
			<rect x="145" y="45" width="210" height="410" rx="14" fill="url(#s24Body)" stroke="#475569" stroke-width="3" />
			<rect x="152" y="52" width="196" height="396" rx="10" fill="#050814" />
			<circle cx="250" cy="68" r="5" fill="#000" stroke="#1e293b" stroke-width="1.5" />
			<rect x="380" y="120" width="12" height="260" rx="6" fill="#334155" stroke="#64748b" stroke-width="2" />
			<text x="250" y="240" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">Galaxy AI</text>
			<text x="250" y="265" fill="#38bdf8" font-size="12" font-family="system-ui, sans-serif" text-anchor="middle">S24 Ultra Titanium</text>
		</svg>`,
	},
	{
		filename: 'visionpro.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="vpGlass" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#38bdf8" />
					<stop offset="50%" stop-color="#1e1b4b" />
					<stop offset="100%" stop-color="#0f172a" />
				</linearGradient>
			</defs>
			<!-- Curved Front Glass Visor -->
			<path d="M 100 200 C 100 130 450 130 450 200 C 450 300 100 300 100 200 Z" fill="url(#vpGlass)" stroke="#94a3b8" stroke-width="4" />
			<!-- Solo Knit Band -->
			<path d="M 70 200 C 30 200 30 250 70 250" stroke="#f97316" stroke-width="18" stroke-linecap="round" fill="none" />
			<path d="M 480 200 C 520 200 520 250 480 250" stroke="#f97316" stroke-width="18" stroke-linecap="round" fill="none" />
			<text x="275" y="220" fill="#ffffff" font-size="20" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">visionOS 2</text>
			<text x="275" y="245" fill="#38bdf8" font-size="12" font-family="system-ui, sans-serif" text-anchor="middle">Apple Vision Pro Spatial Computer</text>
		</svg>`,
	},
	{
		filename: 'streamdeck.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="deckBody" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#1e293b" />
					<stop offset="100%" stop-color="#090d16" />
				</linearGradient>
			</defs>
			<rect x="100" y="110" width="300" height="280" rx="20" fill="url(#deckBody)" stroke="#475569" stroke-width="3" />
			<!-- 15 Customizable LCD Key Buttons -->
			<g fill="#020617" stroke="#38bdf8" stroke-width="2">
				<rect x="130" y="140" width="50" height="50" rx="8" />
				<rect x="195" y="140" width="50" height="50" rx="8" />
				<rect x="260" y="140" width="50" height="50" rx="8" />
				<rect x="325" y="140" width="50" height="50" rx="8" />
				<rect x="130" y="205" width="50" height="50" rx="8" />
				<rect x="195" y="205" width="50" height="50" rx="8" fill="#3b82f6" />
				<rect x="260" y="205" width="50" height="50" rx="8" fill="#ef4444" />
				<rect x="325" y="205" width="50" height="50" rx="8" />
				<rect x="130" y="270" width="50" height="50" rx="8" />
				<rect x="195" y="270" width="50" height="50" rx="8" />
				<rect x="260" y="270" width="50" height="50" rx="8" />
				<rect x="325" y="270" width="50" height="50" rx="8" />
			</g>
			<text x="250" y="355" fill="#38bdf8" font-size="14" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">elgato STREAM DECK MK.2</text>
		</svg>`,
	},
	{
		filename: 'shuresm7b.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<!-- Shure SM7B Vocal Mic Silhouette -->
			<rect x="180" y="100" width="140" height="200" rx="20" fill="#1e293b" stroke="#475569" stroke-width="3" />
			<rect x="190" y="70" width="120" height="50" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2" />
			<!-- Yoke Mount -->
			<path d="M 150 180 L 150 280 L 350 280 L 350 180" fill="none" stroke="#64748b" stroke-width="12" stroke-linecap="round" />
			<circle cx="150" cy="180" r="16" fill="#334155" />
			<circle cx="350" cy="180" r="16" fill="#334155" />
			<text x="250" y="200" fill="#ffffff" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">SHURE SM7B</text>
			<text x="250" y="225" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif" text-anchor="middle">Cardioid Dynamic Studio Vocal Mic</text>
		</svg>`,
	},
	{
		filename: 'macbookm3.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="90" y="70" width="370" height="240" rx="16" fill="#0f172a" stroke="#334155" stroke-width="4" />
			<rect x="100" y="80" width="350" height="220" rx="8" fill="#020617" />
			<rect x="255" y="80" width="40" height="10" rx="4" fill="#0f172a" />
			<circle cx="275" cy="190" r="70" fill="#f43f5e" opacity="0.4" />
			<polygon points="50,340 500,340 450,310 100,310" fill="#1e293b" stroke="#475569" stroke-width="2" />
			<rect x="60" y="340" width="430" height="14" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2" />
		</svg>`,
	},
	{
		filename: 'rogally.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="60" y="140" width="430" height="220" rx="40" fill="#ffffff" stroke="#cbd5e1" stroke-width="3" />
			<rect x="160" y="160" width="230" height="175" rx="8" fill="#090d16" stroke="#1e293b" stroke-width="3" />
			<text x="275" y="245" fill="#ec4899" font-size="20" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">ROG ALLY X</text>
		</svg>`,
	},
	{
		filename: 'rtx4090.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="60" y="140" width="430" height="220" rx="20" fill="#0f172a" stroke="#334155" stroke-width="4" />
			<circle cx="140" cy="250" r="55" fill="#020617" stroke="#22c55e" stroke-width="3" />
			<circle cx="275" cy="250" r="55" fill="#020617" stroke="#22c55e" stroke-width="3" />
			<circle cx="410" cy="250" r="55" fill="#020617" stroke="#22c55e" stroke-width="3" />
		</svg>`,
	},
	{
		filename: 'applewatchultra.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="195" y="30" width="110" height="110" rx="15" fill="#f97316" stroke="#ea580c" stroke-width="2" />
			<rect x="160" y="130" width="180" height="240" rx="44" fill="#64748b" stroke="#cbd5e1" stroke-width="4" />
			<rect x="175" y="145" width="150" height="210" rx="30" fill="#020617" />
			<text x="250" y="240" fill="#ffffff" font-size="28" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">10:09</text>
		</svg>`,
	},
	{
		filename: 'samsungg9.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<path d="M 40 180 Q 275 140 510 180 L 490 320 Q 275 280 60 320 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
			<polygon points="255,300 295,300 310,410 240,410" fill="#334155" />
			<text x="275" y="235" fill="#38bdf8" font-size="18" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">ODYSSEY NEO G9</text>
		</svg>`,
	},
	{
		filename: 'mxmaster3s.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<path d="M 220 80 C 300 80 340 160 340 280 C 340 380 290 420 230 420 C 170 420 140 360 140 270 C 140 170 170 80 220 80 Z" fill="#1e293b" stroke="#475569" stroke-width="3" />
			<rect x="235" y="110" width="20" height="60" rx="8" fill="#94a3b8" />
		</svg>`,
	},
	{
		filename: 'sonywh1000xm5.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<path d="M 110 250 C 110 80 390 80 390 250" fill="none" stroke="#334155" stroke-width="24" stroke-linecap="round" />
			<ellipse cx="110" cy="280" rx="45" ry="65" fill="#0f172a" stroke="#475569" stroke-width="3" />
			<ellipse cx="390" cy="280" rx="45" ry="65" fill="#0f172a" stroke="#475569" stroke-width="3" />
		</svg>`,
	},
	{
		filename: 'ankerprime.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="170" y="80" width="160" height="340" rx="28" fill="#1e293b" stroke="#64748b" stroke-width="3" />
			<rect x="190" y="110" width="120" height="110" rx="14" fill="#020617" stroke="#38bdf8" stroke-width="2" />
			<text x="250" y="160" fill="#22c55e" font-size="34" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">98%</text>
		</svg>`,
	},
	{
		filename: 'samsungt9.png',
		svg: `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
			<rect x="120" y="130" width="260" height="240" rx="36" fill="#1e293b" stroke="#475569" stroke-width="4" />
			<text x="250" y="205" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">SAMSUNG T9</text>
		</svg>`,
	},
	{
		filename: 'asusgtbe98.png',
		svg: `<svg viewBox="0 0 550 500" width="550" height="500" xmlns="http://www.w3.org/2000/svg">
			<polygon points="160,200 390,200 460,270 460,370 390,440 160,440 90,370 90,270" fill="#090d16" stroke="#dc2626" stroke-width="4" />
			<text x="275" y="325" fill="#ef4444" font-size="16" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">ROG BE98 Wi-Fi 7</text>
		</svg>`,
	},
];

async function main() {
	for (const p of productsToGenerate) {
		await createTransparentPng(p.filename, p.svg);
	}
	console.log('Updated transparent PNG assets successfully generated!');
}

main();

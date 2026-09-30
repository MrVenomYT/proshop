import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirs = [
  path.resolve('public', 'images'),
  path.resolve('frontend', 'public', 'images'),
];

async function removeBackgroundAndConvertToPng(inputPath, outputPath) {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const outputBuffer = Buffer.from(data);

    // Make white and near-white pixels transparent with smooth falloff
    for (let i = 0; i < outputBuffer.length; i += channels) {
      const r = outputBuffer[i];
      const g = outputBuffer[i + 1];
      const b = outputBuffer[i + 2];

      // Calculate brightness and color difference from white
      const minVal = Math.min(r, g, b);
      const maxVal = Math.max(r, g, b);

      if (minVal > 240) {
        outputBuffer[i + 3] = 0; // Fully transparent
      } else if (minVal > 220 && (maxVal - minVal) < 15) {
        // Smooth anti-aliased edge
        const alphaFactor = (240 - minVal) / 20;
        outputBuffer[i + 3] = Math.round(255 * Math.max(0, Math.min(1, alphaFactor)));
      }
    }

    await sharp(outputBuffer, {
      raw: { width, height, channels },
    })
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function run() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const inputPath = path.join(dir, file);
        const baseName = path.basename(file, path.extname(file));
        const outputPath = path.join(dir, `${baseName}.png`);
        await removeBackgroundAndConvertToPng(inputPath, outputPath);
      }
    }
  }
}

run();

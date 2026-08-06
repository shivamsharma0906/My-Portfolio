import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const publicDir = './public';

async function getImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getImages(res));
    } else if (/\.(png|jpeg|jpg)$/i.test(entry.name)) {
      files.push(res);
    }
  }
  return files;
}

const images = await getImages(publicDir);

for (const input of images) {
  const parsed = path.parse(input);
  const output = path.join(parsed.dir, `${parsed.name}.webp`);

  await sharp(input)
    .webp({ quality: 82 })
    .toFile(output);

  const { size: inSize } = await stat(input);
  const { size: outSize } = await stat(output);
  const relativeInput = path.relative(publicDir, input);
  const relativeOutput = path.relative(publicDir, output);
  console.log(`${relativeInput} → ${relativeOutput}  (${(inSize / 1024).toFixed(1)}KB → ${(outSize / 1024).toFixed(1)}KB)`);
}


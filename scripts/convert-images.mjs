import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const publicDir = './public';

const files = await readdir(publicDir);
const images = files.filter(f => /\.(png|jpeg|jpg)$/i.test(f));

for (const file of images) {
  const input = path.join(publicDir, file);
  const name = path.parse(file).name;
  const output = path.join(publicDir, `${name}.webp`);

  await sharp(input)
    .webp({ quality: 82 })
    .toFile(output);

  const { size: inSize } = await import('fs').then(fs => fs.promises.stat(input));
  const { size: outSize } = await import('fs').then(fs => fs.promises.stat(output));
  console.log(`${file} → ${name}.webp  (${(inSize/1024).toFixed(1)}KB → ${(outSize/1024).toFixed(1)}KB)`);
}

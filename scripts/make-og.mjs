import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputPath = path.resolve("public/og.jpg");
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0F0E0C"/>
  <rect x="104" y="156" width="64" height="5" rx="2.5" fill="#E8A93C"/>
  <circle cx="1096" cy="520" r="8" fill="#E8A93C"/>
  <text
    x="100" y="302"
    fill="#F4F1EA"
    font-family="Arial, Helvetica, sans-serif"
    font-size="108"
    font-weight="700"
    letter-spacing="3"
  >SHAHADAT</text>
  <text
    x="104" y="382"
    fill="#B8B4A8"
    font-family="Arial, Helvetica, sans-serif"
    font-size="32"
    font-weight="400"
  >Web Developer.</text>
  <text
    x="104" y="430"
    fill="#B8B4A8"
    font-family="Arial, Helvetica, sans-serif"
    font-size="32"
    font-weight="400"
  >Modern websites for businesses.</text>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(outputPath);

const { width, height } = await sharp(outputPath).metadata();
const { size } = await stat(outputPath);
console.log(`${outputPath}: ${width}x${height}, ${size} bytes`);

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";
import site from "../src/data/site.js";

const width = 1200;
const height = 630;
const outputPath = path.resolve("public/og.jpg");
const fontsDir = path.resolve("scripts/fonts");
const knotPath = path.resolve("scripts/assets/og-knot.webp");

const spaceGroteskPath = path.join(fontsDir, "space-grotesk-bold-latin.woff");
const interPath = path.join(fontsDir, "inter-regular-latin.woff");
const spaceGrotesk = opentype.parse(await readFile(spaceGroteskPath));
const inter = opentype.parse(await readFile(interPath));

if (spaceGrotesk.names.windows.fullName.en !== "Space Grotesk Bold") {
  throw new Error("The local headline font is not Space Grotesk Bold.");
}
if (inter.names.windows.fontFamily.en !== "Inter") {
  throw new Error("The local body font is not Inter.");
}

function textPath(font, text, x, baseline, fontSize, letterSpacing = 0) {
  const scale = fontSize / font.unitsPerEm;
  const glyphs = Array.from(text, (character) => font.charToGlyph(character));
  let cursor = x;
  let previousGlyph = null;
  const paths = [];

  for (const glyph of glyphs) {
    if (previousGlyph) {
      cursor += font.getKerningValue(previousGlyph.index, glyph.index) * scale;
    }

    if (glyph.path.commands.length > 0) {
      paths.push(glyph.getPath(cursor, baseline, fontSize).toPathData(2));
    }

    cursor += glyph.advanceWidth * scale + letterSpacing;
    previousGlyph = glyph;
  }

  return paths.join(" ");
}

function pathElement(font, text, x, baseline, size, color, spacing = 0) {
  const d = textPath(font, text, x, baseline, size, spacing);
  return `<path fill="${color}" d="${d}"/>`;
}

const domain = new URL(site.canonical).host;
const art = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="88" y="146" width="64" height="5" rx="2.5" fill="#E8A93C"/>
  ${pathElement(spaceGrotesk, "SHAHADAT", 84, 274, 104, "#F4F1EA", 2)}
  ${pathElement(inter, "Web Developer", 88, 350, 40, "#B8B4A8")}
  ${pathElement(inter, "Websites for clinics, restaurants", 88, 407, 34, "#B8B4A8")}
  ${pathElement(inter, "and local shops.", 88, 453, 34, "#B8B4A8")}
  ${pathElement(inter, domain, 88, 574, 23, "#B8B4A8")}
</svg>`;

const { data: knotLuminance, info: knotInfo } = await sharp(knotPath)
  .resize(580, 630, { fit: "cover", position: "attention" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const knotRgba = Buffer.alloc(knotInfo.width * knotInfo.height * 4);
for (let pixel = 0; pixel < knotLuminance.length; pixel += 1) {
  const luminance = knotLuminance[pixel];
  const offset = pixel * 4;
  knotRgba[offset] = 232;
  knotRgba[offset + 1] = 169;
  knotRgba[offset + 2] = 60;
  knotRgba[offset + 3] = Math.round(
    Math.max(0, Math.min(1, (luminance - 8) / 220)) * 255 * 0.3,
  );
}
const knot = await sharp(knotRgba, {
  raw: {
    width: knotInfo.width,
    height: knotInfo.height,
    channels: 4,
  },
})
  .png()
  .toBuffer();

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: "#0F0E0C",
  },
})
  .composite([
    { input: knot, left: 620, top: 0, blend: "over" },
    { input: Buffer.from(art), left: 0, top: 0, blend: "over" },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
const { size } = await stat(outputPath);
if (metadata.width !== width || metadata.height !== height) {
  throw new Error(`Unexpected Open Graph dimensions: ${metadata.width}x${metadata.height}`);
}
if (size >= 200_000) {
  throw new Error(`Open Graph image exceeds 200 KB: ${size} bytes`);
}

console.log(
  `${outputPath}: ${metadata.width}x${metadata.height}, ${size} bytes; fonts: ${spaceGrotesk.names.windows.fullName.en}, ${inter.names.windows.fontFamily.en}`,
);

import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const sourceDir = path.resolve(".asset-originals");
const maxBytes = 200_000;
const heroProjectIds = new Set([
  "smilecraft",
  "premium-jewellery-showroom",
  "ember-spice",
  "aurora-threads",
  "pee-kay",
  "lumiere",
  "aurelia-estates",
]);

async function findCovers(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findCovers(filePath);
      return entry.name === "cover.png" ? [filePath] : [];
    }),
  );
  return files.flat();
}

async function encode(input, maxWidth) {
  const widths = [];
  for (let width = maxWidth; width >= 480; width -= 120) widths.push(width);
  if (widths.at(-1) !== 480) widths.push(480);

  for (const width of widths) {
    for (const quality of [82, 74, 66, 58, 50, 42, 34, 28]) {
      const output = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();
      if (output.byteLength < maxBytes) return output;
    }
  }
  throw new Error(`Could not optimize image below ${maxBytes} bytes`);
}

async function optimize(pngPath, isHeroTexture = false) {
  const relativePath = path.relative(publicDir, pngPath);
  const backupPath = path.join(sourceDir, relativePath);
  await mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await access(backupPath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await copyFile(pngPath, backupPath);
  }

  const image = await readFile(backupPath);
  const regularPath = pngPath.replace(/\.png$/i, ".webp");
  const regularImage = await encode(image, 1600);
  await sharp(regularImage).toFile(regularPath);

  if (isHeroTexture) {
    const heroPath = pngPath.replace(/\.png$/i, "-hero.webp");
    const heroImage = await encode(image, 1024);
    await sharp(heroImage).toFile(heroPath);
    console.log(`${heroPath}: ${heroImage.byteLength} bytes`);
  }

  await unlink(pngPath);
  console.log(`${regularPath}: ${regularImage.byteLength} bytes`);
}

const covers = await findCovers(path.join(publicDir, "images", "projects"));
for (const coverPath of covers) {
  const projectId = path.basename(path.dirname(coverPath));
  await optimize(coverPath, heroProjectIds.has(projectId));
}
await optimize(path.join(publicDir, "images", "shahadat-profile.png"));

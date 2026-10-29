import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import projects from "../src/data/projects.js";

const publicDir = path.resolve("public");
const projectsPath = path.resolve("src/data/projects.js");
let source = await readFile(projectsPath, "utf8");

for (const project of projects) {
  if (!project.image) {
    throw new Error(`Project ${project.id} has no cover image.`);
  }

  const imagePath = path.resolve(publicDir, `.${project.image}`);
  if (!imagePath.startsWith(`${publicDir}${path.sep}`)) {
    throw new Error(`Project ${project.id} image is outside public/.`);
  }

  const { width, height } = await sharp(imagePath).metadata();
  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${project.id}: ${imagePath}`);
  }

  const marker = `id: "${project.id}"`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Could not find project ${project.id}.`);
  const blockStart = source.lastIndexOf("\n  {", markerIndex) + 1;
  const nextBlock = source.indexOf("\n  {", markerIndex + marker.length);
  const blockEnd = nextBlock < 0 ? source.indexOf("\n];", markerIndex) : nextBlock;
  if (blockStart < 1 || blockEnd < 0) {
    throw new Error(`Could not isolate project data for ${project.id}.`);
  }

  let block = source
    .slice(blockStart, blockEnd)
    .replace(/^[ \t]*imageWidth:\s*\d+,\r?\n/gm, "")
    .replace(/^[ \t]*imageHeight:\s*\d+,\r?\n/gm, "");
  const imageLine = /^([ \t]*)image:\s*"([^"]+)"[,]?[ \t]*$/m;
  let replaced = false;
  block = block.replace(imageLine, (_line, indent, image) => {
    if (image !== project.image) {
      throw new Error(`Project ${project.id} image path changed during generation.`);
    }
    replaced = true;
    return `${indent}image: "${image}",\n${indent}imageWidth: ${width},\n${indent}imageHeight: ${height},`;
  });
  if (!replaced) throw new Error(`Could not find image property for ${project.id}.`);

  source = `${source.slice(0, blockStart)}${block}${source.slice(blockEnd)}`;
  console.log(`${project.id}: ${width}x${height}`);
}

await writeFile(projectsPath, source);

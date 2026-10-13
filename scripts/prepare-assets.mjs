import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Rebuild optimised web assets from the original generated studio photograph.
// Usage: node scripts/prepare-assets.mjs <absolute-path-to-source.png>
const source = process.argv[2];
if (!source) throw new Error("Pass the original studio image path.");
await mkdir("public/images", { recursive: true });
const tasks = [
  ["hero.webp", (image) => image.resize({ width: 1805 }).webp({ quality: 85 })],
  [
    "hero-mobile.webp",
    (image) => image.resize({ width: 800 }).webp({ quality: 80 }),
  ],
  [
    "mechanical.webp",
    (image) =>
      image
        .extract({ left: 969, top: 336, width: 448, height: 430 })
        .resize(800, 750)
        .webp({ quality: 86 }),
  ],
  [
    "detailing.webp",
    (image) =>
      image
        .extract({ left: 510, top: 270, width: 798, height: 570 })
        .resize(1200, 900, { fit: "cover" })
        .webp({ quality: 85 }),
  ],
  [
    "exterior.webp",
    (image) =>
      image
        .extract({ left: 410, top: 292, width: 780, height: 540 })
        .resize(1200, 900, { fit: "cover" })
        .webp({ quality: 84 }),
  ],
  [
    "share.webp",
    (image) =>
      image
        .resize(1200, 630, { fit: "cover", position: "right" })
        .webp({ quality: 85 }),
  ],
];
for (const [name, transform] of tasks) {
  const result = await transform(sharp(source)).toFile(`public/images/${name}`);
  console.log(`${name}: ${Math.round(result.size / 1024)} KB`);
}
const aliases = [
  ["hero.webp", "scene-wide.webp"],
  ["hero-mobile.webp", "scene-wide-mobile.webp"],
  ["mechanical.webp", "scene-wheel.webp"],
  ["detailing.webp", "scene-detail.webp"],
  ["exterior.webp", "scene-exterior.webp"],
];
for (const [src, dest] of aliases) {
  await sharp(`public/images/${src}`).toFile(`public/images/${dest}`);
  console.log(`Aliased ${src} -> ${dest}`);
}

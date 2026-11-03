// Genera las variantes optimizadas de las imágenes del sitio (requiere ffmpeg/ffprobe en el PATH).
// No forma parte del build de Vercel: se ejecuta a mano con `npm run images` y los archivos se versionan.
//
//  - WebP a tamaño completo y a 640 px de ancho para <picture srcset> (el JPG queda como URL canónica).
//  - Recortes 16:9, 4:3 y 1:1 de cada foto de cóctel, que Google recomienda para los resultados de receta.
//  - src/data/image-meta.json con dimensiones y variantes, que consume el componente <Picture>.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const imagesDir = resolve(root, "public/images");
const SMALL_WIDTH = 640;

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${r.stderr}`);
  return r.stdout.trim();
};

const probe = (file) => {
  const [w, h] = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file])
    .split(",")
    .map(Number);
  return { w, h };
};

const webp = (input, output, width) =>
  run("ffmpeg", ["-v", "error", "-y", "-i", input, ...(width ? ["-vf", `scale=${width}:-2:flags=lanczos`] : []), "-c:v", "libwebp", "-quality", "78", "-compression_level", "6", output]);

// Fotos del sitio. Las OG y el póster del video se sirven tal cual; las de la presentación anterior ya no se usan.
const skip = new Set([
  "bagpiper-og.jpg",
  "bagpiper-herbal-og.jpg",
  "bagpiper-gin-og.jpg",
  "bagpiper-hero-poster.jpg",
  "bagpiper-cellar.jpg",
  "bagpiper-darkness.jpg",
  "bagpiper-sunset.jpg",
  "bagpiper-product-og.jpg",
]);
const sources = readdirSync(imagesDir).filter((f) => /^bagpiper-.*\.jpg$/.test(f) && !skip.has(f));

const meta = {};
for (const file of sources) {
  const input = resolve(imagesDir, file);
  const base = file.replace(/\.jpg$/, "");
  const { w, h } = probe(input);
  const variants = [];

  webp(input, resolve(imagesDir, `${base}.webp`));
  variants.push({ src: `/images/${base}.webp`, w });

  if (w > SMALL_WIDTH + 120) {
    webp(input, resolve(imagesDir, `${base}-${SMALL_WIDTH}.webp`), SMALL_WIDTH);
    variants.unshift({ src: `/images/${base}-${SMALL_WIDTH}.webp`, w: SMALL_WIDTH });
  }

  meta[`/images/${file}`] = { w, h, webp: variants };
  console.log(`webp: ${file} ${w}x${h} → ${variants.map((v) => v.w).join(", ")}`);
}

// Recortes para el schema Recipe. `focus` es la posición horizontal (0–1) del vaso en la foto.
const recipeCrops = [
  { slug: "herbal-orange", file: "bagpiper-herbal-ritual.jpg", focus: 0.3 },
  { slug: "dark-piper-tonic", file: "bagpiper-herbal-tonic.jpg", focus: 0.5 },
  { slug: "piper-classic-tonic", file: "bagpiper-gin-classic-limon.jpg", focus: 0.55 },
  { slug: "black-pink-berry-tonic", file: "bagpiper-gin-black-pink-verano.jpg", focus: 0.6 },
];
const ratios = [
  { name: "16x9", rw: 16, rh: 9 },
  { name: "4x3", rw: 4, rh: 3 },
  { name: "1x1", rw: 1, rh: 1 },
];

mkdirSync(resolve(imagesDir, "recetas"), { recursive: true });
const recipeImages = {};
for (const { slug, file, focus } of recipeCrops) {
  const input = resolve(imagesDir, file);
  if (!existsSync(input)) throw new Error(`Falta ${file}`);
  const { w, h } = probe(input);
  recipeImages[slug] = [];
  for (const { name, rw, rh } of ratios) {
    // Recorte máximo con la proporción pedida, centrado en `focus` horizontalmente.
    let cw = w;
    let ch = Math.round((w * rh) / rw);
    if (ch > h) {
      ch = h;
      cw = Math.round((h * rw) / rh);
    }
    const x = Math.min(Math.max(Math.round(w * focus - cw / 2), 0), w - cw);
    const y = Math.round((h - ch) / 2);
    const out = `recetas/${slug}-${name}.jpg`;
    run("ffmpeg", ["-v", "error", "-y", "-i", input, "-vf", `crop=${cw}:${ch}:${x}:${y}`, "-q:v", "3", resolve(imagesDir, out)]);
    recipeImages[slug].push({ src: `/images/${out}`, w: cw, h: ch });
  }
  console.log(`receta: ${slug} → ${recipeImages[slug].map((i) => `${i.w}x${i.h}`).join(", ")}`);
}

writeFileSync(resolve(root, "src/data/image-meta.json"), JSON.stringify({ images: meta, recipes: recipeImages }, null, 2) + "\n");
console.log("src/data/image-meta.json actualizado");

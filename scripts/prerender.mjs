// Prerender estático: inyecta en cada HTML de dist/ el markup de React y el <head> SEO de su página,
// y genera dist/sitemap.xml a partir de las mismas páginas.
// Se ejecuta después de `vite build` (cliente) y `vite build --ssr src/entry-server.tsx` (servidor).
// Las recetas (/cocteles/<id>) no tienen HTML propio en Vite: se generan desde la plantilla de cocteles.html.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const { render, renderHead, renderSitemap, cocktailIds } = await import(
  pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const APP_MARK = "<!--app-html-->";

const readTemplate = async (file) => {
  const html = await readFile(resolve(dist, file), "utf8");
  if (!SEO_BLOCK.test(html) || !html.includes(APP_MARK)) {
    throw new Error(`${file}: faltan los marcadores <!--seo:start-->/<!--seo:end--> o ${APP_MARK}`);
  }
  return html;
};

const sitemapEntries = [];

const build = async (file, template, page, cocktailId) => {
  const appHtml = render(page, cocktailId);
  const html = template.replace(SEO_BLOCK, () => renderHead(page, cocktailId)).replace(APP_MARK, () => appHtml);
  const target = resolve(dist, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
  sitemapEntries.push({ page, cocktailId, html: appHtml });
  console.log(`prerender: ${file} ${(html.length / 1024).toFixed(1)} KB`);
};

// Se lee antes de sobrescribir cocteles.html, porque también es la plantilla de las recetas.
const cocktailTemplate = await readTemplate("cocteles.html");

for (const [file, page] of [
  ["index.html", "home"],
  ["herbal.html", "herbal"],
  ["gin.html", "gin"],
  ["cocteles.html", "cocteles"],
]) {
  await build(file, await readTemplate(file), page);
}

for (const id of cocktailIds) {
  const template = cocktailTemplate.replace('data-page="cocteles"', `data-page="cocktail" data-cocktail="${id}"`);
  if (!template.includes(`data-cocktail="${id}"`)) throw new Error('cocteles.html: no se encontró data-page="cocteles"');
  await build(`cocteles/${id}.html`, template, "cocktail", id);
}

await writeFile(resolve(dist, "sitemap.xml"), renderSitemap(sitemapEntries));
console.log(`prerender: sitemap.xml (${sitemapEntries.length} URLs)`);

await rm(resolve(root, "dist-ssr"), { recursive: true, force: true });

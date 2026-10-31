// Prerender estático: inyecta en cada HTML de dist/ el markup de React y el <head> SEO de su página.
// Se ejecuta después de `vite build` (cliente) y `vite build --ssr src/entry-server.tsx` (servidor).
import { readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const { render, renderHead } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);

const pages = [
  ["index.html", "home"],
  ["herbal.html", "herbal"],
  ["gin.html", "gin"],
];

for (const [file, page] of pages) {
  const target = resolve(root, "dist", file);
  const template = await readFile(target, "utf8");

  const seoBlock = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
  if (!seoBlock.test(template) || !template.includes("<!--app-html-->")) {
    throw new Error(`${file}: faltan los marcadores <!--seo:start-->/<!--seo:end--> o <!--app-html-->`);
  }

  const html = template.replace(seoBlock, () => renderHead(page)).replace("<!--app-html-->", () => render(page));
  await writeFile(target, html);
  console.log(`prerender: ${file} (${page}) ${(html.length / 1024).toFixed(1)} KB`);
}

await rm(resolve(root, "dist-ssr"), { recursive: true, force: true });

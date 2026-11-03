// Metadatos y datos estructurados por página. Se generan en el prerender a partir de content.ts,
// así el JSON-LD siempre describe exactamente lo que la página muestra.
import { BRAND_STATEMENT, cocktails, expressions, faqs, type Cocktail, type Page } from "./data/content";
import { HERO_IMAGE_SIZES } from "./data/lcp";
import imageMeta from "./data/image-meta.json";

// Dominio canónico: el que Vercel sirve como principal (bagpiper.site redirige a www).
export const SITE = "https://www.bagpiper.site";

/** Fecha de la última actualización real del contenido (lastmod del sitemap). Actualizar al cambiar textos o fotos. */
export const CONTENT_UPDATED = "2026-11-02";

type ImageVariants = { w: number; h: number; webp: { src: string; w: number }[] };
const IMAGES = imageMeta.images as Record<string, ImageVariants>;
const RECIPE_IMAGES = imageMeta.recipes as Record<string, { src: string; w: number; h: number }[]>;

type PageMeta = {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogImage: { src: string; w: number; h: number };
  ogImageAlt: string;
  /** Ruta de migas después de "Inicio" (la última es la página actual). */
  trail: { name: string; path: string }[];
  /** Imagen LCP a precargar: JPG (póster del video) o foto con variantes WebP. */
  preload?: { src: string; sizes?: string };
};

const OG = (src: string, w = 1200, h = 630) => ({ src, w, h });

const STATIC_PAGES: Record<Exclude<Page, "cocktail">, PageMeta> = {
  home: {
    path: "/",
    title: "Bagpiper Sitio Oficial | Herbal Liqueur & London Dry Gin",
    description:
      "Sitio oficial de Bagpiper: licores herbales y gines de alta calidad de Lamoille, Nevada (USA). Herbal Liqueur 35% y London Dry Gin Classic y Black Pink 40%.",
    ogTitle: "Bagpiper | Herbal Liqueur & London Dry Gin · Lamoille, Nevada",
    ogImage: OG("/images/bagpiper-og.jpg"),
    ogImageAlt: "Bagpiper Herbal Liqueur y London Dry Gin",
    trail: [],
    preload: { src: "/images/bagpiper-hero-poster.jpg" },
  },
  herbal: {
    path: "/herbal",
    title: "Bagpiper Herbal Liqueur | Licor Herbal · Sitio Oficial",
    description:
      "Bagpiper Herbal Liqueur: licor herbal de hierbas, raíces y especias de Lamoille, Nevada. 35% vol., 750 ml, nueva presentación. Serve cold y cócteles.",
    ogTitle: "Bagpiper Herbal Liqueur — Licor herbal de Lamoille, Nevada",
    ogImage: OG("/images/bagpiper-herbal-og.jpg"),
    ogImageAlt: "Botella de Bagpiper Herbal Liqueur, nueva presentación",
    trail: [{ name: "Bagpiper Herbal Liqueur", path: "/herbal" }],
    preload: { src: "/images/bagpiper-herbal-packshot.jpg", sizes: HERO_IMAGE_SIZES.herbal },
  },
  gin: {
    path: "/gin",
    title: "Bagpiper Gin | London Dry Gin Classic & Black Pink · Oficial",
    description:
      "Bagpiper London Dry Gin: vapour infused, 100% grano, 40% vol. Versiones Classic y Black Pink con frutos del bosque. Desarrollado en Lamoille, Nevada.",
    ogTitle: "Bagpiper London Dry Gin — Classic & Black Pink",
    ogImage: OG("/images/bagpiper-gin-og.jpg"),
    ogImageAlt: "Bagpiper London Dry Gin Classic y Black Pink",
    trail: [{ name: "Bagpiper London Dry Gin", path: "/gin" }],
    preload: { src: "/images/bagpiper-gin-classic-london-dry.jpg", sizes: HERO_IMAGE_SIZES.gin },
  },
  cocteles: {
    path: "/cocteles",
    title: "Cócteles con Bagpiper | Recetas de Gin Tonic y Licor Herbal",
    description:
      "Recetas oficiales con Bagpiper: gin tonic con London Dry Gin Classic y Black Pink, y cócteles con el licor herbal. Ingredientes, medidas y pasos.",
    ogTitle: "Cócteles con Bagpiper — Recetas de la casa",
    ogImage: OG(RECIPE_IMAGES["piper-classic-tonic"][0].src, RECIPE_IMAGES["piper-classic-tonic"][0].w, RECIPE_IMAGES["piper-classic-tonic"][0].h),
    ogImageAlt: "Gin tonic con Bagpiper London Dry Gin Classic",
    trail: [{ name: "Cócteles", path: "/cocteles" }],
    preload: { src: cocktails[0].image, sizes: HERO_IMAGE_SIZES.cocteles },
  },
};

// Nombre corto de la botella para títulos de receta ("Receta con Bagpiper Gin Classic").
const SHORT_EXPRESSION: Record<string, string> = {
  herbal: "Bagpiper Herbal",
  classic: "Bagpiper Gin Classic",
  "black-pink": "Bagpiper Gin Black Pink",
};

const cocktailMeta = (c: Cocktail): PageMeta => {
  const [wide] = RECIPE_IMAGES[c.id];
  return {
    path: `/cocteles/${c.id}`,
    title: `${c.name} — Receta con ${SHORT_EXPRESSION[c.expressionId]}`,
    description: `Receta de ${c.name} con ${c.expression}: ${c.tagline.charAt(0).toLowerCase()}${c.tagline.slice(1)} Ingredientes y pasos en ${c.minutes} min.`,
    ogTitle: `${c.name} · Cóctel con ${c.expression}`,
    ogImage: OG(wide.src, wide.w, wide.h),
    ogImageAlt: c.imageAlt,
    trail: [
      { name: "Cócteles", path: "/cocteles" },
      { name: c.name, path: `/cocteles/${c.id}` },
    ],
    preload: { src: c.image, sizes: HERO_IMAGE_SIZES.cocktail },
  };
};

export const pageMeta = (page: Page, cocktailId?: string): PageMeta => {
  if (page !== "cocktail") return STATIC_PAGES[page];
  const c = cocktails.find((x) => x.id === cocktailId);
  if (!c) throw new Error(`Receta desconocida: ${cocktailId}`);
  return cocktailMeta(c);
};

/** Rutas de todas las recetas, para el prerender y el sitemap. */
export const cocktailIds = cocktails.map((c) => c.id);

const abs = (path: string) => `${SITE}${path}`;
const urlOf = (path: string) => (path === "/" ? `${SITE}/` : abs(path));

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ORG_ID = `${SITE}/#organization`;
const BRAND_ID = `${SITE}/#brand`;
const WEBSITE_ID = `${SITE}/#website`;

// Créditos que Google Imágenes muestra en el panel de la imagen.
const imageCredits = {
  creator: { "@id": ORG_ID },
  creditText: "Bagpiper",
  copyrightNotice: "© Bagpiper · Smith & Johnson & Co.",
};

const imageObject = (src: string, caption: string, id?: string) => {
  const size = IMAGES[src];
  return {
    "@type": "ImageObject",
    ...(id ? { "@id": id } : {}),
    url: abs(src),
    contentUrl: abs(src),
    caption,
    ...(size ? { width: size.w, height: size.h } : {}),
    ...imageCredits,
  };
};

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Bagpiper",
  legalName: "Smith & Johnson & Co.",
  alternateName: ["Bagpiper Gin", "Bagpiper Herbal Liqueur", "Bagpiper Herbal", "The Dark Piper"],
  url: `${SITE}/`,
  logo: { "@type": "ImageObject", "@id": `${SITE}/#logo`, url: abs("/images/bagpiper-logo.png"), width: 512, height: 512, caption: "Bagpiper" },
  image: { "@id": `${SITE}/#logo` },
  description: `${BRAND_STATEMENT} Fundada en 2018 por Smith & Johnson & Co. y reintroducida internacionalmente en 2024.`,
  foundingDate: "2018",
  foundingLocation: {
    "@type": "Place",
    name: "Lamoille, Nevada, United States",
    address: { "@type": "PostalAddress", addressLocality: "Lamoille", addressRegion: "NV", addressCountry: "US" },
  },
  brand: { "@id": BRAND_ID },
};

const brand = {
  "@type": "Brand",
  "@id": BRAND_ID,
  name: "Bagpiper",
  slogan: "Licores herbales y gines de alta calidad",
  logo: { "@id": `${SITE}/#logo` },
  url: `${SITE}/`,
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: "Bagpiper",
  alternateName: ["Bagpiper Sitio Oficial", "bagpiper.site"],
  inLanguage: "es",
  publisher: { "@id": ORG_ID },
};

const EXPRESSION_NAMES: Record<string, string> = {
  herbal: "Bagpiper Herbal Liqueur",
  classic: "Bagpiper London Dry Gin Classic",
  "black-pink": "Bagpiper London Dry Gin Black Pink",
};

const expressionThing = (id: string) => {
  const e = expressions.find((x) => x.id === id)!;
  const url = urlOf(e.family === "herbal" ? "/herbal" : "/gin");
  return {
    "@type": "Thing",
    "@id": `${url}#${e.id}`,
    name: EXPRESSION_NAMES[e.id],
    description: e.description,
    image: imageObject(e.image, e.imageAlt),
    url,
    brand: { "@id": BRAND_ID },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Graduación alcohólica", value: e.abv },
      { "@type": "PropertyValue", name: "Volumen", value: e.volume },
      { "@type": "PropertyValue", name: "Servicio", value: e.serve },
    ],
  };
};

const recipe = (c: Cocktail) => {
  const url = urlOf(`/cocteles/${c.id}`);
  return {
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: c.name,
    description: c.intro,
    // Google recomienda la foto en 16:9, 4:3 y 1:1 para los resultados enriquecidos de receta.
    image: RECIPE_IMAGES[c.id].map((img) => abs(img.src)),
    author: { "@id": ORG_ID },
    datePublished: "2026-10-31",
    recipeCategory: "Cóctel",
    recipeCuisine: "Coctelería",
    keywords: `Bagpiper, ${c.expression}, ${c.name}, cóctel, ${c.expressionId === "herbal" ? "licor herbal" : "gin tonic"}`,
    recipeYield: "1 trago",
    prepTime: `PT${c.minutes}M`,
    totalTime: `PT${c.minutes}M`,
    recipeIngredient: c.ingredients,
    recipeInstructions: [
      ...c.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text, url: `${url}#receta` })),
    ],
    tool: [{ "@type": "HowToTool", name: c.glass }],
    isPartOf: { "@id": `${urlOf("/cocteles")}#recetas` },
    mainEntityOfPage: { "@id": `${url}#webpage` },
  };
};

const faqPage = (page: Page, url: string) => {
  const items = faqs.filter((f) => f.pages.includes(page));
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
};

const breadcrumbList = (meta: PageMeta, url: string) =>
  meta.trail.length
    ? {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
          ...meta.trail.map((step, i) => ({ "@type": "ListItem", position: i + 2, name: step.name, item: urlOf(step.path) })),
        ],
      }
    : null;

const webPage = (meta: PageMeta, url: string, type: string, extra: Record<string, unknown> = {}) => ({
  "@type": type,
  "@id": `${url}#webpage`,
  url,
  name: meta.title,
  description: meta.description,
  isPartOf: { "@id": WEBSITE_ID },
  publisher: { "@id": ORG_ID },
  inLanguage: "es",
  primaryImageOfPage: { "@id": `${url}#primaryimage` },
  ...(meta.trail.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  ...extra,
});

export function buildJsonLd(page: Page, cocktailId?: string) {
  const meta = pageMeta(page, cocktailId);
  const url = urlOf(meta.path);
  const primaryImage = imageObject(meta.ogImage.src, meta.ogImageAlt, `${url}#primaryimage`);
  const graph: (Record<string, unknown> | null)[] = [organization, brand, website, primaryImage, breadcrumbList(meta, url)];

  if (page === "home") {
    graph.push(
      webPage(meta, url, "WebPage", { about: { "@id": BRAND_ID } }),
      {
        "@type": "ItemList",
        "@id": `${SITE}/#expresiones`,
        name: "Expresiones Bagpiper",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Bagpiper Herbal Liqueur", url: urlOf("/herbal") },
          { "@type": "ListItem", position: 2, name: "Bagpiper London Dry Gin", url: urlOf("/gin") },
          { "@type": "ListItem", position: 3, name: "Cócteles con Bagpiper", url: urlOf("/cocteles") },
        ],
      },
      {
        "@type": "VideoObject",
        "@id": `${SITE}/#reel`,
        name: "Bagpiper — Herbal Liqueur & London Dry Gin",
        description:
          "Reel oficial de Bagpiper: Herbal Liqueur en su nueva presentación y London Dry Gin en versiones Classic y Black Pink. Desarrollado en Lamoille, Nevada.",
        thumbnailUrl: abs("/images/bagpiper-hero-poster.jpg"),
        contentUrl: abs("/images/bagpiper-reel.mp4"),
        uploadDate: "2026-10-31",
        duration: "PT20S",
        publisher: { "@id": ORG_ID },
      }
    );
  } else if (page === "herbal" || page === "gin") {
    const ids = page === "herbal" ? ["herbal"] : ["classic", "black-pink"];
    graph.push(webPage(meta, url, "WebPage", { about: ids.map((id) => ({ "@id": `${url}#${id}` })) }), ...ids.map(expressionThing));
  } else if (page === "cocteles") {
    // Página resumen: lista de recetas con URL propia (patrón de carrusel de recetas de Google).
    graph.push(webPage(meta, url, "CollectionPage", { mainEntity: { "@id": `${url}#recetas` } }), {
      "@type": "ItemList",
      "@id": `${url}#recetas`,
      name: "Cócteles con Bagpiper",
      itemListElement: cocktails.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: urlOf(`/cocteles/${c.id}`) })),
    });
  } else {
    const c = cocktails.find((x) => x.id === cocktailId)!;
    graph.push(webPage(meta, url, "WebPage", { mainEntity: { "@id": `${url}#recipe` } }), recipe(c));
  }

  graph.push(faqPage(page, url));
  return { "@context": "https://schema.org", "@graph": graph.filter(Boolean) };
}

/**
 * sitemap.xml con todas las páginas y, por cada una, las imágenes que muestra (extraídas del HTML prerenderizado).
 * Google solo usa <image:loc> del namespace de imágenes; título y caption están deprecados.
 */
export function renderSitemap(entries: { page: Page; cocktailId?: string; html: string }[]) {
  const urls = entries.map(({ page, cocktailId, html }) => {
    const meta = pageMeta(page, cocktailId);
    const images = new Set<string>([meta.ogImage.src]);
    for (const [, src] of html.matchAll(/<img[^>]+src="(\/images\/[^"]+\.(?:jpg|png))"/g)) images.add(src);
    if (page === "cocktail" && cocktailId) RECIPE_IMAGES[cocktailId].forEach((img) => images.add(img.src));

    const video =
      page === "home"
        ? `
    <video:video>
      <video:thumbnail_loc>${abs("/images/bagpiper-hero-poster.jpg")}</video:thumbnail_loc>
      <video:title>Bagpiper — Herbal Liqueur &amp; London Dry Gin</video:title>
      <video:description>Reel oficial de Bagpiper: Herbal Liqueur en su nueva presentación y London Dry Gin Classic y Black Pink.</video:description>
      <video:content_loc>${abs("/images/bagpiper-reel.mp4")}</video:content_loc>
      <video:duration>20</video:duration>
      <video:family_friendly>no</video:family_friendly>
    </video:video>`
        : "";

    return `  <url>
    <loc>${urlOf(meta.path)}</loc>
    <lastmod>${CONTENT_UPDATED}</lastmod>
${[...images].map((src) => `    <image:image><image:loc>${abs(src)}</image:loc></image:image>`).join("\n")}${video}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>
`;
}

const preloadTag = (preload: PageMeta["preload"]) => {
  if (!preload) return "";
  const variants = IMAGES[preload.src]?.webp;
  if (variants && preload.sizes) {
    const srcset = variants.map((v) => `${v.src} ${v.w}w`).join(", ");
    return `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset}" imagesizes="${escapeAttr(preload.sizes)}" fetchpriority="high" />`;
  }
  return `<link rel="preload" as="image" href="${preload.src}" fetchpriority="high" />`;
};

/** Bloque de <head> específico de cada página (reemplaza el marcador seo del template). */
export function renderHead(page: Page, cocktailId?: string) {
  const meta = pageMeta(page, cocktailId);
  const url = urlOf(meta.path);
  const image = abs(meta.ogImage.src);
  const json = JSON.stringify(buildJsonLd(page, cocktailId)).replace(/</g, "\\u003c");
  return [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    preloadTag(meta.preload),
    `<meta property="og:type" content="${page === "cocktail" ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="Bagpiper" />`,
    `<meta property="og:locale" content="es_PE" />`,
    `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${meta.ogImage.w}" />`,
    `<meta property="og:image:height" content="${meta.ogImage.h}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    `<script type="application/ld+json">${json}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

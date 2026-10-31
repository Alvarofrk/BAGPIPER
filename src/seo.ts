// Metadatos y datos estructurados por página. Se generan en el prerender a partir de content.ts,
// así el JSON-LD siempre describe exactamente lo que la página muestra.
import { BRAND_STATEMENT, cocktails, expressions, faqs, type Page } from "./data/content";

// Dominio canónico: el que Vercel sirve como principal (bagpiper.site redirige a www).
export const SITE = "https://www.bagpiper.site";

type PageMeta = {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogImage: string;
  ogImageAlt: string;
  breadcrumb?: string;
};

export const PAGES: Record<Page, PageMeta> = {
  home: {
    path: "/",
    title: "Bagpiper Sitio Oficial | Herbal Liqueur & London Dry Gin",
    description:
      "Sitio oficial de Bagpiper: licores herbales y gines de alta calidad de Lamoille, Nevada (USA). Herbal Liqueur 35% y London Dry Gin Classic y Black Pink 40%.",
    ogTitle: "Bagpiper | Herbal Liqueur & London Dry Gin · Lamoille, Nevada",
    ogImage: "/images/bagpiper-og.jpg",
    ogImageAlt: "Bagpiper Herbal Liqueur y London Dry Gin",
  },
  herbal: {
    path: "/herbal",
    title: "Bagpiper Herbal Liqueur | Licor Herbal · Sitio Oficial",
    description:
      "Bagpiper Herbal Liqueur: licor herbal de hierbas, raíces y especias de Lamoille, Nevada. 35% vol., 750 ml, nueva presentación. Serve cold y cócteles.",
    ogTitle: "Bagpiper Herbal Liqueur — Licor herbal de Lamoille, Nevada",
    ogImage: "/images/bagpiper-herbal-og.jpg",
    ogImageAlt: "Botella de Bagpiper Herbal Liqueur, nueva presentación",
    breadcrumb: "Bagpiper Herbal Liqueur",
  },
  gin: {
    path: "/gin",
    title: "Bagpiper Gin | London Dry Gin Classic & Black Pink · Oficial",
    description:
      "Bagpiper London Dry Gin: vapour infused, 100% grano, 40% vol. Versiones Classic y Black Pink con frutos del bosque. Desarrollado en Lamoille, Nevada.",
    ogTitle: "Bagpiper London Dry Gin — Classic & Black Pink",
    ogImage: "/images/bagpiper-gin-og.jpg",
    ogImageAlt: "Bagpiper London Dry Gin Classic y Black Pink",
    breadcrumb: "Bagpiper London Dry Gin",
  },
};

const abs = (path: string) => `${SITE}${path}`;
const pageUrl = (page: Page) => abs(PAGES[page].path === "/" ? "/" : PAGES[page].path);

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ORG_ID = `${SITE}/#organization`;
const BRAND_ID = `${SITE}/#brand`;
const WEBSITE_ID = `${SITE}/#website`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Bagpiper",
  legalName: "Smith & Johnson & Co.",
  alternateName: ["Bagpiper Gin", "Bagpiper Herbal Liqueur", "The Dark Piper"],
  url: `${SITE}/`,
  logo: { "@type": "ImageObject", url: abs("/images/bagpiper-logo.png"), width: 512, height: 512 },
  image: abs("/images/bagpiper-og.jpg"),
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
  logo: abs("/images/bagpiper-logo.png"),
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
  const page: Page = e.family === "herbal" ? "herbal" : "gin";
  return {
    "@type": "Thing",
    "@id": `${pageUrl(page)}#${e.id}`,
    name: EXPRESSION_NAMES[e.id],
    description: e.description,
    image: abs(e.image),
    url: pageUrl(page),
    brand: { "@id": BRAND_ID },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Graduación alcohólica", value: e.abv },
      { "@type": "PropertyValue", name: "Volumen", value: e.volume },
      { "@type": "PropertyValue", name: "Servicio", value: e.serve },
    ],
  };
};

const recipe = (c: (typeof cocktails)[number], page: Page) => ({
  "@type": "Recipe",
  "@id": `${pageUrl(page)}#${c.id}`,
  name: c.name,
  description: `${c.tagline} Con ${c.expression}.`,
  image: abs(c.image),
  author: { "@id": ORG_ID },
  datePublished: "2026-10-31",
  recipeCategory: "Cóctel",
  recipeCuisine: "Coctelería",
  keywords: `Bagpiper, ${c.expression}, ${c.name}, cóctel`,
  recipeYield: "1 trago",
  totalTime: "PT3M",
  recipeIngredient: c.ingredients,
  recipeInstructions: c.steps.map((text) => ({ "@type": "HowToStep", text })),
});

const faqPage = (page: Page) => ({
  "@type": "FAQPage",
  "@id": `${pageUrl(page)}#faq`,
  mainEntity: faqs
    .filter((f) => f.pages.includes(page))
    .map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const webPage = (page: Page, extra: Record<string, unknown> = {}) => {
  const meta = PAGES[page];
  const node: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${pageUrl(page)}#webpage`,
    url: pageUrl(page),
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "es",
    primaryImageOfPage: { "@type": "ImageObject", url: abs(meta.ogImage) },
    ...extra,
  };
  if (meta.breadcrumb) node.breadcrumb = { "@id": `${pageUrl(page)}#breadcrumb` };
  return node;
};

const breadcrumbList = (page: Page) => ({
  "@type": "BreadcrumbList",
  "@id": `${pageUrl(page)}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name: PAGES[page].breadcrumb, item: pageUrl(page) },
  ],
});

export function buildJsonLd(page: Page) {
  const base = [organization, brand, website];

  if (page === "home") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        ...base,
        webPage("home", { about: { "@id": BRAND_ID } }),
        {
          "@type": "ItemList",
          "@id": `${SITE}/#expresiones`,
          name: "Expresiones Bagpiper",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Bagpiper Herbal Liqueur", url: pageUrl("herbal") },
            { "@type": "ListItem", position: 2, name: "Bagpiper London Dry Gin", url: pageUrl("gin") },
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
        },
        faqPage("home"),
      ],
    };
  }

  const ids = page === "herbal" ? ["herbal"] : ["classic", "black-pink"];
  const pageCocktails = cocktails.filter((c) => (page === "herbal" ? c.expressionId === "herbal" : c.expressionId !== "herbal"));

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...base,
      webPage(page, { about: ids.map((id) => ({ "@id": `${pageUrl(page)}#${id}` })) }),
      breadcrumbList(page),
      ...ids.map(expressionThing),
      ...pageCocktails.map((c) => recipe(c, page)),
      faqPage(page),
    ],
  };
}

/** Bloque de <head> específico de cada página (reemplaza el marcador seo del template). */
export function renderHead(page: Page) {
  const meta = PAGES[page];
  const url = pageUrl(page);
  const image = abs(meta.ogImage);
  const json = JSON.stringify(buildJsonLd(page)).replace(/</g, "\\u003c");
  return [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Bagpiper" />`,
    `<meta property="og:locale" content="es_PE" />`,
    `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    `<script type="application/ld+json">${json}</script>`,
  ].join("\n    ");
}

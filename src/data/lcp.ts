// Imagen principal (LCP) de cada página. La usan App (atributo `sizes` del <Picture>) y seo.ts (<link rel="preload">):
// si los `sizes` no coinciden, el navegador descarga la imagen dos veces.
export const HERO_IMAGE_SIZES = {
  herbal: "(min-width: 960px) 40vw, 100vw",
  gin: "(min-width: 960px) 22vw, 50vw",
  cocteles: "(min-width: 960px) 22vw, 50vw",
  cocktail: "(min-width: 960px) 45vw, 100vw",
} as const;

import type { ImgHTMLAttributes } from "react";
import imageMeta from "../data/image-meta.json";

type ImageMeta = { w: number; h: number; webp: { src: string; w: number }[] };
const images = imageMeta.images as Record<string, ImageMeta>;

/** srcset WebP generado por `npm run images`, o undefined si la imagen no tiene variantes. */
export const webpSrcSet = (src: string) => images[src]?.webp.map((v) => `${v.src} ${v.w}w`).join(", ");

export const imageSize = (src: string) => images[src];

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  /** Ancho mostrado, para que el navegador elija la variante WebP adecuada. */
  sizes?: string;
};

/**
 * <picture> con WebP responsivo y el JPG como <img> de respaldo. El JPG es la URL canónica que indexa
 * Google Imágenes (la misma del sitemap y del schema). `picture { display: contents }` en el CSS hace que el
 * <img> siga siendo el hijo directo del layout, así los estilos existentes no cambian.
 */
export default function Picture({ src, alt, sizes = "100vw", width, height, ...rest }: Props) {
  const meta = images[src];
  const srcSet = webpSrcSet(src);
  return (
    <picture>
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      <img src={src} alt={alt} width={width ?? meta?.w} height={height ?? meta?.h} decoding="async" {...rest} />
    </picture>
  );
}

import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  BRAND_STATEMENT,
  botanicals,
  darkPiperSymbols,
  expressions,
  faqs,
  ginHighlights,
  ginProfile,
  herbalHighlights,
  herbalProfile,
  cocktails,
  marqueeItems,
  navLinks,
  regions,
  stats,
  timeline,
  type Page,
} from "./data/content";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Picture, { imageSize, webpSrcSet } from "./components/Picture";
import { HERO_IMAGE_SIZES } from "./data/lcp";

const HERBAL_PACKSHOT_IMG = "/images/bagpiper-herbal-packshot.jpg";
const HERBAL_VERTICAL_IMG = "/images/bagpiper-herbal-vertical.jpg";
const HERBAL_RITUAL_IMG = "/images/bagpiper-herbal-ritual.jpg";
const HERBAL_PARTY_IMG = "/images/bagpiper-herbal-party.jpg";
const HERBAL_LASERS_IMG = "/images/bagpiper-herbal-lasers.jpg";
const HERBAL_BAR_IMG = "/images/bagpiper-herbal-bar.jpg";
const NIGHTCLUB_IMG = "/images/bagpiper-nightclub.jpg";
const CLUB_IMG = "/images/bagpiper-club.jpg";
const HERO_POSTER = "/images/bagpiper-hero-poster.jpg";
const HERO_VIDEO = "/images/bagpiper-reel.mp4";

const GIN = {
  classicBar: "/images/bagpiper-gin-classic-bar.jpg",
  classicLondonDry: "/images/bagpiper-gin-classic-london-dry.jpg",
  classicTonic: "/images/bagpiper-gin-classic-gin-tonic.jpg",
  classicLemon: "/images/bagpiper-gin-classic-limon.jpg",
  pinkGlass: "/images/bagpiper-gin-black-pink-copa.jpg",
  pinkBerries: "/images/bagpiper-gin-black-pink-fruta-del-bosque.jpg",
  pinkSummer: "/images/bagpiper-gin-black-pink-verano.jpg",
  pinkGarden: "/images/bagpiper-gin-black-pink-jardin.jpg",
};

// Tramos del reel del hero (segundos). El fundido herbal→gin ocurre entre 9.2 y 10.0.
const REEL_CHAPTERS = [
  { id: "herbal", label: "Herbal Liqueur", sub: "Expresión Herbal", start: 0, seekTo: 0, end: 9.6 },
  { id: "gin", label: "London Dry Gin", sub: "Classic · Black Pink", start: 9.6, seekTo: 10, end: 20.25 },
];

const EXPRESSION_ACCENTS: Record<string, string> = {
  herbal: "#c4a36a",
  classic: "#8fb3e0",
  "black-pink": "#e0789a",
};

const moodSlides = [
  { src: GIN.classicBar, label: "London Dry · Classic" },
  { src: HERBAL_RITUAL_IMG, label: "Herbal Liqueur" },
  { src: GIN.pinkGlass, label: "London Dry · Black Pink" },
];

type FilmItem = { src: string; label: string; alt: string };

// Cinta de galería: dos filas que corren en sentido contrario, alternando herbal y gin.
const filmRows: FilmItem[][] = [
  [
    { src: NIGHTCLUB_IMG, label: "Herbal · Night Sessions", alt: "Bagpiper Herbal Liqueur nueva presentación sobre barra de discoteca con luces violetas" },
    { src: GIN.classicBar, label: "Classic Gin · Bar", alt: "Bagpiper London Dry Gin Classic con copa de gin tonic en un bar" },
    { src: HERBAL_PARTY_IMG, label: "Herbal · Dance Floor", alt: "Bagpiper Herbal Liqueur y trago con naranja en una fiesta" },
    { src: GIN.pinkGarden, label: "Black Pink · Garden", alt: "Bagpiper London Dry Gin Black Pink con frutos del bosque en jardín" },
    { src: HERBAL_LASERS_IMG, label: "Herbal · Lasers", alt: "Botella de Bagpiper Herbal Liqueur bajo luces láser violetas" },
    { src: GIN.classicTonic, label: "Classic · Gin Tonic", alt: "Bagpiper London Dry Gin Classic y copa balón con hielo" },
  ],
  [
    { src: GIN.pinkSummer, label: "Black Pink · Summer", alt: "Bagpiper Black Pink gin rosado con copa de frutos rojos sobre mármol" },
    { src: CLUB_IMG, label: "Herbal · Party", alt: "Botella de Bagpiper Herbal Liqueur en la barra de una fiesta" },
    { src: GIN.classicLemon, label: "Classic · Lemon", alt: "Gin tonic de Bagpiper Classic con piel de limón" },
    { src: HERBAL_BAR_IMG, label: "Herbal · Bar", alt: "Bagpiper Herbal Liqueur sobre la barra de una discoteca" },
    { src: GIN.pinkGlass, label: "Black Pink · Night", alt: "Bagpiper London Dry Gin Black Pink servido en copa con moras y frambuesas" },
    { src: HERBAL_RITUAL_IMG, label: "Herbal · Orange", alt: "Bagpiper Herbal Liqueur con trago corto de naranja" },
  ],
];

const ginFilmRow: FilmItem[] = [
  { src: GIN.classicBar, label: "Classic · Bar", alt: "Bagpiper London Dry Gin Classic con gin tonic en un bar" },
  { src: GIN.pinkGarden, label: "Black Pink · Garden", alt: "Bagpiper Black Pink gin con frutos del bosque en un jardín" },
  { src: GIN.classicTonic, label: "Classic · Gin Tonic", alt: "Bagpiper Classic gin con copa balón y hielo" },
  { src: GIN.pinkSummer, label: "Black Pink · Summer", alt: "Bagpiper Black Pink gin rosado sobre mármol con frutos rojos" },
  { src: GIN.classicLemon, label: "Classic · Lemon", alt: "Gin tonic Bagpiper Classic con piel de limón" },
  { src: GIN.pinkGlass, label: "Black Pink · Night", alt: "Bagpiper Black Pink gin servido con moras y frambuesas" },
];

const accentStyle = (id: string) => ({ "--expr": EXPRESSION_ACCENTS[id] }) as CSSProperties;

// React 18 solo emite el atributo en minúsculas; con `fetchPriority` avisa y no lo escribe en el HTML prerenderizado.
const HIGH_PRIORITY = { fetchpriority: "high" } as Record<string, string>;

// Retraso escalonado para las animaciones CSS de entrada (no dependen de JS: el texto del hero se pinta sin hidratar).
const revealDelay = (i: number) => ({ animationDelay: `${0.1 * i}s` }) as CSSProperties;

// Anchos mostrados por tipo de bloque, para que el navegador elija la variante WebP de 640 px en móvil.
const SIZES = {
  half: "(min-width: 900px) 50vw, 100vw",
  third: "(min-width: 980px) 33vw, (min-width: 640px) 50vw, 100vw",
  quarter: "(min-width: 1200px) 25vw, (min-width: 640px) 50vw, 100vw",
  mosaic: "(min-width: 900px) 30vw, 50vw",
  film: "(min-width: 900px) 28vw, 70vw",
};

function ParallaxImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  const size = imageSize(src);
  const srcSet = webpSrcSet(src);
  return (
    <div ref={ref} className={`parallax ${className ?? ""}`}>
      <picture>
        {srcSet && <source type="image/webp" srcSet={srcSet} sizes={SIZES.half} />}
        <motion.img src={src} alt={alt} width={size?.w} height={size?.h} style={{ y }} loading="lazy" decoding="async" />
      </picture>
    </div>
  );
}

function FilmStrip({ rows }: { rows: FilmItem[][] }) {
  return (
    <div className="film-strip">
      {rows.map((row, r) => (
        <div key={r} className={`film-row ${r % 2 ? "film-row--reverse" : ""}`}>
          {/* La fila se duplica para que el desplazamiento sea continuo; la copia queda oculta a lectores de pantalla. */}
          {[...row, ...row].map((item, i) => (
            <figure key={`${item.src}-${i}`} className="film-item" aria-hidden={i >= row.length}>
              <Picture src={item.src} alt={i >= row.length ? "" : item.alt} loading="lazy" sizes={SIZES.film} />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}

function App({ page, cocktailId }: { page: Page; cocktailId?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Arranca en null también en el cliente para que la hidratación coincida con el HTML prerenderizado;
  // el script inline del <head> oculta el aviso por CSS si la edad ya se confirmó en esta sesión.
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const inView = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" },
    variants: staggerContainer,
  } as const;

  const videoRef = useRef<HTMLVideoElement>(null);
  const reelFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [reelChapter, setReelChapter] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const [fichaId, setFichaId] = useState<string | null>(null);

  const ficha = expressions.find((e) => e.id === fichaId) ?? null;
  const ginExpressions = expressions.filter((e) => e.family === "gin");
  const pageFaqs = faqs.filter((f) => f.pages.includes(page));

  useEffect(() => {
    try {
      if (sessionStorage.getItem("bagpiper_age_ok") === "true") setAgeVerified(true);
    } catch {
      // Almacenamiento bloqueado: se muestra el aviso de edad.
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || ficha ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, ficha]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || page !== "home") return;
    const id = window.setInterval(() => {
      setMoodIndex((i) => (i + 1) % moodSlides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduceMotion, page]);

  useEffect(() => {
    const hero = videoRef.current;

    if (!hero || ageVerified !== true || reduceMotion) {
      hero?.pause();
      return;
    }

    if (!hero.src) hero.src = HERO_VIDEO;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hero.play().catch(() => {});
        } else {
          hero.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(hero);

    // El progreso se escribe directo en el DOM en cada frame; solo el cambio de capítulo pasa por React.
    let frame = 0;
    const tick = () => {
      const t = hero.currentTime;
      const active = REEL_CHAPTERS.findIndex((c) => t >= c.start && t < c.end);
      REEL_CHAPTERS.forEach((c, i) => {
        const fill = reelFillRefs.current[i];
        if (!fill) return;
        const p = i < active ? 1 : i > active ? 0 : (t - c.start) / (c.end - c.start);
        fill.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      });
      setReelChapter((prev) => (active === -1 || active === prev ? prev : active));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ageVerified, reduceMotion]);

  const seekReel = (index: number) => {
    const hero = videoRef.current;
    if (!hero || !hero.src) return;
    hero.currentTime = REEL_CHAPTERS[index].seekTo;
    setReelChapter(index);
    hero.play().catch(() => {});
  };

  const handleAgeAccept = () => {
    try {
      sessionStorage.setItem("bagpiper_age_ok", "true");
    } catch {
      // Sin almacenamiento la confirmación dura solo esta vista.
    }
    document.documentElement.dataset.ageOk = "1";
    setAgeVerified(true);
  };

  const handleAgeDecline = () => {
    setAgeVerified(false);
  };

  const openFicha = (id: string) => {
    setFichaId(id);
    if (window.location.hash !== `#ficha-${id}`) {
      window.history.pushState(null, "", `#ficha-${id}`);
    }
  };

  const closeFicha = () => {
    setFichaId(null);
    if (window.location.hash.startsWith("#ficha")) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash;
      if (hash === "#ficha") return "herbal";
      const id = hash.startsWith("#ficha-") ? hash.slice("#ficha-".length) : null;
      return id && expressions.some((e) => e.id === id) ? id : null;
    };
    setFichaId(fromHash());
    const onHash = () => setFichaId(fromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!ficha) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFicha();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ficha]);

  const cocktail = page === "cocktail" ? cocktails.find((c) => c.id === cocktailId) : undefined;
  const currentPath = page === "home" ? "/" : page === "cocktail" ? `/cocteles/${cocktailId}` : `/${page}`;
  // "Cócteles" queda activo también dentro de /cocteles/<receta>.
  const isCurrent = (href: string) => href === currentPath || (href !== "/" && currentPath.startsWith(`${href}/`));
  const expressionPage = (expressionId: string) => (expressionId === "herbal" ? "/herbal" : "/gin");

  /* ---------- Bloques compartidos ---------- */

  const sectionHeader = (eyebrow: string, title: ReactNode, desc?: ReactNode, center = true) => (
    <motion.div variants={fadeUp} className={`section-header ${center ? "section-header-center" : ""}`}>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
    </motion.div>
  );

  const cocktailsSection = (
    filter: (c: (typeof cocktails)[number]) => boolean,
    eyebrow: string,
    title: ReactNode,
    desc: ReactNode,
    { compact = false, sectionId = "cocteles" }: { compact?: boolean; sectionId?: string } = {}
  ) => {
    const list = cocktails.filter(filter);
    const gridClass = list.length === 2 ? "cocktail-grid--duo" : list.length === 3 ? "cocktail-grid--trio" : "";
    return (
      <motion.section id={sectionId} className="section" {...inView}>
        <div className="container">
          {sectionHeader(eyebrow, title, desc)}
          <div className={`cocktail-grid ${gridClass}`}>
            {list.map((c) => (
              <motion.article variants={fadeUp} key={c.id} className="cocktail-card" style={accentStyle(c.expressionId)}>
                <a href={`/cocteles/${c.id}`} className="cocktail-media" tabIndex={-1} aria-hidden="true">
                  <Picture
                    src={c.image}
                    alt=""
                    width={c.imageWidth}
                    height={c.imageHeight}
                    loading="lazy"
                    sizes={SIZES.quarter}
                    style={c.imagePosition ? { objectPosition: c.imagePosition } : undefined}
                  />
                  <span className="cocktail-glass">{c.glass}</span>
                </a>
                <div className="cocktail-body">
                  <span className="cocktail-expression">{c.expression}</span>
                  <h3 className="cocktail-name">
                    <a href={`/cocteles/${c.id}`}>{c.name}</a>
                  </h3>
                  <p className="cocktail-tagline">{c.tagline}</p>
                  {!compact && (
                    <>
                      <ul className="cocktail-ingredients">
                        {c.ingredients.map((ing) => (
                          <li key={ing}>{ing}</li>
                        ))}
                      </ul>
                      <ol className="cocktail-steps">
                        {c.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  <a href={`/cocteles/${c.id}`} className="cocktail-more">
                    Receta de {c.name}
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  const faqSection = (title: ReactNode, desc: ReactNode) => (
    <motion.section id="faq" className="section" {...inView}>
      <div className="container">
        {sectionHeader("Preguntas frecuentes", title, desc)}
        <div className="faq-list">
          {pageFaqs.map((item) => (
            <motion.div variants={fadeUp} key={item.q}>
              <details className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const profileSection = (
    id: string,
    eyebrow: string,
    title: ReactNode,
    desc: ReactNode,
    items: { title: string; label: string; text: string }[],
    accentId: string
  ) => (
    <motion.section id={id} className="section" {...inView}>
      <div className="container">
        {sectionHeader(eyebrow, title, desc)}
        <div className="profile-grid" style={accentStyle(accentId)}>
          {items.map((item, i) => (
            <motion.article variants={fadeUp} key={item.title} className="profile-card">
              <span className="profile-num">0{i + 1}</span>
              <span className="profile-label">{item.label}</span>
              <h3 className="profile-title">{item.title}</h3>
              <p className="profile-text">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const crossLink = (to: "herbal" | "gin") =>
    to === "gin" ? (
      <section className="section crosslink" aria-label="Descubre Bagpiper London Dry Gin">
        <div className="container">
          <a href="/gin" className="split-panel split-panel--gin crosslink-panel" style={accentStyle("black-pink")}>
            <ParallaxImg src={GIN.pinkGlass} alt="Bagpiper London Dry Gin Black Pink servido en copa balón" />
            <span className="split-panel-shade" aria-hidden="true" />
            <span className="split-panel-content">
              <span className="split-panel-tag">Descubre también · Expresión Gin</span>
              <span className="split-panel-title">Bagpiper London Dry Gin</span>
              <span className="split-panel-line">Classic &amp; Black Pink. Seco, fresco y botánico.</span>
              <span className="split-panel-cta">Ver Bagpiper Gin</span>
            </span>
          </a>
        </div>
      </section>
    ) : (
      <section className="section crosslink" aria-label="Descubre Bagpiper Herbal Liqueur">
        <div className="container">
          <a href="/herbal" className="split-panel crosslink-panel" style={accentStyle("herbal")}>
            <ParallaxImg src={NIGHTCLUB_IMG} alt="Bagpiper Herbal Liqueur en la barra de una discoteca" />
            <span className="split-panel-shade" aria-hidden="true" />
            <span className="split-panel-content">
              <span className="split-panel-tag">Descubre también · Expresión Herbal</span>
              <span className="split-panel-title">Bagpiper Herbal Liqueur</span>
              <span className="split-panel-line">La receta original. Oscuro, herbal y bien frío.</span>
              <span className="split-panel-cta">Ver Bagpiper Herbal</span>
            </span>
          </a>
        </div>
      </section>
    );

  // Ruta visible; coincide con el BreadcrumbList del schema (src/seo.ts).
  const breadcrumb = (...trail: { label: string; href?: string }[]) => (
    <nav className="breadcrumb hero-reveal" aria-label="Ruta de navegación">
      <a href="/">Inicio</a>
      {trail.map((item) => (
        <span key={item.label} className="breadcrumb-step">
          <span aria-hidden="true">/</span>
          {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );

  // Las dos expresiones lado a lado, enlazando a sus páginas (cierre de /cocteles y de cada receta).
  const productDuo = (
    <section className="split-band split-band--compact" aria-labelledby="duo-title">
      <motion.div className="container split-band-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
        <span className="section-eyebrow">Las botellas</span>
        <h2 id="duo-title" className="section-title">
          HERBAL BAGPIPER <span className="accent">&amp; GIN BAGPIPER</span>
        </h2>
      </motion.div>
      <div className="split-band-panels">
        <a href="/herbal" className="split-panel" style={accentStyle("herbal")}>
          <ParallaxImg src={NIGHTCLUB_IMG} alt="Bagpiper Herbal Liqueur en la barra de una discoteca" />
          <span className="split-panel-shade" aria-hidden="true" />
          <span className="split-panel-content">
            <span className="split-panel-tag">Expresión Herbal · 35% Vol.</span>
            <span className="split-panel-title">Herbal Liqueur</span>
            <span className="split-panel-cta">Ver Bagpiper Herbal</span>
          </span>
        </a>
        <a href="/gin" className="split-panel split-panel--gin" style={accentStyle("black-pink")}>
          <ParallaxImg src={GIN.pinkGlass} alt="Bagpiper London Dry Gin Black Pink servido en copa balón" />
          <span className="split-panel-shade" aria-hidden="true" />
          <span className="split-panel-content">
            <span className="split-panel-tag">Expresión Gin · 40% Vol.</span>
            <span className="split-panel-title">London Dry Gin</span>
            <span className="split-panel-cta">Ver Bagpiper Gin</span>
          </span>
        </a>
      </div>
    </section>
  );

  const specChips = (items: string[]) => (
    <div className="product-hero-specs hero-reveal" style={revealDelay(3)}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );

  /* ---------- Portada ---------- */

  const homeContent = (
    <>
      <section className="container" id="top">
        <div className="hero-bento">
          <div className="bento-card bento-card-main hero-reveal">
            <video
              ref={videoRef}
              className="bg-video"
              muted
              loop
              playsInline
              preload="none"
              poster={HERO_POSTER}
              aria-hidden="true"
            />
            <div className="overlay" />
            <div className="content">
              <span className="section-eyebrow">Lamoille, Nevada · USA · Smith &amp; Johnson &amp; Co.</span>
              <h1 className="hero-title">
                BAGPIPER <span className="accent hero-title-sub">HERBAL LIQUEUR &amp; LONDON DRY GIN</span>
              </h1>
              <p className="section-desc">
                {BRAND_STATEMENT} Dos expresiones, una misma leyenda: la receta herbal original y un London Dry Gin en
                versiones Classic y Black Pink.
              </p>
              <div className="hero-actions">
                <a href="#elige" className="btn btn-primary">
                  Ver las expresiones
                </a>
                <a href="#contacto" className="btn btn-outline">
                  Distribución
                </a>
              </div>
            </div>
            <div className="reel-nav" aria-label="Capítulos del video">
              {REEL_CHAPTERS.map((chapter, i) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={`reel-chapter reel-chapter--${chapter.id} ${reelChapter === i ? "is-active" : ""}`}
                  onClick={() => seekReel(i)}
                  aria-pressed={reelChapter === i}
                >
                  <span className="reel-chapter-num">0{i + 1}</span>
                  <span className="reel-chapter-text">
                    <strong>{chapter.label}</strong>
                    <span>{chapter.sub}</span>
                  </span>
                  <span className="reel-chapter-bar" aria-hidden="true">
                    <span
                      ref={(el) => {
                        reelFillRefs.current[i] = el;
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bento-side-cards">
            <div className="bento-card bento-card-stat bento-card-mini-video hero-reveal" style={revealDelay(1)}>
              <div className="mood-rotator" aria-hidden="true">
                {moodSlides.map((slide, i) => (
                  <Picture key={slide.src} src={slide.src} alt="" className={`mood-slide ${moodIndex === i ? "is-active" : ""}`} />
                ))}
              </div>
              <div className="side-video-overlay" />
              <div className="stat-content">
                <div className="stat-label">The Dark Piper</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={moodIndex}
                    className="stat-val stat-val-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {moodSlides[moodIndex].label}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="bento-card bento-card-stat hero-reveal" style={revealDelay(2)}>
              <div className="stat-content stat-content-stack">
                {stats.map((stat) => (
                  <div key={stat.value} className="stat-row">
                    <div className="stat-label">{stat.title}</div>
                    <div className="stat-val">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#expresiones"
              className="bento-card bento-card-stat bento-card-label hero-reveal"
              style={revealDelay(3)}
              aria-label="Ver las expresiones de Bagpiper"
            >
              <div className="spec-label">
                <p className="spec-label-eyebrow">The Expressions</p>
                <p className="spec-label-abv">02</p>
                <p className="spec-label-vol">Expresiones</p>
                <div className="spec-label-rule" />
                <div className="spec-label-row">
                  <span>Herbal 35%</span>
                  <span className="spec-label-serve">Gin 40%</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="marquee-wrapper" aria-hidden="true">
        <div className="marquee-content">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`${item}-${index}`} className="marquee-item">
              <span>✦</span> {item}
            </div>
          ))}
        </div>
      </div>

      <section id="elige" className="split-band" aria-labelledby="elige-title">
        <motion.div className="container split-band-head" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <span className="section-eyebrow">Elige tu expresión</span>
          <h2 id="elige-title" className="section-title">
            DOS EXPRESIONES. <span className="accent">UNA LEYENDA.</span>
          </h2>
        </motion.div>

        <div className="split-band-panels">
          <a href="/herbal" className="split-panel" style={accentStyle("herbal")}>
            <ParallaxImg src={NIGHTCLUB_IMG} alt="Bagpiper Herbal Liqueur, nueva presentación, en la barra de una discoteca" />
            <span className="split-panel-shade" aria-hidden="true" />
            <span className="split-panel-content">
              <span className="split-panel-tag">01 · Expresión Herbal</span>
              <span className="split-panel-title">Herbal Liqueur</span>
              <span className="split-panel-line">Oscuro. Herbal. Bien frío.</span>
              <span className="split-panel-meta">35% Vol. · 750 ml · Serve Cold</span>
              <span className="split-panel-cta">Descubrir Bagpiper Herbal</span>
            </span>
          </a>
          <a href="/gin" className="split-panel split-panel--gin" style={accentStyle("black-pink")}>
            <ParallaxImg src={GIN.pinkGlass} alt="Bagpiper London Dry Gin Black Pink servido en copa balón con frutos del bosque" />
            <span className="split-panel-shade" aria-hidden="true" />
            <span className="split-panel-content">
              <span className="split-panel-tag">02 · Expresión Gin</span>
              <span className="split-panel-title">London Dry Gin</span>
              <span className="split-panel-line">Seco. Fresco. Botánico.</span>
              <span className="split-panel-meta">40% Vol. · Classic &amp; Black Pink</span>
              <span className="split-panel-cta">Descubrir Bagpiper Gin</span>
            </span>
          </a>
        </div>
      </section>

      <motion.section id="herbal" className="section feature-section herbal-section" {...inView}>
        <span className="feature-bgword" aria-hidden="true">
          HERBAL
        </span>
        <div className="container">
          <div className="gin-layout feature-layout--reverse">
            <motion.div variants={fadeUp} className="gin-mosaic">
              <Picture src={HERBAL_VERTICAL_IMG} alt="Bagpiper Herbal Liqueur, botella verde oscuro de la nueva presentación, sobre barra nocturna" width={900} height={1200} loading="lazy" />
              <Picture src={HERBAL_LASERS_IMG} alt="Botella de Bagpiper Herbal Liqueur bajo luces láser en una discoteca" width={1280} height={720} loading="lazy" />
              <Picture src={CLUB_IMG} alt="Bagpiper Herbal Liqueur en la barra de una fiesta" width={1280} height={720} loading="lazy" />
            </motion.div>

            <div className="gin-content">
              <motion.div variants={fadeUp} className="section-header gin-header">
                <span className="section-eyebrow">Expresión Herbal</span>
                <h2 className="section-title">
                  BAGPIPER <span className="text-outline">HERBAL LIQUEUR</span>
                </h2>
                <p className="section-desc">
                  La receta original de la casa, desarrollada en Lamoille, Nevada: un licor herbal oscuro y envolvente de
                  hierbas, raíces, especias y botánicos. Nueva presentación en botella verde profundo. Se sirve muy frío,
                  solo o en coctelería.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="gin-highlights">
                {herbalHighlights.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="gin-variants">
                <button type="button" className="gin-variant" style={accentStyle("herbal")} onClick={() => openFicha("herbal")} aria-haspopup="dialog">
                  <span className="gin-variant-dot" aria-hidden="true" />
                  <span className="gin-variant-text">
                    <strong>Original Recipe</strong>
                    <span>Hierbas · Raíces · Especias · Serve Cold</span>
                  </span>
                  <span className="gin-variant-cta">Ficha</span>
                </button>
                <a href="/herbal" className="feature-more">
                  Todo sobre Bagpiper Herbal Liqueur
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section id="gin" className="section feature-section gin-section" {...inView}>
        <span className="feature-bgword" aria-hidden="true">
          GIN
        </span>
        <div className="container">
          <div className="gin-layout">
            <motion.div variants={fadeUp} className="gin-mosaic">
              <Picture src={GIN.classicBar} alt="Bagpiper London Dry Gin Classic con copa de gin tonic en un bar nocturno" width={718} height={1086} loading="lazy" />
              <Picture src={GIN.classicTonic} alt="Bagpiper London Dry Gin Classic y copa balón con hielo" width={1023} height={701} loading="lazy" />
              <Picture src={GIN.pinkGarden} alt="Bagpiper London Dry Gin Black Pink con frutos del bosque en un jardín" width={1023} height={729} loading="lazy" />
            </motion.div>

            <div className="gin-content">
              <motion.div variants={fadeUp} className="section-header gin-header">
                <span className="section-eyebrow">Expresión Gin</span>
                <h2 className="section-title">
                  BAGPIPER <span className="text-outline">LONDON DRY GIN</span>
                </h2>
                <p className="section-desc">
                  Desarrollada en Lamoille, Nevada, la expresión gin de Bagpiper es un London Dry infusionado al vapor y
                  destilado a partir de 100% grano. Dos versiones, una misma firma: el Classic, seco y cítrico, y el Black
                  Pink, con frutos del bosque.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="gin-highlights">
                {ginHighlights.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="gin-variants">
                {ginExpressions.map((expr) => (
                  <button key={expr.id} type="button" className="gin-variant" style={accentStyle(expr.id)} onClick={() => openFicha(expr.id)} aria-haspopup="dialog">
                    <span className="gin-variant-dot" aria-hidden="true" />
                    <span className="gin-variant-text">
                      <strong>{expr.short}</strong>
                      <span>{expr.notes.slice(0, 3).join(" · ")}</span>
                    </span>
                    <span className="gin-variant-cta">Ficha</span>
                  </button>
                ))}
                <a href="/gin" className="feature-more">
                  Todo sobre Bagpiper London Dry Gin
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section id="expresiones" className="section" {...inView}>
        <div className="container">
          {sectionHeader(
            "La colección",
            <>
              LA COLECCIÓN <span className="accent">BAGPIPER</span>
            </>,
            <>
              {BRAND_STATEMENT} Herbal Liqueur y London Dry Gin en versiones Classic y Black Pink: abre la ficha de cada
              botella.
            </>
          )}

          <div className="expr-grid">
            {expressions.map((expr) => (
              <motion.button
                variants={fadeUp}
                key={expr.id}
                type="button"
                className={`expr-card ${expr.studio ? "expr-card--studio" : ""}`}
                style={accentStyle(expr.id)}
                onClick={() => openFicha(expr.id)}
                aria-haspopup="dialog"
                aria-label={`Ver ficha de Bagpiper ${expr.name} ${expr.short}`}
              >
                <div className="expr-card-media">
                  <Picture src={expr.image} alt={expr.imageAlt} width={expr.imageWidth} height={expr.imageHeight} loading="lazy" />
                  <span className="expr-card-family">{expr.familyLabel}</span>
                </div>
                <div className="expr-card-body">
                  <span className="expr-card-tag">{expr.tag}</span>
                  <h3 className="expr-card-title">
                    {expr.name}
                    <span>{expr.short}</span>
                  </h3>
                  <p className="expr-card-line">{expr.line}</p>
                  <div className="expr-card-specs">
                    <span>{expr.abv}</span>
                    <span>{expr.volume}</span>
                    <span>{expr.serve}</span>
                  </div>
                  <span className="expr-card-cta">Ver ficha</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {cocktailsSection(
        () => true,
        "Cócteles de la casa",
        <>
          CÓMO SE TOMA <span className="accent">BAGPIPER</span>
        </>,
        "Frío y directo para el licor herbal; en copa balón con tónica para el gin. Cuatro recetas de la casa, dos por expresión.",
        { compact: true }
      )}

      <motion.section id="historia" className="section" {...inView}>
        <div className="container">
          {sectionHeader(
            "Sobre Nosotros",
            <>
              DESARROLLADO EN USA <span className="accent">LAMOILLE, NEVADA</span>
            </>,
            <>
              {BRAND_STATEMENT} Creada en 2018 por Smith &amp; Johnson &amp; Co., compañía dedicada al desarrollo y
              comercialización de bebidas espirituosas, y reintroducida internacionalmente en 2024.
            </>
          )}

          <div className="heritage-layout">
            <motion.div variants={fadeUp} className="timeline">
              {timeline.slice(0, 2).map((item) => (
                <article key={item.year} className="timeline-item">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-text">{item.text}</p>
                </article>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="heritage-img-wrapper">
              <Picture src={HERBAL_PARTY_IMG} alt="Nueva presentación de Bagpiper Herbal Liqueur junto a un trago con naranja en una fiesta" width={540} height={720} loading="lazy" />
            </motion.div>

            <motion.div variants={fadeUp} className="timeline">
              {timeline.slice(2).map((item) => (
                <article key={item.year} className="timeline-item">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-text">{item.text}</p>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section id="leyenda" className="section" {...inView}>
        <div className="container">
          <motion.div variants={fadeUp} className="legend-intro">
            <div>
              <span className="section-eyebrow">La identidad</span>
              <h2 className="section-title">
                EL <span className="text-outline">DARK PIPER</span>
              </h2>
            </div>
            <p className="section-desc">
              La identidad visual de Bagpiper está basada en la figura del Dark Piper, un personaje inspirado en una antigua
              leyenda sobre un misterioso gaitero de los bosques que conocía las propiedades de plantas y botánicos, y
              elaboraba mezclas con hierbas, raíces, especias, flores y bayas. Esa herencia vive hoy en cada expresión de la
              casa: en sus licores herbales y en sus gines.
            </p>
          </motion.div>

          <div className="legend-grid">
            {darkPiperSymbols.map((symbol) => (
              <motion.article variants={fadeUp} key={symbol.name} className="legend-card">
                <span className="legend-role">{symbol.role}</span>
                <h3 className="legend-name">{symbol.name}</h3>
                <p className="legend-text">{symbol.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <section id="mundo" className="section film-section" aria-labelledby="mundo-title">
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="section-header">
            <span className="section-eyebrow">Visual Language</span>
            <h2 id="mundo-title" className="section-title">
              BAGPIPER <span className="text-outline">NIGHT MOOD</span>
            </h2>
            <p className="section-desc">
              Del bar a la pista y de la terraza al jardín: Bagpiper Herbal Liqueur y Bagpiper London Dry Gin en su
              ambiente, para consumo directo y coctelería.
            </p>
          </div>
        </motion.div>
        <FilmStrip rows={filmRows} />
      </section>

      <motion.section id="botanicos" className="section" {...inView}>
        <div className="container">
          <div className="botanicals-layout">
            <motion.div variants={fadeUp} className="botanicals-img-panel botanicals-img-panel--studio">
              <Picture
                src={HERBAL_PACKSHOT_IMG}
                alt="Nueva presentación de Bagpiper Herbal Liqueur: botella verde oscuro con etiqueta Crafted with selected herbs & botanicals"
                width={800}
                height={1200}
                loading="lazy"
              />
              <div className="botanicals-img-label">
                <span className="section-eyebrow">Perfil Aromático</span>
                <p className="botanicals-img-copy">Hierbas · Raíces · Especias · Enebro · Frutos del bosque</p>
              </div>
            </motion.div>

            <div className="botanicals-content">
              <motion.div variants={fadeUp} className="section-header" style={{ marginBottom: "2rem" }}>
                <span className="section-eyebrow">Selección botánica</span>
                <h2 className="section-title">
                  ALMA
                  <br />
                  <span className="text-outline">BOTÁNICA</span>
                </h2>
                <p className="section-desc">
                  Crafted with selected herbs &amp; botanicals. Hierbas, raíces y especias para el licor herbal; enebro,
                  cítricos y frutos del bosque para el gin. Dos perfiles que nacen del mismo bosque.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="botanicals-tags">
                {botanicals.map((botanical) => (
                  <span key={botanical} className="botanical-tag">
                    {botanical}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="regions-list">
                {regions.map((region) => (
                  <div key={region.name} className="region-item">
                    <span className="region-name">{region.name}</span>
                    <span className="region-role">{region.role}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {faqSection(
        <>
          GIN &amp; <span className="text-outline">LICOR HERBAL</span>
        </>,
        "Todo sobre Bagpiper: una marca de gines y licores herbales desarrollada en Lamoille, Nevada, con receta, marca e identidad propias."
      )}
    </>
  );

  /* ---------- /herbal ---------- */

  const herbalContent = (
    <>
      <section className="container product-hero" id="top">
        {breadcrumb({ label: "Bagpiper Herbal Liqueur" })}
        <div className="product-hero-grid">
          <div className="product-hero-copy">
            <span className="section-eyebrow hero-reveal" style={revealDelay(1)}>
              Herbal Bagpiper · Lamoille, Nevada
            </span>
            <h1 className="hero-title hero-reveal" style={revealDelay(1)}>
              BAGPIPER <span className="accent hero-title-sub">HERBAL LIQUEUR</span>
            </h1>
            <p className="section-desc hero-reveal" style={revealDelay(2)}>
              {BRAND_STATEMENT} Bagpiper Herbal Liqueur —el herbal Bagpiper— es la receta original de la casa: un licor herbal oscuro y
              envolvente de hierbas, raíces, especias y botánicos, ahora en su nueva presentación de botella verde
              profundo. Se sirve muy frío, solo o en coctelería.
            </p>
            {specChips(["35% Vol.", "750 ml", "Serve Cold", "Original Recipe"])}
            <div className="hero-actions hero-reveal" style={revealDelay(4)}>
              <button type="button" className="btn btn-primary" onClick={() => openFicha("herbal")} aria-haspopup="dialog">
                Ver ficha técnica
              </button>
              <a href="#cocteles" className="btn btn-outline">
                Cócteles con Bagpiper Herbal
              </a>
            </div>
          </div>
          <div className="product-hero-visual product-hero-visual--studio hero-reveal" style={revealDelay(2)}>
            <Picture
              src={HERBAL_PACKSHOT_IMG}
              alt="Botella de Bagpiper Herbal Liqueur, nueva presentación verde oscuro, 750 ml, 35% vol., etiqueta Smith & Johnson"
              width={800}
              height={1200}
              sizes={HERO_IMAGE_SIZES.herbal}
              {...HIGH_PRIORITY}
            />
          </div>
        </div>
      </section>

      {profileSection(
        "perfil",
        "A secret blend of fine botanicals",
        <>
          EL PERFIL <span className="accent">HERBAL</span>
        </>,
        "Cuatro rasgos que la casa imprimió en la etiqueta de la nueva presentación y que definen a Bagpiper Herbal Liqueur.",
        herbalProfile,
        "herbal"
      )}

      <motion.section id="presentacion" className="section feature-section herbal-section" {...inView}>
        <span className="feature-bgword" aria-hidden="true">
          HERBAL
        </span>
        <div className="container">
          <div className="gin-layout feature-layout--reverse">
            <motion.div variants={fadeUp} className="gin-mosaic">
              <Picture src={HERBAL_VERTICAL_IMG} alt="Bagpiper Herbal Liqueur, botella verde oscuro, sobre barra nocturna" width={900} height={1200} loading="lazy" />
              <Picture src={HERBAL_PARTY_IMG} alt="Bagpiper Herbal Liqueur y un trago con naranja en una fiesta" width={540} height={720} loading="lazy" />
              <Picture src={HERBAL_LASERS_IMG} alt="Botella de Bagpiper Herbal Liqueur bajo luces láser" width={1280} height={720} loading="lazy" />
            </motion.div>
            <div className="gin-content">
              <motion.div variants={fadeUp} className="section-header gin-header">
                <span className="section-eyebrow">Nueva presentación</span>
                <h2 className="section-title">
                  LA NOCHE <span className="text-outline">ES VERDE</span>
                </h2>
                <p className="section-desc">
                  La nueva botella de Bagpiper Herbal Liqueur es verde profundo, con la etiqueta vintage de Smith &amp;
                  Johnson Master Liquormakers y la figura del Dark Piper al centro. Hecha para la barra, la pista y el
                  ritual del trago bien frío.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="gin-highlights">
                {herbalHighlights.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {cocktailsSection(
        (c) => c.expressionId === "herbal",
        "Cócteles con licor herbal",
        <>
          CÓCTELES CON <span className="accent">BAGPIPER HERBAL</span>
        </>,
        "Dos recetas de la casa para el herbal Bagpiper: el ritual frío con naranja y un tónico oscuro con romero.",
        { compact: true }
      )}

      {faqSection(
        <>
          BAGPIPER <span className="text-outline">HERBAL LIQUEUR</span>
        </>,
        "Lo que más nos preguntan sobre el licor herbal de Bagpiper."
      )}

      {crossLink("gin")}
    </>
  );

  /* ---------- /gin ---------- */

  const ginContent = (
    <>
      <section className="container product-hero" id="top">
        {breadcrumb({ label: "Bagpiper London Dry Gin" })}
        <div className="product-hero-grid">
          <div className="product-hero-copy">
            <span className="section-eyebrow hero-reveal" style={revealDelay(1)}>
              Gin Bagpiper · Lamoille, Nevada
            </span>
            <h1 className="hero-title hero-reveal" style={revealDelay(1)}>
              BAGPIPER <span className="accent hero-title-sub hero-title-sub--gin">LONDON DRY GIN</span>
            </h1>
            <p className="section-desc hero-reveal" style={revealDelay(2)}>
              {BRAND_STATEMENT} Bagpiper London Dry Gin —el gin Bagpiper— es su expresión gin: vapour infused y destilado a partir de 100%
              grano, en dos versiones con una misma firma. El Classic, seco y cítrico; el Black Pink, rosado y con frutos
              del bosque.
            </p>
            {specChips(["40% Vol. · 80 Proof", "750 ml", "Vapour Infused", "100% Grano"])}
            <div className="hero-actions hero-reveal" style={revealDelay(4)}>
              <a href="#versiones" className="btn btn-primary">
                Classic &amp; Black Pink
              </a>
              <a href="#cocteles" className="btn btn-outline">
                Gin tonic Bagpiper
              </a>
            </div>
          </div>
          <div className="product-hero-visual product-hero-visual--duo hero-reveal" style={revealDelay(2)}>
            <Picture
              src={GIN.classicLondonDry}
              alt="Bagpiper London Dry Gin Classic, botella transparente con copa balón de gin tonic"
              width={654}
              height={1086}
              sizes={HERO_IMAGE_SIZES.gin}
              {...HIGH_PRIORITY}
            />
            <Picture
              src={GIN.pinkBerries}
              alt="Bagpiper London Dry Gin Black Pink, botella rosada con copa de frutos del bosque"
              width={717}
              height={1086}
              sizes={HERO_IMAGE_SIZES.gin}
            />
          </div>
        </div>
      </section>

      <motion.section id="versiones" className="section" {...inView}>
        <div className="container">
          {sectionHeader(
            "Dos versiones",
            <>
              CLASSIC <span className="accent">&amp; BLACK PINK</span>
            </>,
            "La misma base London Dry, dos caracteres. Abre la ficha de cada botella."
          )}
          <div className="expr-grid expr-grid--duo">
            {ginExpressions.map((expr) => (
              <motion.button
                variants={fadeUp}
                key={expr.id}
                type="button"
                className="expr-card"
                style={accentStyle(expr.id)}
                onClick={() => openFicha(expr.id)}
                aria-haspopup="dialog"
                aria-label={`Ver ficha de Bagpiper ${expr.name} ${expr.short}`}
              >
                <div className="expr-card-media">
                  <Picture src={expr.image} alt={expr.imageAlt} width={expr.imageWidth} height={expr.imageHeight} loading="lazy" />
                  <span className="expr-card-family">{expr.familyLabel}</span>
                </div>
                <div className="expr-card-body">
                  <span className="expr-card-tag">{expr.tag}</span>
                  <h3 className="expr-card-title">
                    Bagpiper {expr.name}
                    <span>{expr.short}</span>
                  </h3>
                  <p className="expr-card-line">{expr.line}</p>
                  <p className="expr-card-desc">{expr.description}</p>
                  <div className="expr-card-specs">
                    {expr.notes.map((note) => (
                      <span key={note}>{note}</span>
                    ))}
                  </div>
                  <span className="expr-card-cta">Ver ficha</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {profileSection(
        "estilo",
        "Vapour infused · Distilled from 100% grain spirit",
        <>
          EL ESTILO <span className="accent">LONDON DRY</span>
        </>,
        "Lo que dice la etiqueta de Bagpiper London Dry Gin, explicado.",
        ginProfile,
        "classic"
      )}

      <section className="section film-section" aria-labelledby="gin-mood-title">
        <motion.div className="container" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="section-header">
            <span className="section-eyebrow">En su ambiente</span>
            <h2 id="gin-mood-title" className="section-title">
              BAGPIPER <span className="text-outline">GIN MOOD</span>
            </h2>
          </div>
        </motion.div>
        <FilmStrip rows={[ginFilmRow]} />
      </section>

      {cocktailsSection(
        (c) => c.expressionId !== "herbal",
        "Gin tonic Bagpiper",
        <>
          CÓCTELES CON <span className="accent">BAGPIPER GIN</span>
        </>,
        "Copa balón, hielo abundante y tónica fría: el gin tonic del gin Bagpiper en cada versión.",
        { compact: true }
      )}

      {faqSection(
        <>
          BAGPIPER <span className="text-outline">LONDON DRY GIN</span>
        </>,
        "Lo que más nos preguntan sobre el gin de Bagpiper."
      )}

      {crossLink("herbal")}
    </>
  );

  /* ---------- /cocteles ---------- */

  const coctelesContent = (
    <>
      <section className="container product-hero" id="top">
        {breadcrumb({ label: "Cócteles" })}
        <div className="product-hero-grid">
          <div className="product-hero-copy">
            <span className="section-eyebrow hero-reveal" style={revealDelay(1)}>
              Recetas de la casa · Gin &amp; Herbal
            </span>
            <h1 className="hero-title hero-reveal" style={revealDelay(1)}>
              CÓCTELES <span className="accent hero-title-sub">CON BAGPIPER</span>
            </h1>
            <p className="section-desc hero-reveal" style={revealDelay(2)}>
              Cuatro recetas oficiales, dos por expresión: el herbal Bagpiper bien frío o con tónica, y el gin Bagpiper en
              gin tonic Classic o Black Pink. Ingredientes, medidas y pasos para prepararlos en casa o en la barra.
            </p>
            {specChips(["4 recetas", "Herbal Liqueur", "London Dry Gin", "2–3 min"])}
            <div className="hero-actions hero-reveal" style={revealDelay(4)}>
              <a href="#recetas" className="btn btn-primary">
                Ver las recetas
              </a>
              <a href="/gin" className="btn btn-outline">
                Bagpiper Gin
              </a>
            </div>
          </div>
          <div className="product-hero-visual product-hero-visual--quad hero-reveal" style={revealDelay(2)}>
            {cocktails.map((c, i) => (
              <Picture
                key={c.id}
                src={c.image}
                alt={c.imageAlt}
                sizes={HERO_IMAGE_SIZES.cocteles}
                style={c.imagePosition ? { objectPosition: c.imagePosition } : undefined}
                {...(i === 0 ? HIGH_PRIORITY : { loading: "lazy" })}
              />
            ))}
          </div>
        </div>
      </section>

      {cocktailsSection(
        () => true,
        "Las recetas",
        <>
          CUATRO RECETAS <span className="accent">DOS EXPRESIONES</span>
        </>,
        "Elige una receta para ver los ingredientes, las medidas y el consejo de la casa.",
        { compact: true, sectionId: "recetas" }
      )}

      {faqSection(
        <>
          CÓCTELES <span className="text-outline">BAGPIPER</span>
        </>,
        "Lo que más nos preguntan sobre cómo tomar Bagpiper."
      )}

      {productDuo}
    </>
  );

  /* ---------- /cocteles/<receta> ---------- */

  const cocktailContent = cocktail && (
    <>
      <section className="container product-hero" id="top" style={accentStyle(cocktail.expressionId)}>
        {breadcrumb({ label: "Cócteles", href: "/cocteles" }, { label: cocktail.name })}
        <div className="product-hero-grid">
          <div className="product-hero-copy">
            <span className="section-eyebrow hero-reveal" style={revealDelay(1)}>
              Receta con {cocktail.expression}
            </span>
            <h1 className="hero-title hero-reveal" style={revealDelay(1)}>
              {cocktail.name.toUpperCase()}{" "}
              <span className={`accent hero-title-sub ${cocktail.expressionId === "herbal" ? "" : "hero-title-sub--gin"}`}>
                {cocktail.expressionId === "herbal" ? "CON HERBAL BAGPIPER" : "CON GIN BAGPIPER"}
              </span>
            </h1>
            <p className="section-desc hero-reveal" style={revealDelay(2)}>
              {cocktail.intro}
            </p>
            {specChips([cocktail.glass, `${cocktail.minutes} min`, "1 trago", cocktail.expressionId === "herbal" ? "Licor herbal" : "Gin"])}
            <div className="hero-actions hero-reveal" style={revealDelay(4)}>
              <a href="#receta" className="btn btn-primary">
                Ver la receta
              </a>
              <a href={expressionPage(cocktail.expressionId)} className="btn btn-outline">
                {cocktail.expression}
              </a>
            </div>
          </div>
          <div className="product-hero-visual hero-reveal" style={revealDelay(2)}>
            <Picture
              src={cocktail.image}
              alt={cocktail.imageAlt}
              width={cocktail.imageWidth}
              height={cocktail.imageHeight}
              sizes={HERO_IMAGE_SIZES.cocktail}
              style={cocktail.imagePosition ? { objectPosition: cocktail.imagePosition } : undefined}
              {...HIGH_PRIORITY}
            />
          </div>
        </div>
      </section>

      <motion.section id="receta" className="section" style={accentStyle(cocktail.expressionId)} {...inView}>
        <div className="container">
          {sectionHeader(
            `Receta · ${cocktail.glass} · ${cocktail.minutes} min`,
            <>
              CÓMO PREPARAR <span className="accent">{cocktail.name.toUpperCase()}</span>
            </>,
            cocktail.tagline
          )}
          <div className="recipe-layout">
            <motion.div variants={fadeUp} className="recipe-block">
              <h3 className="recipe-block-title">Ingredientes</h3>
              <ul className="cocktail-ingredients">
                {cocktail.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="recipe-block">
              <h3 className="recipe-block-title">Preparación</h3>
              <ol className="cocktail-steps recipe-steps">
                {cocktail.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="recipe-tip">
                <strong>Consejo de la casa.</strong> {cocktail.tip}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {cocktailsSection(
        (c) => c.id !== cocktail.id,
        "Más recetas",
        <>
          OTROS CÓCTELES <span className="accent">BAGPIPER</span>
        </>,
        "Las demás recetas de la casa con el herbal y el gin Bagpiper.",
        { compact: true, sectionId: "mas-cocteles" }
      )}

      {productDuo}
    </>
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      <AnimatePresence>
        {ageVerified === null && (
          <motion.div className="age-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6 } }}>
            <motion.div
              className="age-gate-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.2, duration: 0.6, ease: "easeOut" } }}
            >
              <div className="age-gate-logo">BAGPIPER</div>
              <div className="age-gate-divider" />
              <p className="age-gate-title">¿Eres mayor de 18 años?</p>
              <p className="age-gate-desc">
                El consumo de alcohol es exclusivo para mayores de edad.
                <br />
                Por favor confirma tu edad para continuar.
              </p>
              <div className="age-gate-actions">
                <button className="age-gate-btn age-gate-yes" onClick={handleAgeAccept}>
                  Sí, tengo 18+
                </button>
                <button className="age-gate-btn age-gate-no" onClick={handleAgeDecline}>
                  No, soy menor
                </button>
              </div>
              <p className="age-gate-legal">Al ingresar confirmas que tienes la edad legal para consumir bebidas alcohólicas en tu país.</p>
            </motion.div>
          </motion.div>
        )}

        {ageVerified === false && (
          <motion.div className="age-gate age-gate--denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="age-gate-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}>
              <div className="age-gate-logo">BAGPIPER</div>
              <div className="age-gate-divider" />
              <p className="age-gate-title">Lo sentimos</p>
              <p className="age-gate-desc">Debes ser mayor de edad para acceder a este sitio.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="noise-overlay" />
      <div className="app-wrapper">
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="container nav-container">
            <a href="/" className="nav-logo" aria-label="Bagpiper, inicio">
              <span className="nav-logo-main">BAGPIPER</span>
              <span className="nav-logo-sub">Gin &amp; Herbal Liqueur</span>
            </a>

            <nav className="nav-links-desktop" aria-label="Principal">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="nav-link" aria-current={isCurrent(link.href) ? "page" : undefined}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="nav-right">
              <a href="#contacto" className="nav-cta">
                Contacto
              </a>
              <button
                className={`menu-toggle ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </header>

        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
            <nav className="mobile-menu-nav" onClick={(e) => e.stopPropagation()} aria-label="Móvil">
              <div className="mobile-menu-top">
                <span className="nav-logo-main">BAGPIPER</span>
                <button className="menu-toggle open" onClick={() => setMenuOpen(false)} aria-label="Cerrar">
                  <span />
                  <span />
                  <span />
                </button>
              </div>
              <div className="mobile-menu-links">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="mobile-menu-link"
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mobile-menu-footer">
                <a href="#contacto" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>
                  Contacto
                </a>
                <p className="mobile-menu-tagline">Herbal Liqueur · London Dry Gin · Lamoille, Nevada</p>
              </div>
            </nav>
          </div>
        )}

        <main id="main">
          {page === "home" && homeContent}
          {page === "herbal" && herbalContent}
          {page === "gin" && ginContent}
          {page === "cocteles" && coctelesContent}
          {page === "cocktail" && cocktailContent}

          <motion.section id="contacto" className="section ig-section" {...inView}>
            <div className="container">
              {sectionHeader(
                "Latinoamérica",
                <>
                  NUEVA <span className="text-outline">ETAPA</span>
                </>,
                <>
                  {BRAND_STATEMENT} A partir de 2024 trabaja con importadores y distribuidores de bebidas espirituosas en
                  Latinoamérica, posicionando sus gines y licores herbales para consumo directo y coctelería.
                </>
              )}

              <motion.div variants={fadeUp} className="contact-panel">
                <Picture
                  src={HERBAL_BAR_IMG}
                  alt="Bagpiper Herbal Liqueur sobre la barra de una fiesta con luces violetas"
                  className="contact-panel-bg"
                  width={1280}
                  height={720}
                  loading="lazy"
                />
                <div className="contact-panel-content">
                  <p className="section-eyebrow">Distribución</p>
                  <h3>Presencia progresiva en la región</h3>
                  <p>
                    Modernización de la presentación, un portafolio de gin y licor herbal, y expansión hacia mercados
                    internacionales. Próximamente, nuevas alianzas comerciales en la región.
                  </p>
                  <div className="btn btn-outline" style={{ cursor: "default" }}>
                    Coming Soon
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </main>

        <footer className="footer">
          <nav className="container footer-nav" aria-label="Pie de página">
            <a href="/">Inicio</a>
            <a href="/herbal">Bagpiper Herbal Liqueur</a>
            <a href="/gin">Bagpiper London Dry Gin</a>
            <a href="/cocteles">Cócteles Bagpiper</a>
            <a href="/#historia">Historia</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className="container">
            <div>© {new Date().getFullYear()} BAGPIPER · SMITH &amp; JOHNSON &amp; CO.</div>
            <div className="footer-tag">Gines &amp; Licores Herbales · Lamoille, Nevada · USA</div>
            <div>HERBAL 35% VOL. · GIN 40% VOL. · SÓLO PARA MAYORES DE EDAD LEGAL.</div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {ficha && (
          <motion.div className="ficha-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeFicha}>
            <motion.div
              id="ficha-bagpiper"
              className="ficha-card"
              style={accentStyle(ficha.id)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ficha-title"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="ficha-close" onClick={closeFicha} aria-label="Cerrar ficha">
                Cerrar
              </button>
              <div className={`ficha-visual ${ficha.studio ? "" : "ficha-visual--photo"}`}>
                <Picture src={ficha.image} alt={ficha.imageAlt} width={ficha.imageWidth} height={ficha.imageHeight} />
              </div>
              <div className="ficha-body">
                <p className="product-card-tag">
                  {ficha.tag} · {ficha.short}
                </p>
                <h2 id="ficha-title" className="product-card-title">
                  Bagpiper {ficha.name}
                </h2>
                <p className="ficha-line">{ficha.line}</p>
                <p className="product-card-desc">{ficha.description}</p>
                <div className="product-specs">
                  <div>
                    <span>Alcohol</span>
                    <strong>{ficha.abv}</strong>
                  </div>
                  <div>
                    <span>Formato</span>
                    <strong>{ficha.volume}</strong>
                  </div>
                  <div>
                    <span>Servicio</span>
                    <strong>{ficha.serve}</strong>
                  </div>
                </div>
                <div className="product-notes">
                  {ficha.notes.map((note) => (
                    <span key={note} className="note-pill">
                      {note}
                    </span>
                  ))}
                </div>
                <p className="product-line">
                  Gines &amp; licores herbales de alta calidad
                  <br />
                  Desarrollado en Lamoille, Nevada — USA
                </p>
                <div className="ficha-switch" aria-label="Otras expresiones">
                  {expressions
                    .filter((e) => e.id !== ficha.id)
                    .map((e) => (
                      <button key={e.id} type="button" className="ficha-switch-btn" style={accentStyle(e.id)} onClick={() => openFicha(e.id)}>
                        {e.familyLabel} · {e.short}
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;

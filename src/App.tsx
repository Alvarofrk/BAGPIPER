import { useState, useEffect, useRef, type CSSProperties } from "react";
import {
  BRAND_STATEMENT,
  botanicals,
  darkPiperSymbols,
  expressions,
  faqs,
  ginHighlights,
  herbalHighlights,
  cocktails,
  marqueeItems,
  navLinks,
  regions,
  stats,
  timeline,
} from "./data/content";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

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

// Cinta de galería: dos filas que corren en sentido contrario, alternando herbal y gin.
const filmRows = [
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

const accentStyle = (id: string) => ({ "--expr": EXPRESSION_ACCENTS[id] }) as CSSProperties;

function ParallaxImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <div ref={ref} className={`parallax ${className ?? ""}`}>
      <motion.img src={src} alt={alt} style={{ y }} loading="lazy" />
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ageVerified, setAgeVerified] = useState<boolean | null>(() => {
    return sessionStorage.getItem("bagpiper_age_ok") === "true" ? true : null;
  });

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const reelFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [reelChapter, setReelChapter] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const [fichaId, setFichaId] = useState<string | null>(null);

  const ficha = expressions.find((e) => e.id === fichaId) ?? null;
  const ginExpressions = expressions.filter((e) => e.family === "gin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setMoodIndex((i) => (i + 1) % moodSlides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

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
    sessionStorage.setItem("bagpiper_age_ok", "true");
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
      window.history.replaceState(null, "", "#expresiones");
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

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      <AnimatePresence>
        {ageVerified === null && (
          <motion.div
            className="age-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            <motion.div
              className="age-gate-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.2, duration: 0.6, ease: "easeOut" } }}
            >
              <div className="age-gate-logo">BAGPIPER</div>
              <div className="age-gate-divider" />
              <h2 className="age-gate-title">¿Eres mayor de 18 años?</h2>
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
              <p className="age-gate-legal">
                Al ingresar confirmas que tienes la edad legal para consumir bebidas alcohólicas en tu país.
              </p>
            </motion.div>
          </motion.div>
        )}

        {ageVerified === false && (
          <motion.div className="age-gate age-gate--denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="age-gate-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
            >
              <div className="age-gate-logo">BAGPIPER</div>
              <div className="age-gate-divider" />
              <h2 className="age-gate-title">Lo sentimos</h2>
              <p className="age-gate-desc">Debes ser mayor de edad para acceder a este sitio.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="noise-overlay" />
      <div className="app-wrapper">
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="container nav-container">
            <a href="#top" className="nav-logo">
              <span className="nav-logo-main">BAGPIPER</span>
              <span className="nav-logo-sub">Gin &amp; Herbal Liqueur</span>
            </a>

            <nav className="nav-links-desktop" aria-label="Principal">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="nav-link">
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
          <motion.section className="container" id="top" initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="hero-bento">
              <motion.div variants={fadeUp} className="bento-card bento-card-main">
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
                    {BRAND_STATEMENT} Dos expresiones, una misma leyenda: la receta herbal original y un London Dry
                    Gin en versiones Classic y Black Pink.
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
              </motion.div>

              <div className="bento-side-cards">
                <motion.div variants={fadeUp} className="bento-card bento-card-stat bento-card-mini-video">
                  <div className="mood-rotator" aria-hidden="true">
                    {moodSlides.map((slide, i) => (
                      <img
                        key={slide.src}
                        src={slide.src}
                        alt=""
                        className={`mood-slide ${moodIndex === i ? "is-active" : ""}`}
                      />
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
                </motion.div>

                <motion.div variants={fadeUp} className="bento-card bento-card-stat">
                  <div className="stat-content stat-content-stack">
                    {stats.map((stat) => (
                      <div key={stat.value} className="stat-row">
                        <div className="stat-label">{stat.title}</div>
                        <div className="stat-val">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.a
                  variants={fadeUp}
                  href="#expresiones"
                  className="bento-card bento-card-stat bento-card-label"
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
                </motion.a>
              </div>
            </div>
          </motion.section>

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
            <motion.div
              className="container split-band-head"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <span className="section-eyebrow">Elige tu expresión</span>
              <h2 id="elige-title" className="section-title">
                DOS EXPRESIONES. <span className="accent">UNA LEYENDA.</span>
              </h2>
            </motion.div>

            <div className="split-band-panels">
              <a href="#herbal" className="split-panel" style={accentStyle("herbal")}>
                <ParallaxImg src={NIGHTCLUB_IMG} alt="Bagpiper Herbal Liqueur, nueva presentación, en la barra de una discoteca" />
                <span className="split-panel-shade" aria-hidden="true" />
                <span className="split-panel-content">
                  <span className="split-panel-tag">01 · Expresión Herbal</span>
                  <span className="split-panel-title">Herbal Liqueur</span>
                  <span className="split-panel-line">Oscuro. Herbal. Bien frío.</span>
                  <span className="split-panel-meta">35% Vol. · 750 ml · Serve Cold</span>
                  <span className="split-panel-cta">Descubrir</span>
                </span>
              </a>
              <a href="#gin" className="split-panel split-panel--gin" style={accentStyle("black-pink")}>
                <ParallaxImg src={GIN.pinkGlass} alt="Bagpiper London Dry Gin Black Pink servido en copa balón con frutos del bosque" />
                <span className="split-panel-shade" aria-hidden="true" />
                <span className="split-panel-content">
                  <span className="split-panel-tag">02 · Expresión Gin</span>
                  <span className="split-panel-title">London Dry Gin</span>
                  <span className="split-panel-line">Seco. Fresco. Botánico.</span>
                  <span className="split-panel-meta">40% Vol. · Classic &amp; Black Pink</span>
                  <span className="split-panel-cta">Descubrir</span>
                </span>
              </a>
            </div>
          </section>

          <motion.section
            id="herbal"
            className="section feature-section herbal-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <span className="feature-bgword" aria-hidden="true">
              HERBAL
            </span>
            <div className="container">
              <div className="gin-layout feature-layout--reverse">
                <motion.div variants={fadeUp} className="gin-mosaic">
                  <img
                    src={HERBAL_VERTICAL_IMG}
                    alt="Bagpiper Herbal Liqueur, botella verde oscuro de la nueva presentación, sobre barra nocturna"
                    width={900}
                    height={1200}
                    loading="lazy"
                  />
                  <img
                    src={HERBAL_LASERS_IMG}
                    alt="Botella de Bagpiper Herbal Liqueur bajo luces láser en una discoteca"
                    width={1280}
                    height={720}
                    loading="lazy"
                  />
                  <img
                    src={CLUB_IMG}
                    alt="Bagpiper Herbal Liqueur en la barra de una fiesta"
                    width={1280}
                    height={720}
                    loading="lazy"
                  />
                </motion.div>

                <div className="gin-content">
                  <motion.div variants={fadeUp} className="section-header gin-header">
                    <span className="section-eyebrow">Expresión Herbal</span>
                    <h2 className="section-title">
                      BAGPIPER <span className="text-outline">HERBAL LIQUEUR</span>
                    </h2>
                    <p className="section-desc">
                      La receta original de la casa, desarrollada en Lamoille, Nevada: un licor herbal oscuro y
                      envolvente de hierbas, raíces, especias y botánicos. Nueva presentación en botella verde profundo.
                      Se sirve muy frío, solo o en coctelería.
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
                    <button
                      type="button"
                      className="gin-variant"
                      style={accentStyle("herbal")}
                      onClick={() => openFicha("herbal")}
                      aria-haspopup="dialog"
                    >
                      <span className="gin-variant-dot" aria-hidden="true" />
                      <span className="gin-variant-text">
                        <strong>Original Recipe</strong>
                        <span>Hierbas · Raíces · Especias · Serve Cold</span>
                      </span>
                      <span className="gin-variant-cta">Ficha</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="gin"
            className="section feature-section gin-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <span className="feature-bgword" aria-hidden="true">
              GIN
            </span>
            <div className="container">
              <div className="gin-layout">
                <motion.div variants={fadeUp} className="gin-mosaic">
                  <img
                    src={GIN.classicBar}
                    alt="Bagpiper London Dry Gin Classic con copa de gin tonic en un bar nocturno"
                    width={718}
                    height={1086}
                    loading="lazy"
                  />
                  <img
                    src={GIN.classicTonic}
                    alt="Bagpiper London Dry Gin Classic y copa balón con hielo"
                    width={1023}
                    height={701}
                    loading="lazy"
                  />
                  <img
                    src={GIN.pinkGarden}
                    alt="Bagpiper London Dry Gin Black Pink con frutos del bosque en un jardín"
                    width={1023}
                    height={729}
                    loading="lazy"
                  />
                </motion.div>

                <div className="gin-content">
                  <motion.div variants={fadeUp} className="section-header gin-header">
                    <span className="section-eyebrow">Expresión Gin</span>
                    <h2 className="section-title">
                      BAGPIPER <span className="text-outline">LONDON DRY GIN</span>
                    </h2>
                    <p className="section-desc">
                      Desarrollada en Lamoille, Nevada, la expresión gin de Bagpiper es un London Dry infusionado al
                      vapor y destilado a partir de 100% grano. Dos versiones, una misma firma: el Classic, seco y
                      cítrico, y el Black Pink, con frutos del bosque.
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
                      <button
                        key={expr.id}
                        type="button"
                        className="gin-variant"
                        style={accentStyle(expr.id)}
                        onClick={() => openFicha(expr.id)}
                        aria-haspopup="dialog"
                      >
                        <span className="gin-variant-dot" aria-hidden="true" />
                        <span className="gin-variant-text">
                          <strong>{expr.short}</strong>
                          <span>{expr.notes.slice(0, 3).join(" · ")}</span>
                        </span>
                        <span className="gin-variant-cta">Ficha</span>
                      </button>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="expresiones"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header section-header-center">
                <span className="section-eyebrow">La colección</span>
                <h2 className="section-title">
                  LA COLECCIÓN <span className="accent">BAGPIPER</span>
                </h2>
                <p className="section-desc">
                  {BRAND_STATEMENT} Herbal Liqueur y London Dry Gin en versiones Classic y Black Pink: abre la ficha de
                  cada botella.
                </p>
              </motion.div>

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
                      <img
                        src={expr.image}
                        alt={expr.imageAlt}
                        width={expr.imageWidth}
                        height={expr.imageHeight}
                        loading="lazy"
                      />
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

          <motion.section
            id="cocteles"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header section-header-center">
                <span className="section-eyebrow">Cócteles de la casa</span>
                <h2 className="section-title">
                  CÓMO SE TOMA <span className="accent">BAGPIPER</span>
                </h2>
                <p className="section-desc">
                  Frío y directo para el licor herbal; en copa balón con tónica para el gin. Cuatro recetas de la casa,
                  dos por expresión.
                </p>
              </motion.div>

              <div className="cocktail-grid">
                {cocktails.map((c) => (
                  <motion.article variants={fadeUp} key={c.id} className="cocktail-card" style={accentStyle(c.expressionId)}>
                    <div className="cocktail-media">
                      <img
                        src={c.image}
                        alt={c.imageAlt}
                        width={c.imageWidth}
                        height={c.imageHeight}
                        loading="lazy"
                        style={c.imagePosition ? { objectPosition: c.imagePosition } : undefined}
                      />
                      <span className="cocktail-glass">{c.glass}</span>
                    </div>
                    <div className="cocktail-body">
                      <span className="cocktail-expression">{c.expression}</span>
                      <h3 className="cocktail-name">{c.name}</h3>
                      <p className="cocktail-tagline">{c.tagline}</p>
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
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            id="historia"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header section-header-center">
                <span className="section-eyebrow">Sobre Nosotros</span>
                <h2 className="section-title">
                  DESARROLLADO EN USA <span className="accent">LAMOILLE, NEVADA</span>
                </h2>
                <p className="section-desc">
                  {BRAND_STATEMENT} Creada en 2018 por Smith &amp; Johnson &amp; Co., compañía dedicada al
                  desarrollo y comercialización de bebidas espirituosas, y reintroducida internacionalmente en 2024.
                </p>
              </motion.div>

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
                  <img
                    src={HERBAL_PARTY_IMG}
                    alt="Nueva presentación de Bagpiper Herbal Liqueur junto a un trago con naranja en una fiesta"
                    width={540}
                    height={720}
                    loading="lazy"
                  />
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

          <motion.section
            id="leyenda"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="legend-intro">
                <div>
                  <span className="section-eyebrow">La identidad</span>
                  <h2 className="section-title">
                    EL <span className="text-outline">DARK PIPER</span>
                  </h2>
                </div>
                <p className="section-desc">
                  La identidad visual de Bagpiper está basada en la figura del Dark Piper, un personaje inspirado en
                  una antigua leyenda sobre un misterioso gaitero de los bosques que conocía las propiedades de
                  plantas y botánicos, y elaboraba mezclas con hierbas, raíces, especias, flores y bayas. Esa
                  herencia vive hoy en cada expresión de la casa: en sus licores herbales y en sus gines.
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
            <motion.div
              className="container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <div className="section-header">
                <span className="section-eyebrow">Visual Language</span>
                <h2 id="mundo-title" className="section-title">
                  BAGPIPER <span className="text-outline">NIGHT MOOD</span>
                </h2>
                <p className="section-desc">
                  Del bar a la pista y de la terraza al jardín: Bagpiper Herbal Liqueur y Bagpiper London Dry Gin en
                  su ambiente, para consumo directo y coctelería.
                </p>
              </div>
            </motion.div>

            <div className="film-strip">
              {filmRows.map((row, r) => (
                <div key={r} className={`film-row ${r % 2 ? "film-row--reverse" : ""}`}>
                  {/* La fila se duplica para que el desplazamiento sea continuo; la copia queda oculta a lectores de pantalla. */}
                  {[...row, ...row].map((item, i) => (
                    <figure key={`${item.src}-${i}`} className="film-item" aria-hidden={i >= row.length}>
                      <img src={item.src} alt={i >= row.length ? "" : item.alt} loading="lazy" />
                      <figcaption>{item.label}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <motion.section
            id="botanicos"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <div className="botanicals-layout">
                <motion.div variants={fadeUp} className="botanicals-img-panel botanicals-img-panel--studio">
                  <img
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
                      Crafted with selected herbs &amp; botanicals. Hierbas, raíces y especias para el licor herbal;
                      enebro, cítricos y frutos del bosque para el gin. Dos perfiles que nacen del mismo bosque.
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

          <motion.section
            id="faq"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header section-header-center">
                <span className="section-eyebrow">Preguntas frecuentes</span>
                <h2 className="section-title">
                  GIN &amp; <span className="text-outline">LICOR HERBAL</span>
                </h2>
                <p className="section-desc contact-lead">
                  Todo sobre Bagpiper: una marca de gines y licores herbales desarrollada en Lamoille, Nevada, con
                  receta, marca e identidad propias.
                </p>
              </motion.div>

              <div className="faq-list">
                {faqs.map((item) => (
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

          <motion.section
            id="contacto"
            className="section ig-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header section-header-center">
                <span className="section-eyebrow">Latinoamérica</span>
                <h2 className="section-title">
                  NUEVA <span className="text-outline">ETAPA</span>
                </h2>
                <p className="section-desc contact-lead">
                  {BRAND_STATEMENT} A partir de 2024 trabaja con importadores y distribuidores de bebidas espirituosas
                  en Latinoamérica, posicionando sus gines y licores herbales para consumo directo y coctelería.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="contact-panel">
                <img
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
                    Modernización de la presentación, un portafolio de gin y licor herbal, y expansión hacia
                    mercados internacionales. Próximamente, nuevas alianzas comerciales en la región.
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
          <div className="container">
            <div>© {new Date().getFullYear()} BAGPIPER · SMITH &amp; JOHNSON &amp; CO.</div>
            <div className="footer-tag">Gines &amp; Licores Herbales · Lamoille, Nevada · USA</div>
            <div>HERBAL 35% VOL. · GIN 40% VOL. · SÓLO PARA MAYORES DE EDAD LEGAL.</div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {ficha && (
          <motion.div
            className="ficha-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFicha}
          >
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
                <img src={ficha.image} alt={ficha.imageAlt} width={ficha.imageWidth} height={ficha.imageHeight} />
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
                      <button
                        key={e.id}
                        type="button"
                        className="ficha-switch-btn"
                        style={accentStyle(e.id)}
                        onClick={() => openFicha(e.id)}
                      >
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

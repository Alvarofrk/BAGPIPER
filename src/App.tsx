import { useState, useEffect, useRef } from "react";
import {
  botanicals,
  darkPiperSymbols,
  faqs,
  marqueeItems,
  navLinks,
  products,
  regions,
  stats,
  timeline,
} from "./data/content";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const PORTRAIT_IMG = "/images/bagpiperherbal-portrait.jpg";
const CELLAR_IMG = "/images/bagpiper-cellar.jpg";
const DARKNESS_IMG = "/images/bagpiper-darkness.jpg";
const SUNSET_IMG = "/images/bagpiper-sunset.jpg";
const HERO_VIDEO = "/images/videohome.mp4";
const SIDE_VIDEO = "/images/bp.mp4";
const product = products[0];

const gallery = [
  { src: CELLAR_IMG, label: "CELLAR SESSIONS", alt: "Bagpiper Herbal Liqueur en un lounge nocturno, con humo azul y magenta" },
  { src: DARKNESS_IMG, label: "HELLO DARKNESS", alt: "Bagpiper Herbal Liqueur sobre barra oscura, con luces rojas y púrpuras" },
  { src: SUNSET_IMG, label: "SUNSET SESSIONS", alt: "Bagpiper Herbal Liqueur en una terraza al atardecer, con neón Sunset Sessions" },
];

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
  const sideVideoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const moodIndexRef = useRef(0);
  moodIndexRef.current = moodIndex;

  const moodSlides = [
    { type: "video" as const, src: SIDE_VIDEO },
    { type: "image" as const, src: CELLAR_IMG },
    { type: "image" as const, src: DARKNESS_IMG },
    { type: "image" as const, src: SUNSET_IMG },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
    const side = sideVideoRef.current;

    if (ageVerified !== true || reduceMotion) {
      hero?.pause();
      side?.pause();
      return;
    }

    if (hero && !hero.src) hero.src = HERO_VIDEO;
    if (side && !side.src) side.src = SIDE_VIDEO;

    const playSideIfNeeded = (visible: boolean) => {
      if (!side) return;
      if (visible && moodIndexRef.current === 0) {
        if (side.paused) {
          side.currentTime = 0;
          side.play().catch(() => {});
        }
      } else {
        side.pause();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (video === side) {
            playSideIfNeeded(entry.isIntersecting);
            return;
          }
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (hero) observer.observe(hero);
    if (side) observer.observe(side);

    playSideIfNeeded(true);

    return () => observer.disconnect();
  }, [ageVerified, reduceMotion, moodIndex]);

  const handleAgeAccept = () => {
    sessionStorage.setItem("bagpiper_age_ok", "true");
    setAgeVerified(true);
  };

  const handleAgeDecline = () => {
    setAgeVerified(false);
  };

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
              <span className="nav-logo-sub">Herbal Liqueur</span>
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
                <p className="mobile-menu-tagline">Herbal Liqueur · The Dark Piper</p>
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
                  poster={CELLAR_IMG}
                  aria-hidden="true"
                />
                <div className="overlay" />
                <div className="content">
                  <span className="section-eyebrow">Smith &amp; Johnson &amp; Co. · USA · Est. 2018</span>
                  <h1 className="hero-title">
                    BAGPIPER <span className="accent">LICOR HERBAL</span>
                  </h1>
                  <p className="section-desc">
                    Un licor herbal de inspiración americana, desarrollado originalmente por Smith &amp; Johnson &amp;
                    Co. y reactivado para una nueva etapa de expansión internacional.
                  </p>
                  <div className="hero-actions">
                    <a href="#leyenda" className="btn btn-primary">
                      Descubrir la leyenda
                    </a>
                    <a href="#contacto" className="btn btn-outline">
                      Distribución
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="bento-side-cards">
                <motion.div variants={fadeUp} className="bento-card bento-card-stat bento-card-mini-video">
                  <div className="mood-rotator" aria-hidden="true">
                    <video
                      ref={sideVideoRef}
                      className={`mood-slide side-video ${moodIndex === 0 ? "is-active" : ""}`}
                      muted
                      playsInline
                      preload="none"
                      poster={DARKNESS_IMG}
                    />
                    {moodSlides.slice(1).map((slide, i) => (
                      <img
                        key={slide.src}
                        src={slide.src}
                        alt=""
                        className={`mood-slide ${moodIndex === i + 1 ? "is-active" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="side-video-overlay" />
                  <div className="stat-content">
                    <div className="stat-label">Identidad</div>
                    <div className="stat-val stat-val-sm">DARK PIPER</div>
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

                <motion.div variants={fadeUp} className="bento-card bento-card-stat bento-card-label">
                  <div className="spec-label">
                    <p className="spec-label-eyebrow">Premium Quality</p>
                    <p className="spec-label-abv">
                      35<span>%</span>
                    </p>
                    <p className="spec-label-vol">Vol.</p>
                    <div className="spec-label-rule" />
                    <div className="spec-label-row">
                      <span>750 ML</span>
                      <span className="spec-label-serve">Serve Cold</span>
                    </div>
                  </div>
                </motion.div>
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
                  DESARROLLADO EN USA <span className="accent">REINTRODUCIDO EN 2024</span>
                </h2>
                <p className="section-desc">
                  Bagpiper es un licor herbal desarrollado originalmente en Estados Unidos en 2018 por Smith &amp;
                  Johnson &amp; Co., compañía dedicada al desarrollo y comercialización de bebidas espirituosas y
                  licores botánicos.
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
                    src={PORTRAIT_IMG}
                    alt="Bagpiper Herbal Liqueur, botella ámbar con etiqueta vintage y el emblema del Dark Piper"
                    width={900}
                    height={1200}
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
                  una antigua leyenda relacionada con un misterioso gaitero de los bosques. Según la leyenda, el
                  gaitero conocía las propiedades de diferentes plantas y botánicos y elaboraba mezclas utilizando
                  hierbas, raíces, especias, flores y frutos recolectados del bosque.
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

          <motion.section
            id="mundo"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header">
                <span className="section-eyebrow">Visual Language</span>
                <h2 className="section-title">NIGHT EDITORIAL MOOD</h2>
                <p className="section-desc">
                  El Dark Piper en la noche: barra, humo y terraza. Tres tomas de fiesta para consumo directo y
                  coctelería.
                </p>
              </motion.div>

              <div className="gallery-grid gallery-grid-night">
                {gallery.map((item) => (
                  <motion.div variants={fadeUp} key={item.src} className="gallery-item">
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <div className="gallery-overlay">
                      <span className="gallery-text">{item.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            id="coleccion"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="container">
              <motion.div variants={fadeUp} className="section-header">
                <span className="section-eyebrow">The Collection</span>
                <h2 className="section-title">LA FIRMA</h2>
              </motion.div>

              <motion.article variants={fadeUp} className="product-featured">
                <div className="product-featured-img">
                  <img
                    src={CELLAR_IMG}
                    alt="Bagpiper Herbal Liqueur en un lounge nocturno, con humo azul y magenta sobre la barra"
                    width={1400}
                    height={787}
                    loading="lazy"
                  />
                </div>
                <div className="product-featured-body">
                  <div className="product-card-tag">{product.tag}</div>
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-desc">{product.description}</p>
                  <div className="product-specs">
                    <div>
                      <span>Alcohol</span>
                      <strong>{product.abv}</strong>
                    </div>
                    <div>
                      <span>Formato</span>
                      <strong>{product.volume}</strong>
                    </div>
                    <div>
                      <span>Servicio</span>
                      <strong>{product.serve}</strong>
                    </div>
                  </div>
                  <div className="product-notes">
                    {product.notes.map((note) => (
                      <span key={note} className="note-pill">
                        {note}
                      </span>
                    ))}
                  </div>
                  <p className="product-line">
                    Developed in the USA — 2018
                    <br />
                    Reintroduced internationally — 2024
                  </p>
                </div>
              </motion.article>
            </div>
          </motion.section>

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
                <motion.div variants={fadeUp} className="botanicals-img-panel">
                  <img
                    src={PORTRAIT_IMG}
                    alt="Botánicos alrededor de Bagpiper: hojas, bayas, anís estrellado y brezo púrpura"
                    width={900}
                    height={1200}
                    loading="lazy"
                  />
                  <div className="botanicals-img-label">
                    <span className="section-eyebrow" style={{ color: "#fff" }}>
                      Perfil Aromático
                    </span>
                    <p className="botanicals-img-copy">Hierbas · Raíces · Especias · Flores · Frutos</p>
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
                      Crafted with selected herbs &amp; botanicals. Una combinación de hierbas, raíces, especias,
                      flores y frutos que da forma al carácter misterioso de Bagpiper.
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
                  LICOR <span className="text-outline">HERBAL</span>
                </h2>
                <p className="section-desc contact-lead">
                  Bagpiper es un trago herbal de inspiración americana. Entra en la categoría de licores herbales —
                  la misma familia de Jägermeister y Fernet — con receta, marca e identidad propias.
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
                  A partir de 2024, Bagpiper trabaja con importadores y distribuidores de bebidas espirituosas en
                  Latinoamérica. La marca se posiciona en la categoría de licores herbales, tanto para consumo directo
                  como para coctelería.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="contact-panel">
                <img
                  src={DARKNESS_IMG}
                  alt=""
                  className="contact-panel-bg"
                  width={1400}
                  height={934}
                  loading="lazy"
                />
                <div className="contact-panel-content">
                  <p className="section-eyebrow">Distribución</p>
                  <h3>Presencia progresiva en la región</h3>
                  <p>
                    Modernización de la presentación, fortalecimiento de la distribución y expansión hacia mercados
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
          <div className="container">
            <div>© {new Date().getFullYear()} BAGPIPER · SMITH &amp; JOHNSON &amp; CO.</div>
            <div className="footer-tag">Herbal Liqueur · Est. 2018</div>
            <div>ALC. 35% VOL. · SÓLO PARA MAYORES DE EDAD LEGAL.</div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;

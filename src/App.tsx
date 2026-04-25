import { useState, useEffect } from "react";
import { botanicals, navLinks, products, regions, stats } from "./data/content";
import { motion, AnimatePresence, type Variants } from "framer-motion";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ageVerified, setAgeVerified] = useState<boolean | null>(() => {
    return sessionStorage.getItem("bagpiper_age_ok") === "true" ? true : null;
  });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const gallery = [
    "/images/b1.avif", // Hero and main
    "/images/b2.avif",
    "/images/b3.avif",
    "/images/b4.avif",
    "/images/b5.avif",
    "/images/b6.avif",
    "/images/b7.avif",
    "/images/b8.avif",
  ];

  const marqueeItems = ["London Dry", "California Craft", "Vapour Infused", "Born for Nightlife", "Premium Botanicals"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutImages = ["/images/b4.avif", "/images/b3.avif", "/images/b2.avif"];
  const [_aboutImgIndex, setAboutImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutImgIndex((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAgeAccept = () => {
    sessionStorage.setItem("bagpiper_age_ok", "true");
    setAgeVerified(true);
  };

  const handleAgeDecline = () => {
    setAgeVerified(false);
  };

  return (
    <>
      {/* AGE VERIFICATION GATE */}
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
                El consumo de alcohol es exclusivo para mayores de edad.<br />
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
          <motion.div
            className="age-gate age-gate--denied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="age-gate-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
            >
              <div className="age-gate-logo">BAGPIPER</div>
              <div className="age-gate-divider" />
              <h2 className="age-gate-title">Lo sentimos</h2>
              <p className="age-gate-desc">
                Debes ser mayor de edad para acceder a este sitio.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="noise-overlay" />
      <div className="app-wrapper">
        {/* NAVBAR */}
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="container nav-container">
            {/* Logo */}
            <a href="#top" className="nav-logo">
              <span className="nav-logo-main">BAGPIPER</span>
              <span className="nav-logo-sub">California Craft Gin</span>
            </a>

            {/* Desktop nav links — hidden on mobile */}
            <nav className="nav-links-desktop">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right: CTA + Hamburger */}
            <div className="nav-right">
              <a href="#contacto" className="nav-cta">Contacto</a>
              <button
                className={`menu-toggle ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile overlay — OUTSIDE header so it can cover full viewport */}
        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
            <nav className="mobile-menu-nav" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-top">
                <span className="nav-logo-main">BAGPIPER</span>
                <button className="menu-toggle open" onClick={() => setMenuOpen(false)} aria-label="Cerrar">
                  <span /><span /><span />
                </button>
              </div>
              <div className="mobile-menu-links">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mobile-menu-footer">
                <a href="#contacto" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>Contacto</a>
                <p className="mobile-menu-tagline">California Craft Gin · London Dry</p>
              </div>
            </nav>
          </div>
        )}

      <main id="top">
        {/* HERO SECTION - BENTO GRID */}
        <motion.section 
          className="container"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="hero-bento">
            {/* Main Hero Card */}
            <motion.div variants={fadeUp} className="bento-card bento-card-main">
              <img src="/images/b7.avif" alt="Bagpiper Black Pink" className="bg-img" />
              <div className="overlay" />
              <div className="content">
                <span className="section-eyebrow">LA Energy / Nightlife</span>
                <h1 className="hero-title">
                  MODERN <span className="accent">ROCK GIN</span>
                </h1>
                <p className="section-desc">
                  Bagpiper mezcla craft californiano, actitud urbana y estetica nocturna en una identidad premium que redefine el estándar.
                </p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <a href="#coleccion" className="btn btn-primary">Ver Colección</a>
                  <a href="#contacto" className="btn btn-outline">Distribución</a>
                </div>
              </div>
            </motion.div>

            {/* Side Stats Cards */}
            <div className="bento-side-cards">
              
              {/* Card 1: Pasarela de Imágenes */}
              <motion.div variants={fadeUp} className="bento-card bento-card-stat">
                <div className="stat-slider-wrapper" style={{ opacity: 0.6 }}>
                  <div className="stat-slider-track" style={{ animationDuration: '30s' }}>
                    {[...gallery, ...gallery].map((img, i) => (
                      <img key={i} src={img} alt="Bagpiper Premium London Dry Gin California" loading="lazy" />
                    ))}
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Visuals</div>
                  <div className="stat-val" style={{ fontSize: '1.5rem' }}>MOODBOARD</div>
                </div>
              </motion.div>

              {/* Card 2: Info Combinada de Stats */}
              <motion.div variants={fadeUp} className="bento-card bento-card-stat">
                <div className="stat-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%' }}>
                  {stats.map((stat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="stat-label" style={{ maxWidth: '60%' }}>{stat.title}</div>
                      <div className="stat-val" style={{ fontSize: '2.5rem' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3: Award Winning */}
              <motion.div variants={fadeUp} className="bento-card bento-card-stat" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--color-accent)' }}>
                <div className="stat-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', textAlign: 'center', color: '#fff' }}>
                    AWARD<br/>WINNING
                  </h3>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* MARQUEE */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={`${item}-${index}`} className="marquee-item">
                <span>✦</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* HISTORIA / SOBRE NOSOTROS */}
        <motion.section 
          id="historia" 
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="container">
            <motion.div variants={fadeUp} className="section-header">
              <span className="section-eyebrow">Sobre Nosotros</span>
              <h2 className="section-title">HERENCIA Y <span className="accent">VANGUARDIA</span></h2>
            </motion.div>

            <motion.div variants={fadeUp} className="bento-card about-bento-card">
              <img src="/images/b8.avif" alt="Bagpiper Heritage" className="bg-img" />
              <div className="overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4))' }} />
              <div className="content about-bento-content">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
                  <p className="section-desc" style={{ margin: '0', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    <strong>Bagpiper Gin</strong> nace en California con espíritu internacional. Fundada por los hermanos Balt, relanzamos nuestra marca combinando la tradición escocesa de su destilado base con un enfoque <em>craft moderno</em> diseñado para el mercado global.
                  </p>
                  <p className="section-desc" style={{ margin: '0', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    Nuestro London Dry destaca por un corazón firme de enebro silvestre y frescas notas de cítricos mediterráneos. Una expresión contemporánea y premium, enriquecida con botánicos cuidadosamente seleccionados de <strong>Escocia, Alemania, Japón, Perú, México y Turquía</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* EDITORIAL GALLERY (MASONRY BENTO) */}
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
                Visuales con textura nocturna, luz controlada y actitud urbana para una narrativa premium. Inspirados por el ritmo de Los Angeles.
              </p>
            </motion.div>
            
            <div className="gallery-grid">
              {gallery.slice(1).map((img, idx) => {
                const words = [
                  "BOTANICALS",
                  "CRAFTSMANSHIP",
                  "JUNIPER",
                  "DISTILLATION",
                  "ESSENCE",
                  "MIXOLOGY",
                  "HERITAGE"
                ];
                return (
                  <motion.div variants={fadeUp} key={idx} className="gallery-item">
                    <img src={img} alt={`Bagpiper Premium Gin London Dry - ${words[idx]}`} loading="lazy" />
                    <div className="gallery-overlay">
                      <span className="gallery-text">{words[idx] || `FRAME 0${idx + 1}`}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* PRODUCTS (COLECCION) */}
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
              <h2 className="section-title">THREE SIGNATURES</h2>
            </motion.div>
            
            <div className="products-grid">
              {products.map((product) => {
                let imgSrc = "";
                if (product.name.includes("Classic")) imgSrc = "/images/b2.avif";
                else if (product.name.includes("Black Pink")) imgSrc = "/images/b1.avif";
                else if (product.name.includes("Fruit")) imgSrc = "/images/b3.avif";

                return (
                  <motion.article variants={fadeUp} key={product.name} className="product-card-new">
                    <div className="product-card-img">
                      {imgSrc && <img src={imgSrc} alt={product.name} loading="lazy" />}
                      <div className="product-card-overlay" />
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-tag">Bagpiper Gin</div>
                      <h3 className="product-card-title">{product.name}</h3>
                      <p className="product-card-desc">{product.description}</p>
                      <div className="product-notes">
                        {product.notes.map((note) => (
                          <span key={note} className="note-pill">{note}</span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* BOTANICALS */}
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

              {/* Left: Image panel */}
              <motion.div variants={fadeUp} className="botanicals-img-panel">
                <img src="/images/b5.avif" alt="Bagpiper Gin Botánicos del Mundo" loading="lazy" />
                <div className="botanicals-img-label">
                  <span className="section-eyebrow" style={{ color: '#fff' }}>Perfil Aromático</span>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-serif)', marginTop: '0.25rem' }}>6 países · 8 botánicos</p>
                </div>
              </motion.div>

              {/* Right: Content */}
              <div className="botanicals-content">
                <motion.div variants={fadeUp} className="section-header" style={{ marginBottom: '2rem' }}>
                  <span className="section-eyebrow">Botánicos del Mundo</span>
                  <h2 className="section-title">ALMA<br/><span className="text-outline">BOTÁNICA</span></h2>
                  <p className="section-desc">
                    Una selección curada de ingredientes de seis países que forman el carácter único de Bagpiper.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="botanicals-tags">
                  {botanicals.map((botanical) => (
                    <span key={botanical} className="botanical-tag">{botanical}</span>
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

        {/* CONTACTO / INSTAGRAM */}
        <motion.section
          id="contacto"
          className="section ig-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="container">
            <motion.div variants={fadeUp} className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
              <span className="section-eyebrow">Síguenos</span>
              <h2 className="section-title">ÚNETE AL<br /><span className="text-outline">MOVIMIENTO</span></h2>
            </motion.div>

            {/* Instagram Profile Card */}
            <motion.a
              variants={fadeUp}
              href="https://www.instagram.com/bagpiperginperu"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-profile-card"
            >
              <div className="ig-avatar">
                <img src="/images/b1.avif" alt="Bagpiper Gin Peru Instagram" />
              </div>
              <div className="ig-profile-info">
                <div className="ig-handle">@bagpiperginperu</div>
                <div className="ig-name">Bagpiper Gin Perú</div>
                <div className="ig-bio">California Craft Gin · London Dry · 🌿 Botánicos del Mundo</div>
              </div>
              <div className="ig-follow-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Ver en Instagram
              </div>
            </motion.a>

            {/* Preview grid using project images */}
            <motion.div variants={fadeUp} className="ig-grid">
              {["/images/b2.avif", "/images/b3.avif", "/images/b4.avif", "/images/b6.avif", "/images/b7.avif", "/images/b8.avif"].map((src, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/bagpiperginperu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-grid-item"
                >
                  <img src={src} alt={`Bagpiper Instagram post ${i + 1}`} loading="lazy" />
                  <div className="ig-grid-overlay">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* Final CTA */}
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a
                href="https://www.instagram.com/bagpiperginperu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Seguir @bagpiperginperu
              </a>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="footer">
        <div className="container">
          <div>© {new Date().getFullYear()} BAGPIPER DISTILLERY.</div>
          <a
            href="https://www.instagram.com/bagpiperginperu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            @bagpiperginperu
          </a>
          <div>ALC. 40% VOL. · SÓLO PARA MAYORES DE EDAD LEGAL.</div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default App;

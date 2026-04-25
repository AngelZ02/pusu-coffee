"use client";

import { useEffect, useRef } from "react";
import s from "./landing.module.css";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      ref.current?.classList.add(s.heroIn);
    });
  }, []);

  return (
    <section ref={ref} className={s.heroSection} id="hero" aria-labelledby="hero-title">
      <div className={s.heroGrid}>
        {/* Left — copy */}
        <div>
          <div className={s.heroMeta}>
            <span className={s.eyebrow}>Edición Otoño · Lote 014</span>
            <span className={s.heroDot} aria-hidden="true" />
            <span className={s.eyebrow}>Origen Perú</span>
          </div>

          <h1 className={s.heroTitle} id="hero-title">
            Deja de tomar<br />
            café <em style={{ fontStyle: "italic", fontWeight: 300 }}>al azar.</em>
          </h1>

          <p className={s.heroSub}>
            Descubre el café peruano que va contigo, sin ser experto.
            Tres perfiles. Una conversación corta. La taza que esperabas.
          </p>

          <div className={s.heroCtas}>
            <button
              data-open-recommender
              className={`${s.btn} ${s.btnPrimary}`}
            >
              Descubrir mi café
              <ArrowRight />
            </button>
            <a href="#cafes" className={`${s.btn} ${s.btnGhost}`}>
              Explorar por mi cuenta
            </a>
          </div>

          <div className={s.heroTag}>
            <span className={s.heroTagBar} />
            <span>Cusco · Cajamarca · Amazonas</span>
          </div>
        </div>

        {/* Right — visual */}
        <div className={s.heroVisual}>
          <span className={s.heroBadge}>Café peruano · Lote 014</span>
          <div className={`${s.ph} ${s.heroVisualPh}`} />
          <div className={s.heroSerial}>
            N° 014<br />
            2026 · 04 · 24
          </div>
          <div className={s.heroCaption}>Lote limitado · Tostado semanal</div>
        </div>
      </div>

      {/* Product band */}
      <div className={s.productBand}>
        {[
          { href: "#packs", ph: s.phDorado, name: "Colibrí Dorado", meta: "Suave · 250g",     price: "S/ 40" },
          { href: "#packs", ph: s.phRojo,   name: "Colibrí Rojo",   meta: "Balanceado · 250g", price: "S/ 37" },
          { href: "#packs", ph: s.phNegro,  name: "Colibrí Negro",  meta: "Intenso · 250g",    price: "S/ 42" },
        ].map((p) => (
          <a key={p.name} href={p.href} className={s.productItem}>
            <div className={`${s.ph} ${p.ph} ${s.productThumb}`} />
            <div>
              <span className={s.productName}>{p.name}</span>
              <span className={s.productMeta}>{p.meta}</span>
            </div>
            <span className={s.productPrice}>{p.price}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

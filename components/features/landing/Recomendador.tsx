"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import s from "./landing.module.css";
import { createClient } from "@/lib/supabase/client";
import { useCarrito } from "@/lib/carrito/context";

const WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? "51999999999";

interface ProductoData {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  proceso: string;
}

type Screen = 1 | 2 | 3 | "result";
type Answers = { intensity: string | null; notes: string | null; moment: string | null };

const COFFEES = {
  rojo: {
    slug: "colibri-rojo",
    name: "Colibrí Rojo",
    swatch: "var(--color-brand-vino)",
    phClass: s.phRojo,
    title: ["Colibrí ", "Rojo"] as [string, string],
    desc: "El café que se queda contigo. Dulzura redonda, cereza madura y un final largo a cacao que no tiene prisa.",
    interp: "Buscas un café que te acompañe, no que te despierte a gritos. Balance sobre intensidad.",
    notes: ["Cereza madura", "Panela", "Cacao", "Tueste medio"],
    origin: "Cusco · La Convención",
    altitude: "1,650 msnm",
    process: "Lavado",
  },
  dorado: {
    slug: "colibri-dorado",
    name: "Colibrí Dorado",
    swatch: "var(--color-brand-gold)",
    phClass: s.phDorado,
    title: ["Colibrí ", "Dorado"] as [string, string],
    desc: "Luminoso y abierto. Flor blanca, miel clara y un cítrico suave que ilumina la mañana sin levantar la voz.",
    interp: "Prefieres la claridad. Una taza que suena bajito pero se queda en la memoria.",
    notes: ["Flor blanca", "Miel", "Cítrico suave", "Tueste medio claro"],
    origin: "Cajamarca · Jaén",
    altitude: "1,820 msnm",
    process: "Honey",
  },
  negro: {
    slug: "colibri-negro",
    name: "Colibrí Negro",
    swatch: "var(--color-brand-colibri-negro)",
    phClass: s.phNegro,
    title: ["Colibrí ", "Negro"] as [string, string],
    desc: "Denso, sereno, mineral. Chocolate amargo, nuez tostada y un final de tabaco que se extiende como una tarde larga.",
    interp: "Quieres una taza que pese. Café para concentrarse, para leer, para pensar despacio.",
    notes: ["Chocolate amargo", "Tabaco", "Nuez tostada", "Tueste medio oscuro"],
    origin: "Amazonas · Rodríguez de Mendoza",
    altitude: "1,540 msnm",
    process: "Natural",
  },
} as const;

type CoffeeKey = keyof typeof COFFEES;

function score(a: Answers): CoffeeKey {
  const pts = { rojo: 0, dorado: 0, negro: 0 };
  if (a.intensity === "light")  pts.dorado += 3;
  if (a.intensity === "medium") pts.rojo   += 3;
  if (a.intensity === "deep")   pts.negro  += 3;
  if (a.notes === "floral") pts.dorado += 3;
  if (a.notes === "fruity") pts.rojo   += 3;
  if (a.notes === "earthy") pts.negro  += 3;
  if (a.moment === "morning") { pts.dorado += 2; pts.rojo += 1; }
  if (a.moment === "midday")  { pts.negro  += 2; pts.rojo += 1; }
  if (a.moment === "evening") { pts.rojo   += 2; pts.negro += 1; }
  return (Object.entries(pts).sort((a, b) => b[1] - a[1])[0][0]) as CoffeeKey;
}

export default function Recomendador() {
  const [isOpen, setIsOpen]     = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>(1);
  const [leavingScreen, setLeavingScreen] = useState<Screen | null>(null);
  const [answers, setAnswers]   = useState<Answers>({ intensity: null, notes: null, moment: null });
  const [result, setResult]     = useState<CoffeeKey | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [productoMap, setProductoMap] = useState<Record<string, ProductoData>>({});
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { agregarItem } = useCarrito();

  useEffect(() => {
    createClient()
      .from("productos")
      .select("id, nombre, precio, imagen_url, proceso, slug")
      .in("slug", ["colibri-rojo", "colibri-dorado", "colibri-negro"])
      .then(({ data }) => {
        if (data) setProductoMap(Object.fromEntries(data.map((p) => [p.slug, p])));
      });
  }, []);

  /* ── Scroll reveal via IntersectionObserver ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("rv-visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv-landing").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Sticky CTA scroll ── */
  useEffect(() => {
    let lastY = 0;
    let shown = false;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      if (!shown && pct >= 0.6)        { setStickyVisible(true);  shown = true; }
      else if (shown && pct < 0.55)   { setStickyVisible(false); shown = false; }
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Global click delegation for [data-open-recommender] ── */
  const openOverlay = useCallback(() => {
    setIsClosing(false);
    setIsOpen(true);
    setActiveScreen(1);
    setLeavingScreen(null);
    setAnswers({ intensity: null, notes: null, moment: null });
    setResult(null);
    document.body.style.overflow = "hidden";
  }, []);

  const closeOverlay = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 220);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-open-recommender]")) openOverlay();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openOverlay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeOverlay]);

  /* ── Screen transitions ── */
  function showScreen(target: Screen) {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setLeavingScreen(activeScreen);
    transitionTimer.current = setTimeout(() => {
      setLeavingScreen(null);
      setActiveScreen(target);
    }, 420);
  }

  function selectOption(answer: keyof Answers, value: string) {
    const next = { ...answers, [answer]: value };
    setAnswers(next);
    setTimeout(() => {
      if (answer === "intensity") showScreen(2);
      else if (answer === "notes") showScreen(3);
      else {
        const key = score(next);
        setResult(key);
        showScreen("result");
      }
    }, 260);
  }

  function goBack() {
    if (activeScreen === 2) showScreen(1);
    else if (activeScreen === 3) showScreen(2);
  }

  function restart() {
    setAnswers({ intensity: null, notes: null, moment: null });
    setResult(null);
    showScreen(1);
  }

  /* ── Cart helpers ── */
  function addToCartAndClose(slugs: string[]) {
    for (const slug of slugs) {
      const p = productoMap[slug];
      if (p) agregarItem({ productoId: p.id, nombre: p.nombre, precio: p.precio, imagen_url: p.imagen_url, proceso: p.proceso });
    }
    closeOverlay();
  }

  /* ── Screen class helper ── */
  function screenCls(screen: Screen) {
    const classes = [s.screen];
    if (activeScreen === screen && leavingScreen === null) classes.push(s.screenActive);
    if (leavingScreen === screen) classes.push(s.screenLeaving);
    return classes.join(" ");
  }

  const coffee = result ? COFFEES[result] : null;
  const waMsg = coffee
    ? encodeURIComponent(`Hola PUSU, hice el test y me salió ${coffee.name}. Quiero conversar antes de comprar.`)
    : "";

  return (
    <>
      {/* Scroll-reveal global style */}
      <style>{`
        .rv-landing {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 500ms cubic-bezier(0.16,0.84,0.44,1), transform 500ms cubic-bezier(0.16,0.84,0.44,1);
        }
        .rv-landing.d1 { transition-delay: 60ms; }
        .rv-landing.d2 { transition-delay: 120ms; }
        .rv-landing.d3 { transition-delay: 180ms; }
        .rv-landing.rv-visible { opacity: 1; transform: none; }
      `}</style>

      {/* Sticky mobile CTA */}
      <div className={`${s.stickyCta} ${stickyVisible ? s.stickyCtaVisible : ""}`} aria-hidden="true">
        <button
          data-open-recommender
          className={`${s.btn} ${s.btnPrimary}`}
          style={{ width: "100%", boxShadow: "0 16px 30px -12px rgba(20,20,20,0.45)" }}
        >
          Descubrir mi café
          <ArrowRight />
        </button>
      </div>

      {/* Overlay */}
      {(isOpen || isClosing) && (
        <div
          className={`${s.overlay} ${isOpen && !isClosing ? s.overlayOpen : ""} ${isClosing ? s.overlayClosing : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Recomendador de café"
          onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
        >
          <div className={`${s.shell} ${activeScreen === "result" ? s.shellWide : ""}`}>
            {/* Topbar */}
            <div className={s.topbar}>
              <span className={s.topbarBrand}>PUSU</span>
              <div className={s.progressDots}>
                {([1, 2, 3] as const).map((n) => (
                  <span
                    key={n}
                    className={`${s.progressDot} ${
                      (activeScreen === "result" || (typeof activeScreen === "number" && activeScreen >= n))
                        ? s.progressDotActive
                        : ""
                    }`}
                  />
                ))}
              </div>
              <button className={s.closeBtn} onClick={closeOverlay} aria-label="Cerrar">
                Cerrar
                <CloseIcon />
              </button>
            </div>

            <div className={s.body}>
              {/* Screen 1 */}
              <section className={screenCls(1)} aria-hidden={activeScreen !== 1}>
                <div className={s.screenEyebrow}>01 · Tu taza</div>
                <h3 className={s.screenQ}>¿Cómo te gusta <em style={{ fontStyle: "italic", fontWeight: 300 }}>sentir tu café?</em></h3>
                <p className={s.screenHint}>Una forma de empezar. No hay respuesta correcta.</p>
                <div className={s.options}>
                  {[
                    { key: "A", value: "light",  label: "Suave y fácil",          desc: "Una taza clara, sin peso. Agradable de tomar sola." },
                    { key: "B", value: "medium", label: "Balanceado y dulce",      desc: "Cuerpo medio, dulzura redonda. Funciona con o sin leche." },
                    { key: "C", value: "deep",   label: "Intenso y con carácter",  desc: "Denso, profundo. Se nota desde el primer sorbo." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`${s.option} ${answers.intensity === opt.value ? s.optionSelected : ""}`}
                      onClick={() => selectOption("intensity", opt.value)}
                    >
                      <span className={s.optionKey}>{opt.key}</span>
                      <span>
                        <span className={s.optionLabel}>{opt.label}</span>
                        <span className={s.optionDesc}>{opt.desc}</span>
                      </span>
                      <ArrowSmall />
                    </button>
                  ))}
                </div>
                <div className={s.screenNav}>
                  <button className={`${s.backBtn} ${s.backHidden}`}>← Anterior</button>
                  <span className={s.screenCount}>01 / 03</span>
                </div>
              </section>

              {/* Screen 2 */}
              <section className={screenCls(2)} aria-hidden={activeScreen !== 2}>
                <div className={s.screenEyebrow}>02 · Sabor</div>
                <h3 className={s.screenQ}>¿Qué disfrutas más <em style={{ fontStyle: "italic", fontWeight: 300 }}>en una taza?</em></h3>
                <p className={s.screenHint}>Lo que te haría volver al siguiente sorbo.</p>
                <div className={s.options}>
                  {[
                    { key: "A", value: "fruity", label: "Dulzura cálida",    desc: "Panela, cereza madura, chocolate con leche." },
                    { key: "B", value: "earthy", label: "Notas tostadas",    desc: "Chocolate amargo, nuez tostada, tabaco." },
                    { key: "C", value: "floral", label: "Toque frutal",      desc: "Flor blanca, cítrico suave, miel clara." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`${s.option} ${answers.notes === opt.value ? s.optionSelected : ""}`}
                      onClick={() => selectOption("notes", opt.value)}
                    >
                      <span className={s.optionKey}>{opt.key}</span>
                      <span>
                        <span className={s.optionLabel}>{opt.label}</span>
                        <span className={s.optionDesc}>{opt.desc}</span>
                      </span>
                      <ArrowSmall />
                    </button>
                  ))}
                </div>
                <div className={s.screenNav}>
                  <button className={s.backBtn} onClick={goBack}>← Anterior</button>
                  <span className={s.screenCount}>02 / 03</span>
                </div>
              </section>

              {/* Screen 3 */}
              <section className={screenCls(3)} aria-hidden={activeScreen !== 3}>
                <div className={s.screenEyebrow}>03 · Momento</div>
                <h3 className={s.screenQ}>¿Cuándo lo <em style={{ fontStyle: "italic", fontWeight: 300 }}>disfrutas más?</em></h3>
                <p className={s.screenHint}>El café se parece al momento en que se bebe.</p>
                <div className={s.options}>
                  {[
                    { key: "A", value: "morning", label: "Para empezar el día",            desc: "Primera luz, una taza que abre la mañana." },
                    { key: "B", value: "evening", label: "Para una pausa tranquila",        desc: "Media tarde, sin reloj, con algo que leer." },
                    { key: "C", value: "midday",  label: "Para activarme y concentrarme",  desc: "Antes de una tarea larga, cuando el foco importa." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`${s.option} ${answers.moment === opt.value ? s.optionSelected : ""}`}
                      onClick={() => selectOption("moment", opt.value)}
                    >
                      <span className={s.optionKey}>{opt.key}</span>
                      <span>
                        <span className={s.optionLabel}>{opt.label}</span>
                        <span className={s.optionDesc}>{opt.desc}</span>
                      </span>
                      <ArrowSmall />
                    </button>
                  ))}
                </div>
                <div className={s.screenNav}>
                  <button className={s.backBtn} onClick={goBack}>← Anterior</button>
                  <span className={s.screenCount}>03 / 03</span>
                </div>
              </section>

              {/* Screen result */}
              <section className={screenCls("result")} aria-hidden={activeScreen !== "result"}>
                {coffee && (
                  <div className={s.result}>
                    {/* Image */}
                    <div className={`${s.resultImg} ${s.ph} ${coffee.phClass}`} />

                    {/* Info */}
                    <div>
                      <div className={s.resultKicker}>
                        <span className={s.resultSwatch} style={{ background: coffee.swatch }} />
                        Tu perfil
                      </div>
                      <h3 className={s.resultTitle}>
                        <em style={{ fontStyle: "italic", fontWeight: 300 }}>{coffee.title[0]}</em>
                        {coffee.title[1]}
                      </h3>
                      <p className={s.resultDesc}>{coffee.desc}</p>
                      <div className={s.resultInterp}>"{coffee.interp}"</div>
                      <div className={s.resultNotes}>
                        {coffee.notes.map((n) => <span key={n} className={s.chip}>{n}</span>)}
                      </div>
                      <div className={s.resultMeta}>
                        <span>Origen · {coffee.origin}</span>
                        <span>Altitud · {coffee.altitude}</span>
                        <span>Proceso · {coffee.process}</span>
                      </div>

                      <div className={s.resultBuy}>
                        <button
                          className={s.buyOption}
                          onClick={() => result && addToCartAndClose([COFFEES[result].slug])}
                        >
                          <span>
                            <span className={s.buyOptionName}>Este es el mío</span>
                            <span className={s.buyOptionSub}>Bolsa 250g · {coffee.name} · molienda a pedido</span>
                          </span>
                          <span className={s.buyOptionPrice}>S/ 58</span>
                        </button>
                        <button
                          className={`${s.buyOption} ${s.buyOptionRec}`}
                          onClick={() => result && addToCartAndClose([COFFEES[result].slug])}
                        >
                          <span>
                            <span className={s.buyOptionName}>Quiero este + explorar</span>
                            <span className={s.buyOptionSub}>250g de {coffee.name} + 2 muestras 30g</span>
                          </span>
                          <span style={{ textAlign: "right" }}>
                            <span className={s.buyOptionPrice}>S/ 84</span>
                            <span className={s.buyOptionBadge}>Recomendado</span>
                          </span>
                        </button>
                        <button
                          className={s.buyOption}
                          onClick={() => addToCartAndClose(["colibri-rojo", "colibri-dorado", "colibri-negro"])}
                        >
                          <span>
                            <span className={s.buyOptionName}>Quiero descubrirlos todos</span>
                            <span className={s.buyOptionSub}>Kit · 3 muestras 30g · los tres perfiles</span>
                          </span>
                          <span className={s.buyOptionPrice}>S/ 46</span>
                        </button>
                      </div>

                      <a
                        className={s.resultWa}
                        href={`https://wa.me/${WA}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WaIcon />
                        ¿Dudas? Conversémoslo por WhatsApp
                      </a>
                    </div>

                    <button className={s.resultRestart} onClick={restart}>
                      <RestartIcon />
                      Empezar de nuevo
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ArrowSmall() {
  return (
    <svg className={s.optionArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}
function WaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.8-5.4A8.5 8.5 0 1 1 8.4 19.2L3 21z" />
    </svg>
  );
}
function RestartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

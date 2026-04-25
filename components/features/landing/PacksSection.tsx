import { createClient } from "@/lib/supabase/server";
import s from "./landing.module.css";
import PackBuyBtn from "./PackBuyBtn";

const WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? "51999999999";

function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.8-5.4A8.5 8.5 0 1 1 8.4 19.2L3 21z" />
    </svg>
  );
}

export default async function PacksSection() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("id, nombre, precio, imagen_url, proceso, slug")
    .in("slug", ["colibri-rojo", "colibri-dorado", "colibri-negro"]);

  const bySlug = Object.fromEntries((data ?? []).map((p) => [p.slug, p]));

  const rojo   = bySlug["colibri-rojo"]   ?? null;
  const dorado = bySlug["colibri-dorado"] ?? null;
  const negro  = bySlug["colibri-negro"]  ?? null;

  // Pack 1: Rojo + Negro
  const pack1 = [rojo, negro].filter(Boolean) as NonNullable<typeof rojo>[];
  // Pack 3: all three
  const pack3 = [rojo, dorado, negro].filter(Boolean) as NonNullable<typeof rojo>[];

  const ctaBtnClass = `${s.btn} ${s.btnGhost} ${s.packCtaBtn}`;

  return (
    <section id="packs" className={s.section}>
      <div className={s.sectionHead}>
        <div className={s.sectionNum}>02 / Formatos</div>
        <h2 className={`${s.sectionTitle} rv-landing`}>
          Tres maneras{" "}
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>de empezar.</em>
        </h2>
      </div>

      <div className={s.packs}>
        {/* Pack 1 — Empieza simple */}
        <article className={`${s.pack} rv-landing d1`}>
          <div className={`${s.ph} ${s.packImg}`} />
          <div className={s.packHead}>
            <h3 className={s.packTitle}>
              Empieza{" "}
              <em style={{ fontStyle: "italic", fontFamily: "var(--font-display)" }}>simple</em>
            </h3>
            <div className={s.packPrice}>S/ 37–42</div>
          </div>
          <p className={s.packDesc}>
            Una bolsa 250g de la variedad que quieras. Tostada esta semana, molida a pedido.
          </p>
          <ul className={s.packList}>
            <li>1 × Bolsa 250g (Rojo, Dorado o Negro)</li>
            <li>Molienda a pedido</li>
            <li>Entrega en Lima en 48h</li>
          </ul>
          <div className={s.packCtaRow}>
            <PackBuyBtn productos={pack1} className={ctaBtnClass} />
            <a
              className={ctaBtnClass}
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola PUSU, quiero Empieza simple (Bolsa 250g)")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon />
              WhatsApp
            </a>
          </div>
        </article>

        {/* Pack 2 — Tu café + Explora (featured) — recommender, no change */}
        <article className={`${s.pack} ${s.packFeatured} rv-landing d2`}>
          <span className={s.packBadge}>Más recomendado</span>
          <div className={`${s.ph} ${s.phDorado} ${s.packImg}`} />
          <div className={s.packHead}>
            <h3 className={s.packTitle}>
              Tu café +{" "}
              <em style={{ fontStyle: "italic", fontFamily: "var(--font-display)" }}>Explora</em>
            </h3>
            <div className={s.packPrice}>S/ 84</div>
          </div>
          <p className={s.packDesc}>
            Tu perfil favorito en 250g, con dos muestras de 30g para conocer las otras dos personalidades.
          </p>
          <ul className={s.packList}>
            <li>1 × Bolsa 250g (tu perfil)</li>
            <li>2 × Muestras 30g (otros dos perfiles)</li>
            <li>Tarjeta editorial con notas de cata</li>
          </ul>
          <div className={s.packCtaRow}>
            <button
              data-open-recommender
              className={`${s.btn} ${s.btnPrimary} ${s.packCtaBtn}`}
            >
              Empezar por aquí
            </button>
            <a
              className={ctaBtnClass}
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola PUSU, quiero Tu café + Explora")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon />
              WhatsApp
            </a>
          </div>
        </article>

        {/* Pack 3 — Descubre tu café */}
        <article className={`${s.pack} rv-landing d3`}>
          <div className={`${s.ph} ${s.packImg}`} />
          <div className={s.packHead}>
            <h3 className={s.packTitle}>
              Descubre{" "}
              <em style={{ fontStyle: "italic", fontFamily: "var(--font-display)" }}>tu café</em>
            </h3>
            <div className={s.packPrice}>S/ 46</div>
          </div>
          <p className={s.packDesc}>
            Tres muestras de 30g. Prueba los tres perfiles antes de decidir tu bolsa grande.
          </p>
          <ul className={s.packList}>
            <li>3 × Muestras 30g · Rojo, Dorado, Negro</li>
            <li>Guía simple para no expertos</li>
            <li>Código para canjear contra tu bolsa 250g</li>
          </ul>
          <div className={s.packCtaRow}>
            <PackBuyBtn productos={pack3} className={ctaBtnClass} />
            <a
              className={ctaBtnClass}
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola PUSU, quiero el Kit de descubrimiento")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon />
              WhatsApp
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

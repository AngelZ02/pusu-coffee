import { createClient } from "@/lib/supabase/server";
import s from "./landing.module.css";
import CafeAddBtn from "./CafeAddBtn";

const SLUGS = ["colibri-rojo", "colibri-dorado", "colibri-negro"] as const;

const CAFES = [
  {
    key: "rojo",
    slug: "colibri-rojo",
    accentColor: "var(--color-brand-vino)",
    label: "Colibrí Rojo",
    phClass: s.phRojo,
    name: ["Colibrí ", "Rojo"],
    notes: ["Cereza madura", "Panela", "Cacao"],
    desc: "Para quien prefiere la taza que se siente en el centro del paladar. Dulzura redonda, final largo.",
    meta: [
      { dt: "Origen",   dd: "Cusco · La Convención" },
      { dt: "Altitud",  dd: "1,650 msnm" },
      { dt: "Tueste",   dd: "Medio" },
      { dt: "Proceso",  dd: "Lavado" },
    ],
  },
  {
    key: "dorado",
    slug: "colibri-dorado",
    accentColor: "var(--color-brand-gold)",
    label: "Colibrí Dorado",
    phClass: s.phDorado,
    name: ["Colibrí ", "Dorado"],
    notes: ["Flor blanca", "Miel", "Cítrico suave"],
    desc: "Luminoso y abierto. Un café de mañana clara, con acidez que se parece a una fruta tibia.",
    meta: [
      { dt: "Origen",   dd: "Cajamarca · Jaén" },
      { dt: "Altitud",  dd: "1,820 msnm" },
      { dt: "Tueste",   dd: "Medio claro" },
      { dt: "Proceso",  dd: "Honey" },
    ],
  },
  {
    key: "negro",
    slug: "colibri-negro",
    accentColor: "var(--color-brand-colibri-negro)",
    label: "Colibrí Negro",
    phClass: s.phNegro,
    name: ["Colibrí ", "Negro"],
    notes: ["Chocolate amargo", "Tabaco", "Nuez tostada"],
    desc: "Profundo y sereno. Cuerpo denso, final mineral. Pensado para leer sin prisa.",
    meta: [
      { dt: "Origen",   dd: "Amazonas · Rdz. de Mendoza" },
      { dt: "Altitud",  dd: "1,540 msnm" },
      { dt: "Tueste",   dd: "Medio oscuro" },
      { dt: "Proceso",  dd: "Natural" },
    ],
  },
];

export default async function CafesSection() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("id, nombre, precio, imagen_url, proceso, slug")
    .in("slug", SLUGS);

  const bySlug = Object.fromEntries((data ?? []).map((p) => [p.slug, p]));

  return (
    <section id="cafes" className={s.section}>
      <div className={s.sectionHead}>
        <div className={s.sectionNum}>01 / Cafés</div>
        <h2 className={`${s.sectionTitle} rv-landing`}>
          Tres orígenes.{" "}
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>Tres temperamentos.</em>
        </h2>
      </div>

      <div className={s.personalities}>
        {CAFES.map((cafe, i) => (
          <article
            key={cafe.key}
            className={`${s.coffeeCard} rv-landing d${i + 1}`}
          >
            <div className={s.coffeeAccent}>
              <span className={s.coffeeSwatch} style={{ background: cafe.accentColor }} />
              {cafe.label}
            </div>

            <div className={`${s.ph} ${cafe.phClass} ${s.coffeeImg}`} />

            <h3 className={s.coffeeName}>
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>{cafe.name[0]}</em>
              {cafe.name[1]}
            </h3>

            <div className={s.coffeeNotes}>
              {cafe.notes.map((n) => (
                <span key={n} className={s.chip}>{n}</span>
              ))}
            </div>

            <p className={s.coffeeDesc}>{cafe.desc}</p>

            <dl className={s.coffeeMeta}>
              {cafe.meta.map(({ dt, dd }) => (
                <div key={dt}>
                  <dt className={s.coffeeMetaDt}>{dt}</dt>
                  <dd className={s.coffeeMetaDd}>{dd}</dd>
                </div>
              ))}
            </dl>

            <CafeAddBtn
              producto={bySlug[cafe.slug] ?? null}
              accentColor={cafe.accentColor}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

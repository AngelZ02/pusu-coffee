import s from "./landing.module.css";

const ITEMS = [
  {
    heading: "Café peruano seleccionado",
    body: "Trabajamos con pequeños productores de Cusco, Cajamarca y Amazonas. Cada bolsa indica origen y fecha de tueste.",
  },
  {
    heading: "Guía simple para no expertos",
    body: "Tres perfiles claros, descripciones directas y un recomendador de 3 preguntas. No necesitas vocabulario de barista.",
  },
  {
    heading: "Compra por web o WhatsApp",
    body: "Eliges cómo. Web para lo rápido, WhatsApp si prefieres conversar antes de decidir. Los dos canales llevan al mismo equipo.",
  },
  {
    heading: "Entrega en Lima",
    body: "Envío a Lima Metropolitana en 48h tras el tostado. Fuera de Lima, coordinamos por WhatsApp.",
  },
];

export default function TrustSection() {
  return (
    <section className={s.section} aria-labelledby="trust-title">
      <div className={s.trust}>
        <h2 className={`${s.trustTitle} rv-landing`} id="trust-title">
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>Café peruano.</em>
          <br />
          Dicho simple.
        </h2>

        <div className={s.trustGrid}>
          {ITEMS.map((item, i) => (
            <div key={item.heading} className={`rv-landing d${i % 2 === 0 ? 1 : 2}`}>
              <h4 className={s.trustItemH}>{item.heading}</h4>
              <p className={s.trustItemP}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

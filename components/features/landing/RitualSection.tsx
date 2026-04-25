import s from "./landing.module.css";

const STEPS = [
  { num: "01", verb: "Abrir",     text: "Romper el sello. Oler el grano antes que el agua. El aroma es la primera taza." },
  { num: "02", verb: "Preparar",  text: "Pesar, calentar, esperar. La prisa se nota en la taza. 92 °C, 1:15 agua." },
  { num: "03", verb: "Descubrir", text: "Primera nota, cuerpo, final. Lo que deja cuando ya no está es lo que importa." },
  { num: "04", verb: "Repetir",   text: "No hay receta correcta, solo la que se vuelve tuya. Mañana, otra vez." },
];

export default function RitualSection() {
  return (
    <section id="ritual" className={s.section}>
      <div className={s.sectionHead}>
        <div className={s.sectionNum}>03 / Ritual</div>
        <h2 className={`${s.sectionTitle} rv-landing`}>
          Cuatro gestos,{" "}
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>todos los días.</em>
        </h2>
      </div>

      <div className={s.ritual}>
        {STEPS.map((step, i) => (
          <div key={step.num} className={`${s.ritualStep} rv-landing d${Math.min(i + 1, 3)}`}>
            <div className={s.ritualNum}>{step.num}</div>
            <div className={s.ritualVerb}>{step.verb}</div>
            <p className={s.ritualText}>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

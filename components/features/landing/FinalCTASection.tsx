import s from "./landing.module.css";

export default function FinalCTASection() {
  return (
    <div className={s.final}>
      <div className={s.finalEyebrow}>
        <span className={s.finalBar} />
        <span className={s.eyebrow}>Descubre tu perfil</span>
        <span className={s.finalBar} />
      </div>

      <h2 className={`${s.finalTitle} rv-landing`}>
        Tu café ideal<br />
        <em style={{ fontStyle: "italic", fontWeight: 300 }}>no debería ser</em>{" "}
        <span className={s.finalGold}>una apuesta.</span>
      </h2>

      <div className={`${s.finalCta} rv-landing d1`}>
        <button
          data-open-recommender
          className={`${s.btn} ${s.btnPrimary}`}
        >
          Descubrir mi café
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

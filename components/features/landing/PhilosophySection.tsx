export default function PhilosophySection() {
  return (
    <section className="sec-phil">
      {/* Anillos decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="phil-ring phil-ring-sm" />
        <div className="phil-ring phil-ring-md" />
        <div className="phil-ring phil-ring-lg" />
      </div>

      <p className="phil-q rv">
        "No estamos vendiendo café.<br />
        Estamos vendiendo <em>cómo se siente tomarlo.</em>"
      </p>
      <p className="phil-attr rv d1">— Pusu Coffee · Lima, Perú</p>
    </section>
  );
}

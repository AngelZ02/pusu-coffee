const ITEMS = [
  "Arábica Peruano",
  "Proceso Lavado",
  "Selva Alta",
  "1,600 msnm",
  "Tueste Medio",
  "Single Origin Perú",
  // duplicados para el loop sin corte visual
  "Arábica Peruano",
  "Proceso Lavado",
  "Selva Alta",
  "1,600 msnm",
  "Tueste Medio",
  "Single Origin Perú",
];

export default function TickerSection() {
  return (
    <div className="ticker">
      <div className="tk-inner">
        {ITEMS.map((item, i) => (
          <span key={i} className="tk-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

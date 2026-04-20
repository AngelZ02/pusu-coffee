import Image from "next/image";

const IMAGES = [
  {
    src:   "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    alt:   "Coffee ritual",
    label: "Origen",
    title: "Selva Alta Peruana",
    tall:  true,
  },
  {
    src:   "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&q=80",
    alt:   "Brewing",
    label: "Proceso",
    title: "Tueste Artesanal",
    tall:  false,
  },
  {
    src:   "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    alt:   "Cup",
    label: "Resultado",
    title: "Perfil Único",
    tall:  false,
  },
];

export default function RitualSection() {
  return (
    <section className="sec-black">
      <div className="rv">
        <div className="slabel">El Ritual</div>
        <h2 className="stitle-light">
          Cada taza,<br /><em>una experiencia</em>
        </h2>
      </div>

      <div className="img-row rv d1">
        {IMAGES.map((img) => (
          <div key={img.src} className={`img-block ${img.tall ? "img-block-tall" : ""}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width:700px) 100vw, 40vw"
            />
            <div className="img-caption">
              <div className="img-cap-label">{img.label}</div>
              <div className="img-cap-title">{img.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

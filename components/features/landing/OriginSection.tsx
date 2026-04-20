import Image from "next/image";

export default function OriginSection() {
  return (
    <section id="origen" className="sec-origin">
      {/* Imagen izquierda */}
      <div className="origin-img-wrap">
        <Image
          src="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=900&q=80"
          alt="Origen del café — selva alta peruana"
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        <div className="origin-img-overlay" />
      </div>

      {/* Texto derecha */}
      <div className="origin-text">
        <div className="rv">
          <div className="slabel">Nuestro Origen</div>
          <h2 className="origin-h">
            Arábica Catimor<br /><em>de las alturas</em>
          </h2>
        </div>

        <p className="origin-body rv d1">
          Cultivado en los valles de la selva alta peruana, a más de 1,600 msnm.
          Variedad Catimor: estable, equilibrada, con perfiles que van del cacao a
          la nuez y un dulzor limpio que persiste.
        </p>

        <div className="ostats rv d2">
          <div>
            <div className="ostat-n">1,600<sup>m</sup></div>
            <div className="ostat-l">Altitud</div>
          </div>
          <div>
            <div className="ostat-n">100%</div>
            <div className="ostat-l">Arábica</div>
          </div>
          <div>
            <div className="ostat-n">3</div>
            <div className="ostat-l">Procesos</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

const WA_HREF = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? "51980792770"}`;

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Imagen de fondo con animación zoom */}
      <div className="hero-img-zoom">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
          alt="Pusu Coffee — café de especialidad peruano"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Overlay degradado */}
      <div className="hero-overlay" />

      {/* Contenido */}
      <div className="hero-content">
        <p className="hero-eyebrow">Single Origin · Perú · Arábica</p>

        <h1 className="hero-title">
          Café<br />que<br /><em>se siente.</em>
        </h1>

        <div className="hero-btns">
          <Link href="/productos" className="btn-solid">
            Ver la colección
          </Link>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="wi" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.133.558 4.136 1.535 5.874L.057 23.943l6.273-1.644A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.031-1.378l-.36-.214-3.733.979 1.001-3.648-.235-.375A9.861 9.861 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106S21.894 6.53 21.894 12 17.47 21.894 12 21.894z" />
    </svg>
  );
}

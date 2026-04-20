import Link from "next/link";

const WA_HREF = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? "51980792770"}`;

export default function HowToBuySection() {
  return (
    <section className="sec-off">
      <div className="rv">
        <div className="slabel">¿Cómo comprar?</div>
        <h2 className="stitle-dark">
          Dos formas de<br /><em>hacerlo tuyo</em>
        </h2>
      </div>

      <div className="bcards">
        {/* Tienda online */}
        <div className="bcard rv d1">
          <div className="bnum">01</div>
          <div className="bicon">🛒</div>
          <h3 className="bhead">Tienda online</h3>
          <p className="bbody">
            Elige tu blend, paga con tarjeta o Yape y recibe en Lima en 24–48 horas.
            Rápido, seguro, sin complicaciones.
          </p>
          <Link href="/productos" className="blink">
            Ir a la tienda
          </Link>
        </div>

        {/* WhatsApp directo */}
        <div className="bcard rv d2">
          <div className="bnum">02</div>
          <div className="bicon">💬</div>
          <h3 className="bhead">WhatsApp directo</h3>
          <p className="bbody">
            Asistente inteligente: te guía, resuelve dudas y confirma tu pedido
            en minutos. Velocidad de bot, atención real.
          </p>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="blink">
            Abrir chat
          </a>
        </div>
      </div>
    </section>
  );
}

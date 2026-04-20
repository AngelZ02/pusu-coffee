"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCarrito } from "@/lib/carrito/context";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "51999999999";

function ConfirmadoContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id") ?? "";
  const { limpiarCarrito } = useCarrito();
  const idCorto = rawId.slice(0, 8).toUpperCase();

  useEffect(() => {
    limpiarCarrito();
  }, [limpiarCarrito]);

  return (
    <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
      {/* Ícono de check animado */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
        <div className="check-circle">
          <svg
            className="check-svg"
            viewBox="0 0 52 52"
            width="52"
            height="52"
            fill="none"
          >
            <circle
              className="check-ring"
              cx="26"
              cy="26"
              r="24"
              stroke="var(--color-brand-gold)"
              strokeWidth="1.5"
            />
            <path
              className="check-mark"
              d="M14 27l8 8 16-16"
              stroke="var(--color-brand-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Número de pedido */}
      <p
        style={{
          fontSize: "9.5px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-brand-bark)",
          marginBottom: "12px",
          fontFamily: "var(--font-body)",
        }}
      >
        {idCorto ? `#PC-${idCorto}` : "Pedido confirmado"}
      </p>

      {/* Título */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 6vw, 64px)",
          fontWeight: 300,
          color: "var(--color-brand-black)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: "20px",
        }}
      >
        Pedido{" "}
        <em style={{ fontStyle: "italic", color: "var(--color-brand-gold-lt)" }}>
          confirmado
        </em>
      </h1>

      <p
        style={{
          color: "var(--color-brand-bark)",
          fontSize: "14px",
          lineHeight: 1.6,
          letterSpacing: "0.03em",
          marginBottom: "40px",
          fontFamily: "var(--font-body)",
        }}
      >
        Tu café de especialidad está en camino.
        <br />
        Entrega en Lima en{" "}
        <span style={{ color: "var(--color-brand-gold)" }}>24–48 horas</span>.
      </p>

      {/* Separador */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "var(--color-brand-gold)",
          margin: "0 auto 40px",
          opacity: 0.4,
        }}
      />

      {/* Botones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20acabo%20de%20hacer%20un%20pedido%20%23PC-${idCorto}%20y%20tengo%20una%20consulta.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-dark"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ opacity: 0.6 }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          ¿Dudas? Escríbenos
        </a>

        <Link
          href="/productos"
          className="btn-ghost"
          style={{ textAlign: "center", borderColor: "rgba(61,32,16,0.3)", color: "var(--color-brand-bark)" }}
        >
          Seguir explorando
        </Link>
      </div>
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <section
      style={{
        background: "var(--color-brand-cream)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Suspense fallback={null}>
        <ConfirmadoContent />
      </Suspense>
    </section>
  );
}

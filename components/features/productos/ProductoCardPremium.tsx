"use client";

import Image from "next/image";
import { useCarrito } from "@/lib/carrito/context";

interface Producto {
  id: string;
  nombre: string;
  proceso: string;
  precio: number;
  peso_g: number;
  notas: string;
  imagen_url?: string | null;
}

interface Props {
  producto: Producto;
  index: number;
}

function getAccentColor(nombre: string, index: number): string {
  const n = nombre.toLowerCase();
  if (n.includes("rojo")) return "var(--color-brand-vino)";
  if (n.includes("dorado")) return "var(--color-brand-gold)";
  if (n.includes("negro")) return "var(--color-brand-colibri-negro)";
  const fallback = ["var(--color-brand-vino)", "var(--color-brand-gold)", "var(--color-brand-colibri-negro)"];
  return fallback[index % 3];
}

function getAccentGradient(nombre: string, index: number): string {
  const n = nombre.toLowerCase();
  if (n.includes("dorado")) return "linear-gradient(90deg, var(--color-brand-gold), var(--color-brand-gold-lt))";
  return "none";
}

export default function ProductoCardPremium({ producto, index }: Props) {
  const { agregarItem } = useCarrito();
  const accent = getAccentColor(producto.nombre, index);
  const gradient = getAccentGradient(producto.nombre, index);
  const tags = producto.notas.split(",").map((t) => t.trim());

  const imgUrl = producto.imagen_url
    ? `${producto.imagen_url}?w=600&q=80`
    : null;

  function handleAgregar() {
    agregarItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url ?? null,
      proceso: producto.proceso,
    });
  }

  return (
    <div className="prod-card-premium group">
      {/* Barra de acento superior */}
      <div
        style={{
          height: "3px",
          background: gradient !== "none" ? gradient : accent,
          flexShrink: 0,
        }}
      />

      {/* Imagen */}
      <div
        style={{
          position: "relative",
          height: "260px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={producto.nombre}
            fill
            style={{ objectFit: "cover" }}
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--color-brand-cream-2)",
            }}
          />
        )}
        {/* Overlay de acento sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: accent,
            opacity: 0.05,
          }}
        />
      </div>

      {/* Contenido */}
      <div style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
        {/* Pill de proceso */}
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "var(--color-brand-gold-pale)",
              border: "1px solid rgba(196,149,48,0.3)",
              color: "var(--color-brand-bark)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            Proceso {producto.proceso}
          </span>
        </div>

        {/* Nombre */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 300,
            color: "var(--color-brand-black)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {producto.nombre}
        </h2>

        {/* Tags de sabor */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 10px",
                background: "transparent",
                border: "1px solid rgba(61,32,16,0.15)",
                color: "var(--color-brand-bark)",
                fontSize: "10px",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-body)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Precio + peso */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 400,
              color: "var(--color-brand-gold)",
              lineHeight: 1,
            }}
          >
            S/ {producto.precio}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--color-brand-mid)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.08em",
              paddingBottom: "2px",
            }}
          >
            {producto.peso_g}g
          </span>
        </div>

        {/* Botón */}
        <button
          onClick={handleAgregar}
          className="btn-primary-dark"
          type="button"
          style={{ width: "100%", textAlign: "center" }}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/lib/carrito/context";

const ENVIO = 8;

export default function CarritoDrawer() {
  const {
    drawerOpen,
    cerrarDrawer,
    items,
    total,
    cantidadItems,
    quitarItem,
    cambiarCantidad,
  } = useCarrito();

  // Bloquear scroll del body mientras el drawer está abierto
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cerrarDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${drawerOpen ? "drawer-overlay--visible" : ""}`}
        onClick={cerrarDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`drawer-panel ${drawerOpen ? "drawer-panel--open" : ""}`}
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="drawer-header">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: 300,
              color: "var(--color-brand-cream)",
              letterSpacing: "-0.01em",
            }}
          >
            Tu selección
          </h2>
          <button
            onClick={cerrarDrawer}
            className="drawer-close"
            aria-label="Cerrar carrito"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                color: "var(--color-brand-cream-30)",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Tu selección está vacía
            </p>
            <button
              onClick={cerrarDrawer}
              className="btn-ghost"
              style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}
              type="button"
            >
              Explorar colección
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.productoId} className="drawer-item">
                  {/* Imagen mini */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--color-brand-charcoal)",
                    }}
                  >
                    {item.imagen_url && (
                      <Image
                        src={`${item.imagen_url}?w=128&q=70`}
                        alt={item.nombre}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="64px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        color: "var(--color-brand-cream)",
                        fontWeight: 400,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.nombre}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "var(--color-brand-mid)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginTop: "2px",
                      }}
                    >
                      {item.proceso}
                    </p>
                    {/* Cantidad */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          cambiarCantidad(item.productoId, item.cantidad - 1)
                        }
                        className="qty-btn"
                        type="button"
                        aria-label="Quitar uno"
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--color-brand-cream)",
                          minWidth: "16px",
                          textAlign: "center",
                        }}
                      >
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          cambiarCantidad(item.productoId, item.cantidad + 1)
                        }
                        className="qty-btn"
                        type="button"
                        aria-label="Agregar uno"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Precio + eliminar */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        color: "var(--color-brand-gold)",
                      }}
                    >
                      S/ {item.precio * item.cantidad}
                    </span>
                    <button
                      onClick={() => quitarItem(item.productoId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-brand-cream-20)",
                        cursor: "pointer",
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: 0,
                        transition: "color 0.2s",
                      }}
                      type="button"
                      aria-label="Eliminar producto"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con totales y botones */}
            <div className="drawer-footer">
              <div className="drawer-totals">
                <div className="drawer-total-row">
                  <span>Subtotal</span>
                  <span>S/ {total}</span>
                </div>
                <div className="drawer-total-row">
                  <span>Envío (Lima)</span>
                  <span>S/ {ENVIO}</span>
                </div>
                <div
                  className="drawer-total-row"
                  style={{
                    borderTop: "1px solid var(--color-brand-gold-20)",
                    paddingTop: "12px",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      color: "var(--color-brand-cream)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                      color: "var(--color-brand-gold)",
                    }}
                  >
                    S/ {total + ENVIO}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-solid"
                style={{ display: "block", textAlign: "center", width: "100%" }}
                onClick={cerrarDrawer}
              >
                Proceder al pago
              </Link>

              <button
                onClick={cerrarDrawer}
                className="btn-ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}
                type="button"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

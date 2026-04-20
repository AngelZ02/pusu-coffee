"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { procesarPago } from "@/lib/payments";
import { useCarrito } from "@/lib/carrito/context";

interface Props {
  pedidoId: string;
  total: number;
}

type MetodoPago = "tarjeta" | "yape";
type EstadoBoton = "idle" | "loading" | "error";

export default function PagoMock({ pedidoId, total }: Props) {
  const router = useRouter();
  const { limpiarCarrito } = useCarrito();
  const [metodo, setMetodo] = useState<MetodoPago>("tarjeta");
  const [estado, setEstado] = useState<EstadoBoton>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handlePagar() {
    setEstado("loading");
    setErrorMsg("");

    try {
      const result = await procesarPago({ pedidoId, total });
      if (result.ok) {
        limpiarCarrito();
        router.push(`/pedido-confirmado?id=${pedidoId}`);
      } else {
        setEstado("error");
        setErrorMsg(result.error ?? "Error al procesar el pago");
      }
    } catch {
      setEstado("error");
      setErrorMsg("Error de conexión — intenta de nuevo");
    }
  }

  return (
    <div className="pago-mock-card">
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: 300,
          color: "var(--color-brand-black)",
          marginBottom: "28px",
          letterSpacing: "-0.01em",
        }}
      >
        Confirmar pago
      </h3>

      {/* Total destacado */}
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          background: "rgba(196,149,48,0.12)",
          border: "1px solid rgba(196,149,48,0.15)",
          marginBottom: "32px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-brand-mid)",
            fontFamily: "var(--font-body)",
            marginBottom: "8px",
          }}
        >
          Total a pagar
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "48px",
            fontWeight: 300,
            color: "var(--color-brand-gold)",
            lineHeight: 1,
          }}
        >
          S/ {total}
        </p>
      </div>

      {/* Selección de método */}
      <p
        style={{
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--color-brand-mid)",
          marginBottom: "12px",
          fontFamily: "var(--font-body)",
        }}
      >
        Método de pago
      </p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
        {(["tarjeta", "yape"] as MetodoPago[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMetodo(m)}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              border: `1px solid ${metodo === m ? "var(--color-brand-gold)" : "rgba(0,0,0,0.1)"}`,
              color:
                metodo === m
                  ? "var(--color-brand-gold)"
                  : "rgba(61,32,16,0.4)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
              fontFamily: "var(--font-body)",
            }}
          >
            {m === "tarjeta" ? "💳 Tarjeta" : "📱 Yape"}
          </button>
        ))}
      </div>

      {/* Inputs decorativos (no funcionales) */}
      {metodo === "tarjeta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
          <div className="pago-input-wrap">
            <p className="pago-input-label">Número de tarjeta</p>
            <input
              readOnly
              value="•••• •••• •••• ••••"
              className="pago-input"
              aria-label="Número de tarjeta (decorativo)"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="pago-input-wrap">
              <p className="pago-input-label">Vencimiento</p>
              <input
                readOnly
                value="MM / AA"
                className="pago-input"
                aria-label="Fecha de vencimiento (decorativo)"
              />
            </div>
            <div className="pago-input-wrap">
              <p className="pago-input-label">CVV</p>
              <input
                readOnly
                value="•••"
                className="pago-input"
                aria-label="CVV (decorativo)"
              />
            </div>
          </div>
        </div>
      )}

      {metodo === "yape" && (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            background: "var(--color-brand-cream)",
            border: "1px solid var(--color-brand-cream-2)",
            marginBottom: "28px",
            color: "var(--color-brand-mid)",
            fontSize: "12px",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-body)",
          }}
        >
          Yape disponible próximamente
        </div>
      )}

      {/* Error */}
      {estado === "error" && (
        <div
          style={{
            padding: "12px 16px",
            border: "1px solid rgba(220,50,50,0.4)",
            background: "rgba(220,50,50,0.06)",
            color: "#e06060",
            fontSize: "12px",
            letterSpacing: "0.03em",
            fontFamily: "var(--font-body)",
            marginBottom: "16px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Botón de pago */}
      <button
        onClick={handlePagar}
        disabled={estado === "loading"}
        type="button"
        style={{
          width: "100%",
          padding: "18px",
          background:
            estado === "loading"
              ? "transparent"
              : estado === "error"
              ? "transparent"
              : "var(--color-brand-black)",
          border:
            estado === "error"
              ? "1px solid rgba(220,50,50,0.5)"
              : estado === "loading"
              ? "1px solid rgba(196,149,48,0.3)"
              : "none",
          color:
            estado === "loading"
              ? "var(--color-brand-gold)"
              : estado === "error"
              ? "#e06060"
              : "var(--color-brand-cream)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 500,
          cursor: estado === "loading" ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          fontFamily: "var(--font-body)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {estado === "loading" ? (
          <>
            <span className="spinner-gold" />
            Procesando...
          </>
        ) : estado === "error" ? (
          "Error al procesar — intenta de nuevo"
        ) : (
          `Pagar S/ ${total}`
        )}
      </button>

      {/* Nota de seguridad */}
      <p
        style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "10px",
          color: "var(--color-brand-mid)",
          letterSpacing: "0.05em",
          fontFamily: "var(--font-body)",
        }}
      >
        🔒 Pago seguro — Procesado por Mercado Pago (próximamente)
      </p>
    </div>
  );
}

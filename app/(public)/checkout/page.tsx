"use client";

import { useState, FormEvent } from "react";
import { useCarrito } from "@/lib/carrito/context";
import PagoMock from "@/components/features/checkout/PagoMock";
import Image from "next/image";
import Link from "next/link";

interface PedidoInfo {
  pedidoId: string;
  total: number;
}

const ENVIO = 8;

export default function CheckoutPage() {
  const { items, total, cantidadItems } = useCarrito();

  const [pedidoInfo, setPedidoInfo] = useState<PedidoInfo | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Campos del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    referencia: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validarTelefono(tel: string): boolean {
    return /^9\d{8}$/.test(tel.replace(/\s/g, ""));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!validarTelefono(form.telefono)) {
      setError("El teléfono debe tener 9 dígitos y empezar en 9 (ej: 987654321)");
      return;
    }

    if (items.length === 0) {
      setError("Tu carrito está vacío");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: {
            nombre: form.nombre.trim(),
            email: form.email.trim(),
            telefono: form.telefono.trim(),
            direccion: form.direccion.trim(),
            referencia: form.referencia.trim() || undefined,
          },
          items: items.map((i) => ({
            productoId: i.productoId,
            cantidad: i.cantidad,
            precio: i.precio,
          })),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setPedidoInfo({ pedidoId: data.data.pedidoId, total: data.data.total });
      } else {
        setError(data.error ?? "Error al crear el pedido");
      }
    } catch {
      setError("Error de conexión — verifica tu internet e intenta de nuevo");
    } finally {
      setEnviando(false);
    }
  }

  // Carrito vacío sin pedido iniciado
  if (items.length === 0 && !pedidoInfo) {
    return (
      <section
        style={{
          background: "var(--color-brand-white)",
          minHeight: "100vh",
          paddingTop: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              color: "var(--color-brand-bark-40)",
              fontStyle: "italic",
              marginBottom: "24px",
            }}
          >
            Tu carrito está vacío
          </p>
          <Link href="/productos" className="btn-solid">
            Explorar colección
          </Link>
        </div>
      </section>
    );
  }

  // Paso 2: mostrar PagoMock
  if (pedidoInfo) {
    return (
      <section
        style={{
          background: "var(--color-brand-white)",
          minHeight: "100vh",
          paddingTop: "100px",
          paddingBottom: "80px",
        }}
      >
        <div
          className="container-brand"
          style={{ maxWidth: "520px" }}
        >
          <PagoMock pedidoId={pedidoInfo.pedidoId} total={pedidoInfo.total} />
        </div>
      </section>
    );
  }

  // Paso 1: formulario + resumen
  return (
    <section
      style={{
        background: "var(--color-brand-white)",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <div className="container-brand">
        <div className="checkout-grid">
          {/* ── Columna izquierda: formulario ── */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300,
                color: "var(--color-brand-black)",
                letterSpacing: "-0.02em",
                marginBottom: "40px",
              }}
            >
              Tus datos de entrega
            </h1>

            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "28px" }}
              >
                <FloatingField
                  label="Nombre completo *"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                <FloatingField
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <FloatingField
                  label="Teléfono celular * (9XXXXXXXX)"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  maxLength={9}
                />
                <FloatingField
                  label="Dirección de entrega * (Lima Metropolitana)"
                  name="direccion"
                  type="text"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  autoComplete="street-address"
                />
                <FloatingField
                  label="Referencia (opcional — frente al parque, piso 3...)"
                  name="referencia"
                  type="text"
                  value={form.referencia}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "12px 16px",
                    border: "1px solid var(--color-brand-error-border)",
                    background: "var(--color-brand-error-bg)",
                    color: "var(--color-brand-error)",
                    fontSize: "12px",
                    letterSpacing: "0.03em",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="btn-solid"
                style={{
                  marginTop: "36px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  opacity: enviando ? 0.7 : 1,
                  cursor: enviando ? "not-allowed" : "pointer",
                }}
              >
                {enviando ? (
                  <>
                    <span className="spinner-gold" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar y pagar"
                )}
              </button>
            </form>
          </div>

          {/* ── Columna derecha: resumen ── */}
          <div>
            <div className="checkout-summary">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 300,
                  color: "var(--color-brand-black)",
                  letterSpacing: "-0.01em",
                  marginBottom: "28px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--color-brand-gold-15)",
                }}
              >
                Resumen del pedido
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {items.map((item) => (
                  <div
                    key={item.productoId}
                    style={{ display: "flex", gap: "14px", alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        position: "relative",
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "var(--color-brand-cream-2)",
                      }}
                    >
                      {item.imagen_url && (
                        <Image
                          src={`${item.imagen_url}?w=104&q=70`}
                          alt={item.nombre}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="52px"
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "15px",
                          color: "var(--color-brand-black)",
                        }}
                      >
                        {item.nombre}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "var(--color-brand-mid)",
                          marginTop: "2px",
                          letterSpacing: "0.08em",
                        }}
                      >
                        x{item.cantidad} — Proceso {item.proceso}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        color: "var(--color-brand-gold)",
                      }}
                    >
                      S/ {item.precio * item.cantidad}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div
                style={{
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--color-brand-gold-15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-brand-mid)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{ fontSize: "13px", color: "var(--color-brand-bark-60)" }}
                  >
                    S/ {total}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-brand-mid)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Envío (Lima)
                  </span>
                  <span
                    style={{ fontSize: "13px", color: "var(--color-brand-bark-60)" }}
                  >
                    S/ {ENVIO}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--color-brand-gold-20)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      color: "var(--color-brand-black)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      color: "var(--color-brand-gold)",
                    }}
                  >
                    S/ {total + ENVIO}
                  </span>
                </div>
              </div>

              {/* Nota de entrega */}
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "10px",
                  color: "var(--color-brand-bark-40)",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  fontFamily: "var(--font-body)",
                }}
              >
                Entrega en Lima — 24 a 48 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Campo con label flotante estilo premium
interface FieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
}

function FloatingField({
  label,
  name,
  type,
  value,
  onChange,
  required,
  autoComplete,
  maxLength,
}: FieldProps) {
  return (
    <div className="float-field">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder=" "
        className="float-input"
      />
      <label htmlFor={name} className="float-label">
        {label}
      </label>
    </div>
  );
}

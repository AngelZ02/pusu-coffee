"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  productoId: string;
  monto: number;       // en céntimos
  nombre: string;
  email?: string;
}

declare global {
  interface Window {
    // Culqi.js se carga como script externo
    Culqi?: {
      publicKey: string;
      settings: (opts: object) => void;
      open: () => void;
      token?: { id: string; email: string };
    };
  }
}

export default function BotonPago({ productoId, monto, nombre, email }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePago() {
    setError(null);

    if (!window.Culqi) {
      setError("Culqi no está disponible. Recarga la página.");
      return;
    }

    // Configurar Culqi antes de abrir el modal
    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!;
    window.Culqi.settings({
      title: "Pusu Coffee",
      currency: "PEN",
      description: nombre,
      amount: monto,
    });

    // Abrir el modal de pago de Culqi
    window.Culqi.open();

    // El callback de culqiAction se maneja globalmente en un useEffect o script
    // Aquí solo abrimos el modal; la lógica de cobro está en /api/payments/culqi
  }

  async function procesarCargo(token: string, correo: string) {
    setLoading(true);
    try {
      // 1. Crear pedido
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ producto_id: productoId, cantidad: 1, precio_unitario: monto }],
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.ok) throw new Error(orderData.error);

      // 2. Procesar pago
      const payRes = await fetch("/api/payments/culqi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          order_id: orderData.data.id,
          email: correo,
        }),
      });
      const payData = await payRes.json();
      if (!payData.ok) throw new Error(payData.error);

      alert("¡Pago exitoso! Gracias por tu compra en Pusu Coffee.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  }

  // Exponer para que Culqi.js lo llame al tokenizar
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).culqiAction = () => {
      if (window.Culqi?.token) {
        procesarCargo(window.Culqi.token.id, window.Culqi.token.email);
      }
    };
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="primary" loading={loading} onClick={handlePago}>
        Comprar
      </Button>
      {error && (
        <p className="text-brand-vino text-xs max-w-[160px] text-right">{error}</p>
      )}
    </div>
  );
}

export interface ProcesarPagoParams {
  pedidoId: string;
  total: number;
}

export interface ProcesarPagoResult {
  ok: boolean;
  data?: { pedidoId: string };
  error?: string;
}

// Punto de entrada único para pagos.
// TODO: reemplazar la llamada a /api/payments/mock con Mercado Pago SDK cuando tengamos RUC.
// Solo este archivo necesita cambiar — el resto del frontend no toca.
export async function procesarPago({
  pedidoId,
}: ProcesarPagoParams): Promise<ProcesarPagoResult> {
  const res = await fetch("/api/payments/mock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pedidoId }),
  });
  return res.json();
}

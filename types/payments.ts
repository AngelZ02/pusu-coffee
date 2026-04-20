export interface CulqiChargePayload {
  token: string;      // token generado por Culqi.js en el frontend
  order_id: string;
  email: string;
}

export interface CulqiChargeResult {
  charge_id: string;
}

export type PaymentEstado = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  order_id: string;
  culqi_charge_id: string;
  amount: number;
  currency: string;
  estado: PaymentEstado;
  created_at: string;
}

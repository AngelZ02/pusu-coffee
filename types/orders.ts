export type OrderEstado = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";

export interface OrderItem {
  producto_id: string;
  cantidad: number;
  precio_unitario: number; // en céntimos
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total: number;           // en céntimos
  estado: OrderEstado;
  culqi_charge_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  user_id?: string;
  items: OrderItem[];
}

// Producto para uso en frontend
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;          // en céntimos
  imagen_url: string | null;
  stock: number;
}

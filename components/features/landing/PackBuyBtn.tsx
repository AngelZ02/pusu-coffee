"use client";

import { useCarrito } from "@/lib/carrito/context";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  proceso: string;
}

interface Props {
  productos: Producto[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PackBuyBtn({ productos, children, className, style }: Props) {
  const { agregarItem } = useCarrito();

  if (!productos.length) return null;

  function handleClick() {
    for (const p of productos) {
      agregarItem({
        productoId: p.id,
        nombre: p.nombre,
        precio: p.precio,
        imagen_url: p.imagen_url,
        proceso: p.proceso,
      });
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children ?? "Comprar en web"}
    </button>
  );
}

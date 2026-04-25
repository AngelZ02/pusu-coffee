"use client";

import { useCarrito } from "@/lib/carrito/context";
import s from "./landing.module.css";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  proceso: string;
}

interface Props {
  producto: Producto | null;
  accentColor: string;
}

export default function CafeAddBtn({ producto, accentColor }: Props) {
  const { agregarItem } = useCarrito();

  if (!producto) return null;

  return (
    <button
      type="button"
      className={`${s.btn} ${s.btnSm} ${s.cafeAddBtn}`}
      style={{ "--cafe-accent": accentColor } as React.CSSProperties}
      onClick={() =>
        agregarItem({
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen_url: producto.imagen_url,
          proceso: producto.proceso,
        })
      }
    >
      Añadir al carrito
    </button>
  );
}

"use client";

import Image from "next/image";
import Card, { CardContent } from "@/components/ui/Card";
import BotonPago from "@/components/features/checkout/BotonPago";
import type { Producto } from "@/types/orders";

interface Props {
  producto: Producto;
}

export default function ProductoCard({ producto }: Props) {
  const precioSoles = (producto.precio / 100).toFixed(2);

  return (
    <Card variant="elevated" className="flex flex-col group">
      {/* Imagen */}
      <div className="relative aspect-square bg-brand-cream-2 overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-gold/30 text-5xl select-none">
            ☕
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-display text-xl text-brand-black">{producto.nombre}</h3>
          <p className="text-brand-charcoal/60 text-sm mt-1 leading-relaxed">
            {producto.descripcion}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-cream-2">
          <span className="text-brand-gold font-medium">S/ {precioSoles}</span>
          <BotonPago
            productoId={producto.id}
            monto={producto.precio}
            nombre={producto.nombre}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit/log";

interface ClienteInput {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  referencia?: string;
}

interface ItemInput {
  productoId: string;
  cantidad: number;
  precio: number; // precio del cliente — se valida contra Supabase abajo
}

interface CreateOrderBody {
  cliente: ClienteInput;
  items: ItemInput[];
}

const ENVIO = 8; // soles, fijo Lima Metropolitana

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderBody = await req.json();
    const { cliente, items } = body;

    // Validaciones de entrada
    if (
      !cliente?.email ||
      !cliente?.nombre ||
      !cliente?.telefono ||
      !cliente?.direccion
    ) {
      return NextResponse.json(
        { ok: false, error: "Datos del cliente incompletos" },
        { status: 400 }
      );
    }
    if (!items?.length) {
      return NextResponse.json(
        { ok: false, error: "El pedido debe tener al menos un producto" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Validar precios contra Supabase — NUNCA confiar en el precio del cliente
    const productoIds = items.map((i) => i.productoId);
    const { data: productos, error: prodError } = await supabase
      .from("productos")
      .select("id, precio, activo, stock")
      .in("id", productoIds);

    if (prodError || !productos?.length) {
      return NextResponse.json(
        { ok: false, error: "No se pudieron validar los productos" },
        { status: 400 }
      );
    }

    // Calcular total en servidor con precios reales
    let subtotal = 0;
    for (const item of items) {
      const prod = productos.find((p) => p.id === item.productoId);
      if (!prod) {
        return NextResponse.json(
          { ok: false, error: `Producto ${item.productoId} no encontrado` },
          { status: 400 }
        );
      }
      if (!prod.activo) {
        return NextResponse.json(
          { ok: false, error: "Uno o más productos no están disponibles" },
          { status: 400 }
        );
      }
      subtotal += prod.precio * item.cantidad;
    }

    const total = subtotal + ENVIO;

    // Upsert cliente por email
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert(
        {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          referencia: cliente.referencia ?? null,
        },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select("id")
      .single();

    if (clienteError || !clienteData) {
      return NextResponse.json(
        { ok: false, error: clienteError?.message ?? "Error al guardar cliente" },
        { status: 500 }
      );
    }

    // Insertar pedido con el primer item como producto principal
    // (schema CLAUDE.md: pedidos tiene producto_id singular)
    const primerItem = items[0];

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        cliente_id: clienteData.id,
        producto_id: primerItem.productoId,
        cantidad: primerItem.cantidad,
        total,
        estado: "pendiente",
      })
      .select("id")
      .single();

    if (pedidoError || !pedido) {
      return NextResponse.json(
        {
          ok: false,
          error: pedidoError?.message ?? "Error al crear el pedido",
        },
        { status: 500 }
      );
    }

    await auditLog({
      action: "order.created",
      entity: "pedidos",
      entity_id: pedido.id,
      metadata: {
        total,
        subtotal,
        envio: ENVIO,
        items_count: items.length,
        cliente_email: cliente.email,
      },
    });

    return NextResponse.json(
      { ok: true, data: { pedidoId: pedido.id, total, clienteId: clienteData.id } },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

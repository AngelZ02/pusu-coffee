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
  precio: number; // client value — validated server-side below
}

interface CreateOrderBody {
  cliente: ClienteInput;
  items: ItemInput[];
}

const ENVIO = 8; // soles, Lima Metropolitana

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  try {
    const body: CreateOrderBody = await req.json();
    const { cliente, items } = body;

    if (!cliente?.email || !cliente?.nombre || !cliente?.telefono || !cliente?.direccion) {
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

    // ── Validate prices server-side — never trust client amounts ──
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

    // ── Upsert cliente (email is the unique key) ──────────────────
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert(
        {
          nombre:   cliente.nombre,
          email:    cliente.email,
          telefono: cliente.telefono,
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

    // ── Insert direccion ──────────────────────────────────────────
    const { data: direccionData, error: direccionError } = await supabase
      .from("direcciones")
      .insert({
        cliente_id:  clienteData.id,
        direccion:   cliente.direccion,
        referencia:  cliente.referencia ?? null,
        es_principal: false,
      })
      .select("id")
      .single();

    if (direccionError || !direccionData) {
      return NextResponse.json(
        { ok: false, error: direccionError?.message ?? "Error al guardar dirección" },
        { status: 500 }
      );
    }

    // ── Insert pedido ─────────────────────────────────────────────
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        cliente_id:   clienteData.id,
        direccion_id: direccionData.id,
        estado:       "pendiente",
        total,
        metodo_pago:  "mock",
      })
      .select("id")
      .single();

    if (pedidoError || !pedido) {
      return NextResponse.json(
        { ok: false, error: pedidoError?.message ?? "Error al crear el pedido" },
        { status: 500 }
      );
    }

    // ── Insert ALL pedido_items ───────────────────────────────────
    const pedidoItemsData = items.map((item) => {
      const prod = productos.find((p) => p.id === item.productoId)!;
      return {
        pedido_id:       pedido.id,
        producto_id:     item.productoId,
        cantidad:        item.cantidad,
        precio_unitario: prod.precio, // server-validated price
      };
    });

    const { error: itemsError } = await supabase
      .from("pedido_items")
      .insert(pedidoItemsData);

    if (itemsError) {
      // Compensating delete — pedido was created but items failed
      await supabase.from("pedidos").delete().eq("id", pedido.id);
      console.error("[orders/create] pedido_items insert failed, pedido rolled back:", itemsError.message);
      return NextResponse.json(
        { ok: false, error: "Error al guardar los productos del pedido" },
        { status: 500 }
      );
    }

    await auditLog({
      accion:      "order.created",
      tabla:       "pedidos",
      registro_id: pedido.id,
      datos: {
        total,
        subtotal,
        envio:         ENVIO,
        items_count:   items.length,
        cliente_email: cliente.email,
      },
      ip,
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

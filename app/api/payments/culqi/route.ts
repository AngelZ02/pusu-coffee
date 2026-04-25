import { NextRequest, NextResponse } from "next/server";
import { createCharge } from "@/lib/culqi/charge";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit/log";
import type { CulqiChargePayload } from "@/types/payments";

// CULQI_SECRET_KEY solo se usa server-side — nunca exponer con NEXT_PUBLIC_

export async function POST(req: NextRequest) {
  try {
    const body: CulqiChargePayload = await req.json();

    if (!body.token || !body.order_id) {
      return NextResponse.json(
        { ok: false, error: "token y order_id son requeridos" },
        { status: 400 }
      );
    }

    // Obtener el pedido para conocer el monto
    const supabase = createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total, estado")
      .eq("id", body.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { ok: false, error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (order.estado !== "pendiente") {
      return NextResponse.json(
        { ok: false, error: "El pedido ya fue procesado" },
        { status: 409 }
      );
    }

    // Cobrar con Culqi
    const charge = await createCharge({
      token: body.token,
      amount: order.total,          // en céntimos (soles × 100)
      currency_code: "PEN",
      email: body.email,
      description: `Pusu Coffee — Pedido ${order.id}`,
    });

    // Actualizar estado del pedido
    await supabase
      .from("orders")
      .update({ estado: "pagado", culqi_charge_id: charge.id })
      .eq("id", order.id);

    await auditLog({
      accion:      "payment.success",
      tabla:       "pedidos",
      registro_id: order.id,
      datos:       { charge_id: charge.id, amount: order.total },
    });

    return NextResponse.json({ ok: true, data: { charge_id: charge.id } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

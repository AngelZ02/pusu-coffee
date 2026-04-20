import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit/log";

// TODO: reemplazar con Mercado Pago SDK cuando tengamos RUC.
// Cambiar solo lib/payments/index.ts para apuntar a la ruta real.

export async function POST(req: NextRequest) {
  try {
    const { pedidoId } = await req.json();

    if (!pedidoId) {
      return NextResponse.json(
        { ok: false, error: "pedidoId requerido" },
        { status: 400 }
      );
    }

    // Simula el delay de una pasarela real (1.5s)
    await new Promise((r) => setTimeout(r, 1500));

    const supabase = createClient();

    const { error } = await supabase
      .from("pedidos")
      .update({ estado: "pagado" })
      .eq("id", pedidoId);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    await auditLog({
      action: "payment.paid",
      entity: "pedidos",
      entity_id: pedidoId,
      metadata: { metodo: "mock" },
    });

    return NextResponse.json({ ok: true, data: { pedidoId } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

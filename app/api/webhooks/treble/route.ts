import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit/log";

// Webhook de Treble.ai para notificaciones de WhatsApp / mensajería

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Validar firma si Treble provee un secret header
    // const signature = req.headers.get("x-treble-signature");
    // TODO: implementar validación HMAC

    const supabase = createClient();

    // Persistir el evento crudo para procesamiento posterior
    const { error } = await supabase.from("webhook_events").insert({
      source: "treble",
      payload,
      received_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[webhook/treble] Error guardando evento:", error.message);
    }

    await auditLog({
      accion: "webhook.treble.received",
      tabla:  "webhook_events",
      datos:  { event_type: payload?.event ?? "unknown" },
    });

    // Treble espera 200 para confirmar recepción
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[webhook/treble]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

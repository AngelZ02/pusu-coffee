import { createClient } from "@/lib/supabase/server";

interface AuditLogParams {
  accion: string;
  tabla?: string;
  registro_id?: string;
  datos?: Record<string, unknown>;
  ip?: string | null;
}

export async function auditLog(params: AuditLogParams): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.from("audit_log").insert({
      accion:      params.accion,
      tabla:       params.tabla       ?? null,
      registro_id: params.registro_id ?? null,
      datos:       params.datos       ?? {},
      ip:          params.ip          ?? null,
    });

    if (error) {
      console.error("[auditLog] Insert failed:", error.message, { params });
    }
  } catch (err) {
    console.error("[auditLog] Unexpected error:", err, { params });
  }
}

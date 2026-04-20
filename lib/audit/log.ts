import { createClient } from "@/lib/supabase/server";

interface AuditLogParams {
  action: string;
  entity?: string;
  entity_id?: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
}

// Inserta un registro en la tabla `audit_log` de Supabase.
// La tabla debe existir con al menos: id, action, entity, entity_id, user_id, metadata, created_at
// SQL de referencia:
//   CREATE TABLE audit_log (
//     id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     action      text NOT NULL,
//     entity      text,
//     entity_id   text,
//     user_id     text,
//     metadata    jsonb,
//     created_at  timestamptz DEFAULT now()
//   );
//   ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

export async function auditLog(params: AuditLogParams): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.from("audit_log").insert({
      action: params.action,
      entity: params.entity ?? null,
      entity_id: params.entity_id ?? null,
      user_id: params.user_id ?? null,
      metadata: params.metadata ?? {},
    });

    if (error) {
      console.error("[auditLog] Error al insertar:", error.message);
    }
  } catch (err) {
    // El audit nunca debe romper el flujo principal
    console.error("[auditLog] Error inesperado:", err);
  }
}

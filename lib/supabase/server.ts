import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para Server Components, Server Actions y API Routes
// NOTA DE SEGURIDAD:
//   - Usa SUPABASE_SERVICE_ROLE_KEY (sin NEXT_PUBLIC_) — nunca exponer al navegador
//   - RLS (Row Level Security) debe estar habilitado en todas las tablas de Supabase
//   - El service role bypasea RLS: usarlo solo en rutas de API confiables (server-side)
//   - Para Server Components que operan con permisos del usuario, usar la ANON_KEY
//     con la sesión del usuario en lugar del service role

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Cambiar a NEXT_PUBLIC_SUPABASE_ANON_KEY para operaciones con sesión de usuario
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // En Server Components el set puede fallar; es esperado
          }
        },
      },
    }
  );
}

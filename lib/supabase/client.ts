import { createBrowserClient } from "@supabase/ssr";

// Cliente para componentes del lado del navegador ("use client")
// Usa NEXT_PUBLIC_ keys — no incluir datos sensibles aquí
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rutas que requieren autenticación
const PRIVATE_PATHS = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas privadas
  const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));
  if (!isPrivate) return NextResponse.next();

  const response = NextResponse.next();

  // Crear cliente Supabase con manejo de cookies para refrescar sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - api/webhooks (webhooks externos sin sesión)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)",
  ],
};

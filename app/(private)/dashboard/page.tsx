// Ruta protegida — el middleware redirige aquí solo si el usuario está autenticado
export default function DashboardPage() {
  return (
    <div className="section-brand container-brand">
      <h1 className="text-display text-4xl md:text-5xl text-brand-black mb-6">
        Mi cuenta
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resumen de pedidos */}
        <div className="bg-brand-cream-2 rounded-md p-6 col-span-2">
          <h2 className="text-display text-2xl text-brand-black mb-4">
            Mis pedidos
          </h2>
          <p className="text-brand-charcoal/60 text-sm">
            Aún no tienes pedidos registrados.
          </p>
        </div>

        {/* Datos del usuario */}
        <div className="bg-brand-cream-2 rounded-md p-6">
          <h2 className="text-display text-2xl text-brand-black mb-4">
            Perfil
          </h2>
          <p className="text-brand-charcoal/60 text-sm">
            {/* TODO: mostrar datos del usuario autenticado con Supabase */}
            Cargando perfil…
          </p>
        </div>
      </div>
    </div>
  );
}

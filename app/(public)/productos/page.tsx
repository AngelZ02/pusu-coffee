import { createClient } from "@/lib/supabase/server";
import ProductoCardPremium from "@/components/features/productos/ProductoCardPremium";

interface Producto {
  id: string;
  nombre: string;
  proceso: string;
  precio: number;
  peso_g: number;
  notas: string;
  activo: boolean;
  stock: number;
  imagen_url?: string | null;
}

const PRODUCTOS_FALLBACK: Producto[] = [
  {
    id: "1",
    nombre: "Colibrí Rojo",
    proceso: "Lavado",
    precio: 37,
    peso_g: 250,
    notas: "Cacao, Nuez, Final dulce",
    activo: true,
    stock: 10,
    imagen_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
  },
  {
    id: "2",
    nombre: "Colibrí Dorado",
    proceso: "Honey",
    precio: 40,
    peso_g: 250,
    notas: "Miel, Durazno, Caramelo",
    activo: true,
    stock: 8,
    imagen_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    id: "3",
    nombre: "Colibrí Negro",
    proceso: "Natural",
    precio: 42,
    peso_g: 250,
    notas: "Frutos rojos, Chocolate, Intenso",
    activo: true,
    stock: 6,
    imagen_url: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c",
  },
];

export default async function ProductosPage() {
  let productos: Producto[] = [];

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("precio");

    productos = data?.length ? data : PRODUCTOS_FALLBACK;
  } catch {
    productos = PRODUCTOS_FALLBACK;
  }

  return (
    <section
      style={{
        background: "var(--color-brand-black)",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <div className="container-brand">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            style={{
              fontSize: "9.5px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--color-brand-gold)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontFamily: "var(--font-body)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "30px",
                height: "1px",
                background: "var(--color-brand-gold)",
              }}
            />
            La Colección
            <span
              style={{
                display: "inline-block",
                width: "30px",
                height: "1px",
                background: "var(--color-brand-gold)",
              }}
            />
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 300,
              color: "var(--color-brand-cream)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Tres expresiones{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-brand-gold-lt)" }}>
              del origen
            </em>
          </h1>
          <p
            style={{
              marginTop: "20px",
              color: "rgba(248,244,237,0.35)",
              fontSize: "13px",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-body)",
            }}
          >
            Selva alta peruana — Arábica de especialidad — 250g
          </p>
        </div>

        {/* Grid de productos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "32px",
          }}
          className="productos-grid"
        >
          {productos.map((producto, idx) => (
            <ProductoCardPremium
              key={producto.id}
              producto={producto}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { createClient } from "@/lib/supabase/server";
import ProductoCardPremium from "@/components/features/productos/ProductoCardPremium";
import PackBuyBtn from "@/components/features/landing/PackBuyBtn";
import Recomendador from "@/components/features/landing/Recomendador";

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
  slug?: string;
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
    slug: "colibri-rojo",
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
    slug: "colibri-dorado",
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
    slug: "colibri-negro",
    imagen_url: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c",
  },
];

const PACKS = [
  {
    id: "simple",
    nombre: "Empieza simple",
    precio: "S/ 37–42",
    desc: "Una bolsa 250g de la variedad que quieras. Tostada esta semana, molida a pedido.",
    contenido: ["1 × Bolsa 250g (Rojo, Dorado o Negro)", "Molienda a pedido", "Entrega en Lima en 48h"],
    slugs: ["colibri-rojo", "colibri-negro"] as string[],
  },
  {
    id: "explora",
    nombre: "Tu café + Explora",
    precio: "S/ 84",
    badge: "Más recomendado",
    desc: "Tu perfil favorito en 250g, con dos muestras de 30g para conocer las otras dos personalidades.",
    contenido: ["1 × Bolsa 250g (tu perfil)", "2 × Muestras 30g (otros perfiles)", "Tarjeta editorial con notas de cata"],
    slugs: null,
  },
  {
    id: "descubre",
    nombre: "Descubre tu café",
    precio: "S/ 46",
    desc: "Tres muestras de 30g. Prueba los tres perfiles antes de decidir tu bolsa grande.",
    contenido: ["3 × Muestras 30g · Rojo, Dorado, Negro", "Guía simple para no expertos", "Código para canjear contra tu bolsa 250g"],
    slugs: ["colibri-rojo", "colibri-dorado", "colibri-negro"] as string[],
  },
];

const PACK_BTN_CLASS = [
  "btn-solid",
  "btn-solid",
  "btn-solid",
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

  const bySlug = Object.fromEntries(
    productos
      .filter((p) => p.slug)
      .map((p) => [
        p.slug!,
        { id: p.id, nombre: p.nombre, precio: p.precio, imagen_url: p.imagen_url ?? null, proceso: p.proceso },
      ])
  );

  return (
    <>
      {/* Products section — cream background */}
      <section
        style={{
          background: "var(--color-brand-cream)",
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
                color: "var(--color-brand-black)",
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
                color: "var(--color-brand-bark-40)",
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

      {/* Packs section — black background */}
      <section
        style={{
          background: "var(--color-brand-black)",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div className="container-brand">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
              <span style={{ display: "inline-block", width: "30px", height: "1px", background: "var(--color-brand-gold)" }} />
              Formatos
              <span style={{ display: "inline-block", width: "30px", height: "1px", background: "var(--color-brand-gold)" }} />
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 300,
                color: "var(--color-brand-cream)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Nuestros{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-brand-gold-lt)" }}>Packs</em>
            </h2>
          </div>

          {/* Grid de packs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {PACKS.map((pack) => {
              const packProductos = pack.slugs
                ? pack.slugs.map((sl) => bySlug[sl]).filter(Boolean) as { id: string; nombre: string; precio: number; imagen_url: string | null; proceso: string }[]
                : [];

              return (
                <div
                  key={pack.id}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--color-brand-gold-20)",
                    padding: "32px 28px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative",
                  }}
                >
                  {pack.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-1px",
                        left: "28px",
                        background: "var(--color-brand-gold)",
                        color: "var(--color-brand-black)",
                        fontSize: "8.5px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                      }}
                    >
                      {pack.badge}
                    </span>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginTop: pack.badge ? "12px" : "0",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        fontWeight: 300,
                        color: "var(--color-brand-cream)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                      }}
                    >
                      {pack.nombre}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        color: "var(--color-brand-gold)",
                        flexShrink: 0,
                        marginLeft: "16px",
                      }}
                    >
                      {pack.precio}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "var(--color-brand-bark-40)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {pack.desc}
                  </p>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      flex: 1,
                    }}
                  >
                    {pack.contenido.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "11px",
                          color: "var(--color-brand-cream-40)",
                          fontFamily: "var(--font-body)",
                          letterSpacing: "0.03em",
                          display: "flex",
                          gap: "8px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ color: "var(--color-brand-gold)", flexShrink: 0 }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "8px" }}>
                    {pack.slugs === null ? (
                      <button
                        data-open-recommender
                        className="btn-solid"
                        style={{ width: "100%", cursor: "pointer", border: "none" }}
                        type="button"
                      >
                        Empezar por aquí
                      </button>
                    ) : (
                      <PackBuyBtn
                        productos={packProductos}
                        className="btn-solid"
                        style={{ width: "100%", display: "block", textAlign: "center", border: "none", cursor: "pointer" }}
                      >
                        Comprar
                      </PackBuyBtn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recomendador overlay — handles data-open-recommender clicks */}
      <Recomendador />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Imágenes de referencia (Unsplash) mientras no haya fotos propias
const FALLBACK_IMAGES: Record<string, string> = {
  rojo:   "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
  dorado: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  negro:  "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&q=80",
};

type Variante = "rojo" | "dorado" | "negro";

function getVariante(proceso: string): Variante {
  const p = proceso.toLowerCase();
  if (p.includes("honey"))   return "dorado";
  if (p.includes("natural")) return "negro";
  return "rojo";
}

const META: Record<Variante, string> = {
  rojo:   "Base de línea",
  dorado: "Destacado",
  negro:  "Intenso",
};

const DELAYS = ["d1", "d2", "d3"];

interface Producto {
  id: string;
  nombre: string;
  proceso: string;
  precio: number;
  peso_g: number;
  notas: string | null;
  imagen_url?: string | null;
}

export default async function ProductosSection() {
  let productos: Producto[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, proceso, precio, peso_g, notas, imagen_url")
      .eq("activo", true)
      .order("created_at", { ascending: true });

    if (!error && data) productos = data;
  } catch {
    // Supabase no configurado aún — se muestra vacío sin romper el render
  }

  return (
    <section className="sec-white">
      <div className="rv">
        <div className="slabel">La Colección</div>
        <h2 className="stitle-dark">
          Tres expresiones<br /><em>del mismo origen</em>
        </h2>
      </div>

      {productos.length === 0 ? (
        <p className="text-sm text-mid">
          Productos no disponibles en este momento.
        </p>
      ) : (
        <div className="pgrid">
          {productos.map((p, i) => {
            const variante = getVariante(p.proceso);
            const delay    = DELAYS[i] ?? "";
            const imgSrc   = p.imagen_url ?? FALLBACK_IMAGES[variante];
            const tags     = p.notas ? p.notas.split(",").map((t) => t.trim()) : [];
            const precioS  = (p.precio / 100).toFixed(0);
            const pesoG    = p.peso_g ?? 250;

            return (
              <div key={p.id} className={`pcard pcard-${variante} rv ${delay}`}>
                <div className="pcard-img">
                  <Image
                    src={imgSrc}
                    alt={p.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width:700px) 100vw, 33vw"
                  />
                  <div className="pcard-img-overlay" />
                </div>
                <div className="pcard-bar" />
                <div className="pcard-body">
                  <p className="pmeta">{META[variante]}</p>
                  <h3 className="pname">{p.nombre}</h3>
                  <p className="pproc">Proceso {p.proceso}</p>
                  <div className="pdiv" />
                  <div className="ptags">
                    {tags.map((tag) => (
                      <span key={tag} className="ptag">{tag}</span>
                    ))}
                  </div>
                  <div className="pcta">
                    <div className="pprice">
                      S/ {precioS} <span>/ {pesoG}g</span>
                    </div>
                    <Link href={`/checkout?producto=${p.id}`} className="pbtn">
                      Añadir
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

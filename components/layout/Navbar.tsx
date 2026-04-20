"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCarrito } from "@/lib/carrito/context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cantidadItems, abrirDrawer } = useCarrito();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav-base ${scrolled ? "nav-scrolled" : ""}`}>
      <Link href="/" className="nav-logo">
        PU<em>SU</em>
      </Link>

      <div className="flex items-center gap-6">
        <ul className="nav-links">
          <li>
            <Link href="/productos" className="nav-link">
              Colección
            </Link>
          </li>
          <li>
            <Link href="/#origen" className="nav-link">
              Origen
            </Link>
          </li>
          <li>
            <Link href="/#nosotros" className="nav-link">
              Nosotros
            </Link>
          </li>
        </ul>

        {/* Botón carrito */}
        <button
          onClick={abrirDrawer}
          className="nav-carrito-btn"
          aria-label={`Carrito (${cantidadItems} productos)`}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cantidadItems > 0 && (
            <span className="nav-carrito-badge">{cantidadItems}</span>
          )}
        </button>

        <Link href="/productos" className="nav-btn">
          Comprar
        </Link>
      </div>
    </nav>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CarritoProvider } from "@/lib/carrito/context";
import CarritoDrawer from "@/components/features/carrito/CarritoDrawer";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Pusu Coffee — Café de especialidad peruano",
  description:
    "Single origin arábica de la selva alta peruana. Tres procesos, un mismo origen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <CustomCursor />
        <CarritoProvider>
          <Navbar />
          <CarritoDrawer />
          <main>{children}</main>
          <Footer />
        </CarritoProvider>
      </body>
    </html>
  );
}

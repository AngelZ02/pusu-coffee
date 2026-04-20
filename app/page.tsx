import ScrollRevealScript        from "@/components/ui/ScrollRevealScript";
import HeroSection               from "@/components/features/landing/HeroSection";
import TickerSection             from "@/components/features/landing/TickerSection";
import ProductosSection          from "@/components/features/landing/ProductosSection";
import RitualSection             from "@/components/features/landing/RitualSection";
import PhilosophySection         from "@/components/features/landing/PhilosophySection";
import OriginSection             from "@/components/features/landing/OriginSection";
import HowToBuySection           from "@/components/features/landing/HowToBuySection";
import FinalCTASection           from "@/components/features/landing/FinalCTASection";

export default function LandingPage() {
  return (
    <>
      {/* Activa scroll reveal (IntersectionObserver) para clases .rv */}
      <ScrollRevealScript />

      <HeroSection />
      <TickerSection />
      <ProductosSection />
      <RitualSection />
      <PhilosophySection />
      <OriginSection />
      <HowToBuySection />
      <FinalCTASection />
    </>
  );
}

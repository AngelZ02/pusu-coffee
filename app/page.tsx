import HeroSection      from "@/components/features/landing/HeroSection";
import CafesSection     from "@/components/features/landing/CafesSection";
import PacksSection     from "@/components/features/landing/PacksSection";
import RitualSection    from "@/components/features/landing/RitualSection";
import TrustSection     from "@/components/features/landing/TrustSection";
import FinalCTASection  from "@/components/features/landing/FinalCTASection";
import Recomendador     from "@/components/features/landing/Recomendador";

export default function LandingPage() {
  return (
    <>
      <div
        style={{
          backgroundColor: "var(--color-brand-cream)",
          color: "var(--color-brand-charcoal)",
          fontFamily: "var(--font-body)",
          overflowX: "hidden",
        }}
      >
        <HeroSection />
        <CafesSection />
        <PacksSection />
        <RitualSection />
        <TrustSection />
        <FinalCTASection />
      </div>
      {/* Client component — overlay + sticky CTA + scroll reveals */}
      <Recomendador />
    </>
  );
}

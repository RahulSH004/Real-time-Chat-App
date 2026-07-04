import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductPreview } from "@/components/landing/ProductPreview";

/**
 * LandingPage — root page component for coffee_chat marketing site.
 * Composes: Navbar (fixed) → HeroSection (full-bleed) → ProductPreview (overlap card)
 * Background transitions from hero photo → near-black via scroll-driven overlay.
 */
export function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#050510" }}
    >
      {/* Sticky floating navbar */}
      <Navbar />

      {/* Full-bleed hero with background photo */}
      <HeroSection />

      {/* Dark product preview card — overlaps hero bottom */}
      <ProductPreview />

      {/* Bottom padding / dark continuation */}
      <div
        className="h-32"
        style={{
          background:
            "linear-gradient(to bottom, #050510 0%, #0a0920 100%)",
        }}
      />
    </div>
  );
}

import { useEffect } from "react";
import { business } from "../config";
import { useSectionReveals } from "../hooks";
import { WheelLoader } from "../components/common";
import { FoldingHero, BrandStrip, ServicesSection } from "../components/sections";

/**
 * SKY DEMAC Homepage
 * Features the 2-second morphing wheel loader that docks onto the Porsche,
 * and the folding hero showcase with flat launch and 3D chapter folding.
 */
export default function HomePage() {
  useSectionReveals();

  useEffect(() => {
    document.title = business.seo.title;
  }, []);

  return (
    <>
      <WheelLoader />
      <FoldingHero />
      <BrandStrip />
      <ServicesSection />
    </>
  );
}

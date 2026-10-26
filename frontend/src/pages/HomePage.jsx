import { useEffect, useState } from "react";
import { business } from "../config";
import { useSectionReveals } from "../hooks";
import { WheelLoader } from "../components/common";
import { FoldingHero, BrandStrip, ServicesSection } from "../components/sections";

/**
 * SKY DEMAC Homepage
 * Features the 3-second full-screen spinning wheel loader,
 * clean rectangular hero section with 10-second wheel animation,
 * brand strip, and the services provided section.
 */
export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  useSectionReveals();

  useEffect(() => {
    document.title = business.seo.title;
  }, []);

  return (
    <>
      <WheelLoader onFinish={() => setIsLoaded(true)} />
      <FoldingHero isLoaded={isLoaded} />
      <BrandStrip />
      <ServicesSection />
    </>
  );
}

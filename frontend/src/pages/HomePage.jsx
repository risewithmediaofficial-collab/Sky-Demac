import { useEffect } from "react";
import { business } from "../config";
import { useSectionReveals } from "../hooks";
import { FoldingHero, BrandStrip, ServicesSection } from "../components/sections";

/**
 * SKY DEMAC Homepage
 * Features the signature cinema hero animation,
 * brand strip, and the services provided section.
 */
export default function HomePage() {
  useSectionReveals();

  useEffect(() => {
    document.title = business.seo.title;
  }, []);

  return (
    <>
      <FoldingHero />
      <BrandStrip />
      <ServicesSection />
    </>
  );
}

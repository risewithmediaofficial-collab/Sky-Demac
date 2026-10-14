import { useEffect } from "react";
import { business } from "../config";
import { useSectionReveals } from "../hooks/useSectionReveals";
import FoldingHero from "../components/FoldingHero";
import {
  BrandStrip,
  ServicesSection,
  WorkSection,
  ProcessSection,
  AboutSection,
  FaqSection,
  ContactSection,
} from "../components/sections";

/**
 * SKY DEMAC Homepage
 * Assembles the 3D cinema hero, brand strip, and all editorial care sections
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
      <WorkSection />
      <ProcessSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

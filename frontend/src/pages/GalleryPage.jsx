import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, CalendarCheck } from "lucide-react";
import { business } from "../config";
import { SafeImage } from "../components/common";
function Comparison() {
    const [value, setValue] = useState(50);
    const comparison = business.comparison;
    if (!comparison?.genuine)
        return null;
    return (<div className="comparison" style={{ marginTop: "48px" }}>
      <h3>A closer look, before and after.</h3>
      <div className="comparison-images">
        <SafeImage src={comparison.after} alt={`After: ${comparison.alt}`} width="1200" height="800" loading="lazy"/>
        <div style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <SafeImage src={comparison.before} alt={`Before: ${comparison.alt}`} width="1200" height="800" loading="lazy"/>
        </div>
        <span className="comparison-before">Before</span>
        <span className="comparison-after">After</span>
      </div>
      <label htmlFor="comparison">Compare before and after</label>
      <input id="comparison" type="range" min="0" max="100" value={value} aria-valuetext={`${value}% before, ${100 - value}% after`} onChange={(event) => setValue(Number(event.target.value))}/>
    </div>);
}
export default function GalleryPage() {
    const [filter, setFilter] = useState("All");
    const projects = business.projects;
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.title = `Gallery – Our Work | ${business.name}`;
    }, []);
    return (<div className="gallery-page-view">
      <div className="service-page-hero">
        <div className="wrap">
          <div className="page-breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <ArrowLeft size={14}/> Home
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Gallery – Our Work</span>
          </div>

          <div className="modern-pill-badge">
            <span className="pill-dot" /> CRAFTSMANSHIP SHOWCASE • PROVEN RESULTS
          </div>
          <h1 className="modern-display-heading">
            <span>OUR WORK</span>
            <span className="heading-inline-group">
              <span className="tilted-pill-badge">PORTFOLIO</span>
              <span className="accent-text">GALLERY</span>
            </span>
          </h1>
          <p className="service-page-tagline">
            Precision engineering, mirror-finish detailing, and restored paintwork.
          </p>
        </div>
      </div>

      <div className="wrap section-pad">
        {/* Curated Work Highlights Grid */}
        <div className="gallery-curated-grid">
          <div className="curated-gallery-card">
            <div className="curated-img-frame">
              <SafeImage src="/images/ferrari-red-studio.jpg" alt="Rosso Corsa Ferrari ceramic coating and mirror gloss paint finish" width="800" height="500"/>
              <span className="curated-badge">
                <Sparkles size={14}/> Ceramic Coating & Paint Correction
              </span>
            </div>
            <div className="curated-copy">
              <h3>Bespoke Paint Restoration</h3>
              <p>
                Multi-stage machine compounding removing 95%+ of surface swirls,
                sealed with 9H nano-ceramic protective coating.
              </p>
            </div>
          </div>

          <div className="curated-gallery-card">
            <div className="curated-img-frame">
              <SafeImage src="/images/dodge-challenger-workshop.jpg" alt="Crimson Dodge Challenger SRT high-performance mechanical maintenance" width="800" height="500"/>
              <span className="curated-badge">
                <Sparkles size={14}/> Performance Mechanical Care
              </span>
            </div>
            <div className="curated-copy">
              <h3>Brake & Suspension Engineering</h3>
              <p>
                Complete brake overhaul, rotor skimming, suspension dampening calibration,
                and computerized OBD diagnostic fault resolution.
              </p>
            </div>
          </div>

          <div className="curated-gallery-card">
            <div className="curated-img-frame">
              <SafeImage src="/images/ford-mustang-gt.jpg" alt="Red Ford Mustang GT touchless foam wash and exterior rejuvenation" width="800" height="500"/>
              <span className="curated-badge">
                <Sparkles size={14}/> Deep Exterior Studio Rejuvenation
              </span>
            </div>
            <div className="curated-copy">
              <h3>Precision Detailing & Headlight Polish</h3>
              <p>
                De-ironizer paint decontamination, headlight wet-sanding with UV polymer seal,
                and spotless underbody high-pressure jet cleaning.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Project Filter if genuine projects configured */}
        {projects.length > 0 && (<div className="project-gallery" style={{ marginTop: "60px" }}>
            <div className="eyebrow">FROM THE WORKSHOP</div>
            <h2>Recent Workshop Projects</h2>
            <div className="gallery-filters" aria-label="Filter projects">
              {["All", ...new Set(projects.map((p) => p.category))].map((val) => (<button key={val} aria-pressed={filter === val} onClick={() => setFilter(val)}>
                  {val}
                </button>))}
            </div>
            <div className="project-grid">
              {projects
                .filter((p) => filter === "All" || p.category === filter)
                .map((project) => (<figure key={project.id}>
                    <SafeImage src={project.image} alt={project.alt} width="700" height="500" loading="lazy"/>
                    <figcaption>{project.title}</figcaption>
                  </figure>))}
            </div>
          </div>)}

        <Comparison />

        {/* Action Banner */}
        <div className="gallery-cta-box" style={{ marginTop: "60px" }}>
          <div className="cta-banner-content">
            <div>
              <span className="cta-tag">ELEVATE YOUR VEHICLE</span>
              <h2>Want the same finish for your car?</h2>
              <p>Schedule your vehicle inspection with our certified team.</p>
            </div>
            <Link to="/book-service" className="button button-primary">
              Book a Service <CalendarCheck size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </div>);
}

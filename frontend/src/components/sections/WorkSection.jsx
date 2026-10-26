import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { business } from "../../config";
import SafeImage from "../common/SafeImage";

/**
 * Interactive Before & After comparison slider
 */
function Comparison() {
  const [value, setValue] = useState(50);
  const comparison = business.comparison;

  return (
    <div className="comparison">
      <h3>A closer look, before and after.</h3>
      <div className="comparison-images">
        <SafeImage
          src={comparison.after}
          alt={`After: ${comparison.alt}`}
          width="1200"
          height="800"
          loading="lazy"
        />
        <div style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <SafeImage
            src={comparison.before}
            alt={`Before: ${comparison.alt}`}
            width="1200"
            height="800"
            loading="lazy"
          />
        </div>
        <span className="comparison-before">Before</span>
        <span className="comparison-after">After</span>
      </div>
      <label htmlFor="comparison">Compare before and after</label>
      <input
        id="comparison"
        type="range"
        min="0"
        max="100"
        value={value}
        aria-valuetext={`${value}% before, ${100 - value}% after`}
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
}

/**
 * Editorial Craftsmanship & Work Section
 */
export default function WorkSection() {
  const [filter, setFilter] = useState("All");
  const projects = business.projects.filter((project) => project.genuine);

  return (
    <section id="our-work" className="work-section section-pad">
      <div className="wrap">
        <div className="work-layout">
          <div className="work-image">
            <SafeImage
              src="/images/ferrari-red-studio.jpg"
              alt="Rosso Corsa Ferrari in precision detailing studio"
              width="1000"
              height="1000"
              loading="lazy"
            />
            <span className="image-corner-label">A STUDY IN DETAIL</span>
            <span className="photo-credit">
              Illustrative visual · not a customer project
            </span>
          </div>
          <div className="work-copy">
            <div className="eyebrow">
              <span /> IT’S IN THE DETAILS
            </div>
            <h2>
              Good care is felt.
              <br />
              <span className="muted">Great care is noticed.</span>
            </h2>
            <p>
              The clean line of a reflection. The feeling behind the wheel. The
              confidence to take the long way home.
            </p>
            <p>
              We’re building SKY DEMAC around a simple idea: every part of your
              car deserves a considered approach.
            </p>
            <Link to="/gallery" className="text-link">
              View Work Gallery <ArrowUpRight size={17} />
            </Link>
            <div className="detail-caption">
              <span>01 — 03</span>
              <span>PERFORMANCE. FINISH. FEEL.</span>
            </div>
          </div>
        </div>

        {/* Project Gallery if verified genuine projects are configured */}
        {projects.length > 0 && (
          <div className="project-gallery">
            <div className="eyebrow">FROM THE WORKSHOP</div>
            <h2>Our work.</h2>
            <div className="gallery-filters" aria-label="Filter projects">
              {[
                "All",
                ...new Set(projects.map((project) => project.category)),
              ].map((value) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="project-grid">
              {projects
                .filter(
                  (project) => filter === "All" || project.category === filter
                )
                .map((project) => (
                  <figure key={project.id}>
                    <SafeImage
                      src={project.image}
                      alt={project.alt}
                      width="700"
                      height="500"
                      loading="lazy"
                    />
                    <figcaption>{project.title}</figcaption>
                  </figure>
                ))}
            </div>
          </div>
        )}

        {business.comparison?.genuine && <Comparison />}
      </div>
    </section>
  );
}

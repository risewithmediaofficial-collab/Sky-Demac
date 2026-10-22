import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Wrench, Sparkles, Car, Layers, Cpu, CircleDot, Zap, Gauge, PhoneCall, CalendarCheck, } from "lucide-react";
import { business } from "../config";
import { SafeImage } from "../components/common";
// Icon mapping helper for visual cards
const getCategoryIcon = (id) => {
    switch (id) {
        case "mechanical":
            return <Wrench size={22}/>;
        case "detailing":
        case "ppf":
            return <Sparkles size={22}/>;
        case "wash":
            return <Car size={22}/>;
        case "body-shop":
            return <Layers size={22}/>;
        case "accessories":
            return <Cpu size={22}/>;
        case "wheels":
            return <CircleDot size={22}/>;
        case "electrical":
            return <Zap size={22}/>;
        case "special-care":
            return <Gauge size={22}/>;
        default:
            return <ShieldCheck size={22}/>;
    }
};
export default function ServicePage({ forcedCategory }) {
    const { slug } = useParams();
    // Find category by slug, id, or forcedCategory prop
    const category = forcedCategory ||
        business.categories.find((c) => c.slug === slug ||
            c.id === slug ||
            c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ||
        business.categories[0];
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.title = `${category.title} | ${business.name}`;
    }, [category]);
    return (<div className="service-page-view">
      {/* Page Breadcrumb & Top Bar */}
      <div className="service-page-hero">
        <div className="wrap">
          <div className="page-breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <ArrowLeft size={14}/> Home
            </Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/services" className="breadcrumb-link">
              Services
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{category.title}</span>
          </div>

          <div className="service-hero-grid">
            <div className="service-hero-info">
              <div className="modern-pill-badge">
                <span className="pill-dot" /> SPECIALIZED DIVISION • PRECISION STANDARD
              </div>
              <h1 className="modern-display-heading">
                <span>{category.title.split(" ")[0]}</span>
                <span className="heading-inline-group">
                  <span className="tilted-pill-badge">{category.shortTitle}</span>
                  <span className="accent-text">{category.title.split(" ").slice(1).join(" ")}</span>
                </span>
              </h1>
              <p className="service-page-tagline">{category.tagline}</p>
              <p className="service-page-detail">{category.detail}</p>

              {/* High-Impact Capability Badges */}
              <div className="capability-chips">
                {category.highlights.map((chip) => (<span key={chip} className="capability-chip">
                    <CheckCircle2 size={13} className="chip-check"/>
                    {chip}
                  </span>))}
              </div>

              {/* Action Buttons */}
              <div className="service-hero-actions">
                <Link to={`/book-service?category=${encodeURIComponent(category.title)}`} className="button button-primary">
                  Book {category.shortTitle} <CalendarCheck size={16}/>
                </Link>
                <a href="#services-catalog" className="button button-dark">
                  View All {category.items.length} Offerings <ArrowUpRight size={16}/>
                </a>
              </div>
            </div>

            <div className="service-hero-media">
              <div className="service-media-frame">
                <SafeImage src={category.image} alt={category.imageAlt} width="700" height="460"/>
                <div className="service-media-overlay">
                  <span className="media-badge">
                    {getCategoryIcon(category.id)}
                    {category.shortTitle}
                  </span>
                  <span className="media-sub">Precision Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Operational Note */}
      <div className="wrap">
        <div className="services-notice-box" role="note">
          <div className="notice-icon">
            <ShieldCheck size={20}/>
          </div>
          <div className="notice-copy">
            <strong>Workshop Operational Notice:</strong>
            <p>{business.operationalNote}</p>
          </div>
        </div>
      </div>

      {/* Visual Service Offerings Grid */}
      <section id="services-catalog" className="section-pad offerings-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <div className="modern-pill-badge">
                <span className="pill-dot" /> VISUAL CATALOGUE • INSTANT UNDERSTANDING
              </div>
              <h2 className="modern-display-heading">
                <span>WHAT IS</span>
                <span className="heading-inline-group">
                  <span className="tilted-pill-badge">INCLUDED</span>
                  <span className="accent-text">TRANSPARENT CARE</span>
                </span>
              </h2>
            </div>
            <div className="heading-aside">
              <p>
                Every service is executed using certified workshop procedures,
                specialized tools and genuine components.
              </p>
            </div>
          </div>

          <div className="offerings-grid">
            {category.items.map((item, index) => (
              <div key={item.title} className="offering-card">
                <div className="offering-top">
                  <span className="offering-tag">{item.tag}</span>
                  <span className="offering-num">0{index + 1}</span>
                </div>
                <div className="offering-icon-wrap">
                  {getCategoryIcon(category.id)}
                </div>
                <h3 className="offering-title">{item.title}</h3>
                <p className="offering-desc">{item.desc}</p>
                <div className="offering-action">
                  <Link to={`/book-service?category=${encodeURIComponent(category.title)}&service=${encodeURIComponent(item.title)}`} className="offering-book-btn">
                    <span>Enquire for this</span>
                    <span className="btn-circle-arrow"><ArrowUpRight size={14}/></span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Workshop Process */}
      <section className="section-pad workshop-process-strip">
        <div className="wrap">
          <div className="eyebrow">
            <span /> HOW WE WORK
          </div>
          <h2 className="process-headline">Care that keeps you informed.</h2>
          <div className="process-mini-grid">
            {business.process.map((step, idx) => (<div key={step.title} className="process-mini-step">
                <div className="step-count">0{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Quick Switcher to Other 8 Services */}
      <section className="section-pad other-services-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span /> EXPLORE MORE DEPARTMENTS
              </div>
              <h2>Other specialized care.</h2>
            </div>
            <Link to="/services" className="text-link">
              View all services directory <ArrowUpRight size={16}/>
            </Link>
          </div>

          <div className="other-services-pills">
            {business.categories
            .filter((c) => c.id !== category.id)
            .map((c) => (<Link key={c.id} to={`/${c.slug}`} className="other-service-pill">
                  <span className="pill-icon">{getCategoryIcon(c.id)}</span>
                  <span className="pill-text">{c.title}</span>
                  <ArrowUpRight size={14} className="pill-arrow"/>
                </Link>))}
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="service-cta-banner">
        <div className="wrap">
          <div className="cta-banner-content">
            <div>
              <span className="cta-tag">SKY DEMAC • BUILT FOR THE PRESSURE</span>
              <h2>Ready to give your car the attention it deserves?</h2>
              <p>
                Tell us your car's make, model and requirements. Our service advisors will
                confirm availability and schedule your inspection.
              </p>
            </div>
            <div className="cta-banner-buttons">
              <Link to={`/book-service?category=${encodeURIComponent(category.title)}`} className="button button-primary">
                Book {category.shortTitle} <CalendarCheck size={16}/>
              </Link>
              <Link to="/contact" className="button button-dark">
                Contact Workshop <PhoneCall size={16}/>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);
}

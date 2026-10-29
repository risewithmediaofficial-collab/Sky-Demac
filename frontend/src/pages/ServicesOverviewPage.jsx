import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, CheckCircle2, CalendarCheck, Wrench, Sparkles, Car, Layers, Cpu, CircleDot, Zap, Gauge, } from "lucide-react";
import { business } from "../config";
import { SafeImage } from "../components/common";
const getCategoryIcon = (id) => {
    switch (id) {
        case "mechanical":
            return <Wrench size={20}/>;
        case "detailing":
            return <Sparkles size={20}/>;
        case "wash":
            return <Car size={20}/>;
        case "body-shop":
            return <Layers size={20}/>;
        case "accessories":
            return <Cpu size={20}/>;
        case "wheels":
            return <CircleDot size={20}/>;
        case "electrical":
            return <Zap size={20}/>;
        case "special-care":
            return <Gauge size={20}/>;
        default:
            return <ShieldCheck size={20}/>;
    }
};
export default function ServicesOverviewPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.title = `Car Detailing & Automotive Services in Krishnagiri | SkyDemac`;
    }, []);
    return (
      <div className="services-overview-page">
        <div className="service-page-hero">
          <div className="wrap">
            <div className="modern-pill-badge">
              <span className="pill-dot" /> COMPLETE CARE DIRECTORY • 9 SPECIALIZED DIVISIONS
            </div>
            <h1 className="modern-display-heading">
              <span>AUTOMOTIVE</span>
              <span className="heading-inline-group">
                <span className="tilted-pill-badge">STUDIO GRADE</span>
                <span className="accent-text">SERVICES</span>
              </span>
            </h1>
            <p className="service-page-tagline">
              Multi-brand car care • Mechanical • Detailing • Paint Protection
            </p>
            <p className="service-page-detail">
              Select any department to view dedicated offerings, transparent descriptions,
              and immediate service enquiries.
            </p>

            {/* Quick Menu Pills */}
            <div className="quick-nav-pills" style={{ marginTop: "24px" }}>
              {business.serviceMenu.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`quick-pill ${item.label === "Book a Service" ? "quick-pill-cta" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap">
          {/* Workshop Operational Notice */}
          <div className="services-notice-box" role="note" style={{ marginTop: "32px" }}>
            <div className="notice-icon">
              <ShieldCheck size={20}/>
            </div>
            <div className="notice-copy">
              <strong>Workshop Operational Notice:</strong>
              <p>{business.operationalNote}</p>
            </div>
          </div>

          {/* 9 Categories Grid */}
          <div className="overview-categories-grid">
            {business.categories.map((cat, idx) => (
              <div key={cat.id} className="overview-category-card">
                <Link to={`/${cat.slug}`} className="overview-card-media" aria-label={`View ${cat.title}`}>
                  <SafeImage src={cat.image} alt={cat.imageAlt} width="600" height="380" loading="lazy"/>
                  <span className="overview-card-num">0{idx + 1}</span>
                  <span className="overview-card-badge">
                    {getCategoryIcon(cat.id)}
                    <span>{cat.shortTitle}</span>
                  </span>
                </Link>
                <div className="overview-card-body">
                  <Link to={`/${cat.slug}`} className="overview-card-title-link">
                    <h3>{cat.title}</h3>
                  </Link>
                  <p className="overview-card-tagline">{cat.tagline}</p>

                  <div className="overview-card-topics">
                    {cat.items.slice(0, 4).map((item) => (
                      <span key={item.title} className="overview-topic-item">
                        <CheckCircle2 size={13} className="topic-check"/>
                        {item.title}
                      </span>
                    ))}
                    {cat.items.length > 4 && (
                      <span className="overview-more-topics">
                        +{cat.items.length - 4} more specialized services
                      </span>
                    )}
                  </div>

                  <div className="overview-card-footer">
                    <Link to={`/${cat.slug}`} className="overview-action-btn" aria-label={`Explore ${cat.title}`}>
                      <span>Explore</span>
                      <span className="btn-circle-arrow" aria-hidden="true"><ArrowUpRight size={14}/></span>
                    </Link>
                    <Link to={`/book-service?category=${encodeURIComponent(cat.title)}`} className="overview-book-btn" aria-label={`Book ${cat.title}`}>
                      <CalendarCheck size={14} className="overview-book-icon" aria-hidden="true"/>
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

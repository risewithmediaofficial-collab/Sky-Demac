import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ShieldCheck, CalendarCheck, Wrench, Sparkles, } from "lucide-react";
import { business } from "../config";
import { SafeImage } from "../components/common";
export default function AboutPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.title = `About Us | ${business.name}`;
    }, []);
    return (<div className="about-page-view">
      <div className="service-page-hero">
        <div className="wrap">
          <div className="page-breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <ArrowLeft size={14}/> Home
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">About Us</span>
          </div>

          <div className="modern-pill-badge">
            <span className="pill-dot" /> WORKSHOP PHILOSOPHY • BUILT FOR THE PRESSURE
          </div>
          <h1 className="modern-display-heading">
            <span>ABOUT</span>
            <span className="heading-inline-group">
              <span className="tilted-pill-badge">EST. PERFORMANCE</span>
              <span className="accent-text">SKY DEMAC</span>
            </span>
          </h1>
          <p className="service-page-tagline">
            Complete Automotive Care • Premium Detailing • Professional Maintenance
          </p>
        </div>
      </div>

      <div className="wrap section-pad">
        <div className="about-layout" style={{ marginBottom: "64px" }}>
          <div>
            <div className="modern-pill-badge">
              <span className="pill-dot" /> CORE COMMITMENT
            </div>
            <h2 className="modern-display-heading" style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}>
              <span>BUILT FOR THE</span>
              <span className="accent-text">PRESSURE.</span>
            </h2>
            <div className="about-prose" style={{ marginTop: "24px" }}>
              <p>
                SKY DEMAC AUTOMOTIVE was founded on a simple principle: precision
                automotive care should be completely transparent, technically rigorous, and
                uncompromising in finish.
              </p>
              <p>
                From modern direct-injection engines and hybrid electronics to delicate clear
                coats and carbon fibre aero pieces, every vehicle entrusted to our studio is
                treated to measured, systematic care.
              </p>
            </div>
          </div>
          <div className="about-image-card">
            <SafeImage src="/images/hero.webp" alt="SKY DEMAC workshop vehicle" width="600" height="400"/>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <Wrench size={24}/>
            </div>
            <h3>Multi-Brand Mechanical Care</h3>
            <p>
              Equipped with OBD scanning and multi-brand diagnostic software for domestic,
              Japanese, European and luxury platforms.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <Sparkles size={24}/>
            </div>
            <h3>Detailing & Ceramic Studio</h3>
            <p>
              Dedicated clean-room studio for multi-stage paint correction, 9H nano-ceramic
              coatings, graphene treatments, and self-healing PPF.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon">
              <ShieldCheck size={24}/>
            </div>
            <h3>Transparent Approvals</h3>
            <p>
              No unexpected costs. Every recommendation is clearly explained with an upfront
              estimate before any physical work begins.
            </p>
          </div>
        </div>

        {/* 5-Step Clear Journey */}
        <div style={{ marginTop: "80px" }}>
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span /> A CLEAR PATH
              </div>
              <h2>Know what comes next.</h2>
            </div>
            <p className="process-intro">A thoughtful service journey. With you at every step.</p>
          </div>

          <ol className="process-grid">
            {business.process.map((step, index) => (<li key={step.title}>
                <div className="step-line">
                  <span>0{index + 1}</span>
                  {index !== 4 && <ArrowUpRight size={17}/>}
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>))}
          </ol>
        </div>

        {/* Action Callout */}
        <div className="gallery-cta-box" style={{ marginTop: "70px" }}>
          <div className="cta-banner-content">
            <div>
              <span className="cta-tag">GET STARTED TODAY</span>
              <h2>Experience the SKY DEMAC standard.</h2>
              <p>Book your service consultation or visit our workshop.</p>
            </div>
            <Link to="/book-service" className="button button-primary">
              Book a Service <CalendarCheck size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </div>);
}

import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck, Sparkles, } from "lucide-react";
import { business } from "../config";
import { EnquiryForm } from "../components/forms";
export default function BookServicePage() {
    const [searchParams] = useSearchParams();
    const preselectedCategory = searchParams.get("category");
    const preselectedService = searchParams.get("service");
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.title = `Book a Service | ${business.name}`;
    }, []);
    return (<div className="book-service-page">
      <div className="service-page-hero">
        <div className="wrap">
          <div className="page-breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <ArrowLeft size={14}/> Home
            </Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Book a Service</span>
          </div>

          <div className="modern-pill-badge">
            <span className="pill-dot" /> RESERVATIONS & ESTIMATES • DIRECT WORKSHOP
          </div>
          <h1 className="modern-display-heading">
            <span>BOOK A</span>
            <span className="heading-inline-group">
              <span className="tilted-pill-badge">FAST CONFIRMATION</span>
              <span className="accent-text">SERVICE</span>
            </span>
          </h1>
          <p className="service-page-tagline">
            Tell us about your car and required service. We'll prepare your inspection estimate.
          </p>
        </div>
      </div>

      <div className="wrap section-pad">
        {/* Preselected Service Notification if arriving from a service card */}
        {preselectedCategory && (<div className="preselect-banner">
            <Sparkles size={18} className="preselect-icon"/>
            <div>
              <strong>Enquiring for: {preselectedCategory}</strong>
              {preselectedService && <span> — {preselectedService}</span>}
            </div>
          </div>)}

        <div className="contact-layout">
          <div className="contact-copy">
            <div className="modern-pill-badge">
              <span className="pill-dot" /> DIRECT ASSISTANCE
            </div>
            <h2 className="modern-display-heading" style={{ fontSize: "clamp(30px, 3.5vw, 48px)" }}>
              <span>LET'S TALK ABOUT</span>
              <span className="accent-text">YOUR CAR.</span>
            </h2>
            <p>
              Whether it's routine oil and filter servicing, paint protection film, or an
              unfamiliar engine sound, we take the time to evaluate your vehicle properly.
            </p>

            <div className="contact-details">
              {business.phone ? (<a className="contact-item" href={`tel:${business.phone}`}>
                  <Phone size={18}/>
                  <span>{business.phone}</span>
                </a>) : (<div className="contact-pending">
                  <Phone size={18}/>
                  <span>Workshop phone will be published at launch.</span>
                </div>)}

              {business.email ? (<a className="contact-item" href={`mailto:${business.email}`}>
                  <Mail size={18}/>
                  <span>{business.email}</span>
                </a>) : (<div className="contact-pending">
                  <Mail size={18}/>
                  <span>Direct email available on service confirmation.</span>
                </div>)}

              {business.address ? (<div className="contact-item">
                  <MapPin size={18}/>
                  <span>{business.address}</span>
                </div>) : (<div className="contact-pending">
                  <MapPin size={18}/>
                  <span>Workshop address confirmed upon appointment.</span>
                </div>)}
            </div>

            <div className="services-notice-box" role="note" style={{ marginTop: "28px" }}>
              <div className="notice-icon">
                <ShieldCheck size={20}/>
              </div>
              <div className="notice-copy">
                <strong>Operational Note:</strong>
                <p>{business.operationalNote}</p>
              </div>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </div>
    </div>);
}

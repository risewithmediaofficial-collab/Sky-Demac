import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { business } from "../../config";
import EnquiryForm from "../EnquiryForm";

/**
 * Direct Contact & Enquiry Section
 */
export default function ContactSection() {
  return (
    <section id="contact" className="contact-section section-pad">
      <div className="wrap contact-layout">
        <div className="contact-copy">
          <div className="eyebrow">
            <span /> YOUR NEXT DRIVE STARTS HERE
          </div>
          <h2>
            Let’s talk
            <br />
            <span className="muted">about your car.</span>
          </h2>
          <p>
            A concern to look into. A finish to bring back.
            <br />
            Tell us what you have in mind.
          </p>
          <div className="contact-details">
            {business.phone && (
              <a href={`tel:${business.phone}`}>
                <Phone size={19} />
                <span>
                  <small>CALL THE WORKSHOP</small>
                  {business.phone}
                </span>
                <ArrowUpRight size={17} />
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`}>
                <Mail size={19} />
                <span>
                  <small>EMAIL US</small>
                  {business.email}
                </span>
                <ArrowUpRight size={17} />
              </a>
            )}
            {business.address && (
              <div className="address-line">
                <MapPin size={19} />
                <span>
                  <small>FIND US</small>
                  {business.address}
                  {business.mapUrl && (
                    <a href={business.mapUrl} target="_blank" rel="noreferrer">
                      Get directions <ArrowUpRight size={15} />
                    </a>
                  )}
                </span>
              </div>
            )}
            {business.openingHours && <p>{business.openingHours}</p>}
            {!business.phone && !business.email && (
              <div className="contact-pending">
                <span className="status-dot" />
                <div>
                  <strong>Good conversations start here.</strong>
                  <p>
                    Workshop contact details and opening hours will be shared
                    once confirmed.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="contact-signature">
            <span>SKY DEMAC</span>
            <p>Built for the Pressure.</p>
          </div>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}

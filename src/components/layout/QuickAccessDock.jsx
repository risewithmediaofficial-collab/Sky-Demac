import { Link } from "react-router-dom";
import { MessageCircle, MessageSquareText, PhoneCall } from "lucide-react";
import { business } from "../../config";

export default function QuickAccessDock() {
  const whatsappHref = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <aside className="quick-access-dock" aria-label="Quick contact options">
      <Link to="/book-service" className="quick-access-item">
        <span className="quick-access-icon"><MessageSquareText size={18} /></span>
        <span><strong>Enquiry</strong><small>Tell us what you need</small></span>
      </Link>
      <Link to="/contact" className="quick-access-item">
        <span className="quick-access-icon"><PhoneCall size={18} /></span>
        <span><strong>Contact</strong><small>Speak with the workshop</small></span>
      </Link>
      {whatsappHref ? (
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="quick-access-item quick-access-whatsapp">
          <span className="quick-access-icon"><MessageCircle size={18} /></span>
          <span><strong>WhatsApp</strong><small>Start a quick chat</small></span>
        </a>
      ) : (
        <Link to="/contact?channel=whatsapp" className="quick-access-item quick-access-whatsapp">
          <span className="quick-access-icon"><MessageCircle size={18} /></span>
          <span><strong>WhatsApp</strong><small>Request a chat</small></span>
        </Link>
      )}
    </aside>
  );
}

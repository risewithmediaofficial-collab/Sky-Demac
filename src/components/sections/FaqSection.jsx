import { ArrowUpRight, Plus } from "lucide-react";
import { confirmedServices } from "../../config";

/**
 * Frequently Asked Questions Section
 */
export default function FaqSection() {
  const faqs = [
    [
      "Does an enquiry confirm an appointment?",
      "No. An enquiry starts a conversation. The workshop must confirm the requested service, availability and date before any appointment is arranged.",
    ],
    [
      "What information should I include?",
      "Share your name, mobile number, car make and model, and what you would like help with. A preferred date and any details about the car’s condition can make the conversation easier.",
    ],
    [
      "Which services can I request?",
      confirmedServices.length
        ? "Confirmed services are listed in the enquiry form. If you are unsure which one fits, choose the general enquiry option and describe what your car needs."
        : "The workshop’s operational service list is being confirmed. For now, you can prepare a general enquiry. The care guides explain areas to discuss and do not confirm service availability.",
    ],
    [
      "Can I get a price or completion date here?",
      "Prices and turnaround times are not published here. These details need to be discussed with the workshop based on the vehicle, its condition and the work required.",
    ],
  ];

  return (
    <section className="faq-section section-pad">
      <div className="wrap faq-layout">
        <div>
          <div className="eyebrow">
            <span /> A LITTLE CLARITY
          </div>
          <h2>
            Before you
            <br />
            <span className="muted">drop us a line.</span>
          </h2>
          <a className="text-link" href="#contact">
            Have something else in mind? <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={19} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

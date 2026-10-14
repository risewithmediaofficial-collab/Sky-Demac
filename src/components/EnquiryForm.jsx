import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, MessageCircle } from "lucide-react";
import { business, confirmedServices, whatsappNumber } from "../config";
const initial = {
    name: "",
    mobile: "",
    car: "",
    service: "",
    date: "",
    message: "",
};
function localDate() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export default function EnquiryForm() {
    const [fields, setFields] = useState(initial);
    const [errors, setErrors] = useState({});
    const [summary, setSummary] = useState("");
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const form = useRef(null);
    const result = useRef(null);
    const change = (key, value) => {
        setFields((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setSummary("");
        setCopied(false);
    };
    function submit(event) {
        event.preventDefault();
        const next = {};
        if (fields.name.trim().length < 2)
            next.name = "Please enter your name (at least 2 characters).";
        if (!/^[+\d\s()-]+$/.test(fields.mobile) ||
            !/^\d{8,15}$/.test(fields.mobile.replace(/\D/g, "")))
            next.mobile = "Enter a valid mobile number with 8–15 digits.";
        if (fields.car.trim().length < 2)
            next.car = "Please enter your car’s make and model.";
        if (!fields.service ||
            (fields.service !== "general" &&
                !confirmedServices.some((s) => s.id === fields.service)))
            next.service = "Please select the type of enquiry.";
        if (fields.date && fields.date < localDate())
            next.date = "Choose today or a future date.";
        setErrors(next);
        if (Object.keys(next).length) {
            requestAnimationFrame(() => form.current
                ?.querySelector('[aria-invalid="true"]')
                ?.focus());
            return;
        }
        const service = confirmedServices.find((s) => s.id === fields.service)?.name ??
            "General service enquiry";
        const text = [
            `Hello ${business.name},`,
            "I would like to enquire about care for my car.",
            "",
            `Name: ${fields.name.trim()}`,
            `Mobile: ${fields.mobile.trim()}`,
            `Car: ${fields.car.trim()}`,
            `Service: ${service}`,
            ...(fields.date
                ? [`Preferred date: ${fields.date} (subject to confirmation)`]
                : []),
            ...(fields.message.trim() ? [`Message: ${fields.message.trim()}`] : []),
            "",
            "Please confirm service availability and the next steps.",
        ].join("\n");
        setSummary(text);
        requestAnimationFrame(() => result.current?.focus());
    }
    const common = (name) => ({
        id: name,
        name,
        value: fields[name],
        onChange: (event) => change(name, event.target.value),
        "aria-invalid": !!errors[name],
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
    });
    const error = (name) => errors[name] ? (<span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>) : null;
    return (<form ref={form} className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <h3>Tell us what your car needs.</h3>
        <span>LET’S START HERE</span>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Your name <span>*</span>
          </label>
          <input {...common("name")} autoComplete="name" placeholder="Full name" required maxLength={100}/>
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="mobile">
            Mobile number <span>*</span>
          </label>
          <input {...common("mobile")} type="tel" autoComplete="tel" placeholder="Include country code" required maxLength={22}/>
          {error("mobile")}
        </div>
        <div className="field">
          <label htmlFor="car">
            Car make / model <span>*</span>
          </label>
          <input {...common("car")} placeholder="e.g. Hyundai Creta" required maxLength={120}/>
          {error("car")}
        </div>
        <div className="field">
          <label htmlFor="service">
            Service required <span>*</span>
          </label>
          <select {...common("service")} required>
            <option value="">Select your enquiry</option>
            <option value="general">General enquiry / help me choose</option>
            {confirmedServices.map((service) => (<option key={service.id} value={service.id}>
                {service.name}
              </option>))}
          </select>
          {error("service")}
        </div>
        <div className="field form-wide">
          <label htmlFor="date">
            Preferred date <small>Optional</small>
          </label>
          <input {...common("date")} type="date" min={localDate()}/>
          {error("date")}
        </div>
        <div className="field form-wide">
          <label htmlFor="message">
            Anything else we should know? <small>Optional</small>
          </label>
          <textarea {...common("message")} rows={3} maxLength={2000} placeholder="Tell us about a concern, your car’s condition or the care you have in mind…"/>
        </div>
      </div>
      {Object.keys(errors).some((key) => errors[key]) && (<p className="form-error" role="alert">
          Please check the highlighted fields.
        </p>)}
      <button className="button button-primary form-submit" type="submit">
        {whatsappNumber ? "Prepare WhatsApp enquiry" : "Review your enquiry"}{" "}
        <ArrowUpRight size={18}/>
      </button>
      <p className="form-disclaimer">
        This is an enquiry, not a confirmed appointment.{" "}
        {whatsappNumber
            ? "You must send the prepared message in WhatsApp."
            : "Online enquiries are not connected yet. You can prepare and copy your details."}{" "}
        Your details are not stored on this website.
      </p>
      {summary && (<div className="enquiry-result" ref={result} tabIndex={-1}>
          <div className="eyebrow">YOUR ENQUIRY IS READY TO REVIEW</div>
          <h4>
            {whatsappNumber
                ? "Continue the conversation."
                : "Prepared. Not sent."}
          </h4>
          <p>
            {whatsappNumber
                ? "Open WhatsApp, review the message and tap Send. Availability and your preferred date still need confirmation."
                : "The workshop’s contact details are still being confirmed. Copy this draft for later; nothing has been sent."}
          </p>
          <pre>{summary}</pre>
          {whatsappNumber ? (<a className="button button-primary" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noreferrer">
              <MessageCircle size={17}/> Open WhatsApp to send
            </a>) : (<button type="button" className="button button-dark" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(summary);
                        setCopied(true);
                        setCopyError(false);
                    }
                    catch {
                        setCopyError(true);
                    }
                }}>
              {copied ? <Check size={17}/> : <Copy size={17}/>}
              {copied ? "Draft copied" : "Copy enquiry draft"}
            </button>)}
          <span className="sr-only" role="status">
            {copied ? "Enquiry draft copied to clipboard." : ""}
          </span>
          {copyError && (<p role="alert">
              Clipboard access is unavailable. Select and copy the draft above.
            </p>)}
        </div>)}
    </form>);
}

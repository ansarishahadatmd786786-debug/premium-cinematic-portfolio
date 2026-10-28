import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import site from "../../data/site";
import "./Contact.css";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");
  const reduced = usePrefersReducedMotion();
  const whatsappNumber = site.phone.replace(/\D/g, "");
  const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();
  const formKey = import.meta.env.VITE_FORM_KEY?.trim();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-fade",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: "top 74%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const business = String(data.get("business") || "");
    const message = String(data.get("message") || "");

    if (String(data.get("website") || "").trim()) {
      form.reset();
      setStatus("success");
      setFeedback("Thank you. Your message has been received.");
      return;
    }

    const subject = `Project enquiry: ${business || name || "New website"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business / Project: ${business || "Not specified"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    if (!formEndpoint) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("success");
      setFeedback("Your email app should open with a draft. Send it to complete the enquiry.");
      return;
    }

    setStatus("loading");
    setFeedback("Sending your message...");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(formKey ? { Authorization: `Bearer ${formKey}` } : {}),
        },
        body: JSON.stringify({ name, email, business, message }),
      });
      if (!response.ok) {
        throw new Error(`The form service returned ${response.status}.`);
      }

      form.reset();
      setStatus("success");
      setFeedback("Thanks. Your message has been sent.");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? `We could not send your message. ${error.message} You can email ${site.email} instead.`
          : `We could not send your message. Please email ${site.email} instead.`,
      );
    }
  };

  return (
    <section
      ref={rootRef}
      className="contact section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">07</span>
          <span>Contact</span>
          <span className="label-note dim">Start a project</span>
        </div>

        <div className="contact-grid grid-12">
          <div className="contact-left">
            <h2 id="contact-title" className="contact-fade display display--md contact-title">
              Tell me about your project<span className="accent">.</span>
            </h2>
            <p className="contact-fade dim contact-note">
              A few lines are enough: your business, what you need the website
              to do, and any links you like. I&rsquo;ll reply personally.
            </p>

            <ul className="contact-rows">
              <li className="contact-fade contact-row-item">
                <span className="mono dim contact-row-label">
                  <Mail size={13} strokeWidth={1.5} aria-hidden="true" />
                  Email
                </span>
                <a className="u-link contact-row-value" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li className="contact-fade contact-row-item">
                <a
                  className="btn btn--ghost contact-whatsapp"
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Shahadat, I'd like to discuss a website project.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={15} strokeWidth={1.75} aria-hidden="true" />
                  Chat on WhatsApp
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
              <li className="contact-fade contact-row-item">
                <span className="mono dim contact-row-label">
                  <Phone size={13} strokeWidth={1.5} aria-hidden="true" />
                  Phone
                </span>
                <a className="u-link contact-row-value" href={`tel:${site.phone}`}>
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={onSubmit} aria-label="Project enquiry form">
            <div className="contact-fade field">
              <label htmlFor="cf-name" className="mono dim">
                Name <span className="accent" aria-hidden="true">*</span>
              </label>
              <input
                id="cf-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
              />
            </div>

            <div className="contact-fade field">
              <label htmlFor="cf-email" className="mono dim">
                Email <span className="accent" aria-hidden="true">*</span>
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
              />
            </div>

            <div className="contact-fade field">
              <label htmlFor="cf-business" className="mono dim">
                Business / Project
              </label>
              <input
                id="cf-business"
                name="business"
                type="text"
                autoComplete="organization"
                placeholder="e.g. Riverside Dental Clinic"
              />
            </div>

            <div className="contact-fade field">
              <label htmlFor="cf-message" className="mono dim">
                Message <span className="accent" aria-hidden="true">*</span>
              </label>
              <textarea
                id="cf-message"
                name="message"
                rows={5}
                required
                placeholder="What do you need the website to do for your business?"
              />
            </div>

            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor="cf-website">Leave this field empty</label>
              <input
                id="cf-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="contact-fade contact-submit">
              <button
                type="submit"
                className="btn btn--ghost"
                data-cursor="link"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending" : "Send enquiry"}
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <p
                className="mono dim contact-hint"
                aria-live="polite"
                role={status === "error" ? "alert" : undefined}
              >
                {feedback ||
                  (formEndpoint
                    ? "Your message is sent to the configured form service. Nothing is stored on this site."
                    : "No form service is configured. Submitting opens an email draft.")}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

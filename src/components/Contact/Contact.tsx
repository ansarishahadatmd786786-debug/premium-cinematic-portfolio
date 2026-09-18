import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import site from "../../data/site";
import "./Contact.css";

/**
 * Frontend-only form: submit opens a pre-filled email draft.
 * Clearly communicated — no fake backend.
 */
export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const reduced = usePrefersReducedMotion();

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const business = String(data.get("business") || "");
    const message = String(data.get("message") || "");

    const subject = `Project enquiry — ${business || name || "New website"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business / Project: ${business || "—"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
              A few lines are enough — your business, what you need the website
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

            <div className="contact-fade contact-submit">
              <button type="submit" className="btn btn--ghost" data-cursor="link">
                Send via email
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <p className="mono dim contact-hint">
                {sent
                  ? "Email draft opened — press send in your email app."
                  : "Opens your email app pre-filled. Nothing is stored on this site."}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

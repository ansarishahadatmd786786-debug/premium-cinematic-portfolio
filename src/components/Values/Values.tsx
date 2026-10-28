import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import "./Values.css";

/** Verifiable implementation details from this portfolio. */
const values = [
  {
    n: "01",
    title: "Responsive layouts",
    note: "This portfolio reflows for narrow screens and desktop layouts.",
  },
  {
    n: "02",
    title: "Reduced-motion support",
    note: "Motion effects are skipped when the device requests reduced motion.",
  },
  {
    n: "03",
    title: "Optimized project images",
    note: "Project covers use WebP, reserved dimensions and lazy loading.",
  },
  {
    n: "04",
    title: "Visible keyboard focus",
    note: "Interactive controls have a visible focus style for keyboard users.",
  },
];

export default function Values() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".value-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".values-grid", start: "top 80%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="values section"
      aria-labelledby="values-title"
    >
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">06</span>
          <span>Why me</span>
          <span className="label-note dim">What you get</span>
        </div>

        <h2 id="values-title" className="display display--md values-heading">
          Straight answers,
          <br />
          careful work<span className="accent">.</span>
        </h2>

        <ul className="values-grid">
          {values.map((v) => (
            <li key={v.n} className="value-item">
              <span className="value-num mono dim">{v.n}</span>
              <h3 className="display value-title">{v.title}</h3>
              <p className="dim value-note">{v.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

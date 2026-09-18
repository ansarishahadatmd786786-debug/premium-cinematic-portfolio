import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import "./Values.css";

/** Why work with me — genuine value, no invented claims. */
const values = [
  {
    n: "01",
    title: "Modern digital design",
    note: "Interfaces that look current and feel considered — no templates.",
  },
  {
    n: "02",
    title: "Responsive experiences",
    note: "Designed for phones first, then refined up to widescreen.",
  },
  {
    n: "03",
    title: "Performance-conscious build",
    note: "Fast loads and smooth motion are part of the design, not extras.",
  },
  {
    n: "04",
    title: "Business-focused thinking",
    note: "Every section is built around what your customer needs to do next.",
  },
  {
    n: "05",
    title: "Clear communication",
    note: "Plain answers, visible progress, no jargon.",
  },
  {
    n: "06",
    title: "Attention to detail",
    note: "Spacing, type and interaction tuned until they feel right.",
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

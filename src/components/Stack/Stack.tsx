import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import "./Stack.css";

/**
 * Honest stack — only tools genuinely used in this portfolio.
 * GSAP / Three.js / WebGL power this very page.
 */
const groups = [
  {
    label: "Core",
    items: [
      { name: "React", note: "UI engine" },
      { name: "JavaScript", note: "Language" },
      { name: "HTML", note: "Structure" },
      { name: "CSS", note: "Styling & layout" },
      { name: "Vite", note: "Build tooling" },
    ],
  },
  {
    label: "Motion & 3D",
    items: [
      { name: "GSAP", note: "Animation" },
      { name: "Three.js", note: "3D rendering" },
      { name: "WebGL", note: "Graphics API" },
    ],
  },
  {
    label: "Workflow",
    items: [
      { name: "Git", note: "Version control" },
      { name: "GitHub", note: "Code hosting" },
      { name: "Vercel", note: "Deployment" },
    ],
  },
];

export default function Stack() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stack-group").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll(".stack-row"),
          { opacity: 0, x: -36 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: group, start: "top 82%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  let rowIndex = 0;

  return (
    <section
      ref={rootRef}
      className="stack section"
      id="stack"
      aria-labelledby="stack-title"
    >
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">04</span>
          <span>Technology</span>
          <span className="label-note dim">Tools I ship with</span>
        </div>

        <h2 id="stack-title" className="sr-only">
          Technology stack
        </h2>

        {groups.map((g) => (
          <div key={g.label} className="stack-group">
            <p className="stack-group-label mono dim">{g.label}</p>
            <ul className="stack-list">
              {g.items.map((item) => {
                rowIndex += 1;
                return (
                  <li key={item.name} className="stack-row">
                    <span className="stack-index mono dim">
                      {String(rowIndex).padStart(2, "0")}
                    </span>
                    <span className="stack-name display">
                      <span className="stack-name-base" aria-hidden="true">
                        {item.name}
                      </span>
                      <span className="stack-name-fill" aria-hidden="true">
                        {item.name}
                      </span>
                      <span className="sr-only">{item.name}</span>
                    </span>
                    <span className="stack-note mono dim">{item.note}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { splitWords } from "../../lib/split";
import "./Process.css";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "A short conversation about your business, goals and content. We define exactly what the site must achieve before anything is designed.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Visual direction and layouts you review before a line of code is written. You know what you're getting — no surprises later.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Responsive development with clean, modern code. Fast loading, careful detail at every breakpoint, from phone to widescreen.",
  },
  {
    n: "04",
    title: "Refine",
    desc: "Review rounds on real devices. Motion, copy and flow are tuned until the whole experience feels right.",
  },
  {
    n: "05",
    title: "Launch",
    desc: "Deployment, domain setup and a final performance and SEO pass. Your site goes live — and it's yours.",
  },
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const words = splitWords(headlineRef.current!);
      gsap.fromTo(
        words,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        }
      );

      // progress line filling through the steps
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-steps",
            start: "top 68%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );

      gsap.utils
        .toArray<HTMLElement>(".process-step")
        .forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0, y: 44 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: step, start: "top 80%" },
            }
          );
        });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="process section"
      id="process"
      aria-labelledby="process-title"
    >
      <div className="wrap grid-12">
        <div className="process-head">
          <div className="label-row mono">
            <span className="label-index">05</span>
            <span>Process</span>
          </div>
          <h2
            ref={headlineRef}
            id="process-title"
            className="display display--md process-title"
          >
            From idea to launch.
          </h2>
          <p className="dim process-lead">
            A clear, transparent workflow — you always know what happens next,
            and you review the design before development begins.
          </p>
        </div>

        <ol className="process-steps">
          <span className="process-track" aria-hidden="true" />
          <span ref={lineRef} className="process-fill" aria-hidden="true" />
          {steps.map((s) => (
            <li key={s.n} className="process-step">
              <span className="process-step-num mono dim">{s.n}</span>
              <div>
                <h3 className="display process-step-title">{s.title}</h3>
                <p className="dim process-step-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

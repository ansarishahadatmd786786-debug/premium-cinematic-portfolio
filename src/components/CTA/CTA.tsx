import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import {
  useFinePointer,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";
import { splitWords } from "../../lib/split";
import site from "../../data/site";
import "./CTA.css";

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
  "Project enquiry — I'd like a website"
)}`;

export default function CTA() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  /* reveal */
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const words = splitWords(headlineRef.current!);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 68%" },
      });
      tl.fromTo(
        ".cta-label",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          words,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.07 },
          0.1
        )
        .fromTo(
          ".cta-action",
          { opacity: 0, y: 24, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          0.5
        );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  /* magnetic button */
  useEffect(() => {
    if (!fine || reduced) return;
    const el = magnetRef.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.32);
      yTo(dy * 0.32);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced]);

  return (
    <section ref={rootRef} className="cta section" aria-labelledby="cta-title">
      <div className="wrap cta-inner">
        <p className="cta-label mono dim">Have a project?</p>

        <h2
          ref={headlineRef}
          id="cta-title"
          className="display display--xl cta-title"
        >
          Let&rsquo;s build it.
        </h2>

        <div className="cta-action">
          <div ref={magnetRef} className="cta-magnet">
            <a href={mailto} className="btn btn--solid cta-btn" data-cursor="link">
              Start a project
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
          <p className="cta-direct mono dim">
            <a className="u-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <span aria-hidden="true"> · </span>
            <a className="u-link" href={`tel:${site.phone}`}>
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

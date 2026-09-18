import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useIsMobile, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import "./Work.css";

/** Dramatic pinned transition into the project gallery. */
export default function WorkIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const counter = { v: 1 };
      if (numRef.current) numRef.current.textContent = "01";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: isMobile ? "+=170%" : "+=220%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        ".workintro-line .w-inner",
        { yPercent: 118 },
        { yPercent: 0, duration: 0.75, ease: "power3.out", stagger: 0.14 },
        0
      )
        .fromTo(
          ".workintro-head",
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          0.1
        )
        .to(".workintro-title", { opacity: 0.24, y: -26, duration: 0.9 }, 0.9)
        .fromTo(
          ".workintro-count",
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          1.0
        )
        .to(
          counter,
          {
            v: 12,
            duration: 1.6,
            ease: "power1.inOut",
            onUpdate: () => {
              if (numRef.current) {
                numRef.current.textContent = String(
                  Math.round(counter.v)
                ).padStart(2, "0");
              }
            },
          },
          1.1
        )
        .fromTo(
          [".workintro-projects", ".workintro-note"],
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.12 },
          2.45
        )
        .to({}, { duration: 0.5 });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <section
      ref={rootRef}
      className="workintro"
      aria-labelledby="workintro-title"
    >
      <div className="workintro-pin wrap">
        <div className="workintro-head mono dim">
          <span>
            <span className="label-index">03</span> — Selected Work
          </span>
          <span>Gallery</span>
        </div>

        <h2 id="workintro-title" className="sr-only">
          Selected work — twelve concept projects
        </h2>

        <div className="workintro-title display" aria-hidden="true">
          <span className="workintro-line">
            <span className="w-mask">
              <span className="w-inner">Selected</span>
            </span>
          </span>
          <span className="workintro-line">
            <span className="w-mask">
              <span className="w-inner">Work</span>
            </span>
          </span>
        </div>

        <div className="workintro-count" aria-hidden="true">
          <span ref={numRef} className="workintro-num display">
            12
          </span>
          <span className="workintro-projects mono dim">Projects</span>
        </div>

        <p className="workintro-note dim" aria-hidden="true">
          Twelve live concept websites across real industries — every one is a
          working demo that opens in a new tab.
        </p>
      </div>
    </section>
  );
}

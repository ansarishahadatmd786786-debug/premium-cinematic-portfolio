import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import site from "../../data/site";
import "./Loader.css";

/**
 * Cinematic loader — brand + 000 → 100 progress.
 * Runs once on initial page load (~1.5s), then slides away.
 * onBeginExit fires as the panel starts to lift, so the hero
 * intro can begin underneath — one continuous transition.
 */
export default function Loader({
  onBeginExit,
  onDone,
}: {
  onBeginExit: () => void;
  onDone: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          onDone();
        },
      });

      tl.fromTo(
        ".loader-brand .w-inner",
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, stagger: 0.045 },
        0.05
      )
        .fromTo(
          ".loader-role",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.35
        )
        .fromTo(
          ".loader-foot",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          0.3
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.15,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(
                  Math.round(counter.v)
                ).padStart(3, "0");
              }
            },
          },
          0.15
        )
        .to(
          barRef.current,
          { scaleX: 1, duration: 1.15, ease: "power2.inOut" },
          0.15
        )
        .add(() => onBeginExit(), "+=0.12")
        .to(".loader-inner", { yPercent: -24, opacity: 0, duration: 0.7, ease: "power3.in" }, "<")
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "<0.08"
        );
    }, rootRef);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letters = site.name.split("");

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading">
      <div className="loader-inner">
        <div className="loader-center">
          <div className="loader-brand display" aria-label={site.name}>
            {letters.map((l, i) => (
              <span key={i} className="w-mask" aria-hidden="true">
                <span className="w-inner">{l}</span>
              </span>
            ))}
          </div>
          <p className="loader-role mono dim">{site.roleDisplay}</p>
        </div>
        <div className="loader-foot mono">
          <span className="dim">Portfolio — {site.year}</span>
          <span ref={countRef} className="loader-count">
            000
          </span>
        </div>
        <div className="loader-bar" aria-hidden="true">
          <span ref={barRef} />
        </div>
      </div>
    </div>
  );
}

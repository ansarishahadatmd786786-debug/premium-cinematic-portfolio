import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import {
  useFinePointer,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";
import "./Capabilities.css";

const services = [
  {
    n: "01",
    title: "Business Websites",
    desc: "Complete company websites that make your business look established — and make contacting you effortless.",
    tags: ["Multi-page", "SEO-ready", "Contact flows"],
    hue: 210,
  },
  {
    n: "02",
    title: "Landing Pages",
    desc: "Focused single-page builds for a product, offer or campaign. One message, one goal: enquiries and sales.",
    tags: ["Conversion", "Campaign", "Fast loads"],
    hue: 32,
  },
  {
    n: "03",
    title: "E-commerce",
    desc: "Storefront experiences with collections, product pages and smooth shopping journeys on every screen.",
    tags: ["Storefront", "Cart flow", "Mobile-first"],
    hue: 300,
  },
  {
    n: "04",
    title: "Custom Web Experiences",
    desc: "Cinematic, interactive sites with 3D and motion — for brands that need to be remembered.",
    tags: ["3D / WebGL", "Motion", "Immersive"],
    hue: 90,
  },
];

export default function Capabilities() {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  /* floating preview — follows the cursor while hovering rows */
  useEffect(() => {
    if (!fine) return;
    const root = rootRef.current!;
    const preview = previewRef.current!;
    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 });

    const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });
    let visible = false;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    };
    const hide = () => {
      visible = false;
      gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.35, ease: "power3.in" });
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("capabilityenter", show);
    root.addEventListener("capabilityleave", hide);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("capabilityenter", show);
      root.removeEventListener("capabilityleave", hide);
    };
  }, [fine]);

  /* entrance reveals */
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cap-row",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".cap-list", start: "top 80%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const fire = (type: "capabilityenter" | "capabilityleave") =>
    rootRef.current?.dispatchEvent(new Event(type));

  return (
    <section
      ref={rootRef}
      className="capabilities section"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">02</span>
          <span>Services</span>
          <span className="label-note dim">What I build</span>
        </div>

        <h2 id="services-title" className="display display--md cap-heading">
          What I can build
          <br />
          for your business<span className="accent">.</span>
        </h2>

        <div className="cap-list">
          {services.map((s, i) => (
            <article
              key={s.n}
              className={`cap-row${active === i ? " is-active" : ""}`}
              onMouseEnter={() => {
                setActive(i);
                fire("capabilityenter");
              }}
              onMouseLeave={() => {
                setActive(null);
                fire("capabilityleave");
              }}
            >
              <span className="cap-row-index mono dim">{s.n}</span>
              <div className="cap-row-main">
                <h3 className="display cap-row-title">{s.title}</h3>
                <p className="cap-row-desc dim">{s.desc}</p>
                {/* inline abstract art — always visible on touch layouts */}
                <div
                  className="cap-row-art"
                  style={{ "--hue": s.hue } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <span className="cap-art-mono mono">{s.title}</span>
                </div>
              </div>
              <ul className="cap-row-tags mono dim" aria-label="Characteristics">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}

          {/* cursor-following preview (desktop) */}
          {fine && (
            <div ref={previewRef} className="cap-preview" aria-hidden="true">
              {services.map((s, i) => (
                <div
                  key={s.n}
                  className={`cap-preview-art${active === i ? " is-active" : ""}`}
                  style={{ "--hue": s.hue } as React.CSSProperties}
                >
                  <span className="cap-preview-num display">{s.n}</span>
                  <span className="cap-preview-label mono">{s.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

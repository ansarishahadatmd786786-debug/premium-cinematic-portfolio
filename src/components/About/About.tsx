import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { splitWords } from "../../lib/split";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import site from "../../data/site";
import "./About.css";

const facts = [
  { k: "Focus", v: "Business websites & web experiences" },
  { k: "Stack", v: "React · JavaScript · GSAP · Three.js" },
  { k: "Base", v: site.location },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  /* cursor-reactive grid glow */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  /* scroll reveals */
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
          stagger: 0.035,
          scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".about-fade",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".about-body", start: "top 82%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="about section" id="about" aria-labelledby="about-title">
      <div className="about-bg" aria-hidden="true" />
      <div className="about-glow" aria-hidden="true" />

      <div className="wrap">
        <div className="label-row mono">
          <span className="label-index">01</span>
          <span>About</span>
          <span className="label-note dim">Profile</span>
        </div>

        <h2 ref={headlineRef} id="about-title" className="display display--lg about-headline">
          Turning ideas into digital experiences.
        </h2>

        <div className="about-body grid-12">
          <figure className="about-photo about-fade">
            <img src="/images/shahadat-profile.png" alt="Shahadat — Web Developer" />
            <span className="about-photo-accent" aria-hidden="true" />
          </figure>

          <div className="about-copy">
            <p className="about-fade about-lead">
              I&rsquo;m Shahadat — a web developer building modern, responsive,
              conversion&#8209;focused websites for businesses and growing
              brands.
            </p>
            <p className="about-fade dim">
              Every project starts with your business, not the code: what you
              offer, who it&rsquo;s for, and what the site needs to achieve.
              From there it&rsquo;s design, build, refine, launch — with
              performance and clarity treated as features, not afterthoughts.
            </p>
          </div>

          <dl className="about-facts">
            {facts.map((f) => (
              <div key={f.k} className="about-fade about-fact">
                <dt className="mono dim">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
            <div className="about-fade about-fact">
              <dt className="mono dim">Status</dt>
              <dd className="about-status">
                <span className="status-dot" aria-hidden="true" />
                {site.availability}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

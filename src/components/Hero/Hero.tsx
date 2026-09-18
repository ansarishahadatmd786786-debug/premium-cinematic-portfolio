import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { isWebGLAvailable } from "../../lib/webgl";
import {
  useIsMobile,
  usePrefersReducedMotion,
} from "../../hooks/useMediaQuery";
import Scene from "./Scene";
import site from "../../data/site";
import "./Hero.css";

/* Elegant static substitute when WebGL is unavailable */
function FallbackArt() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <span className="hero-fallback-ring r1" />
      <span className="hero-fallback-ring r2" />
      <span className="hero-fallback-ring r3" />
      <span className="hero-fallback-orb" />
    </div>
  );
}

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const webgl = !reduced && isWebGLAvailable();
  const [inView, setInView] = useState(true);

  /* pause the WebGL frameloop once the hero leaves the viewport */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !webgl) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [webgl]);

  /* ---------- pointer tracking ---------- */
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile]);

  /* ---------- entrance after the loader ---------- */
  useEffect(() => {
    if (!started) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-line .w-inner",
        { yPercent: 118 },
        { yPercent: 0, duration: 1.15, stagger: 0.09 },
        0
      )
        .fromTo(
          canvasRef.current,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out" },
          0.1
        )
        .fromTo(
          [".hero-top", ".hero-bottom"],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.55
        );
    }, rootRef);
    return () => ctx.revert();
  }, [started]);

  /* ---------- cinematic pinned scroll sequence ---------- */
  useEffect(() => {
    if (reduced) return;
    rootRef.current?.classList.add("hero--cinematic");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: isMobile ? "+=190%" : "+=250%",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate: (self) => {
            scroll.current = self.progress;
          },
        },
      });

      // Phase 01 — "I BUILD" & "DIGITAL" lift away
      tl.to(".hero-line--1 .w-inner", { yPercent: -130, duration: 0.8, ease: "power2.in" }, 0.4)
        .to(".hero-line--2 .w-inner", { yPercent: -130, duration: 0.8, ease: "power2.in" }, 0.55)
        .to(".hero-line--3", { yPercent: -6, duration: 0.9 }, 0.5)

        // Phase 02 — "EXPERIENCES." exits upward
        .to(".hero-line--3 .w-inner", { yPercent: -130, duration: 0.85, ease: "power2.in" }, 1.35)
        .to([".hero-top", ".hero-bottom"], { opacity: 0, duration: 0.5 }, 1.3)

        // Phase 03 — "FOR BUSINESSES." mask-reveals
        .fromTo(
          ".hero-final",
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power2.out" },
          1.85
        )
        .fromTo(
          ".hero-final .hero-sub",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          2.45
        )
        .to(canvasRef.current, { opacity: 0.14, duration: 1.2 }, 1.8)

        // rest
        .to({}, { duration: 0.65 });
    }, rootRef);

    return () => ctx.revert();
  }, [isMobile, reduced]);

  useEffect(() => {
    // keep triggers honest once fonts settle
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section ref={rootRef} className="hero" id="home" aria-label="Intro">
      <div ref={pinRef} className="hero-pin">
        <div ref={canvasRef} className="hero-canvas" aria-hidden="true">
          {webgl ? (
            <Scene
              pointer={pointer}
              scroll={scroll}
              lowPower={isMobile}
              active={inView}
            />
          ) : (
            <FallbackArt />
          )}
        </div>

        <div className="hero-ui">
          <div className="hero-top mono">
            <span className="dim">Folio — {site.year}</span>
            <span className="hero-top-right dim">{site.tagline}</span>
          </div>

          <div className="hero-stage">
            <h1 className="sr-only">
              I build digital experiences for businesses — {site.firstName},{" "}
              {site.role}.
            </h1>

            <div className="hero-title display" aria-hidden="true">
              <span className="hero-line hero-line--1">
                <span className="w-mask">
                  <span className="w-inner">I&nbsp;Build</span>
                </span>
              </span>
              <span className="hero-line hero-line--2">
                <span className="w-mask">
                  <span className="w-inner">Digital</span>
                </span>
              </span>
              <span className="hero-line hero-line--3">
                <span className="w-mask">
                  <span className="w-inner">Experiences.</span>
                </span>
              </span>
            </div>

            <div className="hero-final display" aria-hidden="true">
              <span className="hero-final-line">
                For
                <br />
                Businesses<span className="accent">.</span>
              </span>
              <p className="hero-sub">
                Modern, responsive websites that turn your visitors into
                customers — designed with intent, built to perform.
              </p>
            </div>
          </div>

          <div className="hero-bottom mono">
            <span className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              {site.availability}
            </span>
            <span className="hero-scroll dim" aria-hidden="true">
              Scroll
              <span className="hero-scroll-line" />
            </span>
            <span className="dim hero-loc">{site.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

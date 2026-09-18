import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { getLenis, scrollToTarget } from "../../lib/lenis";
import site, { navLinks } from "../../data/site";
import "./Navbar.css";

/**
 * Minimal fixed navbar.
 * Left: SHAHADAT · Right: inline links (desktop) + MENU button.
 * MENU opens a fullscreen overlay (all viewports, primary on mobile).
 */
export default function Navbar({ started }: { started: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* ---------- nav background on scroll ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- overlay animation ---------- */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (open) {
      document.documentElement.style.overflow = "hidden";
      getLenis()?.stop();
      tlRef.current?.kill();
      const tl = gsap.timeline();
      tl.set(overlay, { visibility: "visible" })
        .fromTo(
          overlay,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" }
        )
        .fromTo(
          ".nav-overlay-item",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.75, ease: "power4.out", stagger: 0.055 },
          "-=0.25"
        )
        .fromTo(
          ".nav-overlay-foot",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.4"
        );
      tlRef.current = tl;
      firstLinkRef.current?.focus({ preventScroll: true });
    } else if (overlay.style.visibility === "visible") {
      tlRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { visibility: "hidden" });
          document.documentElement.style.overflow = "";
          getLenis()?.start();
        },
      });
      tl.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: "power4.inOut",
      });
      tlRef.current = tl;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ---------- entrance after loader ---------- */
  useEffect(() => {
    if (!started || !rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 }
    );
  }, [started]);

  const go = useCallback((id: string) => {
    setOpen(false);
    // wait briefly for the overlay close, ensure lenis is running,
    // then glide to the section
    window.setTimeout(() => {
      getLenis()?.start();
      scrollToTarget(`#${id}`, id === "home" ? 0 : -20);
    }, 120);
  }, []);

  return (
    <>
      <header
        ref={rootRef}
        className={`nav${scrolled ? " nav--scrolled" : ""}`}
        style={started ? undefined : { opacity: 0 }}
      >
        <button
          className="nav-brand mono"
          onClick={() => go("home")}
          aria-label="Shahadat — back to top"
        >
          SHAHADAT<span className="accent">.</span>
        </button>

        <nav className="nav-links mono" aria-label="Primary">
          {navLinks.map((l) => (
            <button key={l.id} className="u-link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <button
          className="nav-menu-btn mono"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-overlay"
        >
          <span className="nav-menu-label">{open ? "Close" : "Menu"}</span>
          <span className={`nav-menu-icon${open ? " is-open" : ""}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>

      <div
        ref={overlayRef}
        id="nav-overlay"
        className="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav className="nav-overlay-list" aria-label="Overlay">
          {navLinks.map((l, i) => (
            <div key={l.id} className="nav-overlay-row">
              <button
                ref={i === 0 ? firstLinkRef : undefined}
                className="nav-overlay-link display"
                onClick={() => go(l.id)}
              >
                <span className="nav-overlay-index mono">0{i + 1}</span>
                <span className="nav-overlay-item-wrap">
                  <span className="nav-overlay-item">{l.label}</span>
                </span>
                <ArrowUpRight className="nav-overlay-arrow" size={22} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </nav>

        <div className="nav-overlay-foot mono">
          <a href={`mailto:${site.email}`} className="u-link dim">
            {site.email}
          </a>
          <span className="dim">{site.tagline}</span>
        </div>
      </div>
    </>
  );
}

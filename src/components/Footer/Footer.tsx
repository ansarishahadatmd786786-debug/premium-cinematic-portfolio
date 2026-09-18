import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { scrollToTarget } from "../../lib/lenis";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import site, { navLinks } from "../../data/site";
import "./Footer.css";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-word",
        { yPercent: 42, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const validSocials = site.socials.filter((s) => s.url && s.url.trim() !== "");

  return (
    <footer ref={rootRef} className="footer">
      <div className="wrap">
        <div className="footer-word-wrap" aria-hidden="true">
          <span className="footer-word display">{site.name}</span>
        </div>

        <div className="footer-mid">
          <div className="footer-col footer-col-brand">
            <p className="mono">{site.roleDisplay}</p>
            <p className="dim footer-tagline">{site.tagline}</p>
          </div>

          <nav className="footer-col mono" aria-label="Footer">
            <p className="mono dim footer-col-title">Menu</p>
            <ul>
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    className="u-link dim footer-link"
                    onClick={() => scrollToTarget(`#${l.id}`, -10)}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col mono">
            <p className="mono dim footer-col-title">Contact</p>
            <ul>
              <li>
                <a className="u-link dim footer-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="u-link dim footer-link" href={`tel:${site.phone}`}>
                  {site.phoneDisplay}
                </a>
              </li>
              {validSocials.map((s) => (
                <li key={s.label}>
                  <a
                    className="u-link dim footer-link"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bar mono dim">
          <span>© {site.year} {site.name}</span>
          <span className="footer-made">Designed &amp; built by {site.firstName}</span>
          <button
            className="u-link footer-top"
            onClick={() => scrollToTarget(0)}
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={13} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

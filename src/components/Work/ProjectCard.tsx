import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import type { Project } from "../../data/projects";
import "./Work.css";

/**
 * Cinematic project showcase — visual scales into view (0.85 → 1),
 * media parallaxes inside its frame, info rises in one by one.
 */
export default function ProjectCard({
  project,
  flip,
}: {
  project: Project;
  flip: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLAnchorElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  console.log("PROJECT CHECK:", project.num, project.name, project.image);

  useEffect(() => {
    // Temporarily disable GSAP in development while debugging project images.
    if (import.meta.env.DEV) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // 70% → 100% scale-in as the visual enters the viewport
      gsap.fromTo(
        visualRef.current,
        { scale: 0.86, y: 70 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: visualRef.current,
            start: "top 96%",
            end: "top 34%",
            scrub: 0.6,
          },
        }
      );

      // Parallax inside the frame
      gsap.fromTo(
        mediaRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: visualRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Info cascade
      gsap.fromTo(
        rootRef.current!.querySelectorAll(".p-fade"),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <article
      ref={rootRef}
      className={`project${flip ? " project--flip" : ""}`}
      aria-label={`${project.name} — ${project.category}`}
    >
      <span className="project-bgnum display" aria-hidden="true">
        {project.num}
      </span>

      <a
        ref={visualRef}
        className="project-visual"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="view"
        aria-label={`${project.name} — view live experience (opens in a new tab)`}
      >
        <div ref={mediaRef} className="project-media">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} — website screenshot`}
              decoding="async"
            />
          ) : (
            <div
              className="project-cover"
              style={{ "--hue": project.hue } as React.CSSProperties}
            >
              <span className="project-cover-grid" />
              <span className="project-cover-initials display">
                {project.initials}
              </span>
              <span className="project-cover-meta mono">
                <span className="dim">{project.category}</span>
                <span className="dim">Site {project.num} / 12</span>
              </span>
            </div>
          )}
        </div>

        <span className="project-live mono">
          <span className="status-dot" aria-hidden="true" />
          Live demo
        </span>
      </a>

      <div className="project-info">
        <div className="p-fade project-meta mono dim">
          <span className="accent">P.{project.num}</span>
          <span>{project.category}</span>
        </div>

        <h3 className="p-fade display project-name">{project.name}</h3>

        <p className="p-fade project-desc dim">{project.description}</p>

        <dl className="p-fade project-details mono">
          <div>
            <dt className="dim">Focus</dt>
            <dd>{project.focus.join(" · ")}</dd>
          </div>

          <div>
            <dt className="dim">Tech</dt>
            <dd>{project.tech.join(" · ")}</dd>
          </div>

          <div>
            <dt className="dim">Type</dt>
            <dd>{project.type}</dd>
          </div>
        </dl>

        <a
          className="p-fade project-cta u-link mono"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View live experience
          <ArrowUpRight
            size={14}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}
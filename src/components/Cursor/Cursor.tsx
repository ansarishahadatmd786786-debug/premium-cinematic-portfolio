import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../../lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import "./Cursor.css";

type CursorMode = "dot" | "ring" | "view";

/**
 * Custom cursor — desktop (fine pointer) only.
 * dot   → default state
 * ring  → hovering links / buttons
 * view  → "[data-cursor=view]" elements (project visuals)
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>("dot");

  useEffect(() => {
    if (!fine || reduced) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const pill = pillRef.current!;
    const els = [dot, ring, pill];

    document.body.classList.add("cursor-on");
    gsap.set(els, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const setters = els.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: el === dot ? 0.16 : 0.42, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: el === dot ? 0.16 : 0.42, ease: "power3" }),
    }));

    const onMove = (e: PointerEvent) => {
      setters.forEach((s) => {
        s.x(e.clientX);
        s.y(e.clientY);
      });
    };

    const applyMode = (mode: CursorMode) => {
      if (modeRef.current === mode) return;
      modeRef.current = mode;
      gsap.to(dot, {
        scale: mode === "dot" ? 1 : 0,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(ring, {
        scale: mode === "ring" ? 1 : 0,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(pill, {
        scale: mode === "view" ? 1 : 0,
        duration: 0.35,
        ease: "back.out(1.6)",
      });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== "function") return;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        applyMode(tagged.dataset.cursor === "view" ? "view" : "ring");
        return;
      }
      if (t.closest("a, button, input, textarea, [role='button']")) {
        applyMode("ring");
        return;
      }
      applyMode("dot");
    };

    const onLeave = () =>
      gsap.to(els, { opacity: 0, duration: 0.25, overwrite: "auto" });
    const onEnter = () =>
      gsap.to(els, { opacity: 1, duration: 0.25, overwrite: "auto" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      document.body.classList.remove("cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={pillRef} className="cursor-pill">
        <span>View</span>
        <ArrowUpRight size={13} strokeWidth={1.75} />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

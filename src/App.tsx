import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { destroyLenis, initLenis } from "./lib/lenis";
import { usePrefersReducedMotion } from "./hooks/useMediaQuery";

import Cursor from "./components/Cursor/Cursor";
import Loader from "./components/Loader/Loader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Capabilities from "./components/Capabilities/Capabilities";
import WorkIntro from "./components/Work/WorkIntro";
import Work from "./components/Work/Work";
import Stack from "./components/Stack/Stack";
import Process from "./components/Process/Process";
import Values from "./components/Values/Values";
import CTA from "./components/CTA/CTA";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

export default function App() {
  /** loader exit has begun → hero intro + navbar entrance start */
  const [exitBegan, setExitBegan] = useState(false);
  /** loader fully finished → unmount it */
  const [loaderGone, setLoaderGone] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* smooth scroll (skipped for reduced-motion users) */
  useEffect(() => {
    if (reduced) return;
    initLenis();
    return () => destroyLenis();
  }, [reduced]);

  /* always start at the top on load */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const handleBeginExit = useCallback(() => setExitBegan(true), []);
  const handleDone = useCallback(() => {
    setLoaderGone(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  /* recalc layouts once everything is mounted */
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Cursor />

      {!loaderGone && (
        <Loader onBeginExit={handleBeginExit} onDone={handleDone} />
      )}

      <Navbar started={exitBegan} />

      <main id="main">
        <Hero started={exitBegan} />
        <About />
        <Capabilities />
        <WorkIntro />
        <Work />
        <Stack />
        <Process />
        <Values />
        <CTA />
        <Contact />
      </main>

      <Footer />

      {/* cinematic film grain */}
      <div className="noise" aria-hidden="true" />
    </>
  );
}

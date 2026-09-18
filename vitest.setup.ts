import { vi } from "vitest";

/**
 * Runs before any test module imports (incl. gsap plugin registration).
 * Forces reduced-motion + mobile + coarse-pointer → WebGL, Lenis,
 * pinned timelines and the custom cursor all stay inert under jsdom.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: () => false,
  }),
});

window.scrollTo = vi.fn();

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverStub,
});

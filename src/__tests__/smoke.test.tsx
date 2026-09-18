// @ts-nocheck
/**
 * Smoke test — the full app must mount and render every section.
 * matchMedia is stubbed to force reduced-motion + mobile state so
 * WebGL / Lenis / pinned timelines stay inert under jsdom.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(cleanup);

beforeAll(() => {
  window.matchMedia = (q) => ({
    matches: true, // reduced motion + mobile → inert animations
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: () => false,
  });
  window.scrollTo = vi.fn();
});

import App from "../App";
import projects from "../data/projects";

describe("App", () => {
  it("mounts the entire portfolio without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("renders the brand and role", () => {
    render(<App />);
    expect(screen.getAllByText(/SHAHADAT/i).length).toBeGreaterThan(0);
  });

  it("renders all 12 projects with live links", () => {
    render(<App />);
    const liveLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.includes("vercel.app"));
    // 12 visual anchors + 12 CTA links = 24
    expect(liveLinks.length).toBe(24);
    projects.forEach((p) => {
      const matches = liveLinks.filter((a) => a.getAttribute("href") === p.url);
      expect(matches.length).toBeGreaterThan(0);
      matches.forEach((a) => {
        expect(a.getAttribute("target")).toBe("_blank");
        expect(a.getAttribute("rel")).toContain("noopener");
      });
    });
  });

  it("renders contact email & phone from site config", () => {
    render(<App />);
    expect(
      screen.getAllByText("ansarish8880@gmail.com").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("72176 58640").length).toBeGreaterThan(0);
  });

  it("renders all sections in order", () => {
    const { container } = render(<App />);
    const order = [
      ".hero",
      ".about",
      ".capabilities",
      ".workintro",
      ".work",
      ".stack",
      ".process",
      ".values",
      ".cta",
      ".contact",
      ".footer",
    ];
    const nodes = order.map((s) => container.querySelector(s));
    nodes.forEach((n) => expect(n).not.toBeNull());
    const positions = nodes.map((n) => n.compareDocumentPosition(nodes[0]));
    expect(positions.every((p) => typeof p === "number")).toBe(true);
  });
});

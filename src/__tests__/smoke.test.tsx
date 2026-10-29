/**
 * Smoke test: the full app must mount and render every section.
 * matchMedia is stubbed to force reduced-motion + mobile state so
 * WebGL / Lenis / pinned timelines stay inert under jsdom.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

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

  it("shows featured projects first and can reveal the full project list", () => {
    render(<App />);
    const featuredLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.includes("vercel.app"));

    expect(featuredLinks.length).toBe(
      projects.filter((project) => project.featured).length * 2,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show all projects" }));
    const liveLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.includes("vercel.app"));
    expect(liveLinks.length).toBe(projects.length * 2);

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
      screen.getAllByText("ansarishahadatmd786786@gmail.com").length
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
      ".case-study",
      ".packages",
      ".contact",
      ".footer",
    ];
    const nodes = order.map((selector) => {
      const node = container.querySelector(selector);
      if (!node) throw new Error(`Missing section ${selector}`);
      return node;
    });
    nodes.slice(1).forEach((node, index) => {
      const position = nodes[index].compareDocumentPosition(node);
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    });
  });
});

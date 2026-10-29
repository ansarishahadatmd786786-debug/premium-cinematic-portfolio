import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Contact from "./Contact";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Contact form", () => {
  it("uses the international WhatsApp number", () => {
    render(<Contact />);
    const whatsappLink = screen.getByRole("link", { name: /Chat on WhatsApp/ });
    expect(whatsappLink.getAttribute("href")).toMatch(
      /^https:\/\/wa\.me\/917217658640\?/,
    );
  });

  it("posts enquiries to the configured endpoint and reports success", async () => {
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    vi.stubEnv("VITE_FORM_KEY", "browser-public-key");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "A. Person" },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "person@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: "I need a business website." },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Project enquiry form" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://forms.example/submit",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer browser-public-key",
        },
        body: JSON.stringify({
          name: "A. Person",
          email: "person@example.com",
          business: "",
          message: "I need a business website.",
        }),
      }),
    );
    expect(await screen.findByText("Thanks. Your message has been sent.")).toBeTruthy();
  });

  it("reports form-service failures", async () => {
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "A. Person" },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "person@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: "I need a business website." },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Project enquiry form" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("We could not send your message.");
  });
});

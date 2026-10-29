import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Contact from "./Contact";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function fillAndSubmit(honeypot = false) {
  fireEvent.change(screen.getByLabelText(/Name/), {
    target: { value: "A. Person" },
  });
  fireEvent.change(screen.getByLabelText(/Email/), {
    target: { value: "person@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Business \/ Project/), {
    target: { value: "Portfolio project" },
  });
  fireEvent.change(screen.getByLabelText(/Message/), {
    target: { value: "I need a business website." },
  });
  if (honeypot) {
    fireEvent.change(screen.getByLabelText("Leave this field empty"), {
      target: { value: "spam" },
    });
  }
  fireEvent.submit(screen.getByRole("form", { name: "Project enquiry form" }));
}

describe("Contact form", () => {
  it("uses the international WhatsApp number", () => {
    render(<Contact />);
    const whatsappLink = screen.getByRole("link", { name: /Chat on WhatsApp/ });
    expect(whatsappLink.getAttribute("href")).toMatch(
      /^https:\/\/wa\.me\/917217658640\?/,
    );
  });

  it("posts the Web3Forms access key in the JSON body without authorization headers", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "web3forms");
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    vi.stubEnv("VITE_FORM_KEY", "public-access-key");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://forms.example/submit");
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    expect(options?.headers).not.toHaveProperty("Authorization");
    expect(JSON.parse(String(options?.body))).toEqual({
      access_key: "public-access-key",
      name: "A. Person",
      email: "person@example.com",
      business: "Portfolio project",
      message: "I need a business website.",
      subject: "Project enquiry: Portfolio project",
      from_name: "Portfolio",
    });
    expect(await screen.findByText("Thanks. Your message has been sent.")).toBeTruthy();
  });

  it("posts the Formspree JSON payload with an Accept header", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "formspree");
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    expect(JSON.parse(String(options?.body))).toEqual({
      name: "A. Person",
      email: "person@example.com",
      business: "Portfolio project",
      message: "I need a business website.",
    });
  });

  it("posts the generic JSON payload without an authorization header", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "generic");
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    vi.stubEnv("VITE_FORM_KEY", "unused-key");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    expect(options?.headers).not.toHaveProperty("Authorization");
    expect(JSON.parse(String(options?.body))).toEqual({
      name: "A. Person",
      email: "person@example.com",
      business: "Portfolio project",
      message: "I need a business website.",
    });
  });

  it("silently ignores submissions caught by the honeypot", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "generic");
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit(true);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(await screen.findByText("Thank you. Your message has been received.")).toBeTruthy();
  });

  it("uses an honest mailto fallback when no endpoint is configured", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "generic");
    vi.stubEnv("VITE_FORM_ENDPOINT", "");
    const openMock = vi.fn<(url: string, target: string) => Window | null>(
      () => null,
    );
    vi.stubGlobal("open", openMock);
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(openMock).toHaveBeenCalledOnce());
    expect(openMock.mock.calls[0][0]).toContain("mailto:");
    expect(openMock.mock.calls[0][1]).toBe("_self");
    expect(
      await screen.findByText(
        "Your email app should open with a draft. The enquiry is sent only after you send that email.",
      ),
    ).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports form-service failures", async () => {
    vi.stubEnv("VITE_FORM_PROVIDER", "generic");
    vi.stubEnv("VITE_FORM_ENDPOINT", "https://forms.example/submit");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("We could not send your message.");
  });
});

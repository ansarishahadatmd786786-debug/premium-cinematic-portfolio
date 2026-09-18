/**
 * Split an element's text content into masked word spans
 * for staggered reveal animations.
 * Returns the inner word spans (animate these).
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  // idempotent — reuse spans if the element was already split
  const existing = Array.from(
    el.querySelectorAll<HTMLElement>(".w-inner")
  );
  if (existing.length) return existing;

  const text = (el.textContent ?? "").trim();
  if (!text) return [];
  const words = text.split(/\s+/);

  el.setAttribute("aria-label", text);
  el.textContent = "";

  const inners: HTMLElement[] = [];
  words.forEach((word, i) => {
    const mask = document.createElement("span");
    mask.className = "w-mask";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "w-inner";
    inner.textContent = word;
    mask.appendChild(inner);
    el.appendChild(mask);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });
  return inners;
}

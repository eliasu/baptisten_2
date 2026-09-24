import { ScrollTrigger } from "gsap/ScrollTrigger";

for (const wrap of document.querySelectorAll<HTMLElement>(".offers_wrap")) {
  const filters = wrap.querySelector<HTMLElement>(".offers_filters");
  const count = wrap.querySelector<HTMLElement>(".offers_count");
  const items = [...wrap.querySelectorAll<HTMLElement>(".offers_item")];
  if (!filters || !count) continue;

  // Categories in the order they first appear in the list
  const categories = new Map<string, string>([["", "Alle"]]);
  for (const item of items) {
    const slug = item.dataset.category;
    if (slug && !categories.has(slug)) categories.set(slug, item.dataset.categoryTitle ?? slug);
  }

  const chips = [...categories].map(([slug, title]) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "offers_chip";
    chip.dataset.category = slug;
    const amount = slug ? items.filter((item) => item.dataset.category === slug).length : items.length;
    chip.innerHTML = `${title}<sup aria-hidden="true">${amount}</sup>`;
    chip.addEventListener("click", () => filter(slug));
    filters.append(chip);
    return chip;
  });

  const filter = (slug: string) => {
    chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.category === slug)));
    let shown = 0;
    for (const item of items) {
      const show = !slug || item.dataset.category === slug;
      item.hidden = !show;
      if (show) shown++;
    }
    count.textContent = shown === 1 ? "1 Angebot" : `${shown} Angebote`;
    ScrollTrigger.refresh();
  };

  filters.hidden = false;
  count.hidden = false;
  filter("");

  document.querySelectorAll<HTMLAnchorElement>("[data-offer-filter]").forEach((link) => {
    link.addEventListener("click", () => filter(link.dataset.offerFilter ?? ""));
  });

  // Opening a row changes the page height below it
  wrap.querySelectorAll("details").forEach((details) => details.addEventListener("toggle", () => setTimeout(() => ScrollTrigger.refresh(), 700)));
}

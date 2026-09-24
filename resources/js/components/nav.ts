const nav = document.querySelector<HTMLElement>(".nav_wrap");
const toggle = nav?.querySelector<HTMLButtonElement>(".nav_toggle");

if (nav && toggle) {
  const setOpen = (open: boolean) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!nav.classList.contains("open") || !(target instanceof Node)) return;
    if (!nav.contains(target)) setOpen(false);
  });

  window
    .matchMedia("(width >= 64rem)")
    .addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
}

// Statamic port: border once scrolled, hide on scroll down, show on scroll up
if (nav) {
  let lastY = scrollY;
  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
      nav.classList.toggle("scrolled", y > 8);
      nav.classList.toggle("hidden", y > lastY && y > 240);
      lastY = y;
    },
    { passive: true },
  );

  // Statamic port: in-page links mark the section in view
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('.nav_link[href*="#"]')];
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((section): section is HTMLElement => section !== null);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else if (link.getAttribute("aria-current") === "location") link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

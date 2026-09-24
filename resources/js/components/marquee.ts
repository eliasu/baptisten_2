for (const marquee of document.querySelectorAll<HTMLElement>(
  ".marquee_wrap",
)) {
  // Statamic port: Astro counts the items at build time; Antlers can't, so it happens here.
  const panel = marquee.querySelector(".marquee_panel");
  if (panel) marquee.style.setProperty("--_count", String(panel.children.length));

  const toggle = marquee.querySelector<HTMLButtonElement>(
    "[data-marquee-toggle]",
  );
  if (!toggle) continue;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  const setPlaying = (playing: boolean) => {
    marquee.dataset.state = playing ? "playing" : "paused";
    toggle.setAttribute("aria-pressed", String(playing));
    // Statamic port: German, the site language.
    toggle.setAttribute("aria-label", playing ? "Pause" : "Abspielen");
  };

  /* Anyone who asked for less motion gets it still, and can start it. */
  setPlaying(!reduced.matches);
  reduced.addEventListener("change", () => setPlaying(!reduced.matches));

  toggle.addEventListener("click", () => {
    setPlaying(marquee.dataset.state !== "playing");
  });
}

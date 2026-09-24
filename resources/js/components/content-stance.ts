import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  for (const text of document.querySelectorAll<HTMLElement>(".stance_text")) {
    // Wrap each word so it can light up on its own
    text.innerHTML = text.textContent!
      .trim()
      .split(/(\s+)/)
      .map((part) => (/\s/.test(part) ? part : `<span class="stance_word">${part}</span>`))
      .join("");
    gsap.fromTo(
      text.querySelectorAll(".stance_word"),
      { opacity: 0.16 },
      { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true } },
    );
  }
});

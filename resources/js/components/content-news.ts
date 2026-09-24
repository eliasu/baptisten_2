import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  for (const cover of document.querySelectorAll<HTMLElement>(".news_cover")) {
    const paths = [...cover.querySelectorAll<SVGPathElement>(".news_cover-plant path")];
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    const grow = gsap.timeline({ paused: true }).to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.18, ease: "power2.out" });
    ScrollTrigger.create({ trigger: cover, start: "top 75%", once: true, onEnter: () => grow.play() });
    cover.addEventListener("pointerenter", () => grow.restart());
  }
});

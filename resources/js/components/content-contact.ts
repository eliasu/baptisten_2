import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  for (const map of document.querySelectorAll<HTMLElement>(".contact_map")) {
    const route = map.querySelector<SVGPathElement>(".contact_route");
    if (!route) continue;
    const length = route.getTotalLength();
    gsap.fromTo(
      route,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: map, start: "top 80%", end: "bottom 60%", scrub: true } },
    );
  }
});

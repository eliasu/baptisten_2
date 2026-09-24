import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add("(width >= 64rem) and (prefers-reduced-motion: no-preference)", () => {
  for (const section of document.querySelectorAll<HTMLElement>(".history_wrap")) {
    const track = section.querySelector<HTMLElement>(".history_track");
    const pin = section.querySelector<HTMLElement>(".history_pin");
    if (!track || !pin) continue;

    section.classList.add("pinned");
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const scroll = { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: 0.7, invalidateOnRefresh: true };

    const move = gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { ...scroll, pin } });
    gsap.fromTo(section.querySelector(".history_progress"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: scroll });
    section.querySelectorAll(".history_year").forEach((year) => {
      gsap.from(year, {
        yPercent: 40,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: year, containerAnimation: move, start: "left 88%", toggleActions: "play none none reverse" },
      });
    });
  }
  return () => document.querySelectorAll(".history_wrap").forEach((section) => section.classList.remove("pinned"));
});

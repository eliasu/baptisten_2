import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  for (const schedule of document.querySelectorAll<HTMLElement>(".schedule_wrap")) {
    const timeline = schedule.querySelector(".schedule_timeline");
    gsap.fromTo(
      schedule.querySelector(".schedule_rail"),
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
    );
    gsap.to(schedule.querySelectorAll(".schedule_bars rect"), {
      scaleY: 0.3,
      transformOrigin: "50% 100%",
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.12, from: "random" },
      ease: "sine.inOut",
    });
  }
});

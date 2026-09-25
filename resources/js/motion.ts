import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out" });
  // Reset once scrolled back above the start, so every build-up plays again on the next pass
  ScrollTrigger.defaults({ toggleActions: "play none none reset" });

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  const lenis = new Lenis({ lerp: 0.08 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href") || "");
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      const nav = document.querySelector<HTMLElement>(".nav_wrap");
      lenis.scrollTo(target, { offset: -(nav?.offsetHeight ?? 0) });
    });
  });

  // Headings split into lines that slide up
  document.querySelectorAll<HTMLElement>(".intro_heading").forEach((heading) => {
    heading.innerHTML = heading.innerHTML
      .split(/<br\s*\/?>/i)
      .map((line) => `<span class="intro_line"><span>${line.trim()}</span></span>`)
      .join("");
    gsap.from(heading.querySelectorAll(".intro_line > span"), {
      yPercent: 110,
      duration: 1.6,
      stagger: 0.12,
      scrollTrigger: { trigger: heading, start: "top 85%" },
    });
    const layout = heading.parentElement;
    if (layout) {
      gsap.from(layout.querySelectorAll(":scope > :not(.intro_heading)"), {
        opacity: 0,
        y: 20,
        duration: 1.4,
        stagger: 0.2,
        scrollTrigger: { trigger: layout, start: "top 75%" },
      });
    }
  });

  // Section heads: the rule draws in, then the contents rise
  document.querySelectorAll<HTMLElement>(".content-head_wrap").forEach((head) => {
    gsap.from(head, {
      borderTopColor: "transparent",
      duration: 1,
      ease: "none",
      scrollTrigger: { trigger: head, start: "top 90%" },
    });
  });

  // Anything marked data-reveal: its children rise in turn
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((group) => {
    gsap.from(group.children, {
      opacity: 0,
      y: 24,
      duration: 1.3,
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 88%" },
    });
  });

  // Network rows
  document.querySelectorAll<HTMLElement>(".network_item").forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      scrollTrigger: { trigger: item, start: "top 95%" },
    });
  });

  // Work: masks open, image zooms out, caption follows
  document.querySelectorAll<HTMLElement>(".work_item").forEach((item) => {
    const trigger = { trigger: item, start: "top 88%" };
    gsap.fromTo(
      item.querySelector(".work_media"),
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: trigger },
    );
    const image = item.querySelector(".work_media .media_inner");
    if (image) gsap.from(image, { scale: 1.3, duration: 2.2, scrollTrigger: trigger });
    gsap.from(item.querySelector(".work_caption"), { opacity: 0, y: 10, duration: 1.2, delay: 0.6, scrollTrigger: trigger });
  });

  // Contact
  const mail = document.querySelector(".contact_mail");
  if (mail) gsap.from(mail, { opacity: 0, y: 30, duration: 1.5, scrollTrigger: { trigger: mail, start: "top 85%" } });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

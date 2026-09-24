import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* Hooks: .motion-words (words rise on load), .motion-scrub (words brighten
   while scrolling), .motion-up, .motion-clip, [data-parallax="-6"] (percent),
   [data-drift]. Nothing moves for prefers-reduced-motion. */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out" });

  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -80 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const splitWords = (root: Element) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const parts = (node.textContent ?? "").split(/(\s+)/);
      node.replaceWith(
        ...parts.map((part) => {
          if (!part.trim()) return part;
          const word = document.createElement("span");
          word.className = "motion-word";
          word.append(Object.assign(document.createElement("span"), { textContent: part }));
          return word;
        }),
      );
    }
    return root.querySelectorAll(".motion-word > span");
  };

  const reveal = (trigger: Element) => ({ trigger, start: "top 90%" });

  for (const el of document.querySelectorAll(".motion-words")) {
    gsap.from(splitWords(el), { yPercent: 110, duration: 1.4, stagger: 0.045, delay: 0.1 });
  }

  for (const el of document.querySelectorAll(".motion-scrub")) {
    gsap.fromTo(splitWords(el), { opacity: 0.15 }, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
    });
  }

  for (const el of document.querySelectorAll(".motion-up")) {
    gsap.from(el, { opacity: 0, y: 20, duration: 1.2, scrollTrigger: reveal(el) });
  }

  for (const el of document.querySelectorAll(".motion-clip")) {
    gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.6,
      ease: "expo.inOut",
      scrollTrigger: reveal(el),
    });
    gsap.from(el.firstElementChild, { scale: 1.3, duration: 2.2, scrollTrigger: reveal(el) });
  }

  for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
    gsap.to(el, {
      yPercent: Number(el.dataset.parallax),
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  for (const el of document.querySelectorAll("[data-drift]")) {
    gsap.fromTo(el, { xPercent: 4 }, {
      xPercent: -28,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  // Opening a <details> changes the page height.
  document.addEventListener("toggle", () => setTimeout(() => ScrollTrigger.refresh(), 400), true);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* Hooks: .motion-words (words rise on load, a .motion-first part inside
   first; then on-screen .motion-up, the nav, on-screen media), .motion-scrub (words brighten
   while scrolling), .motion-up, .motion-clip (builds up with the scroll
   position and back down when scrolled back; media already on screen at load
   builds up once, on its own), [data-parallax="-6"] (percent),
   [data-drift]. Nothing moves for prefers-reduced-motion. */
export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The smooth scroller, for components that scroll the page. */
export let lenis: Lenis | null = null;

/* Each .motion-clip's timeline. Media hidden at load gets none: its scroll
   position isn't known yet, so the component that shows it calls
   clipReveal() then, and clipRemove() when it hides it again. */
export const clips = new WeakMap<Element, gsap.core.Timeline>();

export function clipReveal(el: Element, onScreen = false) {
  if (reduced) return;
  // Tied to the scroll, an expo curve packs the whole build into a sliver
  // of the scroll distance; a gentle curve spreads it over the range.
  const timeline = gsap.timeline(
    onScreen
      ? {}
      : { defaults: { ease: "power1.inOut" }, scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: 2.5 } },
  );
  timeline
    .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ...(onScreen && { ease: "expo.inOut" }) })
    .fromTo(el.firstElementChild, { scale: 1.3 }, { scale: 1, duration: 1.6, ...(onScreen && { ease: "expo.out", duration: 2.2 }) }, 0);
  clips.set(el, timeline);
}

export function clipRemove(el: Element) {
  const timeline = clips.get(el);
  timeline?.scrollTrigger?.kill();
  timeline?.kill();
  gsap.set([el, el.firstElementChild], { clearProps: "clipPath,scale" });
  clips.delete(el);
}

if (!reduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out" });

  lenis = new Lenis({ lerp: 0.09, anchors: { offset: -80 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
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

  const intro = gsap.timeline({ delay: 0.1 });
  for (const el of document.querySelectorAll(".motion-words")) {
    const words = [...splitWords(el)];
    const first = words.filter((word) => word.closest(".motion-first"));
    const rest = words.filter((word) => !first.includes(word));
    if (first.length) intro.from(first, { yPercent: 110, duration: 1.4, stagger: 0.06 }, 0);
    intro.from(rest, { yPercent: 110, duration: 1.4, stagger: 0.045 }, first.length ? 1.1 : 0);
  }
  intro.addLabel("chrome", "-=0.7");
  const onScreen = (el: Element) => el.getBoundingClientRect().top < innerHeight;

  for (const el of document.querySelectorAll(".motion-scrub")) {
    gsap.fromTo(splitWords(el), { opacity: 0.15 }, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
    });
  }

  for (const el of document.querySelectorAll(".motion-up")) {
    if (onScreen(el)) intro.from(el, { opacity: 0, y: 20, duration: 1.2 }, "chrome");
    else gsap.from(el, { opacity: 0, y: 20, duration: 1.2, scrollTrigger: reveal(el) });
  }
  intro.from(".nav_wrap", { opacity: 0, y: -16, duration: 1.2 }, "chrome+=0.5");
  intro.addLabel("media", "chrome+=1");

  let shown = 0;
  for (const el of document.querySelectorAll<HTMLElement>(".motion-clip")) {
    if (el.offsetParent === null) continue;
    const visible = onScreen(el);
    clipReveal(el, visible);
    if (visible) intro.add(clips.get(el)!, `media+=${shown++ * 0.15}`);
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

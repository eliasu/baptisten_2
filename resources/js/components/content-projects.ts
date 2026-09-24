import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clipRemove, clipReveal, clips, lenis, reduced } from "./motion.ts";

gsap.registerPlugin(Flip);

for (const wrap of document.querySelectorAll<HTMLElement>("[data-projects]")) {
  const toggle = wrap.querySelector<HTMLButtonElement>("[data-projects-toggle]");
  if (!toggle) continue;

  const label = toggle.querySelector(".button_text") ?? toggle;
  const items = [...wrap.querySelectorAll<HTMLElement>(".projects_item")];
  const more = items.filter((item) => item.hasAttribute("data-more"));
  const mediaOf = (item: Element) => item.querySelector(".media_wrap")!;
  let busy = false;

  toggle.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    const expand = !wrap.classList.contains("is-expanded");
    toggle.setAttribute("aria-expanded", String(expand));
    label.textContent = expand ? "Weniger anzeigen" : "Alle anzeigen";

    if (reduced) {
      wrap.classList.toggle("is-expanded", expand);
      busy = false;
      return;
    }

    if (!expand) {
      // Collapsing removes most of the section's height; from inside the
      // grid, that would drop the reader somewhere further down the page.
      if (wrap.getBoundingClientRect().top < 0 && lenis) {
        await new Promise<void>((done) => lenis!.scrollTo(wrap, { offset: -120, duration: 1.2, onComplete: () => done() }));
      }
      await gsap.to(more, { opacity: 0, duration: 0.4, stagger: { each: 0.03, from: "end" } });
    }

    const state = Flip.getState(items);
    wrap.classList.toggle("is-expanded", expand);
    gsap.set(more, { opacity: 1 });

    // Measured in the final layout, before Flip moves anything: the extra
    // works start unbuilt and build up as far as their positions say.
    // New triggers measure on the next refresh and then jump straight to
    // their position's progress; the works already in view build up to it.
    for (const item of more) {
      if (expand) clipReveal(mediaOf(item));
      else clipRemove(mediaOf(item));
    }
    if (expand) {
      ScrollTrigger.refresh();
      for (const item of more) {
        const timeline = clips.get(mediaOf(item));
        const progress = timeline?.scrollTrigger?.progress ?? 0;
        // No delay: until the tween starts, the trigger holds it at its progress.
        if (timeline && progress > 0) gsap.fromTo(timeline, { progress: 0 }, { progress, duration: 1.8, ease: "power2.inOut" });
      }
    }

    await Flip.from(state, {
      duration: 1.1,
      ease: "expo.inOut",
      onEnter: (entering) =>
        gsap.fromTo(entering.map((item) => item.querySelector(".projects_caption")), { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5, stagger: 0.08 }),
    });

    ScrollTrigger.refresh();
    busy = false;
  });
}

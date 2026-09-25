import gsap from "gsap";

const DURATION = 4.6;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll<HTMLElement>(".hero-slides_wrap").forEach((wrap) => {
  const slides = Array.from(wrap.querySelectorAll<HTMLElement>(".hero-slides_slide"));
  const title = wrap.querySelector<HTMLElement>(".hero-slides_title");
  const count = wrap.querySelector<HTMLElement>(".hero-slides_count");
  const progress = wrap.querySelector<HTMLElement>(".hero-slides_progress");
  if (reduced || slides.length < 2 || !title || !count || !progress) return;

  const pad = (n: number) => String(n).padStart(2, "0");
  let current = 0;
  let layer = 2;

  gsap.from(slides[0], { clipPath: "inset(12% 12% 12% 12%)", duration: 1.8, ease: "expo.inOut", delay: 0.1 });
  gsap.from(slides[0].querySelector(".media_inner"), { scale: 1.25, duration: 2.4, ease: "expo.out", delay: 0.1 });
  gsap.from(wrap.querySelectorAll(".hero-slides_caption > *"), { opacity: 0, y: 12, duration: 1.2, stagger: 0.1, delay: 1 });

  const next = () => {
    current = (current + 1) % slides.length;
    const slide = slides[current];
    slide.style.zIndex = String(++layer);
    gsap.fromTo(slide, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
    gsap.fromTo(slide.querySelector(".media_inner"), { scale: 1.2, xPercent: 8 }, { scale: 1, xPercent: 0, duration: 2, ease: "expo.out" });

    const previous = title.querySelector("span");
    const caption = document.createElement("span");
    caption.textContent = slide.dataset.caption ?? "";
    title.append(caption);
    gsap.fromTo(caption, { yPercent: 100 }, { yPercent: -100, duration: 0.9, ease: "expo.inOut" });
    gsap.to(previous, {
      yPercent: -100,
      duration: 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        previous?.remove();
        gsap.set(caption, { yPercent: 0 });
      },
    });
    count.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
    run();
  };

  let timer: gsap.core.Tween | undefined;
  const run = () => {
    timer?.kill();
    timer = gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: DURATION, ease: "none", onComplete: next });
  };
  run();

  document.addEventListener("visibilitychange", () => (document.hidden ? timer?.pause() : timer?.resume()));
  wrap.addEventListener("pointerenter", () => timer?.pause());
  wrap.addEventListener("pointerleave", () => timer?.resume());
});

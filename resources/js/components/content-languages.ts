import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const wrap of document.querySelectorAll<HTMLElement>(".languages_wrap")) {
  const word = wrap.querySelector<HTMLElement>(".languages_word");
  const label = wrap.querySelector<HTMLElement>(".languages_label");
  const buttons = [...wrap.querySelectorAll<HTMLButtonElement>(".languages_item")];
  if (!word || buttons.length < 2) continue;

  let current = 0;
  let picked = false;
  let cycle: number | undefined;

  const show = (index: number) => {
    if (index === current) return;
    current = index;
    const button = buttons[index];
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    const apply = () => {
      const lang = button.dataset.lang ?? "";
      word.textContent = button.dataset.word ?? "";
      word.lang = lang;
      word.dir = lang === "fa" || lang === "ar" ? "rtl" : "ltr";
      if (label) label.textContent = button.dataset.label ?? "";
    };
    if (reduce) return apply();
    gsap
      .timeline()
      .to(word, { yPercent: -110, duration: 0.45, ease: "power3.in" })
      .add(apply)
      .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
  };

  const pick = (index: number) => {
    picked = true;
    clearInterval(cycle);
    show(index);
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => pick(index));
    button.addEventListener("pointerenter", () => {
      if (matchMedia("(hover: hover)").matches) pick(index);
    });
  });

  if (!reduce) {
    const startCycle = () => {
      if (picked) return;
      clearInterval(cycle);
      cycle = window.setInterval(() => show((current + 1) % buttons.length), 2600);
    };
    const stopCycle = () => clearInterval(cycle);
    ScrollTrigger.create({
      trigger: wrap,
      start: "top 60%",
      end: "bottom 20%",
      onEnter: startCycle,
      onEnterBack: startCycle,
      onLeave: stopCycle,
      onLeaveBack: stopCycle,
    });
  }
}

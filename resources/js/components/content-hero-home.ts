import { gsap } from "gsap";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const hero of document.querySelectorAll<HTMLElement>(".hero_wrap")) {
  const canvas = hero.querySelector<HTMLCanvasElement>(".hero_canvas");
  const field = canvas ? figureField(canvas) : null;

  const all = hero.querySelector<HTMLElement>(".hero_all");
  if (all && field) {
    ["pointerenter", "focus"].forEach((type) => all.addEventListener(type, () => field.raise(1)));
    ["pointerleave", "blur"].forEach((type) => all.addEventListener(type, () => field.raise(0)));
  }

  const caption = hero.querySelector<HTMLElement>(".hero_caption");
  if (caption?.dataset.touchText && matchMedia("(hover: none)").matches) caption.textContent = caption.dataset.touchText;

  if (!reduce) {
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .fromTo(hero.querySelectorAll(".hero_line > span"), { yPercent: 108, y: 0 }, { yPercent: 0, duration: 1.3, stagger: 0.11 }, 0.15)
      .fromTo(hero.querySelectorAll(".hero_fade"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.55)
      .fromTo(hero.querySelector(".hero_rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.7)
      .fromTo(hero.querySelectorAll(".hero_fact"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.05);
  }
}

// A crowd of stick figures: arms sway, lift near the pointer, and all rise on `raise(1)`.
function figureField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  type Figure = { x: number; y: number; angle: number; accent: boolean; gone: boolean; delay: number };
  let width = 0;
  let height = 0;
  let figures: Figure[] = [];
  let pointerX = -9999;
  let pointerY = -9999;
  let up = 0;
  let upTarget = 0;
  let running = false;
  let visible = true;
  const start = performance.now();
  const colors = { text: "", accent: "" };

  const random = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const readColors = () => {
    const style = getComputedStyle(canvas);
    colors.text = style.getPropertyValue("--text").trim();
    colors.accent = style.getPropertyValue("--brand-500").trim();
  };

  const build = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gapX = width < 520 ? 38 : 46;
    const gapY = gapX * 1.22;
    const cols = Math.max(1, Math.floor(width / gapX));
    const rows = Math.max(1, Math.floor((height - 10) / gapY));
    const offsetX = (width - (cols - 1) * gapX) / 2;
    const offsetY = (height - (rows - 1) * gapY) / 2 + 6;
    figures = [];
    let i = 0;
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const k = random(++i);
        figures.push({
          x: offsetX + col * gapX + (row % 2 ? gapX * 0.18 : 0),
          y: offsetY + row * gapY,
          angle: -1.35,
          accent: k < 0.07,
          gone: k > 0.93,
          delay: (col / cols) * 0.9 + row * 0.04 + k * 0.2,
        });
      }
  };

  const draw = (t: number) => {
    ctx.clearRect(0, 0, width, height);
    up += (upTarget - up) * 0.08;
    for (const f of figures) {
      if (f.gone) continue;
      let intro = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.5 - f.delay) / 0.9));
      intro = 1 - Math.pow(1 - intro, 3);
      let target = -1.35 + 0.8 * intro;
      target += Math.sin(t * 1.1 + f.x * 0.018 + f.y * 0.013) * 0.07 * intro;
      const d = Math.hypot(f.x - pointerX, f.y - pointerY);
      const near = Math.max(0, 1 - d / 150);
      target += near * near;
      target += (0.45 - target) * up * Math.min(1, Math.max(0, t * 3 - f.delay * 2));
      f.angle += (target - f.angle) * (reduce ? 1 : 0.12);
      const color = f.accent ? colors.accent : colors.text;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(f.x, f.y - 13, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(f.x, f.y - 8);
      ctx.lineTo(f.x, f.y + 12);
      const cos = Math.cos(f.angle) * 11;
      const sin = Math.sin(f.angle) * 11;
      const shoulder = f.y - 5;
      ctx.moveTo(f.x - cos, shoulder - sin);
      ctx.lineTo(f.x, shoulder);
      ctx.lineTo(f.x + cos, shoulder - sin);
      ctx.stroke();
    }
  };

  const loop = (now: number) => {
    if (!visible) {
      running = false;
      return;
    }
    draw((now - start) / 1000);
    requestAnimationFrame(loop);
  };
  const run = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  };
  const still = () => draw(10);

  readColors();
  build();
  reduce ? still() : run();

  new ResizeObserver(() => {
    build();
    if (reduce) still();
  }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !reduce) run();
  }).observe(canvas);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    readColors();
    if (reduce) still();
  });

  const host = canvas.parentElement!;
  host.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    if (reduce) still();
  });
  host.addEventListener("pointerleave", () => {
    pointerX = pointerY = -9999;
    if (reduce) still();
  });

  return {
    raise(value: number) {
      upTarget = value;
      if (reduce) {
        up = value;
        still();
      }
    },
  };
}

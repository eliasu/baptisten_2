document.querySelectorAll<HTMLElement>(".network_wrap").forEach((wrap) => {
  const items = Array.from(wrap.querySelectorAll<HTMLElement>(".network_item"));
  const media = Array.from(wrap.querySelectorAll<HTMLElement>(".network_media"));
  const current = wrap.querySelector<HTMLElement>(".network_current");
  let active = 0;

  const activate = (index: number) => {
    if (index === active) return;
    active = index;
    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    media.forEach((tile, i) => tile.classList.toggle("is-active", i === index));
    if (current) current.textContent = items[index].querySelector(".network_name")?.textContent ?? "";
  };

  items.forEach((item, i) => item.addEventListener("pointerenter", () => activate(i)));

  // The row crossing a line at 55% of the viewport becomes active while scrolling
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && activate(items.indexOf(entry.target as HTMLElement))),
    { rootMargin: "-55% 0px -45% 0px" },
  );
  items.forEach((item) => observer.observe(item));
});

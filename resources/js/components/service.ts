// Next Sunday service in Berlin time: date, note, calendar link and live state.
// Reads `data-service-*` from the first element carrying `data-service-time`.
const source = document.querySelector<HTMLElement>("[data-service-time]");

if (source) {
  const data = source.dataset;
  const time = data.serviceTime || "10:00";
  const [hours, minutes] = time.split(":").map(Number);
  const start = hours * 60 + minutes;
  const duration = Number(data.serviceDuration) || 90;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const now = part("hour") * 60 + part("minute");
  const today = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  const weekday = today.getUTCDay();

  const ahead = weekday === 0 ? (now < start + duration ? 0 : 7) : 7 - weekday;
  const day = new Date(today);
  day.setUTCDate(day.getUTCDate() + ahead);
  const live = weekday === 0 && now >= start - 5 && now < start + duration + 15;

  const daysInMonth = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)).getUTCDate();
  let note = "Vor Ort und im Livestream";
  if (day.getUTCDate() <= 7) note = "Mit Abendmahl, vor Ort und im Livestream";
  if (day.getUTCDate() + 7 > daysInMonth) note = "Danach Brunch im Gemeinderestaurant";

  const label = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(day);
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${day.getUTCFullYear()}${pad(day.getUTCMonth() + 1)}${pad(day.getUTCDate())}`;
  const end = start + duration;
  const calendar =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(data.serviceTitle || "Gottesdienst")}` +
    `&dates=${ymd}T${pad(hours)}${pad(minutes)}00/${ymd}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00` +
    "&ctz=Europe/Berlin" +
    `&location=${encodeURIComponent(data.serviceLocation || "")}` +
    `&details=${encodeURIComponent(data.serviceStream ? `Livestream: ${data.serviceStream}` : "")}`;

  document.querySelectorAll<HTMLElement>("[data-service-next]").forEach((el) => {
    el.innerHTML = ahead === 0 ? `Heute, ${time} Uhr` : `${label},<br>${time} Uhr`;
  });
  document.querySelectorAll<HTMLElement>("[data-service-note]").forEach((el) => {
    el.textContent = note;
  });
  document.querySelectorAll<HTMLAnchorElement>("[data-service-calendar]").forEach((el) => {
    el.href = calendar;
  });

  if (live) {
    document.querySelectorAll("[data-live]").forEach((el) => el.classList.add("is-live"));
    document.querySelectorAll<HTMLElement>("[data-live-label]").forEach((el) => {
      el.textContent = el.dataset.liveLabel ?? el.textContent;
    });
  }
}

for (const wrap of document.querySelectorAll<HTMLElement>(".join_wrap")) {
  const areas = [...wrap.querySelectorAll<HTMLButtonElement>(".join_area")];
  const output = wrap.querySelector<HTMLElement>(".join_output");
  const send = wrap.querySelector<HTMLAnchorElement>(".join_send");
  const subject = encodeURIComponent("Ich möchte mitmachen");

  areas.forEach((area) =>
    area.addEventListener("click", () => {
      area.setAttribute("aria-pressed", String(area.getAttribute("aria-pressed") !== "true"));
      const picked = areas.filter((a) => a.getAttribute("aria-pressed") === "true").map((a) => a.textContent!.trim());
      if (output) output.textContent = picked.length ? `Du interessierst dich für: ${picked.join(", ")}.` : "Noch nichts ausgewählt.";
      const body = picked.length ? `&body=${encodeURIComponent(`Hallo,\n\nich möchte gern mitmachen bei: ${picked.join(", ")}.\n\nViele Grüße`)}` : "";
      if (send) send.href = `mailto:${wrap.dataset.email}?subject=${subject}${body}`;
    }),
  );

  const copy = wrap.querySelector<HTMLButtonElement>(".join_copy");
  const iban = wrap.querySelector(".join_iban")?.textContent?.trim();
  const label = copy?.querySelector(".button_text");
  if (copy && iban && label) {
    const original = label.textContent;
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
        label.textContent = copy.dataset.copied ?? "";
      } catch {
        label.textContent = copy.dataset.failed ?? "";
      }
      setTimeout(() => (label.textContent = original), 1800);
    });
  }
}

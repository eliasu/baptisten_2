for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
  const text = button.dataset.copy ?? "";
  const hint = button.querySelector("[data-copy-hint]");

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      location.href = `mailto:${text}`;
      return;
    }
    if (!hint) return;
    hint.textContent = "Kopiert";
    setTimeout(() => (hint.textContent = "Kopieren"), 1800);
  });
}

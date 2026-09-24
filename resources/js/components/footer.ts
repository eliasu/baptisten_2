const year = document.querySelector<HTMLSpanElement>("#year");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

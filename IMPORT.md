# Website import

- **Source** — `import/baptisten.schöneberg – Redesign.html`: single HTML file,
  inline CSS, GSAP 3.12.5 (ScrollTrigger, Flip) from cdnjs, Google Fonts. No
  build; open the file directly. Reference screenshots taken with
  `--force-prefers-reduced-motion` (the GSAP intro hides content otherwise).
- **Live URL** — none for the redesign; the current site is
  https://www.baptisten-schoeneberg.de/
- **Pages in scope** — the single page → `/` (home). Stays one page with
  in-page anchors; no split.
- **Out of scope** — Impressum and Datenschutz: footer keeps linking to the
  old site (baptisten-schoeneberg.de), no legal pages here.
- **Tokens** — agreed 2026-09-24, all "as proposed":
  - Type (changed in base.css; min→max px, lh, tracking, weight):
    display 48→128 .9 −.045em 520 (hero h1, language word) ·
    h1 42→90 .95 −.04em 520 (section titles, history years) ·
    h2 30→66 1.05 −.03em 450 (manifest, address — snapped from 35→74) ·
    h3 32→48 1 −.04em 450 (step times, footer claim — snapped from 26→42) ·
    h4 21→34 1.1 −.025em 500 (offer titles, Spenden) ·
    h5 21→28 1.15 −.02em 500 (step/language/news/stream titles) ·
    h6 18→22 1.25 −.015em 500 (fact values, pillar/year titles) ·
    large 18→23 1.45 serif (lede + hero sub merged) ·
    main 16→17 1.55 sans · small 14→15 1.4 (14 and 15 merged)
  - Serif: new `--secondary-family` (Newsreader); `large` is serif; new text
    style `serif` 17→18, lh 1.55, for body paragraphs (added in site.css).
  - Colours: Lumos swatches replaced with the source palette. Light theme =
    paper #FBFBFA / paper-2 #F0F0EC (background-2) / ink #15192B / ink-2
    #5B5F6E (text-2) / line #D8D8D2 (border) / accent #2C44C9 (buttons).
    Dark theme = #101320 / #181C2B / #ECECE7 / #A3A6B3 / #2B3042 / #8E9DFF,
    applied to :root automatically under prefers-color-scheme: dark.
    Stance band = section theme `dark` (flips to light in dark mode, as the
    source); magazine card = theme-brand (accent).
    sun #E9A91F and live red #E5484D are swatches only.
  - Spacing: --section-space-large 88/168; --site-margin 20/56; max width
    1440; small gaps snap to --space-1…5 (≤4px each).
  - Radius 0 everywhere (radius-small/main = 0).
  - Heading weight 520 → new --primary-heading; 450 → --primary-book.
  - Nav height 72px → --nav-height 4.5rem (source value, not a snap).
  - Dark mode implemented by swapping the swatch values under
    prefers-color-scheme (as the source swaps its palette), so the invert
    theme = the source's stance band in both modes.
  - Leading trim measured from the font files (hhea/OS2) with upstream's
    offset: Schibsted 0.38/0.375em, Newsreader 0.47/0.25em.
- **Breakpoints** — Lumos' 30/48/64rem kept. Source used 560/760/860/900/960px;
  two-column layouts now stack at 64rem (1024px) instead of 960px.
- **Fonts** — all SIL OFL, self-hosted in resources/fonts/ (GDPR, no Google
  CDN): Schibsted Grotesk (variable, roman + italic), Newsreader (variable
  opsz/wght, roman + italic), Vazirmatn 400/600 (Arabic subset, Persian
  word only). Korean uses system fonts (Apple SD Gothic Neo / Malgun
  Gothic); Noto Sans KR dropped as too heavy.
- **Content model** — agreed 2026-09-24 (confirmed):
  - **Page `home`** (blueprint `home`, template `pages/home`), tabs:
    Hero (heading: textarea, one line per line, last line is the
    interactive "Alle."; text) · Gottesdienst (heading, lede; stream box:
    heading, text, note) · Sprachen (heading, lede) · Angebote (heading,
    lede) · Gemeinde (label, manifest) · Geschichte (heading) · Aktuelles
    (heading, lede, newsletter heading + text) · Mitmachen (heading, text,
    areas: list of labels) · SEO.
    Hero facts: labels + kids fact fixed in the template; values from globals.
  - **Collections** (no routes, all shown on home, orderable unless dated):
    - `schedule` Sonntagsablauf: title, time, place, text, tag?
    - `languages` Sprachen: title (name as written), time, description,
      welcome word, lang code, label
    - `offers` Angebote: title, when, category (term), icon (select of the
      12 source icons), text, tags (list), info (Bard: links only)
    - `principles` Grundsätze: title, text
    - `history` Geschichte: year, title, text (last item highlighted, no field)
    - `news` Aktuelles: dated; title, category label, teaser, link? — newest 3,
      no detail pages
    - `magazine` Gemeindemagazin: dated; issue no., theme line, link (URL or
      PDF asset) — latest shown; name "Willkommen" fixed
    - `team` Ansprechpersonen: title (name), role, email
  - **Taxonomy** `offer_categories` Angebotskategorien: title only, no
    archive pages; filter chip order = first appearance in the offers order.
  - **Globals**: `contact` (street, city line, phone, email, video email,
    directions list, map URL) · `social` (YouTube = livestream, Instagram,
    Facebook) · `donations` (text, recipient, IBAN, purpose) · `service`
    (time 10:00, duration 90 min; the 1st-Sunday Abendmahl and last-Sunday
    Brunch notes stay in the script) · `seo` (existing).
  - **Navigations**: `main` (5 anchor links; the Livestream button comes from
    `social`), `footer` (3 groups: Gemeinde, Verbunden mit, Rechtliches).
  - **Form** `newsletter`: email (required) + honeypot → elias@commandg.de.
  - **Fixed in template**: footer claim + legal line, schematic map, hero
    fact labels, history hint, magazine name.
- **Components** (partials in resources/views/components, CSS + TS alongside):
  - `content-section-head` — heading + lede in a 5/7 grid; used 5× on home.
  - `content-hero-home` — heading lines, canvas figure field, 4 facts.
  - `content-schedule` — Sunday timeline (schedule) + livestream box.
  - `content-languages` — welcome-word stage + language picker.
  - `content-offers` — offers list (<details>) with JS-built filter chips.
  - `content-stance` — statement with word reveal + principles.
  - `section-history` — pinned sideways timeline (styles act on the section).
  - `content-news` — magazine cover, newest 3 news, newsletter form.
  - `content-join` — Mach-mit toggles → mailto, donations box.
  - `content-contact` — address, links, directions, team, schematic map.
  - `service.ts` — next service / calendar link / live state (nav + hero).
  - Changed ported partials (marked `Statamic port:`): nav (logo figure +
    wordmark, livestream button, address in mobile menu, desktop from 64rem,
    hide-on-scroll, active section), footer (claim + 3 link groups from the
    footer navigation), button (square, fill-wipe hover), section (`id`
    param). heading/paragraph/rich-text list the `serif` variant.
  None of these existed: each is a page-specific layout with its own data.
- **Behaviour** — agreed 2026-09-24:
  - GSAP (npm, not CDN) for: hero intro timeline, Sunday rail scrub, stream
    bars, language word swap, manifest word reveal, history pin + sideways
    scroll + progress bar + year reveals, magazine plant, map route, mobile
    menu reveal (built in CSS instead: clip-path + transitions are Baseline).
    History uses GSAP because CSS scroll-driven animations are
    not Baseline (Firefox lacks them) — user's rule: CSS only if Baseline.
  - Hero figure field: vanilla canvas port (no library), pauses off-screen,
    still frame under reduced motion, colours from the theme.
  - Offers: Lumos accordion (native <details>) + small filter script with a
    fade instead of GSAP Flip; icon stroke-draw on hover in CSS.
  - Vanilla: header hide-on-scroll + scrolled border + active-section link,
    next-service date / calendar link / live state, language picker with
    auto-cycle, Mach mit toggles → mailto, copy IBAN.
  - CSS: link underlines, logo arm hover, button fill-wipe hover.
  - Everything that moves respects prefers-reduced-motion.
- **Redirects** — none inside this site (one page). If it replaces
  baptisten-schoeneberg.de, the old URLs need redirects: still open.
- **Decisions**
  - Newsletter box: a Statamic form (submissions in the CP + email
    notification to elias@commandg.de); the office adds subscribers by hand.
    One required email field + honeypot. No automatic double opt-in.
  - "Mach mit" stays a mailto link prefilled with the ticked areas (small
    script, nothing stored). The areas are an editable list.
  - Dark mode kept: light by default, dark palette under
    `prefers-color-scheme: dark`, as in the source.
  - Source placeholders (IBAN, Instagram URL, magazine link, news links)
    become CMS fields left empty; the partials hide what is empty.
- **Still open**
  - First slice (nav, footer, home) built — awaiting the user's review.
  - Real values: IBAN, Instagram URL, magazine link, news links.
  - Mail: MAIL_MAILER=log locally; production SMTP needed for the newsletter
    notification to elias@commandg.de.
  - News dates were invented (2026-09-18/19/20) — the source had none.
  - Redirects from the old site, if this replaces it.

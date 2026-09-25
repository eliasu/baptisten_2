# Website import

- **Source** — `imported/C-produktion-netzwerk.html`, single HTML file, inline
  CSS, GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 from CDN, Hanken Grotesk
  from Google Fonts. Opened as a file, no build.
- **Live URL** — none
- **Pages in scope** — the one page → `/` (existing home entry, anchors
  #netzwerk #arbeiten #produktion #kontakt kept); Impressum `/impressum` and
  Datenschutz `/datenschutz` as generic `page` entries (footer links)
- **Out of scope** —
- **Tokens** — (changed in base.css unless noted; min→max px, 320→1440)
  - display 38→86 w300 lh1 -0.05em (Netzwerk names)
  - h1 35→72 w300 lh1 -0.045em (intro; source lh 1.04 snapped)
  - h2 35→69 w300 lh1 -0.045em (section h2 + mail link, mail was 32→63)
  - h3 24→32 w400 lh1.5 -0.03em (phase h3; price was 24→35, thanks 22→29)
  - text-large 18→22 (intro p; head p was 18→20, form input 19→24.5)
  - text-main 18→18, text-small 15→15; eyebrow 14 uppercase +0.06em w500
  - weights: added --primary-light 300 (site.css); --primary-bold 700→600
  - swatches: light-100 #fff, light-200 #f1f1ef, light-300 #e4e4e1 (dimmed
    names #c9c9c6 are --text mixed 21% into --background, no swatch),
    dark-700 #767674 (source #777775
    nudged to pass AA), dark-900 #000, brand-500 #000 (no accent in source)
  - theme-light background light-100, text-2 dark-700, border light-300,
    buttons black/white inverting on hover; intro #333 → --text
  - radius-small/main → 0
  - section-space-large 110→187 (intro was 120→216, contact 100→173);
    section-space-medium kept (price grid 70→115); site-margin 16→38;
    work gap → site-gutter; roster/contact column gap and head padding →
    space-8 retuned 40→70
- **Breakpoints** — Lumos' 30/48/64rem kept; the source's single 900px
  collapse is 64rem here (safer for 86px names beside the preview)
- **Fonts** — Hanken Grotesk, variable 300–700, SIL OFL (self-hosting
  allowed), from Google Fonts → `resources/fonts/`, replaces Inter
- **Content model** — (mode A)
  - collection `projects` "Arbeiten": blueprint and nine dummy entries taken
    from branch commandg1 (title, category, media, link) plus `featured`
    (toggle → hero slideshow: Detect, Berenberg Verlag, Team Papenburg,
    Rhythmusgerät). Ordered by hand, no route. Offset layout repeats every
    five items by position
  - collection `network` "Netzwerk": title, details, media (images assigned
    at random from the commandg1 assets). Ordered by hand, no route;
    numbering 01… automatic
  - blueprint `home`: intro (eyebrow, heading, text), a head text per
    section, `phases` grid (title + points, 3), `prices` grid (label +
    price, up to 4). A grid rather than a collection on purpose: a small
    fixed list with no reuse
  - global `contact`: email, portrait (media group), note
  - form `kontakt`: anliegen (textarea), email; both required
  - navigations: `main` (anchor links #netzwerk #arbeiten #produktion
    #kontakt), `footer` (Instagram, LinkedIn external; Impressum,
    Datenschutz entries)
  - Impressum, Datenschutz: generic `page` entries
- **Components** —
  - nav `split` variant: half the links left, centred text logo, half right
    from 64rem; inline links 48–64rem; Lumos toggle below 48rem (not below
    64rem as first agreed: four short links fit inline down to 48rem).
    Translucent blurred background always, instead of fading in on scroll
  - footer `bar` variant: one row, copyright left, links right
  - section: `id` param (anchor targets), standing in for upstream's ...rest
  - `media` (from branch commandg1, with the `media` fieldset, media.css,
    media.ts): image, video or slideshow per slot, placeholder label while
    empty. Used by hero, network, work, contact portrait. Replaced the
    earlier `media-tile` and its colour fields
  - `content-head`: the ruled section head (label/heading + text), used 3×
  - page CSS without partials (used once): hero-slides, intro, network,
    work, services, contact
- **Behaviour** — GSAP + ScrollTrigger and Lenis, installed from npm (user
  chose to keep Lenis); all motion off under prefers-reduced-motion
  - `motion.ts`: Lenis smooth scroll + anchor offset; intro lines slide up;
    head rules draw in; `[data-reveal]` children rise; work masks open
  - `hero-slides.ts`: wipe slideshow, caption roll, progress bar (GSAP);
    also pauses on hover (added: the source never paused)
  - `network.ts`: hover and a scroll line at 55% set the active row, with
    IntersectionObserver instead of ScrollTrigger; the preview's clip
    reveal is a CSS transition, not GSAP
- **Redirects** — none (not published before)
- **Decisions** —
  - Form: Statamic form `kontakt`, email to hallo@commandg.de, both fields
    required, honeypot
  - Media: every slot is a `media` group (image, video or slideshow); assets
    (24 images, 16 videos + posters, gestuet.mp4) taken from branch
    commandg1. The coloured placeholders are gone
  - Scroll build-ups replay: they reset once scrolled back above their start
    and play again on the next pass down
  - Logo: the site name "command+g" as text, no SVG
- **Still open** —
  - hero slideshow has no pause button (WCAG 2.2.2 wants one for motion
    over 5s); pauses on hover and stops under reduced motion
  - form email: needs working mail settings in `.env`
  - Impressum and Datenschutz text (placeholder "Inhalt folgt.")
  - Instagram and LinkedIn URLs (placeholders)
  - real content for the dummy projects (commandg1's placeholders)

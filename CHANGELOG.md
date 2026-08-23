# iRO — Israel Hinojosa Baliño
## Project Changelog
### ishibaro.github.io

---

## Session 1 — Initial redesign

### Portfolio page
- Replaced stacked card layout with a **Tetris-style CSS Grid** using variable column/row spans
- Introduced card size classes: `pf-large`, `pf-medium`, `pf-narrow`
- Added accent colour themes per card: `pf-teal`, `pf-purple`, `pf-amber`, `pf-blue`, `pf-coral`
- Added mini-visualisations inside cards: fake bar chart (earthquakes), heatmap grid (Covid), code preview (QGIS plugins)
- Added `pf-link` button style overriding global `<a>` styles
- Added Mapbox map embedded inside a large card with dynamic time-of-day lighting
- Introduced `portfolio.css` as a separate file, loaded after `style.css`
- Added responsive breakpoints: 4 columns (desktop) → 2 (tablet) → 1 (mobile)

### Profile page
- Replaced flat card layout with a **stratigraphic scroll narrative** — vertical dashed timeline mimicking an archaeological section wall
- Each section (`pf-stratum`) revealed on scroll via `IntersectionObserver`
- Added EN/ES language toggle (tab selector, persisted in `localStorage`)
- Content enriched from CV and biosketch: PhD research, fieldwork locations, technical stack, publications, languages, origin story
- Added `profile.css` as a separate file

### Index page
- Replaced static layout with a **hero section** featuring:
  - Background slideshow: 4–6 images, crossfade transition, random start excluding last visit (`localStorage`)
  - Gradient overlay (dark/light mode aware)
  - Portrait photo visible at right, emerging from bottom of hero
  - Credential pills, CTA buttons
  - Dot indicators with click-to-jump
  - Auto-advance every 5 seconds, pauses on hover
- Added `index.css` as a separate file
- Added `slideshow.js` logic (later consolidated into `main.js`)

### Contact page
- Replaced 2005-era table layout (Blogger image icons, inline styles) with:
  - 4 contact cards (email, phone, blog, academic CV) using accent colour system
  - Social links list: GitHub, YouTube, Instagram, Flickr, X/Twitter, GitHub Pages
  - Clean hover states, dark/light mode aware
- Added `contact.css` as a separate file

### Services page
- Replaced generic software logos layout with **4 consultant service blocks**:
  1. Topographic & archaeological survey
  2. GIS, mapping & spatial modelling
  3. Data analysis & scripting
  4. Workshops & teaching
- Scope deliberately limited to genuine expertise (excluded C#, Unity, Unreal)
- Added scroll-reveal animation per block
- Added CTA linking to contact page
- Added `services.css` as a separate file

---

## Session 2 — Nav fixes, dark mode, responsive

### Dark mode
- Fixed all page-specific CSS files to be dark-mode aware using `body.dark-theme` and `body.light-theme` selectors
- Fixed credential pills, stratum dots, layer labels, pullquotes, fieldwork markers, publication list, language grid, skill tags across profile
- Fixed contact cards and social items for dark mode
- Fixed services blocks, icons, tags, CTA for dark mode
- Fixed index hero overlay for light mode (purple/lavender tones instead of near-black)

### Nav — responsive hamburger
- Identified root cause of nav issues: `float: left` system incompatible with new `nav-controls` div
- Created `nav-fix.css` replacing float-based nav with **flexbox**
- Fixed `overflow: hidden` on `.topnav` breaking `position: sticky` — changed to `overflow: visible`
- Fixed `position: relative` on `.topnav.responsive` breaking sticky on scroll — removed it
- Fixed `nav-controls` (EN/ES + theme toggle) hiding correctly when menu closed and showing when hamburger opened
- Fixed `z-index` on `.topnav` (set to 100) so nav stays above `.main.top` quote block on scroll
- Fixed `.main.top` `z-index` reduced from 9 to 1
- Fixed checkbox toggle: moved `<input>` outside `<label>` so `.checkbox:checked + .checkbox-label .ball` selector works correctly
- Converted `nav-controls` from `<a>` wrapper (which intercepted clicks) to `<div class="nav-controls-item">` so theme toggle checkbox works

### Card grid — new size classes
- Added `pf-narsml`, `pf-narlar`, `pf-medlar` card size classes to portfolio
- Fixed responsive breakpoints: tablet query was missing rules for new classes, causing mobile layout to inherit desktop spans
- Lesson documented: `max-width` media queries are cumulative, not exclusive — each breakpoint must define all classes completely

### GitHub / Mapbox token
- Identified exposed Mapbox token in `script.js` flagged by GitHub secret scanning
- Advised: create public-scope-only token (no secret scopes) with URL restriction to `ishibaro.github.io`
- Resolved GitHub push block via Secret scanning alert dismissal
- Identified and fixed Jekyll build failure caused by `_config.yml` with theme reference — added `.nojekyll` file

---

## Session 3 — Homologation & Store

### Architecture overhaul
- New folder structure:
  ```
  assets/
    css/       — style.css, nav.css, + one per page
    scripts/   — main.js, mapbox.js, slideshow.js
    data/      — strings.json, quotes.json
    images/    — all image assets
  ```
- Eliminated `script.js`, `nav-fix.css` — consolidated into new system
- All inline `<script>` blocks removed from HTML files (scroll-reveal, slideshow)
- All inline `<style>` blocks removed from HTML files

### CSS — style.css
- Full rewrite with **CSS custom properties** (design tokens):
  - `--color-*` for brand and accent palette
  - `--font-sans`, `--font-serif`, `--font-title`
  - `--radius-sm/md/lg`
  - `--z-nav`, `--z-content`, `--z-overlay`
- Language visibility rules added globally:
  ```css
  body[data-lang="en"] [lang="es"] { display: none !important; }
  body[data-lang="es"] [lang="en"] { display: none !important; }
  ```

### CSS — nav.css
- Clean flexbox nav replacing float system and `nav-fix.css`
- Sticky + correct z-index
- Mobile hamburger behaviour fully working: controls hidden when closed, visible when open

### JavaScript — main.js
- Consolidates: theme, language (i18n), nav injection, quotes, scroll-reveal
- **Nav injection**: single JS file builds `<nav>` HTML including all links + Store, injects into `<div id="nav-placeholder">` on every page — change nav in one file, updates everywhere
- **Active link detection**: compares `window.location.pathname` to each link href automatically
- **`data-lang` applied immediately** before `fetch()` to prevent flash of double-language content on pages using `lang=` attribute system
- Language and theme persisted in `localStorage`
- `fetch()` loads `strings.json` and `quotes.json` in parallel

### JavaScript — mapbox.js
- Mapbox initialisation isolated, only loads on pages with `#map` element

### JavaScript — slideshow.js
- Index hero slideshow isolated

### Data — strings.json
- All site text centralised in EN/ES:
  - `nav`, `index`, `profile`, `services`, `contact`, `store`, `portfolio`, `footer`, `bottom_tags`
- Portfolio cards (c1–c9) fully added

### Data — quotes.json
- 10 rotating quotes
- Random selection excluding last-seen quote (`localStorage`)

### i18n system
- **Rule**: content in `strings.json` → use `data-i18n="section.key"` (single element, JS fills text)
- **Rule**: content NOT in strings.json with two-language variants → use `lang="en"` / `lang="es"` on separate elements (CSS hides inactive language)
- **Rule**: never mix both attributes on the same element
- All pages migrated: `index`, `profile`, `services`, `portfolio`, `contact`, `store`

### Store page — new
- New `store.html` and `store.css`
- Three sections: Books, Apps, Research
- **Books**: Cuentos cortísimos — Ingram widget (cover image + Buy Now button in original Ingram teal), Amazon and Kindle links
- **Apps**: Harris Matrix Builder — Gumroad link
- **Research**: PhD thesis (Academia.edu), Nile Delta river network dataset (Zenodo) — both free
- All section labels, button text, badges via `data-i18n`
- `store` entry added to nav in `main.js`

### Store page — Ingram widget
- Replaced raw inline HTML with styled `.st-ingram-widget` component
- Cover image, title, authors, Buy Now button
- Dark mode aware

---

## Pending
- Replace `YOUR_ASIN` placeholder in store.html with actual Amazon ASIN when available
- Replace `YOUR_KINDLE_ASIN` placeholder when available
- Replace `YOUR_RECORD` Zenodo placeholder with actual DOI record URL

# My Tailor — Hermanus

A static, three-page website for a luxury tailoring atelier: HTML, CSS and vanilla JS, with no build step.

## Structure

```
my-tailor/
├── index.html          Home
├── services.html       Services (staggered editorial layout)
├── contact.html        Contact, enquiry form, map, WhatsApp
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/styles.css  Design tokens + all styles (mobile-first)
    ├── js/main.js      Header, mobile menu, reveal animations, form UI
    └── images/         Placeholder SVGs + og-image.png
```

## Before launch: replace the placeholders

| What | Where |
|---|---|
| Site URL `https://project-keaton.github.io/My-tailor-` (swap if you add a custom domain) | canonical, og:url, og:image, JSON-LD (all 3 pages), robots.txt, sitemap.xml |
| Phone `+27 (0)28 000 0000` / `+27280000000` | header menu, footer, contact page, JSON-LD |
| WhatsApp `27000000000` | every `wa.me/` link |
| Email `hello@mytailor.co.za` | footer, contact page, JSON-LD |
| Address `00 Main Road, Hermanus, 7200` and geo coordinates | footer, contact page, JSON-LD |
| Prices `From R00,000`, timelines, "Placeholder copy." text | services.html, index.html |
| Images | `assets/images/*.svg`. Swap for real photography (WebP/AVIF, around 2400px for full-width images and around 1200px for others; keep the `width`/`height` attributes accurate) and update the `alt` text |
| Map | Replace the SVG inside `.map` in contact.html with a lazy-loaded Google Maps `<iframe loading="lazy">` |
| Form | Set the form `action` and replace the simulated submit in `main.js` with a `fetch()` to your handler (Formspree, Netlify Forms, etc.) |

## Notes
- Fonts: Cormorant Garamond (display) and Manrope (UI), loaded from Google Fonts with `display=swap`.
- Animations respect `prefers-reduced-motion`. Content stays visible if JS fails to load.
- Services link to the contact form as `contact.html?service=<slug>`, which pre-selects that service in the dropdown.

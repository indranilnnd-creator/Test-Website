# Meadow — Product Analytics Landing Page

Live site: **https://indranilnnd-creator.github.io/Test-Website/**

A static landing page for **Meadow**, a product-analytics concept. A full-screen
desert-oasis video loop plays behind the hero, with the dashboard content —
metrics, features, demo charts, testimonial, pricing — presented on a cream sheet.

No frameworks, no build step, no dependencies. Just HTML, CSS, and vanilla JS.

## Preview locally

Any static server works, e.g. from the repo root:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Structure

```
index.html                  Page markup + SEO/OG meta + JSON-LD
assets/css/styles.css       All styles (responsive, reduced-motion, print)
assets/js/main.js            Mobile nav, scroll reveal, KPI count-up, billing toggle
assets/favicon.svg          Meadow mark
assets/media/oasis-bg.mp4   Hero background video
assets/media/oasis-poster.jpg  Still from the video (poster + no-motion fallback)
assets/media/hero-landscape.jpg
assets/media/clarity-landscape.jpg
```

## Behaviour notes

- Video autoplays muted + looped, with `preload="metadata"` and a poster frame.
- `prefers-reduced-motion` pauses/hides the video and shows the still instead.
- On 2G / data-saver connections the video is downgraded to the still.
- KPI cards animate on scroll; billing toggle switches monthly/yearly prices.

## Sources

- Background video: provided CloudFront MP4 (desert oasis loop), bundled locally as
  `assets/media/oasis-bg.mp4`.
- Copy, metrics, and imagery concept: `https://garden-insights.lovable.app`
  (Meadow analytics-dashboard template).

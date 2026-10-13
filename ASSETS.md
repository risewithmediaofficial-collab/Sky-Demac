# Asset record

## Studio visuals

`public/images/hero.webp`, `hero-mobile.webp`, `mechanical.webp`, `detailing.webp`, `exterior.webp`, and `share.webp` derive from one original image created for this project with the **built-in imagegen tool**. They are AI-generated photographic illustrations, not real workshop photos, customer projects, or a 3D model. Disclosures appear on the site. No photographs or branding were taken from the reference websites.

The selected compressed assets are stored in this repository. `scripts/prepare-assets.mjs` records the resize/crop recipe. The original generated file was `exec-184a76b8-0ce8-4f26-b086-d39012d4bcb6.png`, 1805 × 871 pixels.

Final generation prompt:

> Use case: ads-marketing. Asset type: ultra-wide cinematic website hero background, 1536x1024 or wider. Create a photorealistic luxury automotive studio photograph of one beautiful unbranded graphite silver performance coupe, realistic car proportions and engineering, modern slim LED headlights, viewed low from front left three-quarter angle, the front facing toward the left. The vehicle occupies the RIGHT 68 percent of the composition, starts near x=480 and extends toward right edge; empty near-black graphite negative space across left 35 percent for website headline. Car centered vertically slightly below center. Entire car and both visible wheels in frame. Huge dark cyclorama studio with soft rectangular overhead light reflected subtly on the bonnet and windshield, restrained silver reflections, polished graphite paint, realistic rubber tyres, alloy wheels, subtle soft ground shadow and restrained floor reflection. Deep near-black background #101112 all edges fading dark. Professional luxury automotive advertising photograph, 50mm lens, crisp real bodywork, no coloured lighting, no fog, no people, no brand logos, no text, no typography, no watermark, no exaggerated sci-fi details. Calm editorial premium automotive mood.

## Typography and icons

- **Inter**, by Rasmus Andersson and contributors. Local variable Latin WOFF2 supplied through `@fontsource-variable/inter`. SIL Open Font License: `public/fonts/OFL.txt`. Source: https://github.com/rsms/inter
- **Lucide icons**, bundled as React SVG components. ISC license supplied in `node_modules/lucide-react/LICENSE`. Source: https://lucide.dev/license
- Wordmark: plain HTML text. Favicon: plain SD initials, not a reconstruction of an unavailable logo.

## Missing 3D asset

No GLB/GLTF model, texture set or licence was supplied. No licensed model was integrated. The site intentionally uses a photographic scroll story: zoom, crossfades, a labelled illustrative finish transition, and a pearl-white final chapter. It does **not** claim true 3D, rotate a flat photo to imitate 3D, invent mechanical internals, or show an unconfirmed PPF service.

A future true-3D implementation needs an appropriately licensed realistic car GLB, an attribution record, optimised textures, and visual verification. Implement it as one progressive React Three Fiber canvas coordinated with the existing five chapter ranges. Retain the poster, HTML content, failure boundary, mobile/static experience, reduced-motion support and scroll cleanup. Verify any PPF demonstration against both the confirmed service configuration and mesh suitability.

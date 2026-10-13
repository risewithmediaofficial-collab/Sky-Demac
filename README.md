# SKY DEMAC AUTOMOTIVE

A responsive React 19 + TypeScript + Vite automotive website. The existing Vite architecture is retained; the starter demo is replaced with a five-chapter cinematic image story, editorial care guides, service details, an enquiry draft flow, and accessible mobile layouts.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

On Windows PowerShell with script execution disabled, use `npm.cmd`. Browser tests currently use locally installed Microsoft Edge. For another environment, change `channel` in `playwright.config.ts` or install Playwright Chromium. Test screenshots are written to `artifacts/`; reports and traces are ignored by Git.

## Configuration

Edit `src/config.ts` for the wordmark/logo path, provisional blue accent, contact information, social links, website metadata, service catalogue, process, workshop image, real projects and optional genuine before/after pair. Metadata is injected into HTML during development and build by `vite.config.js`.

- A service is available only when **both** `enabled` and `confirmed` are `true`.
- The PDF was **not present**. All nine requested catalogue categories exist, but their entries are only explicitly marked placeholders from the brief. Empty categories intentionally await the PDF. Do not treat this as a complete transcription.
- PPF, specialised and ceramic coatings, painting, alignment, dry ice cleaning, pickup/drop and insurance assistance are disabled and unconfirmed. These entries are not in the enquiry selector.
- Editorial cards are explicitly care guides, not offers of operational services. Update category copy after the workshop confirms its catalogue.
- With no real WhatsApp number, the form validates and generates a copyable draft. It sends nothing and stores no personal information. Set `whatsapp` to an international number (for example, a real configured E.164 number) to enable the explicit WhatsApp handoff. Users must press Send in WhatsApp; there is no appointment confirmation.
- Phone, email, directions and hours appear only when configured. No contact data is invented. No backend exists in this starter.
- Real project filters are rendered only for `projects` marked `genuine`. The native keyboard-operable comparison range is rendered only when a matching `comparison` pair is marked genuine.
- The process remains labelled proposed until `processConfirmed` is set.
- `launchReady` is false; metadata is `noindex, nofollow`. Enable indexing only after the business details are verified. No LocalBusiness JSON-LD is emitted without verified identity/location data.

## Motion and asset fallback

The desktop story pins for **400 viewport heights** with one GSAP timeline and native scrolling. Progress controls five chapters and reverses when scrolling backwards. The final graphite-to-pearl transition releases into the main page. No wheel interception, scroll snapping, infinite animation, or canvas is used.

**This is an honest photographic fallback, not true 3D.** No suitable licensed car GLB was supplied or integrated. The original AI-generated studio illustration is labelled, with compressed local WebP variants and detail crops. Paint finishing is an illustrative image treatment, not a customer before/after result. Unconfirmed PPF is replaced with an exterior care concept. See `ASSETS.md` for provenance, the final prompt, and requirements for a future real 3D implementation.

The headline and CTAs are ordinary HTML rendered before animation modules load. GSAP is dynamically imported. Under 1000px, with reduced motion, Save-Data, or reported device memory below 4 GB, the story uses a static poster and regular page sections. No WebGL support is required. Failed images have an intentional text fallback. Below-fold images are lazy loaded; aspect ratios reserve their layout. React effect cleanup reverts GSAP contexts and removes observers/listeners. GSAP's idle ticker sleeps when inactive; there is no continuous scene rendering.

Official documentation checked for implementation:

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP matchMedia and cleanup](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>)

The reference sites were reviewed only for service grouping, enquiry access and contact discoverability. Their text, photos, branding, contact details, statistics and reviews were not copied. No equipment sales or Hosur location has been added.

## Before public launch

1. Supply the actual services PDF and approve which individual services are operational. Reconcile every catalogue item and its source before enabling it.
2. Supply the original logo and final brand colour; the current wordmark and electric blue are provisional.
3. Confirm the real phone/WhatsApp number, email, full workshop address, map link, opening days/hours and social links.
4. Approve the workshop introduction, FAQs and actual service process. Add prices, timing or warranties only if verified and desired.
5. Supply approved workshop/project photography. Optional matching genuine before/after photos unlock the comparison. All present imagery is illustrative.
6. Supply a licensed optimised realistic GLB and attribution if the true 3D experience is required before launch.
7. Confirm the final domain, update `seo.url`, connect a real enquiry channel and test a real handoff. Set `launchReady` after approval.

## Verification and limits

Completed on 13 October 2026: TypeScript + production build passed, Oxlint passed without warnings, and all seven Playwright browser tests passed. The automated WCAG A/AA scan reported no violations in its tested static page. Dependency installation reported zero known vulnerabilities after updating Sharp. Desktop and 360px mobile screenshots were visually reviewed; the local preview returned HTTP 200.

`tests/website.spec.ts` covers desktop navigation and service dialogs, all five scroll chapters forwards/backwards, pin release, form errors and past-date rejection, unavailable service/contact gating, honest draft handling, 360px mobile navigation, reduced motion, keyboard FAQ operation, failed assets and low-memory fallback. Axe checks cover the rendered static page at WCAG A/AA. Screenshots support visual inspection.

The actual services PDF, genuine gallery/comparison content, real logo, GLB and a real enquiry destination remain unavailable. A real WhatsApp conversation, workshop operational claims and true WebGL rendering therefore cannot be verified. Automated accessibility testing is not a substitute for a full assistive-technology audit. Browser coverage is Chromium/Edge on Windows, not physical iOS/Safari or Firefox.

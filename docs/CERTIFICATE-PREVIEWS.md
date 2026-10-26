# Six cards and certificate image previews — 26 October 2026

The owner corrected the original list-layout plan: retain the existing Next Step card format and use all six supplied steps in the existing three-column desktop grid. The existing single-column mobile layout, card styling, spacing and entrance selectors are unchanged. Both heading layers now say “Let’s Build Together.” Six cards use the supplied titles, descriptions and supporting captions; captions remain text. New code, brain, network and growth icons use the existing SVG stroke conventions.

Home navigation says **Projects**, still targeting `#projects`; section tracking, mobile menu and “Available for Work” remain intact.

## Certificate behavior

All seven certificates on Home and Training share one preview renderer and one controller. Each page has one native image dialog. Clicking **Preview Certificate** opens the existing local WebP image, its title and a separate **Open Original PDF/Image** link. The image stays in full color, preserves its aspect ratio and uses `object-fit: contain`; no PDF is embedded or opened by the thumbnail action.

The dialog has a Close button, native Escape handling, backdrop dismissal, explicit Tab/Shift+Tab wrapping, background scroll locking and opener-focus restoration. Its 300ms fade/scale follows the existing easing and OS-independent motion policy. A failed image keeps the original-document action available with an error message. Original-document links use a new tab.

Without JavaScript, or without working native-dialog support, thumbnail links open the preview image and separate original links remain on the cards. The fallback link is positioned to keep its screen-reader text contained within the horizontal certificate rail; browser fallback testing caught and verified this overflow fix.

Original PDFs/photos, data records, existing project viewers, contact form, routes, dependencies and Vercel configuration are preserved.

## Implementation files

- `scripts/templates.mjs`: shared certificate preview/dialog markup, six-card copy/icons and Projects label.
- `assets/decks.js`, `assets/app.js`: shared certificate initializer and startup wiring.
- `assets/redesign.css`, `assets/motion.css`: certificate dialog/fallback styling and transitions; existing six-card layout rules unchanged.
- `tests/certificate-preview.test.mjs`, `tests/training.test.mjs`, `tests/ai-tools.test.mjs`: image-first behavior, original links, keyboard/dismissal/fallback/error paths, six-card copy and updated labels.
- `README.md`, `docs/QA.md`, this record: current behavior and verification.

## Verification

- Watched the added/updated checks fail before implementation. Full Node suite: **85 passed, zero failed**. Existing document hashes, project-gallery behavior, contact handling, Education and six-bullet experience tests still pass.
- Syntax checks passed for templates and changed controllers. `git diff --check` passed with pre-existing LF/CRLF warnings. No lint/type-check command is configured.
- `SITE_URL=https://ejmedilo.vercel.app npm run build:release` passed, producing ten content routes and a 404 using the existing Vercel configuration. Draft output was restored afterward.
- **14 real dialog checks:** opened all seven certificates on both Home and Training, confirmed loaded preview images, correct titles, original PDF/image destinations, contain styling and scroll locking. Browser URLs confirmed that the explicit original actions open the PDF and original PNG in separate tabs.
- **24 responsive checks:** Home and Training × 360, 390, 768, 1024, 1366 and 1440px × both themes. No document overflow or failed already-loaded images; representative image dialogs fit inside each viewport without horizontal scrolling or cropping. Desktop and mobile cards and certificate popups were visually inspected.
- **Six fallback checks:** no-script Home, no-script Training and unsupported-dialog Home at 360 and 1440px. All seven original links remain visible, primary destinations match preview images, no dialog enhancement is applied and no document overflow remains. A real script-free thumbnail click opened the WebP image in a separate tab.
- Keyboard Tab/Shift+Tab stays within the certificate popup; Escape and real backdrop clicks close it, clear the lock and return focus. Home Projects navigation updates the active indicator and closes its mobile menu. The existing Kwiztorya viewer advanced 1/4 → 2/4 → 1/4 and restored its opener on Escape.
- Read-only review found no concrete defects; its independent focused run passed ten tests. Checked browser warning/error logs were empty. The design detector flagged only the retained Inter body typography, which the user asked to preserve.

Screenshots and measurements are in ignored `.qa/certificate-update/`. Temporary public QA fixtures and test-opened document/image tabs were removed. No commit, push, deployment or external inquiry was performed. Physical devices, other browser engines, screen readers, custom zoom/slideshow controls and hardware performance tracing were not tested or added.

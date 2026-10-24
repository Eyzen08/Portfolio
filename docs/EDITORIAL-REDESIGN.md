# Project-first editorial redesign — 20 October 2026

Implements the owner-approved plan supplied in this chat. The intended audience is recruiters and developers assessing EJ Christian Medilo's actual software work.

## Implementation record

- Kept the existing `codex/portfolio-studio` checkout because the complete application was already present as uncommitted/untracked work. No reset, checkout, incidental commit, push, or deployment was performed.
- Replaced the Home welcome/bento opening with an introduction and actual sanitized STI dashboard. STI Vio-Log is the first full-width project; Kwiztorya is a smaller second feature. Both expose roles, technologies, case studies, and genuine source/live destinations without requiring a project rail.
- Reused the existing screenshot renderer, autoplay controller, photo gallery, background deck, skill globe/strip, map, and public GitHub panel. Moved supporting evidence below projects. Added two certificate previews and three additional training summaries, education/work-immersion records, and Contact links.
- Categorized project-backed skills and added the same AI responsibility wording to Home and About. No new project features, employment, metrics, or technology claims were invented.
- Consolidated navigation to seven destinations, with Skills at `/stack/`, Contact singular, Activity in the footer, and existing Home anchors intact. Both themes use Inter; light surfaces are warmer and decorative background washes are removed.
- Home initialization now handles an absent gallery or strip without preventing globe initialization. Existing autoplay, interaction pauses, offscreen suspension, and hidden-tab suspension remain.
- Preserved the PDF bytes, screenshot redactions, enhanced/recreated image labels and original-capture links, Formspree behavior, GitHub endpoint, security headers, environment names, and release gates. No dependencies or required content schema were added.

## Source and interface checks

Read the linked STI Vio-Log frontend/backend manifests and Kwiztorya README through GitHub. Existing React/Vite, Express, and educational Android descriptions remain consistent. Detailed project architecture, limitations, and historical verification wording were retained from the existing case studies rather than represented as newly rerun project tests.

Primary files: `scripts/templates.mjs` (page generation), `assets/site.css` (shared/editorial presentation), `assets/home.js` (optional-element initialization). Theme initialization and browser chrome use the updated light background. The existing API, routes, JSON structure, contact endpoint, release configuration, and PDF are unchanged.

## Verification

- Baseline: 48/49 tests passed under the sandbox; preview-server connection failed with loopback `EACCES`. Running with authorized loopback access resolves the failure.
- New editorial tests were observed failing before implementation, then passing. Existing layout tests now assert the approved layout while retaining asset, integration, lifecycle, route, and security checks.
- Added simulated contact responses covering successful confirmation, failed/unconfirmed submissions, retained message data, duplicate prevention, and restored form controls. No inquiry was sent.
- Browser layout checks cover all ten pages at 390/1440px in both themes, plus Home, Projects, and both case studies at 360/768/1024/1366px in both themes: 72 unique combinations, without document overflow or clipped main buttons. Loaded-image checks found no broken images.
- Browser interaction checks confirm Explore Projects lands below the sticky header; screenshot selection works; mobile navigation opens, closes on Escape with focus returned, and closes after Skills navigation; technology search/reset works; keyboard focus has a visible 3px outline; the relocated map loads with attribution and its external fallback.
- Independent read-only code review found no actionable issues; its focused tests passed 4/4.
- No standalone lint or TypeScript command exists. Visual review covers representative desktop/mobile captures and lower Home sections; physical devices and deployed Vercel behavior are not verified.
- Final `npm test`: **52/52 passed** with authorized local loopback access. Final `npm run build`: **10 pages plus 404 generated successfully**. `git diff --check` passed.
- After removing obsolete bento styles, visual review caught and corrected the header's lost flex alignment. Repeated the complete 72-case browser sweep with an explicit brand/theme vertical-alignment check in separate light/dark passes: all passed. Ignored `.qa/editorial/` stores responsive measurements and selected screenshots; `.qa/editorial-final-tests.txt` stores the final test output.

## Publication and known limits

`npm run build:release` correctly refuses release because owner content/imagery approval and `SITE_URL` are still missing. `contentApproved` remains false. Draft builds remain noindex. The existing README launch checklist applies: review content, set the real HTTPS origin, configure server-side GitHub credentials if needed, then build and verify a Vercel preview before promotion.

The owner explicitly selected existing autoplay even with reduced motion enabled. No pause/view controls were added; this remains an accessibility limitation. No real form submission, public deployment, domain/configuration change, production journey, or performance benchmark was performed.

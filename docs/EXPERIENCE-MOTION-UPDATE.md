# Experience, motion and Education — 26 October 2026

Implemented directly in the existing repository, preserving earlier uncommitted work, dependencies, routes, original documents, project media, contact handling and Vercel configuration. No deployment or public API change.

## Content and layout

Both Moreh Academy and BCiS Power Technologies Corp. now have exactly six responsibilities, each starting with an action verb and linking a task to its purpose. The current résumé confirms Moreh's file/document maintenance and graduate-portrait processing/refinement. The archived original portfolio also described computer support and technology assistance, but did not substantiate specific setup or troubleshooting tasks. Asked which duties were performed, the owner answered “both” to the document/portrait and basic IT-support options; the three basic IT duties are included on that confirmation. No advanced repair, networking, administration or invented metrics were added. BCiS uses the supplied administrative, recordkeeping and supervisor-assigned technical/operational scope.

Home and the HTML résumé use one semantic list per experience. At 1024px and above, CSS Grid places bullets 1–3 down the first equal-width column and 4–6 down the second. Below 1024px, all six follow DOM order in one column. Home retains native expandable rows and their 750ms transition; the HTML résumé retains its existing timeline and cards. Location, institution, role, hours and year remain attached to each entry. The supplied downloadable résumé PDF is unchanged.

Education data is unchanged: STI College Global City, BSIT, 2023–Present; Moreh Academy, ICT Strand/Senior High School, 2021–2023. No institution or qualification was added.

## Motion policy

Removed OS reduced-motion suppression from all three site stylesheets and the shared motion, Home and deck controllers, as explicitly requested. Existing reference-derived timing, easing, masks, stagger, parallax, hover/focus feedback, menus and dialogs remain. No new effects or animation dependency were needed. Visible animations run under either OS preference; the globe, strip, hero loops and decks retain their existing offscreen/hidden-tab/interaction suspension. Theme repaint remains available even when the globe is stopped. Default content stays visible if observers, WAAPI or scripts are unavailable.

Revisited the live reference in the browser and opened its Experience disclosure. Its current five-entry accordion remains the visual reference; its employer names and claims were not copied. The earlier detailed timing inventory remains in [MOTION-INVENTORY.md](MOTION-INVENTORY.md).

## Files touched in this update

- `data/profile.json`: six responsibilities for each existing experience; Education unchanged.
- `scripts/templates.mjs`: responsibility-list class on Home and HTML résumé.
- `assets/redesign.css`: integrated responsive bullet grid and removal of OS suppression.
- `assets/site.css`, `assets/motion.css`: removal of OS suppression; print motion suppression retained.
- `assets/motion.js`, `assets/home.js`, `assets/decks.js`: remove preference gates/listeners while retaining lifecycle behavior.
- `tests/experience-update.test.mjs`: content counts/order, exact Education records and absence of OS suppression.
- `tests/motion.test.mjs`, `tests/home-motion.test.mjs`, `tests/decks.test.mjs`, `tests/fidelity.test.mjs`, `tests/remake.test.mjs`: revised motion expectations and lifecycle/fallback coverage.
- `README.md`, `docs/QA.md`, `docs/MOTION-INVENTORY.md`, this report: current policy and evidence.

## Verification actually performed

- Watched the new/updated regression checks fail against the previous two-bullet, OS-suppressed implementation, then pass after implementation. Full `npm test`: **79 passed, zero failed**. Coverage includes one-time entrances, hidden-page cancellation, missing/throwing observers, unsupported WAAPI, globe geometry/rotation/theme repaint, deck suspension/manual controls, menu inert/focus behavior, galleries, contact states, filters, local links, source-image provenance, original-PDF hashes and release boundaries.
- `node --check` passed for changed controllers and templates. `git diff --check` passed with existing LF/CRLF warnings. No separate lint/type-check command is configured.
- `SITE_URL=https://ejmedilo.vercel.app npm run build:release` passed: ten content routes plus 404, with existing Vercel settings unchanged. Draft output was restored afterward.
- **120 production layout checks**: ten routes × 360, 390, 768, 1024, 1366 and 1440 CSS pixels × both themes. No document overflow or failed already-loaded images. Computed experience grids had six items, two equal columns/three rows at desktop sizes and one column at smaller widths. These checks are not exhaustive interaction audits of every route.
- Actual production browser reports `prefers-reduced-motion: reduce`. The header starts at opacity 0; name letters start translated/rotated and move; the portrait follows its delayed reveal; social CSS animation remains `hero-social-float`. About heading and both Education records were observed mid-entrance. Certificate, Contact, next-step and footer elements were observed with intermediate opacity/translation; ghost headings translate with scrolling. Active-section indicators follow navigation; the strip runs in view and stops offscreen.
- Standard-preference **JavaScript input** was supplied by an isolated local fixture using unchanged production styles/controllers. Its own page-context DOM marker confirmed `false` for the reduced-motion query. Home at six widths × both themes passed **12 checks**, with active social motion and no overflow; its Experience disclosure retained the 750ms transition. The browser inspection sandbox reads native media queries separately, so the fixture marker, rather than sandbox `matchMedia`, was used to verify the supplied input. CSS remained under the native reduced preference; production CSS now has no reduced-motion branches. This is controlled-input testing, not an OS-level preference toggle.
- Mobile menu opens with 550ms transitions and staggered links; Escape closes it, restores its button and makes closed links inert. STI gallery shows a moving 900ms dialog entrance, advances 1/6 → 2/6, closes on Escape and restores the opener. Existing Node fixtures cover manual wrapping and unsupported dialog fallback.
- HTTP HEAD requests returned 200 for the owner GitHub profile, both project repositories and the STI Vio-Log live platform. Generated local route/asset destinations are checked by the build. Social destinations beyond GitHub were preserved but not independently audited.
- Script-free fixtures at 360 and 1440px: zero scripts, visible hero/headings, two Education records, native experience expansion with six visible bullets, hidden unused globe presentation and no overflow.
- Desktop Moreh and BCiS entries, mobile stacking and the 1024px HTML résumé were visually inspected. Screenshots/measurements are saved in ignored `.qa/experience-update/`. Checked browser warning/error logs were empty. The design detector flagged the pre-existing Inter body face; the requested existing typography was preserved.

Temporary public fixture files were removed. No real inquiry, commit, push or deployment was performed. No physical-device, screen-reader, non-Chromium, OS-level preference-toggle or hardware performance/CLS trace was performed. Mouse-specific hover rules were inspected; keyboard equivalents and touch-accessible controls were exercised, without a hardware pointer-hover test. The requested policy means visitors who select OS reduced motion still receive full intended animation; offscreen suspension and readable fallbacks remain.

# Current verification

Latest update — 21 October 2026: 57 Node tests and the draft build pass. The summary-first Home passed 26 responsive browser cases, section-anchor/mobile-menu checks, keyboard focus, themes, screenshot controls, map fallback, and JavaScript-disabled content/navigation. See [Summary-first Home](SUMMARY-FIRST-HOME.md) for the current layout and verification limits.

See [Full visual remake](FULL-VISUAL-REMAKE.md) for the 19 October 2026 remake checks. Earlier dated records below are historical. Existing owner-selected Home autoplay remains; reduced-motion preferences now disable smooth anchor scrolling.

# Verification record — 13 October 2026

## Verified

- Draft build: nine pages and a 404 generated successfully.
- Node suite: 20 tests passing after red/green implementation and regressions.
- Browser matrix: nine pages × eight widths × two themes = 144 checks. Widths: 320, 360, 390, 768, 1024, 1366, 1440, 1920. No horizontal document overflow or failed image loads in checked states.
- Mobile navigation exposes seven main pages; Escape closes it and returns focus.
- Theme choice persists across navigation; toggle labels are correct.
- Workflow selection changes illustration and explanation.
- Project platform filters, empty search state, clear filters and technology search verified.
- Anonymous GitHub profile/events rendered. Rapid visual QA later reached the failure/rate-limit fallback. Local preview has no CDN cache.
- One Formspree inquiry accepted; EJ confirmed inbox receipt.
- Local fonts/logos and source-provided imagery have provenance/license records. SVG/signature checks passed; lossless WebP derivatives prepared.
- Old portrait/PDF excluded from public output.
- Review fixes: dark-theme print specificity, stale-calendar refresh, invalid canonical origins. Tests also cover clearing stale data on failed refresh.

## Accessibility and security

Semantic headings/landmarks, skip link, visible focus, associated form labels, announced status, keyboard menu/buttons, image alternatives, contribution text/table equivalent, 44px principal controls, and reduced-motion rules/runtime checks.

Deployment configuration includes CSP, no-sniff, referrer and permissions headers. No frontend dependencies, external font CDN, chatbot or visitor accounts. GitHub credentials stay server-side; fixed upstream, safe errors, form bounds, Formspree spam field and encoded-traversal refusal are implemented.

These targeted checks do not establish full WCAG conformance or a penetration test.

## Pending

- Updated portrait and résumé PDF; owner review of dates/certificates, social links and final imagery.
- Live authenticated contribution calendar: no token supplied. Normalization/errors tested with fixtures.
- Vercel deployment, CDN behavior and production security headers.
- Production Core Web Vitals and cross-browser/physical-device measurements. No measured LCP/INP/CLS claim.
- Physical print/PDF review. Dark-theme print token specificity corrected; no printer export measured.
- Approved dashboard/gameplay captures. Genuine login captures and labeled artwork/illustrations remain distinct.
- Kwiztorya papers and Android/STI authenticated runtime verification were not part of this portfolio build.

Release builds fail intentionally while required approved assets/content or SITE_URL are absent. No public deployment was made.

## Refinement verification — 17 October 2026

- Draft build generates all nine pages and the 404 page. Complete suite: 25 tests pass, including five new refinement checks. New tests were observed failing before implementation for missing content/preview behavior; a text-encoding regression and animation of display-contents children were also verified red → green.
- Fresh code review found no blocking or minor code findings. Reviewer sandbox ran 23/24 pre-final-motion tests; only its loopback test was denied by sandbox EACCES. The complete final suite was run with loopback access in the implementation session.
- Browser matrix: all nine pages × 320, 360, 390, 768, 1024, 1366, 1440, 1920 × both themes = 144 checks. No horizontal document overflow, failed loaded images, or clipped project captions. Results retained in ignored .qa/redesign-responsive.json. Some navigation checks needed a fresh tab after browser-automation timeouts; completed results were retained.
- Six additional mobile-landscape checks at 844 × 390 (Home, Projects and Kwiztorya in both themes) passed without overflow or broken images.
- Phone selector changes image, explanation and pressed state by mouse/Enter. Corrected screens retain their 420:860 aspect ratio. Static generated HTML contains all three figures without hidden panels; controls enhance progressively.
- Project category/search/empty/reset states and all seven mobile navigation links checked. Escape closes navigation and returns focus. JS selection tests exercise unavailable storage and reduced-motion behavior; CSS reduced-motion rules explicitly remove hover movement.
- Supplied PDF hash matches the download source byte-for-byte; original old root PDF remains excluded. Experience responsibilities, education and five training entries match supplied material.
- Anonymous public GitHub data rendered with its timestamp. Endpoint behavior and rate-limit/stale/missing-calendar cases remain covered by the existing suite. Formspree destination unchanged; the earlier confirmed delivery check was not repeated.
- No new frontend/runtime package. Video processing was offline; five existing-collection logos and three general interface symbols are served locally. Combined new phone images: 104,798 bytes. app.js and CSS are unminified local assets; no synthetic loading delays.

### Local HTTP timing sample

Node fetch against the local development server, three requests per route, unthrottled loopback, on this machine. These are server response timings, **not browser LCP, INP, CLS, Lighthouse scores, or real-user measurements**. Browser performance instrumentation is not exposed by the available browser inspection API.

| Route | Median response-header time (ms) | HTML bytes |
| --- | ---: | ---: |
| / | 11.58 | 19,790 |
| /projects/ | 13.69 | 10,599 |
| /projects/kwiztorya/ | 15.80 | 16,879 |
| /resume/ | 13.61 | 10,989 |

### Remaining verification and release gates

- Physical printing/export, OS-level reduced-motion emulation, browser zoom, non-Chromium browsers and physical devices were not measured in this session. Print rules and document flow were reviewed; generated content and reduced-motion JS behavior are tested.
- Production Core Web Vitals, Vercel/CDN/security-header behavior and authenticated GitHub calendar remain unmeasured until deployment/configuration.
- Updated portrait, owner approval of final content/imagery and SITE_URL still gate release. The updated résumé requirement is satisfied. Review the supplied PDF’s broader SQLite wording before publication; the website explains the source-reviewed storage distinction.
- Camera footage limits image sharpness and retains a peripheral fingertip on the era preview. No generated or reconstructed interface content was substituted.
- No public deployment, push or incidental commit was made.

## Card-layout verification — 19 October 2026

- Baseline and final Node suite: 25 tests. Draft build and syntax/diff checks pass. New class names did not change substantive generated HTML, routes, IDs, destinations, controls, or progressive-enhancement attributes.
- All nine routes at 320, 360, 390, 768, 1024, 1366, 1440 and 1920px in both themes: 144 checks. No document overflow, internal card overflow, nested cards or failed loaded images. Ignored evidence: .qa/cards-responsive.json.
- Browser measurement confirmed project copy and action rows share the same top positions at 768/1024/1366px. Search/category/empty/reset behavior, grouped skill filtering, phone selection by Enter and mobile menu/Escape focus return verified.
- Review found the Projects gallery touching the contact CTA; browser confirmed 0px before and 24px after the spacing correction. Narrow workflow crowding at 360px was reproduced, fixed with column-oriented controls, and rechecked in both themes. The mobile hero uses the shared gap.
- Informational cards have no added hover movement. Existing reduced-motion CSS and JS remain; existing selection/storage tests pass. All content remains in the generated HTML without JavaScript.
- Print CSS removes card borders, surfaces, shadows and padding and changes the résumé layout/main/sidebar to block flow; row entries preserve break-inside avoidance. Fresh code review inspected the rules. Actual printer/PDF pagination could not be measured with the available browser controls; no standalone HTML print engine is installed.
- Existing launch gates, authenticated calendar and production/device/performance limitations remain unchanged. No external form inquiry was sent during this layout change.

## Latest résumé and paper-theme verification — 19 October 2026

- 26 Node tests pass. The first sandboxed run could not connect to the temporary loopback server (EACCES); the complete suite passed with loopback access. The new checks confirm the latest exact PDF SHA-256, experience hours/roles, education, five credentials and removed résumé-only MySQL, plus saved/system/invalid/unavailable-storage initial themes and matching browser chrome. Draft build and syntax/diff checks pass.
- All nine routes × eight widths (320, 360, 390, 768, 1024, 1366, 1440, 1920px) × two themes: 144 checks. No document overflow, internal card overflow, nested cards, failed loaded images or incorrect theme metadata. Evidence: ignored .qa/paper-responsive.json.
- Keyboard Story Mode selection switches the visible phone/explanation; mobile navigation exposes all seven links, and Escape returns focus. Project Mobile/empty/reset filtering produces 1/0/2 results. Theme choice persists across route navigation. Contact endpoint and form fields are unchanged; no inquiry was sent.
- Sixteen text/action/focus/input contrast pairs pass, including conservative black/white grain bounds. The lowest body-copy pair is 4.79:1 and lowest input boundary is 3.24:1. Light field boundaries were darkened for extra margin. Evidence: ignored .qa/paper-contrast.json.
- Desktop light Home, dark résumé and narrow dark Contact were visually inspected. Grain remains behind content and pointer-events:none; existing motion/reduced-motion rules and visible focus are retained. All substantive content remains statically generated.
- Print CSS removes grain and card decoration and preserves block flow and entry break avoidance. Actual printer/PDF pagination, OS-level reduced-motion/zoom, physical devices, other browser engines and production Core Web Vitals remain unverified.
- No deployment, commit, push or external form submission. Updated portrait, final owner content/imagery review and canonical SITE_URL remain release gates. The PDF SQLite wording still needs review; the website retains the source-reviewed active SharedPreferences versus SQLite-helper distinction.

## Photo-led homepage verification — 19 October 2026

- All 27 Node tests pass, including the local preview check with loopback access. The added check verifies the Home/About portraits, responsive sources and reserved dimensions, header/footer photo logos, favicon destination, removed Home workflow and retained STI process outline. Existing three-screen preview and reduced-motion tests still pass. Draft build, syntax checks and git diff --check pass.
- All nine routes at 320, 360, 390, 768, 1024, 1366, 1440 and 1920px in both themes: 144 checks. No document/card overflow, nested cards or failed loaded images; all pages contain both photo logos. Home text/actions precede the portrait at every checked mobile width. Evidence: ignored .qa/photo-responsive.json.
- Desktop light Home, narrow dark Home, dark About, portrait/close avatar crops and regenerated sharing image were visually reviewed. The photo keeps its natural colors and cap shadow. Keyboard Story Mode selection still changes the visible panel. Mobile menu exposes seven destinations and Escape restores visible focus to its button. Theme selection persists across navigation.
- Source PNG hash and unchanged backup verified. All published portrait derivatives have the documented dimensions and no source EXIF; built copies match. Original/temporary source paths are absent from generated HTML. Retired Home illustration/initials assets are absent from source and local build output. New PNG favicon destinations are covered by local-link checks.
- Print CSS remains unchanged and hides header/footer branding; résumé block flow, plain surfaces and entry break rules remain. Actual print pagination, physical devices, browser zoom and other browser engines were not retested. No performance/Core Web Vitals claim is made.
- Release validation now reports only owner-approved content/project imagery and SITE_URL as missing. Portrait and résumé inputs are satisfied. No deployment, push, commit, new dependency or external form submission.

## Interactive bento verification — 19 October 2026

- All 28 Node tests pass, including temporary preview-server checks with loopback access. The new static check covers factual content, all six initial descriptions, two initially hidden control groups, unique IDs/relationships, preserved anchors, primary actions and mobile source order. The shared-controller test now covers two independent selectors and both reduced-motion branches. Existing route/link, résumé fingerprint, filter, GitHub and release-boundary checks pass.
- All nine routes × eight widths × two themes: 144 responsive checks, with no document/card overflow, nested main cards or failed loaded images. Home main-tile rectangle checks also detect zero unintended tile intersections. All mobile records confirm source-order stacking. Evidence: ignored .qa/bento-responsive.json.
- All nine Background × hobby combinations at 320/390/768/1024px in both themes: 72 checks. No clipped selected content or button labels, no horizontal overflow, and the selected groups remain independent. Evidence: ignored .qa/bento-selector-states.json. Background/hobby keyboard selection was checked with Enter and Space; visible focus remained on the selected button.
- Existing project Mobile/empty/reset filters returned 1/0/2 results. Kwiztorya Story Mode still selects its own visible panel. Mobile navigation exposes all seven links, and Escape restores focus. Both themes persist through navigation.
- Desktop light bento and tablet portrait crop were visually inspected; photo remains natural and within its grid column. Inactive selector text contrast is 4.63:1 light / 6.30:1 dark. Location text over the motif's maximum 12% tint is 4.90:1 / 5.47:1. Main theme contrast remains unchanged.
- No-JavaScript availability is verified from generated HTML and enhancement-specific CSS; runtime browser JavaScript disabling is not exposed by the available browser controls. Print CSS is unchanged and retains plain single-column résumé flow; actual print pagination, physical devices, browser zoom, other engines, screen-reader announcements and controlled OS-level reduced-motion emulation remain unverified.
- No deployment, push, commit, new service/dependency, borrowed reference media or external contact inquiry. Final owner content/imagery approval and SITE_URL remain launch gates; the PDF SQLite wording and authenticated-calendar verification remain existing review/configuration items.


## 20 October 2026 project picture decks

See [PROJECT-PICTURE-DECKS.md](PROJECT-PICTURE-DECKS.md) for the current shared picture presentation, accepted enhanced images, sanitized STI captures, Background autoplay, verification and remaining limits. This supersedes earlier descriptions of static Background highlights and the combined three-phone showcase.


## Compact Project Row and Rotating Globe — 20 October 2026

- 40/40 Node tests and draft build pass. Shared compact rendering, rail boundaries/filter reset, four-screen Kwiztorya order/labels, mesh geometry, and compact/full deck lifecycles are covered.
- Nine routes × eight widths × two themes: 144 layout/loaded-image checks, no document overflow or failed loaded images. Viewports: 320, 360, 390, 768, 1024, 1366, 1440, 1920px. This does not imply exhaustive interaction testing at every combination.
- Both compact cards advanced twice at roughly four-second intervals while reduced motion was enabled. Keyboard focus paused Kwiztorya. Both cards remained unchanged for nine seconds offscreen and resumed on return. Next/previous bounds, Mobile filter reset, PostgreSQL search, empty state, keyboard case navigation and mobile menu/Escape were checked. Hidden-tab/hover lifecycle and canvas-null behavior use existing Node fixtures.
- Script-free browser fixtures retained both overview links, six STI figures, four Kwiztorya figures and 23 linked technologies with no empty canvas area. These temporary fixtures were removed; no browser-wide JavaScript setting was changed.
- New Home source/recreation and both transparent mobile crops were visually compared. Dimensions, alpha corners, original sanitized-source equality and unchanged PDF SHA-256 pass. Globe frames several seconds apart differ, confirming movement. Screenshots and comparisons are in ignored .qa/compact-projects/REVIEW.md.
- Final code review found two minor capitalization issues; corrected Send Inquiry reset and QR alt text. No functional rail/deck/globe issue was identified.
- Full details and limits: docs/COMPACT-PROJECTS-GLOBE.md. No deployment, paid service, new dependency or contact inquiry. Physical devices, other engines, screen readers, fresh print pagination and production performance remain unverified. Recreated Home attribution and final release gates remain necessary.

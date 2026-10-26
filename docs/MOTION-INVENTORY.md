# Reference motion inventory — 26 October 2026

**Later owner-requested policy update:** intended animations now remain active regardless of the OS reduced-motion setting. Reduced-motion cancellation and suppression described in this original verification record are historical. Offscreen, hidden-tab and interaction suspension remain. See [the current implementation and verification](EXPERIENCE-MOTION-UPDATE.md).

Reference: [jtenajuraportfolio.com](https://jtenajuraportfolio.com/). Inspected in Chrome from initial load through About, Work/project dialog, Experience, Certificates/lightbox, Contact/footer and the phone menu. Public reference assets `index-BftNXYIv.js` and `index-Dk-eTZVt.css` confirm timings below; source files and before/after screenshots are in ignored `.qa/motion/`. These assets are research evidence only and are not bundled into this portfolio.

Shared easing is cubic-bezier(.16,1,.3,1). The reference uses Framer Motion and a nested smooth-scroll container; the portfolio uses native document scrolling, CSS, WAAPI and one shared observer. Observed states corroborate source timings; exact frame timings are source-confirmed rather than a hardware frame-rate measurement. Browser media emulation is not exposed: the current browser reports reduced CSS animations, while the reference's scripted entrances still play.

| Element | Trigger / start → end | Duration / delay | Repeat / responsive behavior |
|---|---|---|---|
| Header | Load; opacity 0, y -40px → 1, 0 | 1000ms; 200ms delay | Once; desktop and phone |
| Hero greeting | Load; opacity 0, y 14px → 1, 0 | 1000ms; 450ms delay | Once |
| Name letters | Load; masked y 112%, rotation 3deg → 0 | 1200ms; first line 550ms, second 850ms; 40ms per letter | Once; same choreography, responsive text size |
| Formal portrait | Load; opacity 0, y 80px → 1, 0 | 1500ms; 1150ms delay | Once; retain supplied portrait |
| Hero description/actions | Load; opacity 0, y 32px → 1, 0 | 1100ms; 1350ms delay | Once |
| Hero social capsules | Load fade, then y 0 → -7px → 0 | Opacity 700ms, delay 1550ms +100ms each; float 1800ms, delay 2050ms +180ms each, ease-in-out | Loop observed; own implementation pauses offscreen/hidden/reduced |
| Hero parallax | Scroll through hero; name y 0→30% of own height, portrait 0→12%; intro opacity 1→0 by 60% progress | Scroll-linked, no independent loop | Reference applies responsive transforms; focus must keep own copy readable |
| Mouse wheel | Visible hero; y 0→6px, opacity 1→0 | 1800ms, cubic-bezier(.22,1,.36,1) | Loop; own lifecycle/reduced-motion pause |
| Section words | Enter view; masked y 110%→0 | 900ms; 40ms start, 55ms word stagger | Once; reference margin -8%, ratio .25 |
| Ghost headings | Scroll heading across viewport; x 3%→-7% | Scroll-linked | No extra continuous loop |
| Body/rows/cards | Enter view; opacity 0, y typically 12–48px→0; shared default 28px | Default 1150ms; local 80–120ms stagger | Once; reference margin -8%, ratio .2 |
| Primary buttons/icons | Hover scale 1→1.03; arrow +2px x/-2px y | 500ms | Mouse hover; keyboard receives matching visual feedback |
| Project images | Hover scale 1→1.03; active scale 1.015; image affordance reveals | 1000ms image, 700ms affordance | Essential controls remain visible on touch |
| Project dialog | Open/close; panel y 100%→0 | 900ms | Existing native gallery is retained, with adapted slide treatment |
| Experience body | Expand/collapse height 0↔auto, opacity 0↔1 | 750ms | Native details, including keyboard/exclusive groups, retained |
| Mobile menu | Open/close; opacity 0↔1, y -12px↔0, scale .98↔1 | 550ms; links 500ms, 60ms stagger | Phone/tablet only; clicks and Escape remain immediate |
| Technology chips | Enter/hover; opacity, y 8px, scale .96→1; hover inverts colors | 350ms enter, 300ms colors | Existing globe and readable list replace reference folders |
| Certificate cards | Hover y -4px, border contrast, grayscale→color | 500ms card; 700ms image | Own original PDFs and native scroll region retained |
| Certificate lightbox | Backdrop opacity; figure scale .92/y24→1/0 | 450ms backdrop, 600ms figure | Own cards open original documents; no duplicate lightbox added |
| Contact/footer | Viewport reveals with shared preset; form border/background feedback; submit hover scale1.02 | Shared reveal, 500ms controls | Existing real submit/error logic retained; no external inquiry sent |

## Implementation decisions and limits

The focal sequence is the reference's masked name and delayed portrait. Supporting motion explains section arrival and existing menu/dialog/disclosure state changes. Only transform/opacity scroll updates are scheduled, at most once per scroll frame and only for visible targets. Motion is canceled when hidden/reduced and cleaned up for page lifecycle changes. Default document content is never CSS-hidden for reveals; late initialization keeps already-readable content stable. Native viewport triggers can begin slightly earlier than the reference to avoid a visible flash. Dedicated pages receive the same restrained reveal language as an adaptation; the reference is primarily one page.

Preserve the owner's globe, manual certificate scrolling, unchanged original images/PDFs, all factual content and all routes. The reference's continuously duplicated certificate marquee, rotating text tail, commercial numeric counters, custom cursor, audio ambience and sections absent from this portfolio are not copied. Do not fabricate metrics or introduce autoplay audio. Certificate motion reproduces entrance/hover treatment while preserving the existing keyboard-operable scrolling and document links. The desktop hero retains the reference copy fade; below 1024px the copy stays opaque after its entrance so touch readers can finish it while scrolling. No artificial cross-page transitions or scroll-hijacking library.


## Implementation and verification

`assets/motion.js` owns bounded WAAPI entrances, one reveal/parallax IntersectionObserver and one passive, frame-scheduled scroll handler. CSS owns native menu/dialog/disclosure transitions and hover/focus treatments. Existing controller handlers remain authoritative; menu closure also makes its mobile links inert immediately, including during its exit, and outside-pointer dismissal matches the reference. Desktop links remain interactive. Original gallery, globe and strip controllers retain their separate lifecycles. No animation framework, scroll engine, public API, runtime dependency or deployment setting changed.

All 76 automated tests pass, including contact and gallery regressions. New checks cover one-time viewport entry, reduced/unsupported animation, live preference cancellation, missing/throwing observers, late initialization, hidden-page cancellation, inert/mobile menu closure, outside clicks, Escape focus and desktop resize. JavaScript syntax checks, `git diff --check` and the production release build pass. The Impeccable detector returned no findings. This project has no separate lint or type-check command.

Browser evidence:

- Reference entrance states were captured at 1440, 1366, 1024, 768, 390 and 360 actual CSS pixels. The masked letters begin at y112%/3deg and the header at y-40px/opacity 0 at every size. Settled and intermediate reference/local screenshots are in ignored `.qa/motion/`.
- Ten content routes × six widths × two themes × standard/reduced motion = 240 layout/loaded-image checks, with no document overflow or failed loaded images. This is not 240 exhaustive interaction audits. The standard-motion fixture uses identical application code and ordinary-motion CSS, with only media-preference inputs controlled; production pages were tested directly under the browser's actual reduced-motion preference.
- Actual standard-motion hero snapshots show a moving first letter while portrait opacity remains0, then settled letter transform none and portrait/copy opacity 1. About's masked word and paragraph were captured entering and settled. Ghost translation changes with scrolling.
- Native STI dialog starts at a 900px vertical translation in a 900px viewport and settles to none. Next advances the gallery; Escape closes it and restores its opener. Kwiztorya next/previous changes 1/4→2/4→1/4; original attribution remains. The native dialog's exit retains its overlay/scroll lock until its existing close handler fires, matching its 900ms exit. No lock remains afterward.
- Experience grows from about 124px to 315px with its native body visible and opacity 1 after the 750ms transition. Menu entry has 550ms transitions; Escape restores the menu button; selection/outside clicks close it and remove closed links from interaction. Desktop navigation is not inert. Keyboard GitHub focus uses a dark icon on the inverted light background in dark mode and a white icon on black in light mode.
- The simulated preference toggle cancels current effects, clears parallax properties and pauses loops. Production reduced motion has no social CSS animation and header opacity 1. Script-free 1440/360px fixtures have zero scripts, hero/heading opacity 1, hidden unused canvas, full-width skill lists and no overflow.
- Native empty-form validation focuses Name. Labeled local QA responses demonstrate disabled `Submitting…`, successful reset and failure with draft preservation/retry enabled; no Formspree request leaves the test fixture. These are simulated response tests, not new inbox-delivery verification. Browser Back returns from the STI case study to the project listing with search/reset and galleries functional. Checked browser warning/error logs were empty.

Read-only review identified two state issues and both were corrected: icon contrast on inverted backgrounds and the mobile intro fading while still readable. Latest display behavior was checked afterward. Temporary public QA files and the earlier script-free globe fixture were removed; an empty ignored QA directory remains locally and serves no test page; their generators and measurements remain outside published output in ignored QA storage. No commit, push, deployment, real inquiry or OS preference change was performed. Mouse-specific CSS was inspected against the reference and equivalent keyboard focus states were exercised; physical pointer/touch hardware, other browser engines, screen-reader announcements and a hardware performance/CPU trace were not tested. Native CSS transitions have readable instant fallbacks in engines without newer discrete/interpolated-size support.

# Compact Projects and Skills Globe — 20 October 2026

Home and Projects share a horizontally scrolling project row. STI Vio-Log comes first, followed by Kwiztorya. Each card contains one linked preview, project title and short description; case studies retain detailed galleries, captions, technology evidence, and source/live destinations.

## Peeking Screens and Monitor Frames

### Consistency Update

The shared `deviceScreen()` renderer now frames STI desktop screenshots and Kwiztorya mobile screenshots in both overview cards and full case studies. STI mobile captures already contain device borders and receive no extra frame. Blue/orange case-study stages and the visible Recreated/Enhanced Preview badges are removed. Source captions, image files, original-capture links, gallery controls and deck lifecycle remain intact.

Desktop navigation uses equal side columns around the centered navigation pill; the name/theme pill stays left and the existing mobile menu remains. The shared contribution calendar uses a blue card, actual last-year totals, five square intensity levels and a labeled focusable scroll region. Partial weeks use UTC weekday placement. Missing data retains a GitHub fallback link.

Verification for this update: **44 tests pass**, and the draft build succeeds. Browser measurements covered Home, Projects, both case studies and Activity at 320, 390, 768, 1024, 1366 and 1920px in both themes: 60 combinations with no page overflow, navigation overlap or clipped front device frames. A clearly marked synthetic 365-day calendar fixture covered the same widths/themes, confirmed square cells and horizontal scrolling, and verified keyboard scrolling. Script-free Projects and case-study fixtures at 320/1366px preserved all image frames and case-study captions/links with no page overflow. Read-only code review found no actionable issues. These checks do not establish live authenticated GitHub availability or physical-device behavior.

Ignored `.qa/consistent-frames/` contains layout/calendar/fallback measurements and screenshots. Temporary HTML fixtures are removed from published output after checking. No dependencies, API contracts, credentials or deployment configuration changed.

### Earlier Overview Update

- Overview cards show the active screenshot in front with its two neighbors peeking behind it. Initial positions use the existing `deckOffset()` helper, so the same layered layout renders before JavaScript starts. The existing four-second rotation, interaction pauses and visibility suspension remain.
- The blue/orange preview gradients are removed; card surfaces, typography and the page background remain. STI desktop screenshots receive a CSS bezel, chin, stand and base. Original image proportions, redactions and mobile framing remain intact. Full case-study galleries are unchanged.
- Cards display concise descriptions from the existing project summaries. Navigation buttons and counters are removed, along with their listeners, boundary calculations and resize observer. Native scrolling, snapping, the thin scrollbar, and the next-card peek remain. The rail is a labeled, keyboard-focusable region; filters reset scrolling and hide empty viewports.
- Verification: all **42 tests pass**, and the draft production build succeeds. Browser checks covered Home at 390px and 1366px in both themes, Projects at 320px, 390px and 1366px, keyboard rail scrolling, Mobile filtering and empty results. Checked pages had no document horizontal overflow. Script-free Projects fixtures at 390px and 1366px showed three visible screenshots per card, monitor frames and descriptions; this checks fallback markup/CSS rather than a browser-wide JavaScript setting. No errors were captured in the checked Home tab.
- Screenshots are saved locally in ignored `.qa/project-cards/`. No deployment or physical-device testing was performed.

## Earlier Implementation (before peeking screens)

- `scripts/templates.mjs` renders both overview rows through `projectRail()` and `projectCard()`. The rail is at most 560px wide, with 440px cards and 16px gaps. Below 600px, cards are the rail width minus 48px, including the viewport's focus gutters.
- `assets/decks.js` reuses the existing four-second lifecycle for compact crossfades and full case-study decks. Compact cards show one screenshot at a time, without overview controls or captions. Hover/focus pauses, offscreen suspension, and hidden-tab suspension remain independent per deck.
- Native horizontal scrolling and snapping keep ordinary vertical scrolling intact. Previous/Next Project controls stop at the ends. Filters reset scrolling, hide irrelevant cards, and retain the underlying description/technology search index. The row never advances automatically.
- Kwiztorya starts with a labeled **Recreated Preview** of Home, then Quiz, Era Selection, and Story Mode. The case study explains the recreation and links to the app-only source crop. Full unchanged personal/source photographs stay outside published output.
- STI mobile screenshots use tighter alpha-masked derivatives of the full-resolution sanitized assets. Their original device frames, browser interfaces, and redactions remain; no second phone frame is added.
- `assets/home.js` draws 24 longitude divisions, 12 latitude bands, diagonal connections, and a circular silhouette behind the same 23 verified technologies. Mesh and logos share the existing 52-second rotation and theme-specific depth fading. The linked HTML skills list remains below the canvas.
- Headings and interface labels use deliberate Title Case. Brand names, official credentials, paragraphs, screenshot text, and the résumé PDF retain their source spelling/content.

No routes, API contracts, environment-variable names, dependencies, contact service, or hosting configuration changed. Home and the approved project decks continue to animate even with a reduced-motion preference, as explicitly requested. Pause/view controls remain absent.

## Earlier Verification

`npm test` passes **40/40 tests**, and `npm run build` succeeds for all nine pages and the 404 page. Focused tests cover shared compact markup, rail boundaries and filter resets, finite rotating mesh geometry, source labels/order, and compact deck lifecycle without captions or controls. Existing tests cover GitHub failures, contact enhancement, route/asset links, résumé fingerprint, themes/storage, and case-study fallbacks.

Browser layout checks covered all nine routes in both themes at 320, 360, 390, 768, 1024, 1366, 1440, and 1920px: **144 combinations**, with no document horizontal overflow or failed loaded images. This is a layout/asset check, not 144 exhaustive interaction audits. The browser reported reduced motion enabled during real automatic preview cycling.

Observed two automatic screenshot changes in both overview cards; verified next/previous bounds, Mobile filter reset, empty results, PostgreSQL search, and keyboard case-study navigation. Keyboard focus paused the Kwiztorya card. Both cards stayed unchanged for nine seconds offscreen and resumed on return. Globe screenshots several seconds apart show rotation; the linked list contains 23 technologies. Hidden-tab suspension, hover/focus lifecycle, and canvas-unavailable paths are exercised by Node fixtures. Mobile navigation exposes all seven destinations. No runtime console errors were captured on the checked Home view; GitHub's existing unavailable-data fallback appeared during repeated local QA.

Browser fixtures made from the generated pages with every application script removed show both overview links, all six STI figures/captions, all four Kwiztorya figures/captions, and the 23-item skills list. The unenhanced sphere area stays hidden. This verifies script-free markup/CSS; it is not an OS-level JavaScript-disabled browser setting. The temporary fixtures were removed afterward.

Image dimensions, alpha corners, preserved sanitized originals, private-photo exclusion, and the unchanged résumé SHA-256 were checked locally. Source/recreated Home and before/after phone comparisons were inspected. See `assets/ASSETS.md` for transformation details.

The final read-only code review found two minor capitalization defects (Send Inquiry reset and QR alt text); both were corrected. It found no functional rail, deck, filter, or mesh issue. Image fidelity and browser behavior were checked separately by the implementer.

## Review Artifacts

Local, ignored `.qa/compact-projects/` contains `layout-checks.json`, `asset-validation.json`, `asset-transformations.json`, desktop/mobile Projects screenshots in both themes, globe frames, and three image comparisons. These artifacts are intentionally not part of the published site. The source photo and unchanged sanitized mobile originals remain there for review.

## Limits

No deployment or additional contact submission was performed. Physical touch devices, other browser engines, screen readers, fresh résumé print pagination, real-user performance, and authenticated GitHub calendar access were not verified in this change. Existing print rules were retained. The Home image is a presentation recreation; its visible label and source comparison must remain. Final imagery/content approval and the canonical deployment address remain release gates.

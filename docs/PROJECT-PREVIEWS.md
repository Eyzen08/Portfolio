# Larger project previews — 20 October 2026

Implements the approved Projects-page plan: two large cards, responsive layout, and native expanded screenshot viewers. This supersedes the Projects rail described in earlier compact-preview records.

## Changes

- Projects uses the full container width, two columns at 900px and above, and one column below. A shorter heading and aligned search/category toolbar bring the work closer to the top.
- Each card shows its project role, description, verified technology tags, an explicit Preview Screenshots action, and the existing case-study destination. The screenshot itself opens the viewer, with a visible Expand preview cue. A single matching project occupies the full grid; no matches show the existing reset state.
- Each project has a native dialog generated from the existing sanitized screenshot records. It opens on the card's current frame and provides manual Previous/Next, thumbnail selection, arrow-key navigation, screen count/title, provenance, full-image access, and original-capture links where available.
- Native dialog behavior excludes background page controls and supports Escape. Closing restores focus to the opening control and restores background scrolling. An explicit preview flag keeps the originating deck paused even when focus moves to browser controls; normal hover/focus/visibility rules apply after closing.
- Preserved existing card autoplay, project order, all screenshots/redactions, responsive source images, Home/case-study decks, genuine links, search semantics, themes, API contracts, release gates, and dependencies. Viewer images have no added decorative device frames; original screenshot hardware remains part of supplied captures.
- Removed the unused rail renderer, styles, initializer, and rail-specific tests. Reused the shared compact image renderer and deck controller. No JSON schema, project content, public API, or package changes.

## Verification

- New markup/viewer/filter tests were observed failing before implementation, then passing. An additional deck regression was observed failing before the explicit modal pause fix, then passing.
- Full suite: **53/53 tests pass** with authorized loopback access for the local preview-server test. `npm run build` generates ten pages and a 404 page. No standalone lint or TypeScript script exists.
- Browser: **36 Projects/grid/viewer checks** across 360, 390, 768, 1024, 1366, and 1440px in both themes. No document/dialog horizontal overflow; correct column count, in-viewport dialog/close button, scroll lock, and originating-card pause state.
- Browser: **12 Home/case-study regression checks** at 390/1440px in both themes, without overflow or missing page headings/decks.
- Exercised all six STI and all four Kwiztorya screenshots, thumbnail selection, both arrow keys, navigation wrapping, real Escape handling, focus restoration, single-result expansion, search/category combinations, no-result/reset behavior, and image provenance. Native Tab traverses modal controls without selecting background page controls; normal browser chrome remains reachable.
- No-JavaScript/unsupported-dialog fallback is covered by generated image-link assertions and the unsupported-dialog fixture. Browser JavaScript was not disabled globally. Independent read-only review found no actionable issues; targeted follow-up pause/viewer tests pass 6/6.
- Ignored `.qa/project-preview/` holds test output, responsive/regression measurements, and selected screenshots.

## Limits and release

No new image assets, custom zoom, homepage redesign, real form submission, physical-device checks, or deployment. Existing owner-approved autoplay outside the manual viewer retains its known reduced-motion accessibility limitation. Publication still requires owner-approved content/imagery and a real `SITE_URL`; approval flags and deployment configuration are unchanged.

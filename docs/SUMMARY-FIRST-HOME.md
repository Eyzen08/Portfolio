# Summary-first Home — 21 October 2026

Implements the owner-approved plan inspired by https://www.pszostak.pl/ and the supplied reference screenshots. The existing vanilla HTML/CSS/JavaScript application remains in the current `codex/portfolio-studio` checkout, preserving the pre-existing uncommitted work.

## Changes

- Replaced the project-first introduction with the identity/background/About/portrait/location/Craft grid. Reused the existing portrait, background deck, map, and moving technology strip once each. Professional copy stays sourced from the profile; hobbies remain excluded.
- Made STI Vio-Log and Kwiztorya equal-width Home features, stacked below 768px. Retained screenshot controls, source/case-study/live destinations, redactions, provenance, and original-image links.
- Kept natural scrolling, with Home header anchors and dedicated-page navigation elsewhere. Footer routes remain intact. Reduced motion disables smooth anchor scrolling. Immediate mobile-menu closing prevents anchor displacement; without JavaScript, the expanded mobile header scrolls away normally.
- Kept Skills → AI Tools → Training → Education/Experience → Activity → Contact below Projects. Removed duplicate lower overview components. Preserved the existing background and screenshot animation controllers and their lifecycle behavior.
- Scoped the dotted background and overview styles to Home. Fixed map-status positioning so loading and error messages remain within the map rather than overlapping its caption.
- Added no dependencies, APIs, data fields, hosting changes, or public deployment. The supplied résumé PDF and existing release gates remain unchanged.

## Verification

- New overview/navigation tests failed before implementation and passed afterward. Existing tests were updated only where they asserted the superseded layout, headings, or Home destinations.
- `npm test`: **57/57 pass**, with authorized loopback access for the local-server test. The initial sandbox-only baseline was 54/55 because loopback connections were denied.
- `npm run build`: **10 pages plus 404** generated as a noindex draft.
- Browser matrix: Home at 390×844, 768×1024, 1024×900, 1440×900, and 1440×640 in both themes; eight dedicated pages at 390/1440px, for 26 responsive cases. No document overflow, overlapping overview tiles, or overflowing feature containers. Desktop projects have equal dimensions; the complete overview cards fit the 1440×900 opening view.
- Interaction checks cover Home anchors below the sticky header, mobile-menu close/Escape/focus return, visible keyboard focus, theme switching, screenshot selection, reduced-motion scrolling, map failure fallback, and JavaScript-disabled content and navigation. Existing unit checks cover map theme updates and animation lifecycle boundaries.
- Browser artifacts and the verification script are in ignored `.qa/summary/` and `.qa/check-summary.mjs`. Layout checks avoid repeatedly polling the unchanged GitHub endpoint. No contact inquiry was submitted.

## Limits

No deployment, production performance measurement, physical-device test, or new live GitHub/contact delivery check was performed. Existing owner-selected autoplay still runs on Home with reduced motion; only smooth anchor scrolling changed in this task. Publication still requires the existing owner content/imagery review and canonical origin.

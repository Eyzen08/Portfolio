# Cinematic motion refinement

Keep the current editorial layout, Archivo lettering, monochrome themes, portraits, content and routes. The owner selected a motion upgrade over a composition redesign and requested full motion regardless of the OS preference. Existing certificate redaction and static-only previews take precedence over the guide's older original-document instructions.

The focal sequence reveals the outlined first name, brings the portrait through the solid surname, then settles the introduction and actions. Supporting interactions use selective card depth, neutral cursor light and short grouped entrances. Forms, maps and long reading surfaces stay stable.

Implementation: extend the existing native motion controller and stylesheet; no dependencies. Test nearest-card targeting, bounded tilt, cached geometry, frame batching, reset/cleanup and an explicit saved Full/Reduced motion switch. Integrate that switch with existing globe/deck autoplay and About crossfades. Use additive WAAPI entrances so pointer transforms and screenshot zoom remain independent.

Verify all routes, both themes and 360/390/768/1024/1366/1440px viewports, pointer/touch/keyboard, no-script fallbacks and project viewers. Run tests, draft/release builds and whitespace checks. Deliver local desktop/mobile previews and a short interaction recording. Publishing requires subsequent explicit owner approval.

## Shipped behavior

- Hero: masked letters start at 180ms with 22ms spacing; portrait rises 48px and settles from 96% scale over 950ms after 400ms. Copy/actions follow at 680ms, socials at 800ms. The initial sequence completes in roughly 1.5 seconds. Fine-pointer name/portrait parallax is bounded to 6px/10px.
- Project covers, related-project tiles, skill cards, picture stages and collaboration cards: 8px lift, 1.015 scale, 1100px perspective and tilt bounded to 4°/5°. Certificates and the About portrait use half-strength tilt, 6px lift and 1.008 scale. Other panels lift 6px; forms and maps retain their position.
- Cursor light: 160px radius, 14% white in dark mode and 6% black in light mode. Closest-card targeting, cached entry geometry, one update per frame, 260ms arrival and 400ms return. Primary hero/header/footer links move at most 3px toward the pointer.
- Scroll entrances rise 20px over 650ms, with sibling delays capped at 210ms. Thin scroll progress, ghost heading drift, existing disclosures and project dialogs share the same native motion infrastructure.
- The footer button persists `ej-motion` independently of theme. Full ignores the OS motion preference as requested. Reduced immediately cancels entrances, pointer depth and decorative loops; manual gallery/photo controls, focus and all content remain available.

## Verification — 27 October 2026

109 tests pass. Draft and release builds pass; `git diff --check` is clean. Browser checks cover 120 route/theme/viewport combinations plus 12 footer/navigation/theme cases including 320px. Additional checks cover 404, project dialogs, form input without submission, touch/keyboard photo swapping, motion persistence, pointer cleanup and no-JavaScript readability. The motion stylesheet detector reports no findings; code review found no important issues.

Ignored `.qa/motion-upgrade/` contains reports, screenshots and `motion-preview.webm`. Implementation verification was local; the owner subsequently approved pushing to main and deploying. No live inquiry or physical-device performance test was performed.

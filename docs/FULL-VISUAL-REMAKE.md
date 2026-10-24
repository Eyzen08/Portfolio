# Full visual remake — 19 October 2026

## Delivered

- Shared Inter type, cool light and dark palettes, static original pastel/dot background, updated social preview. Replaced the paper grain and retired its unused font assets.
- Floating photo identity/theme controls, five-section navigation with current-section tracking, Contact. Seven main destinations remain in the mobile menu and footer; all nine routes and legacy homepage anchors remain.
- Centered real introduction with working project/résumé/contact actions; no simulated chat.
- Compact three-column bento on desktop, two-column tablet and logical one-column mobile flow. Actual overlapping Background cards select with pointer, keyboard and taps; Education is initially raised. Five image-backed perspective hobby cards have manual previous/next and a four-second automatic cycle that pauses during interaction.
- Static approved portrait fallback. The multiple-photo gallery controller wraps previous/next, previews on mouse entry and restores the portrait on exit; controls are omitted with one supplied photo. No additional personal images were fabricated.
- Blue/cyan STI stage uses the real sign-in capture. Amber Kwiztorya stage uses all three authentic Android screens, preserving their original interface and footage limitations. Case/source/live actions and curated database-inclusive tags remain separate.
- Native canvas sphere uses unique project-linked technology IDs, a named pointer target. Its always-visible HTML list sits below the sphere and links directly to project evidence. Résumé-only familiarity is excluded. No heavy 3D engine was added.
- Résumé, Training and Links & Contact resource cards, compact genuine GitHub activity and closing contact invitation.
- Existing filters, Kwiztorya case preview, Formspree endpoint and field names, GitHub interface/env names, résumé PDF fingerprint and factual copy retained.

## Controls and fallbacks

Home now explicitly animates by default even when `prefers-reduced-motion` is enabled, as selected by EJ. There are no global/sphere pause controls or list/sphere switch. The canvas sphere appears automatically when supported, with its HTML evidence list always visible below. With no JavaScript or no canvas context, the list remains available and the hidden canvas presentation leaves no empty area.

The hobby deck cycles every four seconds with 450ms transitions, pausing during hover/focus and resuming afterward. The sphere rotates once per 52 seconds. The Craft strip loops in one direction over two equal-width groups; its second group is aria-hidden, contains no links, and is hidden before enhancement. Keyboard focus pauses the strip. Continuous effects stop offscreen and while the document is hidden; resuming resets the frame timestamp without accumulating hidden time. The 550ms entrance and project tilt remain enabled on Home. Reduced-motion behavior on other pages is unchanged.

The source-reviewed SharedPreferences/SQLite distinction is preserved in the Kwiztorya case study. The unchanged supplied PDF's broader SQLite wording remains a content-review item.

## Verification

- Complete Node suite after the default-motion update: 34 tests passing; draft build generates nine pages and 404. Tests include PDF SHA-256 fidelity, local asset destinations, factual content, no-JS markup, independent previews, gallery wrapping/reset, deck offsets, motion lifecycle conditions, sphere projection, current-section selection and reduced-motion toggle state.
- Browser layout matrix: nine routes × eight widths (320,360,390,768,1024,1366,1440,1920) × both themes = 144 checks, no document overflow, offscreen main cards or failed completed images. Raw record: ignored `.qa/remake/responsive.json`. After the final spacing adjustment, Home was rechecked at all 16 width/theme combinations; no overflow and 12px portrait/location gaps (17px at 1024px because of the scrollbar). Record: `.qa/remake/final-home-checks.json`.
- Browser keyboard checks: all three Background selections, all five hobby selections and independent state; mobile menu exposes all seven pages; Escape closes and returns focus; Kwiztorya Story Mode switches image/explanation correctly. New theme persists across navigation. Mobile project filtering returned Kwiztorya only, unmatched search showed the empty state, and Clear filters restored both projects.
- A separate reviewer found wide-screen section tracking and initial reduced-motion toggle-state defects. Both were fixed with a failing regression followed by a passing run. Actual wide-screen navigation now settles on Projects/Skills. That earlier list-mode behavior has been superseded by the explicit default-motion update below. No console errors in the checked Home state.
- Token contrast: muted text/card 5.26:1 light and 8.90:1 dark; accent/card 5.06:1 and 7.71:1; field boundaries 3.55:1 and 4.41:1. These checks do not constitute a full accessibility audit.
- No further contact inquiry was sent; earlier inbox confirmation remains authoritative. Anonymous GitHub data rendered; server tests retain stale/rate-limit/upstream failures. Live authenticated calendar remains dependent on GITHUB_TOKEN.
- Print rules still remove navigation, texture, card borders/background/shadows and arrange résumé content in one column; actual printed pagination was not measured.

## Screenshots and visual comparison

Desktop/mobile viewport images in both themes are saved under ignored `.qa/remake/`: `desktop-light.png`, `desktop-dark.png`, `mobile-light.png`, `mobile-dark.png`. The visible bento, raised cards, image deck, staged project frames, sphere, resources and floating header were compared against the supplied recording and live reference. EJ's content determines natural heights: cards are intentionally taller where needed to keep his facts readable. The reference's personal imagery, achievements, chatbot, guestbook and gated source widget were not copied.

## Launch and limitations

Run `npm run dev` for the local preview and `npm test` / `npm run build` to validate. `npm run build:release` still requires owner-approved content/imagery and SITE_URL. Environment names remain SITE_URL, GITHUB_TOKEN, and optional local PORT. Existing README deployment/rollback instructions apply; no deployment occurred.

Additional 2–4 approved personal photos are still needed for a meaningful multi-photo gallery. Publisher artwork provenance is recorded in assets/ASSETS.md and visible credits; final imagery/rights selection requires owner review. No physical-device/screen-reader audit, production Core Web Vitals, full cross-browser measurement or print-export validation is claimed. A full-page browser screenshot timed out; viewport screenshots are provided instead. Home deliberately overrides the system reduced-motion preference; this reduces motion accessibility, as noted in the approved plan.

No dependencies, API changes, new services, chat endpoint, accounts, booking or deployment were introduced.

## Default-motion update verification

- Three timed browser observations showed different automatic hobby selections: Valorant, Mobile Legends, and Naruto. The strip was running with changing transforms throughout. Both strip groups measured exactly 586px, totaling 1172px, matching the -50% seamless loop.
- The browser reported reduced motion as true, while Home still showed 450ms hobby transitions, running strip animation and the visible sphere. No pause/view controls were present.
- Hobby hover held the selected card across a timed wait; Enter advanced it manually; keyboard focus held that selection across another wait. Leaving interaction resumes in the controller test.
- Two sphere screenshots taken several seconds apart differed in 29,522 canvas-area pixels (8.87%), confirming movement, rather than inferring it from markup. No console errors were captured.
- All 16 Home width/theme combinations passed: sphere visible, list visible and below it, no horizontal overflow, no failed completed images, and no pause/view buttons. Records and screenshots: ignored `.qa/default-motion/`.
- The new controller test executes initHome with reduced motion requested, both working and unavailable canvas, two automatic hobby changes, hover/focus/manual navigation, offscreen suspension and hidden-tab suspension/resume without accumulated time. No-JavaScript content and duplicate-logo keyboard/announcement exclusions are checked in generated HTML.
- Shared project filters and Kwiztorya preview remain covered by the full suite; browser smoke checks were repeated. The final read-only review reported no actionable findings.


## 20 October 2026 project picture decks

See [PROJECT-PICTURE-DECKS.md](PROJECT-PICTURE-DECKS.md) for the current shared picture presentation, accepted enhanced images, sanitized STI captures, Background autoplay, verification and remaining limits. This supersedes earlier descriptions of static Background highlights and the combined three-phone showcase.

# Animated project picture decks — 20 October 2026

**Overview layout superseded:** Home and Projects now use the minimal horizontal row described in [Compact Projects and Globe](COMPACT-PROJECTS-GLOBE.md). Full layered decks remain in the case studies; Kwiztorya now starts with a fourth, explicitly recreated Home preview. Earlier verification below describes the prior deck layout.

Home, Projects and both case studies now use the same screenshot deck. Each has one active screenshot, offset neighboring previews, previous/next buttons, labeled selectors, a current count, and coordinated explanations and captions. Full-image links remain separate from case-study/source/live destinations. STI retains its blue/cyan stage and Kwiztorya its amber/orange stage.

## Implementation

- `scripts/templates.mjs`: one shared renderer, responsive image sources, reserved dimensions and complete static figures. The combined three-phone presentation and the old generic workflow controller were retired.
- `assets/decks.js`: independent four-second timers, manual wrapping/reset, interaction pauses and visibility lifecycle suspension. Returning from an offscreen or hidden state starts a fresh interval; elapsed hidden time is discarded.
- `assets/site.css`: 450ms picture transitions, contained screenshots, naturally wrapping controls and stable caption space measured at the current width. Existing device frames in the two STI mobile captures are preserved without another frame.
- Background starts with Education, followed by Project leadership and Training every four seconds. Its papers use 220ms transitions. Persistent selectors below the papers remain reachable during movement; hover/focus/click selection is preserved. Paper hover responds to actual pointer movement, avoiding selection loops caused by cards moving under a stationary pointer.
- The approved default-motion override applies to these decks on all four page contexts. Other detailed-page motion preferences remain unchanged. No pause/view controls were restored. Hobby cycling, the sphere/list, themes, routes, APIs, credentials, contact delivery and the supplied PDF are unchanged.

## Images and fidelity

The six new STI inputs are Dashboard, QR attendance, Student portal, Mobile navigation, Landing page and Sign-in. Dashboard is first. Names, IDs, account initials and populated credential/account areas are covered in the published derivatives. The unchanged PNG originals are outside the published asset tree. Counts in screenshots are not presented as project adoption or measured outcomes.

The built-in **imagegen** tool enhanced Quiz, Era selection and Story Mode separately. Originals remain unchanged. Accepted masters are saved as `assets/projects/kwiztorya-{quiz,eras,story}-enhanced.webp`, with separate `-enhanced-small.webp` variants. Each accepted image is captioned **Enhanced from the recorded device demo.** Full provenance, hashes, dimensions, masks and encoding are recorded in [ASSETS.md](../assets/ASSETS.md).

Core enhancement instructions supplied: improve sharpness, contrast, uneven lighting and compression at approximately twice the source resolution; preserve the aspect ratio, readable text, original palette, controls, layout and progress states; do not redesign the interface or fix placeholder strings. Quiz option B was corrected to preserve its existing wrapped `Pagdadamay` / `an` text. Story Mode retains `%1$d Story Chapters` and `%1$d-%2$d min`. An altered Era description was rejected and corrected. The exact final correction prompt is recorded below.

Restoration improves legibility but changes edge/typographic rendering and illumination. It cannot establish missing original detail. Source captures remain the authority and are linked separately.

## Verification

- Complete Node suite: 36 passing checks. Draft build generates nine routes and 404. Existing PDF fingerprint, local links, filtering, theme, release gates, preview-server and GitHub failure checks remain passing.
- New controller tests exercise independent 6/3-image decks, Background, manual selection/wrapping, interval reset, hover/focus pauses and hidden/offscreen suspension. External Background hover/focus controls are also covered.
- Browser matrix: nine routes × eight widths (320, 360, 390, 768, 1024, 1366, 1440, 1920) × both themes = 144 checks, with no document overflow. On deck pages, controls remain within the viewport and selected captions fit.
- Every project image was selected at 320px and 1440px: 18 checks confirmed intrinsic proportions and stage fit, with no accidental route navigation or horizontal overflow. Enter/Space operate the arrows. Mobile/empty/reset project filtering returned 1/0/2 projects; the mobile menu retains all seven links, and Escape closes it and restores focus. The checked browser state reported no console errors.
- All three Background selections across eight widths and both themes: 48 checks confirmed the expected selection, focused control, fitting content and no horizontal overflow.
- Actual browser observation with reduced motion enabled: STI advanced 1 → 2 → 3; Background advanced Project leadership → Training → Education. No click was needed to enable motion. Hover/focus and hidden/offscreen lifecycle conditions also have deterministic controller coverage.
- Script-free rendered fixtures: all 9/9 Home and Projects captions, 6/6 STI captions and 3/3 Kwiztorya captions remained visible in document flow at 320px and 1440px. The temporary fixture files were removed afterward.
- STI originals retain their recorded SHA-256 values. Mask interiors were checked for uniform coverage, and full-resolution public derivatives were visually inspected. Quiz, Era selection and Story Mode were compared side by side with their originals, including labels, choices, locks, counts and placeholder strings.
- A fresh reviewer identified moving Background click/hover targets. Persistent selectors and pointer-movement selection resolved the issue; follow-up review found no important remaining findings.

Evidence is stored locally under ignored `.qa/picture-decks/`: `responsive.json`, `manual-images.json`, `background-states.json`, `nojs.json`, eight `sti-`/`kwiz-` desktop/mobile screenshots in both themes, and `comparison-{quiz,eras,story}.jpg`.

## Limits

No deployment, dependency, new service, fabricated screen or additional contact inquiry. Browser tests used the in-app Chromium surface; physical touch devices, other engines, screen-reader output, actual hidden-tab UI behavior, print pagination and production performance were not independently measured this pass. Résumé print CSS and integrations were preserved; tests verify their existing contracts. The explicit motion override and removed pause controls retain the previously accepted accessibility tradeoff. Final owner content/imagery approval and canonical `SITE_URL` remain release gates.

## Exact final Era correction prompt

> Edit the FIRST image, an enhanced Kwiztorya screenshot. The SECOND image is the unchanged recorded screenshot, the authority for all content. Make exactly ONE correction: in the bottom Modern Era card, change the sentence to exactly 'Post-war Philippines to contemporary times'. The previous edit incorrectly changed Philippines to Republic. Preserve all other words, numbers, layout, control positions, colors, icons, available/locked states, and aspect ratio. The Modern Era count is '0 Questions'; do not change it. Other four counts are '6 Questions'. Keep the image sharp. No redesign, no invented details, no added controls. Only replace Republic with Philippines in this existing description, preserving its line spacing.

## Screenshot and comparison files

| Project | Desktop light | Desktop dark | Mobile light | Mobile dark |
|---|---|---|---|---|
| STI Vio-Log | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/sti-desktop-light.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/sti-desktop-dark.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/sti-mobile-light.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/sti-mobile-dark.png>) |
| Kwiztorya | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/kwiz-desktop-light.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/kwiz-desktop-dark.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/kwiz-mobile-light.png>) | [Open](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/kwiz-mobile-dark.png>) |

Enhancement comparisons: [Quiz](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/comparison-quiz.jpg>), [Eras](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/comparison-eras.jpg>), [Story](<C:/Users/Ezian/OneDrive/Documents/ChatGPT/Portfolio/.qa/picture-decks/comparison-story.jpg>).

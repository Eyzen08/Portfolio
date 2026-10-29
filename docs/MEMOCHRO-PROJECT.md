# MemoChro portfolio addition

Added on 29 October 2026 (Asia/Manila).

## Presentation

- Project order: STI Vio-Log, Toyota Heritage PH, MemoChro, Kwiztorya. STI Vio-Log retains the Featured badge.
- MemoChro uses the existing card and shared preview, with **Personal project** as its context and status. Its View Project action opens `/projects/memochro/`; clicking the artwork opens the preview.
- The case study contains the seven requested narrative sections, an improved 3D device mockup with the real screens, and public/fictional desktop, tablet, and phone screenshots.
- The original mockup is unchanged: SHA-256 `2f013ef3d2e156fa9496049aee79e512bda3cc5b99cea6003c8d90aefdc2dc1d`. The separate WebP thumbnail is 960 × 540.

## Data and rendering

- `viewProjectUrl` optionally overrides a card's View Project destination without changing its image-preview behavior.
- Case study sections optionally accept `images` (`src`, positive integer `width` and `height`, `alt`, `caption`, and display `kind`) and `links` (`href`, `label`). Section content is escaped when rendered.
- Builds require existing local project images with dimensions, alt text, and captions, and HTTPS section links without embedded credentials. Case study screenshots retain their natural proportions rather than using the card's 16:9 crop.
- Technology evidence connects MemoChro to Next.js, React, TypeScript, CSS, Supabase, PostgreSQL, Sharp, Playwright, and Vercel. Sharp and Playwright reuse the existing generic code icon; the Next.js icon comes from the Devicon collection under the existing bundled MIT license.

## Verification

- The new project tests were first run against the original data and failed because MemoChro was absent.
- `npm test`: 135 tests pass. Coverage includes the original mockup hash, new artwork paths and dimensions, card destinations, section screenshots, fictional sample link, project ordering, architecture, generated local links, horizontal recommendations, wheel scrolling and boundaries, arrow controls and motion preferences, focus handling, and track reset.
- `npm run build`: succeeds with 12 pages and a 404 page.
- Browser review: Home, Projects, and MemoChro case study at 390, 820, and 1440 pixels wide, each in light and dark themes; no horizontal page overflow. Case study screenshots load and keep their natural proportions.
- Shared MemoChro preview at all three widths and both themes: correct panel, 16:9 framing, no horizontal overflow, initial focus inside the dialog, Shift+Tab containment, Escape dismissal, and restored opener focus.
- The contributions disclosure opens and closes with Enter. View Project navigates to the case study. Phone card text and case study artwork were visually reviewed.
- Source opens the public GitHub repository. Live Site opens the public landing page. `/demo` redirects to the fictional sample archive at `/demo/home`.
- Source images were visually inspected: public landing content and explicitly labeled fictional, read-only sample content, with licensed sample photographs.

## Evidence boundaries

MemoChro application test claims come from its existing testing documentation; those application suites were not rerun for the portfolio. The live landing page and sample archive were verified publicly accessible despite older documentation describing a protected preview. Production email delivery and remaining application launch checks are still described as outstanding. No user counts, measured performance gains, or impact metrics are claimed.

This change does not deploy the portfolio or modify the MemoChro application.

## 3D mockup and horizontal recommendations revision

- Replaced the active presentation with `memochro-featured-v2.png` and its 960-pixel WebP thumbnail. The supplied master remains unchanged. The generated blank-device scene and full ImageGen prompt are kept under `design/project-showcase/`; the offline compositor is `scripts/render-memochro-mockup.py`.
- The compositor fits each real capture without stretching, then maps it into its device screen. Masks preserve the generated bezels, corners, and camera cutout. The real source captures and other project artwork remain unchanged.
- Every dialog's More Work section now has a single horizontal track: two visible cards at desktop widths and an 82%-width card on phones, leaving a glimpse of the next. A native scrollbar, scroll hint, named focusable region, and native horizontal keyboard scrolling make the additional cards discoverable.
- Arrow keys on the track are not consumed by gallery navigation. The dialog's focus handling includes the track, and switching/reopening resets the active track to zero.
- Browser confirmation: 36 checks, no failures. All four projects at 390, 820, and 1440 pixels in both themes retain a single recommendation row, with overflow contained inside the track and an initial offset of zero. Keyboard focus reaches the last recommendation, Enter switches projects, and Escape restores the original opener. Home and MemoChro case study use the new artwork and have no horizontal page overflow at all three sizes in both themes.
- Manual visual review covered the final artwork, screen edge fitting, desktop preview, and phone recommendation row. Native touch scrolling is provided by browser overflow; physical touchscreen testing was not performed.
- A separate read-only code review found no actionable issues. The design detector reported existing typography conventions; the scoped revision preserves those conventions.

## Full-width and mouse-wheel revision

- The recommendation track now fills the dialog's available content width, superseding the earlier two-card-width limit. Desktop still shows two large cards; phone cards retain the 82% width and next-card glimpse.
- A non-passive wheel listener on each track translates vertical wheel input to horizontal movement. Pixel inputs retain their precision, line inputs use 16 pixels per line, and page inputs use the track's width. Horizontal-dominant gestures, Ctrl/Meta/Shift modifiers, and noncancelable events retain native browser behavior.
- Input is consumed only when the row can move in that direction. A one-pixel boundary tolerance handles fractional scroll positions under browser zoom; at either edge normal vertical dialog scrolling resumes. Scroll snapping is removed so small movements remain responsive.
- The hint reads “Use your mouse wheel or swipe to explore.” The visible native scrollbar, keyboard region, links, focus handling, and track reset remain available.
- Final browser confirmation passed 24 combinations: all four previews at 390, 820, and 1440 pixels in both themes. Every track fills the available width, remains one layout row, contains overflow, and responds to actual downward/upward mouse-wheel input while preserving vertical dialog position. Layout alignment is measured before pointer tilt transforms; wheel input is placed over the visible center of a card.
- At the first-card boundary, an actual upward wheel resumed vertical scrolling (`dialog.scrollTop` changed from 64 to 0 while the track stayed at 0). The last recommendation remains reachable; Enter switches projects with track offset zero, and Escape restores the external opener.
- Physical touchscreens were not tested; touch swiping remains native browser overflow behavior. No assets, project copy, destinations, or deployment configuration changed in this revision.

## Side arrow controls revision

- Every More Work row now has 44px circular SVG chevrons over its left and right edges. They retain the full-width track, use the existing palette and focus styling, and do not overlap project titles.
- Previous projects and Next projects buttons reference their unique scrolling region through `aria-controls`. Unavailable directions use `aria-disabled`, remain focusable, and ignore activation without moving focus. Both controls hide if the track has no overflow; if a focused control must hide, focus transfers to the track.
- Each click scrolls one card plus the actual column gap, measured from adjacent card offsets. Movement is smooth normally and instant when the existing motion preference is reduced.
- Scroll events and ResizeObserver keep state current. Opening and switching projects reset the track and synchronously refresh control state, including formerly hidden panels. Native wheel, scrollbar, touch, and keyboard behavior remain available.
- The hint now reads “Use the arrows, mouse wheel, or swipe to explore.”
- Verification: 135 tests pass and the build succeeds. Four added tests cover card-sized movement, endpoint no-ops and focus retention, fractional boundary states, resizing/no-overflow, project switching/reopening, and reduced motion.
- Browser checks passed 24 project/width/theme combinations: every preview at 390, 820, and 1440 pixels in both themes. Controls remain visible, have 44px CSS targets, leave titles unobscured, preserve contained overflow, start with the correct direction states, move the expected card distance on a mouse click, and return with Space. Native Enter, Tab wrapping, Shift+Tab, Escape, and opener focus restoration were also verified. Resizing preserves correct boundary states. Normal smooth scrolling and immediate reduced-motion movement were checked; the temporary motion preference was restored.
- A separate read-only review found no actionable issues. No deployment was performed.

# Reference recreation — 26 October 2026

This pass supersedes the earlier sage/arched-photo redesign. The user explicitly requested close visual recreation and supplied a transparent formal portrait. Keep the résumé corrections and all existing application routes, assets and integrations. The starting working tree contains the prior redesign; preserve those changes except where the new visual brief supersedes them. Before editing, copies of its templates and stylesheet were saved in ignored `.qa/fidelity/`.

## Observed reference specification

Reference: https://jtenajuraportfolio.com/, inspected in Chrome. Hero screenshots saved at 1440, 1366, 1024, 768, 390 and 360 CSS pixels. Public rendered styles confirm Archivo at 115% stretch for display text and Inter for body text. The reference's public stylesheet was read for verification, not incorporated as application source.

| Element | Desktop | Tablet / mobile |
|---|---|---|
| Content | 1216px inner width, centered, about 107px inset at 1440 | 16px mobile gutters |
| Header | About 70px, logo and availability left, five navigation destinations centered, theme and contact action right | Compact availability, theme and hamburger |
| Hero | Two centered uppercase name lines, first outlined; 152px, 900 weight, .94 line height, -.03em tracking | 99.84px at 768; 51.48px at 390; 47.52px at 360 |
| Portrait | Centered cutout, roughly 446×630, overlaps the second name line; lower edge fades into page | About 227×321 at 390/360; 293×414 at 768 |
| Hero copy | Bottom-left, about 352px wide; 23.2px display role, 14px supporting text; white capsule CTA | Centered copy below the portrait; social capsules form two columns |
| Sections | 128px vertical padding, 82.4px slash-prefixed headings over large faint outlined words | 96px / 61.44px at 768; 56px / 37.05px at 390 |
| About | Journey and expertise left; narrower education timeline and image right, separated by a vertical rule | Single column |
| Skills | Moving technology strip followed by nine expandable folders; expanded folder wide, inactive labels vertical | Stacked expandable folders |
| Projects | Image left about 52%, copy right about 46%, subtle row separators, small category and technology pills, project action | Stacked imagery and text |
| Experience | Rounded inset panel, numbered rows, institution/role left and date/plus right, expandable details | Wrapped readable rows |
| Certificates | Horizontal image cards, about four visible, rounded dark surfaces and labels | Scrollable cards |
| Contact | Large Next Step heading, three numbered cards, then direct-contact/form columns | Single-column form and contacts |
| Footer | Identity/intro, explore, contact and connect columns; separate copyright/back-to-top row | Stacked groups |

Reference colors: dark ink `#f2f2f0`, muted `#9a9a96`, paper `#0f0f0f`, surfaces `#1a1a18`, lines `#2a2a28`; light ink `#141414`, paper `#fdfdfc`, muted `#6f6f6f`, lines `#e7e7e4`. Primary actions are monochrome. Green is reserved for the availability dot. Keep hover/focus feedback and native scrolling, and respect reduced-motion preferences.

## Implementation plan and scope

Replace the prior recreation stylesheet rather than accumulate a third override layer. Recompose Home to Hero → About/Education → Tech Stack → Projects → Experience → Certificates → AI Workflow → GitHub → Contact → Footer. Use truthful student/project context instead of the reference's commercial metrics, services, awards and testimonials. Reuse native details for folders and experience, existing screenshot dialogs/decks, contact validation, theme preferences, map and GitHub data. Keep the detailed routes and use the same global display typography, colors, controls and headings there.

Use the supplied formal PNG unchanged in the hero. Preserve the casual portrait and its sources on About. Self-host the official open-source Archivo variable font with its OFL license. No new runtime dependencies or deployment configuration changes are needed.

Verify updated layout/content contracts and reduced-motion behavior, build production output, inspect both themes and all six viewports, compare saved screenshots, and test navigation, folders, disclosures, dialogs, filters, contact validation, résumé and GitHub. Do not send a real inquiry or deploy as part of this visual implementation.

## Completed implementation and comparisons

The reference layout was implemented in the existing static generator and shared stylesheet. No second application, framework migration or runtime package was introduced. The formal portrait is byte-identical to the owner's supplied transparent PNG. Native disclosures provide exclusive skill folders and experience rows; existing project controllers provide manual viewers and four-second decorative deck cycling. Reduced-motion preferences now stop decorative timers, including when the preference changes during a visit. The fixed header overlays the hero and preserves the reference's navigation behavior.

Six matching-width hero screenshots were saved for each site under ignored `.qa/fidelity/`. The browser capture included unused compositor margins on the local site; these margins were cropped to the measured CSS viewport for comparison, without altering page content. `hero-comparison-desktop.png` and `hero-comparison-mobile.png` show the reference and implementation side by side. Both were visually inspected. Large initial differences corrected during comparison included the prior sage palette and arched portrait, wrong display font, page composition, mobile name wrapping, header presentation and an offscreen certificate accessibility label causing document overflow. The final monochrome social SVG/PNG also uses the supplied formal photograph.

Desktop hero height is 1047px, matching the reference's approximately 1047px stage plus facts. The mobile implementation is about 878px at 390 and 882px at 360, compared with about 858px and 850px in the reference. Extra truthful positioning and actions account for this difference. The longer first name uses a smaller outlined line on phones; the second line follows the reference's 13.2vw sizing. Photograph proportions, real content length, student experience and actual certificate availability necessarily differ. Commercial metrics, services, awards and testimonials were replaced with truthful student/project information or omitted. Pixel-perfect identity with the source is not claimed.

## Verification results

- `npm test`: 65 passing, zero failing. Coverage includes all local links/routes, media integrity, source attribution, résumé fingerprint, disclosures/content, search/filter logic, contact boundaries, GitHub handling, release configuration and reduced-motion timer/manual-control behavior. Existing tests were updated where the old visual layout conflicted with this brief; original factual and functional checks remain.
- `node --check`: all application JavaScript and build scripts parse. This vanilla project defines no separate lint or type-check command.
- `SITE_URL=https://ejmedilo.vercel.app npm run build:release`: passes and produces ten content pages, a 404, canonical URLs, sitemap and existing API-compatible assets. The local preview was returned to its noindex draft build afterward.
- Ten routes × widths 1440, 1366, 1024, 768, 390, 360 × both themes: 120 checks, no document horizontal overflow or failed loaded images. Raw measurements are `responsive-dark.json` and `responsive-light.json` in ignored `.qa/fidelity/`.
- Browser interaction checks: mobile menu opens and closes after selection; section navigation works; exactly one native skill folder opens; experience opens with the complete MIT placement; Home screenshot dialog opens and advances 1/6 → 2/6, fits the phone viewport and closes; project searches return 1 and 0 results and Clear Filters restores 2; empty contact submission focuses the required Name field without sending data; expanded background/map content fits its container. Theme state persists between routes. GitHub displayed current public statistics and contribution data during the check.
- No application errors were recorded. After expanding the map, MapLibre reported an upstream missing `wood-pattern` style image; the map and its full-map fallback remain available. File loading was checked through the rendered image state and the build's complete local-link/media validation. No dedicated request waterfall or production performance audit was run.

No real contact inquiry, commit, push or deployment was performed. Physical devices, other browser engines, screen-reader announcements, fresh print pagination and OS-level reduced-motion emulation were not checked; reduced-motion behavior has deterministic controller tests. Three résumé credentials have no supplied certificate preview and remain clearly labeled as unavailable. External map/GitHub/Formspree availability remains dependent on those services.

## Deploy to existing Vercel project

Review and push this working tree to the repository connected to the existing Vercel project, or deploy through that project's normal workflow. Keep `SITE_URL=https://ejmedilo.vercel.app` (adjust only if the production domain changes) and the existing server-only `GITHUB_TOKEN`. `vercel.json` already uses `npm ci`, `npm run build:release` and `public`; no configuration migration is required. Verify the resulting preview and promote through the existing deployment workflow. Previously recorded content/contact approval flags were preserved.


## Globe restoration — 26 October 2026

At the owner's request, the nine folder panels were replaced with the former canvas globe beside a complete grouped skill list. The current heading, moving strip, section anchor and monochrome page style remain. Twenty-seven project-backed entries populate the original wireframe/52-second rotation; all 36 current technical skills and five AI tools remain in nine readable groups, including separately labeled familiar languages. Existing project, résumé, full-stack evidence and AI workflow links remain.

At 1024px and above the layout uses two equal columns; the globe stays within view while reading the longer list. Below 1024px it stacks above the list. Without scripts or canvas, the globe wrapper stays hidden and the list occupies the whole width. The original geometry, hover-name detection and local icon assets are reused. No dependency, API or deployment setting changed. A theme-attribute observer redraws a static globe under reduced motion. The animation observer now follows the globe presentation rather than the whole section, avoiding continued rotation when only the long skill list is visible.

Verification: all 66 tests pass, including geometry, movement, hover/reset, null-canvas fallback, reduced-motion changes, theme repaint without animation, hidden-tab suspension and the newly caught offscreen-globe/visible-list regression. Browser checks at 1440, 1024, 768, 390 and 360px in both themes found the expected column layout, all nine groups, working local logos and no horizontal page overflow. Two script-free fixtures at 1440/360px confirmed zero scripts, a hidden globe and a full-width skill list. The fixture was removed by the final rebuild. The checked browser warning/error log was empty. Responsive measurements and desktop/mobile screenshots are in ignored `.qa/fidelity/globe-*` files. The production build passes. No deployment or physical-device testing was performed.


## Certificate completion — 26 October 2026

The owner supplied the three previously unavailable originals: Introduction to Modern AI, the TESDA Microsoft Artificial Intelligence Course: Azure AI Fundamentals, and TESDA Fundamentals of Artificial Intelligence. All seven existing records now show full-page authentic previews and link to their unchanged supplied documents on Home and Training. No duplicate records or new achievements were created. The two previously empty issuer fields now accurately name TESDA Online Program. Public asset names omit the email-bearing source filename. Exact original fingerprints and rendering provenance are in `assets/ASSETS.md`.

All 67 tests and the production build pass. Twelve browser checks (Home/Training × 1440/390/360px × both themes) show seven previews, no unavailable placeholders, no failed loaded images and no document overflow. All three new PDF URLs return HTTP 200 and PDF content. This supersedes earlier missing-preview limitations; no deployment or physical-device test was performed.

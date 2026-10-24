# EJ Christian Medilo — Portfolio

A responsive software developer portfolio showcasing practical software systems and web development. Vanilla HTML, CSS, and JavaScript; one native Node build generates eight main pages and two case studies. No chatbot.

Production: [ej-medilo.vercel.app](https://ej-medilo.vercel.app). Vercel project `ej-portfolio` is connected to `Eyzen08/Portfolio`: `main` deploys to production and other branches create previews. Both environments use `SITE_URL=https://ej-medilo.vercel.app`. Node.js 24.x runs `npm ci` and `npm run build:release`, serving `public/` plus the GitHub API function. `GITHUB_TOKEN` is intentionally unset; the contribution calendar can be unavailable.

## Current visual direction

Inter typography, warm-white light surfaces, violet accents, and a near-black dark theme. Home opens directly with a three-column summary grid: identity, background highlights, About/focus, portrait, Taguig map, and Craft with the moving technology strip and contact/résumé actions. Equal-width STI Vio-Log and Kwiztorya features follow, then Skills, AI Tools, Training, Education/Experience, GitHub Activity, and Contact. The grid becomes two columns below 1024px and one below 768px, with natural document scrolling throughout.

On Home, the header links scroll to sections while Resume opens its dedicated page. Other pages retain their existing page navigation; the footer and section links keep all dedicated routes available. Smooth anchor scrolling respects reduced motion. The mobile menu closes immediately so its collapse does not shift an anchor behind the sticky header. See [summary-first Home verification](docs/SUMMARY-FIRST-HOME.md).

Screenshot decks and the moving technology strip retain the owner's explicit autoplay choice, including overriding reduced motion on Home. Offscreen/hidden-tab effects suspend, and decks pause during interaction. This is a known accessibility limitation; full WCAG 2.2 AA compliance is not claimed. Other existing reduced-motion handling remains. No framework, animation library, or dependency was added. See [the current redesign report](docs/EDITORIAL-REDESIGN.md) for scope, checks, and release limits. Earlier dated visual records below describe prior layouts.

Projects now shows both applications in a responsive grid with roles, technology tags, and separate preview/case-study actions. Native screenshot dialogs offer manual browsing, provenance and original-image links; card autoplay pauses while its viewer is open. See [project preview verification](docs/PROJECT-PREVIEWS.md).

The gallery currently uses the supplied portrait only. Add approved records to `profile.gallery` to enable its previous/next controls; keep the portrait first. Each media record needs id, label, description, src, width, height, alt and credit. Original hobby assets and hobbyCards records are retained but are no longer displayed. Keep all media local under assets and original personal files outside output. See [the remake report](docs/FULL-VISUAL-REMAKE.md) for verification and remaining limits.

## Run locally

Requires Node.js 22 or newer. Run `npm ci` once to install the pinned MapLibre dependency used by the interactive map.

    npm run build
    npm test
    npm run dev

Open http://127.0.0.1:4173. Rebuild and reload after editing content or assets; restart after server changes.

The preview is deliberately a noindex draft. The supplied portrait is installed on Home and About, with a matching photo logo. The old root picme.jpg and resume.pdf are preserved as source artifacts and are not copied into public output. The original page is archived in docs/archive/original-index.html.

## Pages

| Route | Content |
| --- | --- |
| / | Summary/About card grid with portrait/map, equal project features, skills/globe, AI tools, training, education/experience, activity, contact |
| /about/ | Professional background, working style, AI-assisted development and learning AI Engineering |
| /projects/ | Searchable responsive project cards with expanded screenshot viewers |
| /projects/sti-vio-log/ | Full-stack capstone case study |
| /projects/kwiztorya/ | Native Android case study |
| /stack/ | Searchable technology with project evidence |
| /activity/ | Public GitHub activity and configured contribution calendar |
| /training/ | Five credentials with four certificate previews linked to the supplied originals |
| /resume/ | HTML résumé, print layout and supplied PDF download |
| /contact/ | Direct email, social links and Formspree inquiry form |

## Editing content

- data/profile.json: public personal details, shared aboutSummary/aiApproach/aiLearning copy, contacts, education, experience, certifications, asset paths, retained hobbyCards/gallery media records and release approvals. Certifications optionally pair a preview record (src, width, height, alt) with documentUrl; both assets must exist under /assets/certifications/.
- data/projects.json: descriptions, contributions, source/live links, case sections, curated cardTechnologies and previewScreens (id, label, src, srcSmall, smallWidth, width, height, kind, deviceFrame, alt, caption, explanation; optional originalSrc/enhanced/presentationLabel).
- data/technologies.json: categories, labels and project relationships. Optional iconId selects an interface symbol; evidenceUrl links résumé-only skills to /resume/#skills instead of implying portfolio usage.
- scripts/templates.mjs: shared layout and page presentation.
- assets/site.css, assets/app.js, assets/decks.js and assets/home.js: shared design, themes, filtering, decks and motion.

Include only verified public facts. Do not commit credentials, private student records or production screenshots containing personal information. EJ confirmed STI as a team capstone with sole system development/full-stack leadership and Kwiztorya as a team project where EJ led development.

Case studies distinguish implementation from measured outcomes. Kwiztorya’s authentic video-derived screens are explicitly labeled. The supplied portrait uses ordinary crops with no reconstructed facial detail. See assets/ASSETS.md for provenance and licenses.

## Launch checklist

The owner approved the current content and imagery for publication on 24 October 2026. The release build still requires a configured canonical origin and verified contact delivery. The supplied résumé PDF is installed unchanged.

1. Review the supplied portrait crops under assets/personal/; portrait in data/profile.json already points to the installed asset. The supplied PDF is already at assets/resume/ej-christian-medilo-resume.pdf; resumePdf points to it.
2. Review personal dates, certificates, social destinations, case wording and project imagery. Set contentApproved true only after owner review.
3. Keep contactVerified true only while the form remains owned, active and delivers to the intended inbox. One inquiry was accepted and EJ confirmed receipt on 13 October 2026.
4. Set SITE_URL to the exact public HTTPS origin, such as the assigned https://project-name.vercel.app. Paths, queries, fragments and credentials are rejected.
5. Configure GITHUB_TOKEN server-side for calendar access. Use an expiring token with necessary public-data access only. Never paste or commit it. Public profile/events work without it.
6. Run npm test and npm run build:release; resolve all release gates.
7. Import into a personal Vercel Hobby project using Other. vercel.json selects public/ and npm run build:release. Configure environment variables in Vercel settings.
8. Verify all preview routes, themes, menu, metadata, GitHub and contact. Promote a reviewed, tested release after the checklist passes.

Vercel Hobby is for personal/noncommercial use. Recruiting is the selected purpose; reassess hosting before converting the site to a commercial service. No paid upgrade or purchased domain is configured.

## Environment

| Variable | Purpose |
| --- | --- |
| SITE_URL | Canonical public origin; required for release |
| GITHUB_TOKEN | Server-only contribution calendar access |
| PORT | Optional local port; default 4173 |

.env.example contains names only. To load a local ignored file:

    node --env-file=.env scripts/dev.mjs

Do not publish environment files or logs containing credentials.

## GitHub and contact limits

GET /api/github is fixed to Eyzen08, validates public data, caches successful responses one hour at the CDN and returns safe errors. No arbitrary proxy. Missing calendar access falls back to the profile without fabricated counts. See docs/github.md.

Local preview has no CDN cache. Repeated visual QA can exhaust the anonymous allowance; the interface then shows direct links. Avoid repeated integration polling.

Formspree xnjekjdq and the public email were confirmed by EJ. Free allows 50 submissions/month. Over-limit submissions may be stored without notification email. Monitor its dashboard and quota notices. A successful response means submitted; inbox receipt was confirmed separately.

## Quality and maintenance

npm test uses Node's test runner, with no dependencies. It covers routes/links, no-chatbot output, old-asset exclusion, release gates/origins, filters/themes, stale data, preview serving and upstream GitHub boundaries.

docs/QA.md records browser checks and limits. Production Core Web Vitals, live authenticated calendar, physical print/device testing and deployed Vercel behavior need independent verification. Do not present performance goals as measured results.

Update source data, rebuild, test, review both themes and deploy the reviewed commit. Roll back through a prior Vercel deployment or Git revision. Keep verified assets and rotate expiring credentials securely.

## Earlier 17 October refinement (superseded visual theme)

Beige paper light mode and warm charcoal dark mode, shared project cards, authentic CSS-framed Kwiztorya previews, grouped skills and a two-column desktop résumé are implemented. Motion follows reduced-motion preferences, including hover transforms. No frontend or animation dependency was added.

The supplied PDF describes SQLite more broadly than the inspected Android source. The case study accurately describes SharedPreferences as active progress storage and SQLite as a helper present in the repository; review that wording before publication.

## Shared cards

All main pages use `.card` and shared CSS variables `--card-padding` / `--card-gap`. `.card--media` removes padding for image-led project previews. Avoid nesting card containers; résumé entries use rows inside section cards. Keep page headings/navigation outside cards and reset card decoration in print styles. No content or integration configuration changed in the 19 October card refinement.

## Interactive bento overview

Home uses a 1120px, three-column bento grid: Identity, Background highlights, Mindset, Portrait, Location and Craft. At tablet widths, Identity/Craft sit beside the portrait; below 768px, source order puts Identity and Craft/actions before the portrait and remaining tiles. The homepage's former About, stack and résumé summary blocks are represented in the grid, with their dedicated routes and familiar anchors retained.

Background now rotates Education → Project leadership → Training every four seconds. Its stable labeled selectors support hover, focus, click, Enter and Space. Compact overview previews and full case-study decks share `assets/decks.js`; each cycles every four seconds with 450ms transitions, pauses during interaction and suspends offscreen/hidden. Overview cards show the first image with neighboring images peeking behind it without JavaScript; case studies show every screenshot and caption in normal flow. The native project row never advances automatically. A 24×12 triangular wire mesh rotates with the verified skill logos; the evidence list remains below it. The hobby deck and Craft marquee retain their existing motion. See [project picture decks](docs/PROJECT-PICTURE-DECKS.md) for assets, verification and limits.

## Compact Projects and Globe

Home and Projects share a 560px horizontal rail with 440px cards, short descriptions, peeking screenshots, native scrolling and snapping, and one case-study link per card. There are no project navigation buttons or page counter. The focusable rail supports keyboard scrolling. A shared device renderer gives STI desktop screenshots monitor bezels and stands and Kwiztorya screenshots slim phone borders across overviews and case studies. STI mobile previews keep their existing device borders. Colored stage backgrounds and preview badges are removed; case-study captions and original-image links retain source attribution. See [implementation and verification](docs/COMPACT-PROJECTS-GLOBE.md).

The desktop navigation pill is centered independently of the name/theme pill. Home and Activity share a blue **Contribution Activity** card with actual last-year totals, square heatmap cells, keyboard scrolling and accessible daily counts. Missing calendar access retains a direct GitHub link without fabricated counts. See [GitHub activity](docs/github.md).

## Live Activity and Background Previews

Local development reuses the existing GitHub CLI sign-in in server memory; authenticated REST and GraphQL requests supply real profile counts, public events and contributions. Both activity panels support Refresh and five-minute updates while visible. Production still requires a server-side `GITHUB_TOKEN`.

The Taguig location card is an interactive MapLibre 6.15.0 map using OpenFreeMap Positron/Dark styles. It loads near the viewport, follows the site theme without replacing the map instance, and retains a full-map link if loading fails. Zoom buttons, pan and keyboard interaction are enabled; scroll-wheel zoom is disabled. The local preview now uses the same security headers as deployment.

Background highlights show the official STI Global City campus image, existing project screenshots and supplied certificate previews. All five Training cards have equal dimensions with contained certificate images; Introduction to Modern AI uses a neutral placeholder. Introductory copy reflects the selected one-page résumé's full-stack/Android experience and exploration of AI engineering; the résumé PDF and verified project responsibilities remain unchanged.

Verification: **48 tests pass**, draft build succeeds, and the running local endpoint returns real Eyzen08 activity. Browser checks cover Home, Activity and Training at 320, 390, 768, 1024, 1366 and 1920px in both themes: 36 combinations without page overflow, header overlap, clipped Background papers or unequal certificate cards. Map loading and theme switching were checked with deployment CSP applied; no inline/eval permissions were added. Ignored `.qa/live-map-background/` holds local QA measurements and screenshots. No deployment or physical-device test was performed.

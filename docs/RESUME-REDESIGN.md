# Portfolio redesign — 25 October 2026

## Audit and implementation plan

The working tree was clean. The existing application is a Node static generator with JSON content, shared HTML templates, vanilla CSS/JavaScript, ten content routes and a 404 page. Preserve its build, Vercel headers, galleries, accessible filters, contact form, map, theme preferences and GitHub API. Baseline: 61 tests pass.

The existing public résumé is outdated: Admission Office duties, five credentials and the earlier professional headline. `C:/Users/Ezian/Downloads/EJ_Christian_Medilo_RESUME.pdf` was extracted with pypdf and matches the updated brief, including MIT responsibilities, seven dated credentials, TypeScript, Tailwind CSS and five AI tools. The `(3)` filename was not present; use the matching document without editing its contents.

The reference was inspected in Chrome: compact navigation, large outlined/solid name typography, portrait-led hero, restrained charcoal palette, generous section spacing, image/text project rows, categorized skills, structured education, experience rows, certificate images and direct contact. Adapt these principles to EJ's student identity and real assets. Do not copy the reference's commercial services, metrics, testimonials or portrait.

1. Synchronize shared profile, project and technology data, then replace the public résumé with the matching updated PDF.
2. Recompose Home with a clear hero, about, selected projects, skills, compact AI workflow, education/experience, training, GitHub and contact.
3. Apply consistent typography, surfaces, borders and responsive layouts across every existing route. Keep original and enhanced/recreated screenshot provenance visible.
4. Update superseded content/layout assertions; run the full suite, production build, syntax checks and browser checks at 360, 390, 768, 1024, 1366 and 1440 pixels. Verify galleries, navigation, filters, PDF, theme and contact validation without sending a real inquiry.

## Source nuance

The résumé describes Firebase authentication and local storage broadly. The existing source-reviewed case study distinguishes custom Firebase Realtime Database account handling from the Firebase Authentication product, and SharedPreferences active progress from the SQLite helper. Preserve that implementation detail; describe the overview as Firebase-backed sign-in and saved progress. Institutional adoption and commercial deployment are unverified.

## Change surface

`data/profile.json`, `data/projects.json`, `data/technologies.json`, `scripts/templates.mjs`, shared styles and theme colors, the public PDF, social preview, and affected tests/documentation. No new runtime dependencies or framework migration.

## Implemented

The shared visual system now uses warm neutral light surfaces, charcoal dark surfaces, a restrained sage accent, outlined/solid name typography, a portrait hero and large image/text project rows. All existing content routes receive the shared presentation. Home retains the personal image, map, background highlights, screenshot decks, source links and GitHub activity. Categorized skills replace the decorative globe; familiar languages have a separate group. Five compact AI tool labels replace repeated tool-description cards.

The professional positioning, fourth-year status, education, training responsibilities, project roles/years/contexts, all seven dated credentials, TypeScript, Tailwind CSS and security practices are synchronized. The downloadable PDF was copied unchanged from the matching updated résumé. SHA-256: `789013513f4916e26205c61831ee166379b0d714c8a807b96a5683f3e713e641`.

Existing original/enhanced/recreated project-image labels and original-capture links remain. STI Vio-Log's public landing page loaded in Chrome; deployment status is described as a public academic project, without institutional-adoption claims. The social preview was recolored and updated to the new positioning.

Rapid browser navigation reproduced `InvalidStateError` messages from the old cross-document View Transition opt-in. Removing that one declaration restored native navigation; ten subsequent rapid route changes produced no new console errors.

## Browser verification

Chrome checked every content route at 360, 390, 768, 1024, 1366 and 1440 CSS pixels, in light and dark modes: 120 route/viewport/theme combinations. No page overflow, clipped headings/paragraphs or broken loaded images were found. Screenshots were reviewed through the browser tools for the hero, project rows, galleries, case studies, training and contact, including mobile views. Initial viewport measurements were calibrated for the existing 90% browser zoom before recording the exact widths.

Verified mobile menu expansion and automatic closure after a section selection; theme and browser-chrome color updates; gallery pagination to the Student Portal screen; Escape dismissal and focus restoration; project search, empty state and reset; native required-field and invalid-email validation; clipboard email copying; and the résumé download. The downloaded PDF hash matches the published file. GitHub returned actual public profile/events and a contribution calendar. No contact inquiry was transmitted.

## Remaining limits and deployment

The Microsoft AI course, Introduction to Modern AI and Fundamentals of Artificial Intelligence have no certificate preview in the existing repository. Their titles and supplied dates remain visible without invented issuer information or links. Four original certificate documents/previews remain available.

OpenFreeMap's dark style logs a missing `wood-pattern` texture warning. The map and attribution remain usable, with the existing full-map fallback. No new map-style dependency or workaround was added.

No lint or type-check scripts are configured; JavaScript syntax checks and the Node test suite cover the available source checks. No Vercel deployment, physical-device test, production performance benchmark, live email delivery test or authenticated STI workflow test was performed.

Vercel configuration is unchanged: `npm ci`, `npm run build:release`, output `public`. Set `SITE_URL=https://ejmedilo.vercel.app` and retain the existing server-side `GITHUB_TOKEN` for the contribution calendar. No additional environment variables are required.

Final command results: `npm test` — 63/63 passing; `SITE_URL=https://ejmedilo.vercel.app npm run build:release` — ten content pages and a 404 generated; `node --check` on the edited JavaScript/templates and `git diff --check` — successful. The repository does not configure separate lint or type-check commands.

# Portfolio implementation record

Current state: see [Full visual remake](FULL-VISUAL-REMAKE.md). Entries below record earlier approved phases; their earlier palettes and pending portrait/PDF inputs are superseded.

Approved brief: the 13 October 2026 revised portfolio plan supplied in this chat. No chatbot.

## Decisions

- Work on `codex/portfolio-studio` in the previously empty checkout. No existing user files were overwritten by the checkout; the original four repository files are preserved in Git history.
- Keep vanilla HTML/CSS/JS. One native Node build creates nine pages and shared navigation from approved public content.
- Draft builds are noindex. Release builds require updated portrait/PDF, owner-approved content and verified contact delivery. Old portrait/PDF are not copied into public output.
- Until approved application screenshots arrive, clearly label workflow illustrations and distinguish them from any genuine repository screenshot.
- No external form submission before endpoint ownership is confirmed. No public deployment while release gates are unmet.

## Progress

- Baseline inspected: four static files; no test or build commands existed.
- Branch prepared from remote main.
- First failing tests added for generation, search/category behavior, themes and release gating.
- Shared generator and nine pages implemented, including filters, themes, workflow, résumé print styling, GitHub and contact.
- Local licensed assets and lossless image derivatives prepared; original SVG social graphic rendered to PNG.
- 20 Node tests green and 144 responsive/theme checks without overflow or broken images.
- Owner confirmed inbox receipt of the single test inquiry; contact verification recorded.
- Fresh whole-change review completed; all three findings fixed, with origin/stale-data regressions red→green.
- Public deployment waits for updated portrait/PDF, content/imagery approval and canonical origin. Calendar needs a server token.

## Refinement — 17 October 2026

- Implemented the owner-approved neutral/blue redesign with both themes, shared project cards, curated technology tags and explicit status.
- Installed the supplied résumé PDF unchanged, synchronized experience/education/training, and added responsive main/sidebar résumé layout and print rules.
- Added authentic quiz, era and Story Mode frames, corrected geometrically from the supplied video and presented inside CSS phone frames; no app interface was redrawn.
- Reused the workflow controller for the three-screen selector. Essential figures remain in HTML without JavaScript. Phone and explanation animate together, with no motion when reduced motion is requested.
- Organized skills into open category groups. Additional résumé familiarity has explicit résumé evidence instead of fabricated project usage.
- Preserved all nine routes, GitHub API, Formspree destination, environment names, release validation and the no-chatbot scope.
- Additional data fields: profile experience bullets/location; project cardTechnologies/previewScreens; technology iconId/evidenceUrl. No API contract changed and no runtime dependency was added.
- Continued in the existing task branch to preserve the earlier uncommitted work; no reset, incidental commit, push, or public deployment.
- Release still requires the portrait, owner content/imagery review and SITE_URL. Calendar verification needs a securely configured GITHUB_TOKEN. The supplied PDF’s SQLite wording remains a final content-review item.

## Minimal cards — 19 October 2026

- Added one shared `.card` style (12px radius, theme surface, subtle border) and a media variant. Desktop padding/gaps are 28/24px; mobile padding/gaps are 20/16px.
- Applied cards to the Home introduction and supporting summaries; About portrait/goals/strengths/interests/hobbies; technologies; activity and repositories; each major résumé section; contact details/form; and case-study previews/sections.
- Kept résumé entries and architecture details as unboxed rows, and removed the secondary box around the phone preview. No `.card` is nested inside another `.card` on any checked route.
- Aligned project image stages, metadata and action rows; reflowed workflow controls to number-over-label at narrow widths; restored the shared gallery-to-contact gap.
- Only template classes and CSS changed in the product. Generated before/after content is identical when class attributes are ignored: routes, wording, IDs, links, downloads, forms and enhancement hooks are preserved. No API/data/dependency/JavaScript changes.
- Existing task branch and earlier uncommitted work retained; no deployment, push or incidental commit.

## Résumé synchronization and paper themes — 19 October 2026

- Replaced the public résumé at its stable URL with the latest owner PDF, unchanged (SHA-256 documented in assets/ASSETS.md and checked by the test suite). Updated the Admission Office role, 54/80 training hours, education labels, summary and project context; retained the five credentials, personal interests and confirmed contribution statements. Removed the outdated résumé-only MySQL listing.
- Applied beige/cream light colors and charcoal-brown/ivory dark colors, with muted blue actions. One original local SVG grain tile sits behind the content, at 4%/3% opacity, with pointer events disabled. Cards, fields, authentic imagery and logos remain unobscured.
- Recolored site-owned SVG artwork and regenerated the social PNG. The initial theme script and interactive toggle synchronize the browser theme-color metadata. Existing saved/system preference and storage-error behavior remain.
- Strengthened light input/search boundaries to #87745c for contrast margin. Print rules explicitly suppress grain and retain plain-white, single-column résumé flow. No API, schema, route, integration or dependency changes.

## Photo-led hero and personal branding — 19 October 2026

- Replaced the Home workflow with one wide card, approximately 60% introduction / 40% portrait. Below 768px, text/actions precede the image. The portrait is at most 400px wide, with reserved dimensions and responsive 400/800px sources.
- Added the approved owner photo to Home and About, and the photo avatar to shared header/footer logos and PNG favicons. Updated social-sharing artwork. The original is preserved outside published assets; public outputs contain cropped, optimized derivatives only.
- Removed the Home workflow renderer, its obsolete CSS and four illustration assets. Kept a smaller process-stage dataset for the existing STI Vio-Log case-study outline, and retained the shared Kwiztorya preview controller and reduced-motion behavior.
- No API, data-schema, route, integration or dependency changes. The portrait launch requirement is now satisfied; final content/imagery approval and SITE_URL still gate release. Calendar verification continues to require a securely configured server token.

## Interactive bento homepage — 19 October 2026

- Replaced the wide hero with the approved three-column grid at 1024px and above: Identity/Background on top, Mindset and Craft flanking the portrait/location column. Maximum grid width 1120px, gaps 16px, corners 12px; heights follow content. Tablet uses two columns, and mobile source order is Identity, Craft/actions, Portrait, Background, Mindset, Location.
- Background highlights use current education, project roles and credential count from existing data. Mindset includes owner-confirmed AI interests and three illustrated hobbies. Craft retains verified project-backed technology logos and the primary project/résumé actions. Location uses city-level text and UTC+8.
- Both selectors reuse the unmodified preview controller. Overlapping tabs/hobby backing layers provide the visual treatment; native buttons handle keyboard/touch selection, with selected states and polite live announcements. Unenhanced HTML exposes all six descriptions with hidden controls. Entrance/selection/hover timings remain 550/220/160ms; reduced motion removes movement.
- Removed duplicate Home About, stack and résumé overview blocks and their unused CSS. Dedicated pages, legacy anchors, actual project cards, GitHub and contact remain. No API, data-schema, dependency, route, hosting or runtime-JavaScript changes.
- First browser review caught portrait sizing transferred from its aspect ratio into a neighboring column. Explicit width/max-width constraints fix that root cause; responsive checks now include main-tile rectangle intersections in addition to document/card overflow.


## 20 October 2026 project picture decks

See [PROJECT-PICTURE-DECKS.md](PROJECT-PICTURE-DECKS.md) for the current shared picture presentation, accepted enhanced images, sanitized STI captures, Background autoplay, verification and remaining limits. This supersedes earlier descriptions of static Background highlights and the combined three-phone showcase.

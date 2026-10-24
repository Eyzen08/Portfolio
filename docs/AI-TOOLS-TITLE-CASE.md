# AI Tools and Title Case — 20 October 2026

## Delivered

The homepage now has one **AI Tools I Use** section directly after Tech Stack and before About. It retains `#ai`, the exact supplied introduction, the four supplied categories/descriptions, and the existing AI approach, learning, and developer-responsibility copy. Projects remain near the top of the page.

Google Gemini, ChatGPT, OpenAI Codex, and Claude appear as four informational cards with local, original vendor logos, meaningful alternative text, and reserved image dimensions. The grid uses four columns on desktop, two on tablet, and one on mobile. Existing Inter typography, light/dark colors, spacing, and borders are reused. Hover changes only the border; the added transition is disabled for reduced motion. No new dependency, route, navigation item, external card link, or technology-filter entry was added.

Logo provenance is recorded in [the asset register](../assets/ASSETS.md). Codex's PNG is the verified icon published by OpenAI on its official extension listing, version `26.51007.21434`; that release uses the shared OpenAI knot on black. Google's supplied monochrome Gemini spark, OpenAI's black monoblossom, and Anthropic's clay Claude spark remain unmodified.

## Capitalization Review

Reviewed Home, About, Projects, Tech Stack, Activity, Training, Resume, Contact, both project case studies, and the 404 page. Shared desktop/mobile navigation, footer, search/filter controls, contact labels, certificate links, project previews/dialogs, technology headings, and dynamic theme/sphere labels were included.

Chicago-style Title Case capitalizes principal words while leaving articles, coordinating conjunctions, and prepositions lowercase unless first or last. Representative corrections:

| Before | After |
| --- | --- |
| Software, put into practice. | Software, Put into Practice. |
| Tools behind the work. | Tools behind the Work. |
| Connecting the pieces. | Connecting the Pieces. |
| My responsibility as a developer | My Responsibility as a Developer |
| Learning through practice. | Learning through Practice. |
| A practical foundation. | A Practical Foundation. |
| Work experience & immersion | Work Experience & Immersion |
| Code, in the open. | Code, in the Open. |
| Open full map | Open Full Map |
| View certificate | View Certificate |
| Expand preview | Expand Preview |
| STI Vio-Log screenshots | STI Vio-Log Screenshots |
| Tools Around the Core Workflow | Tools around the Core Workflow |
| History Through a Playable Sequence | History through a Playable Sequence |
| State Across Screens | State across Screens |

Role labels, hero/context labels, architecture labels, skip link, and relevant accessible action labels were also corrected. Paragraphs, validation/status sentences, official product and credential names, destinations, and technical identifiers retain their intended capitalization. No CSS text transformation or automatic title converter was introduced.

## Files Changed

- `data/profile.json`: four AI tool records; existing fields unchanged.
- `data/projects.json`: capitalization of role labels and three case-study headings only.
- `scripts/templates.mjs`: AI section, placement, and shared UI source text.
- `assets/site.css`: responsive cards, logo sizing, preserved AI copy layout, and reduced-motion rule.
- `assets/app.js`, `assets/home.js`: theme action and sphere instruction capitalization.
- `assets/icons/gemini.svg`, `chatgpt.svg`, `codex.png`, `claude.svg`: original vendor marks.
- `assets/ASSETS.md`: exact logo sources and trademark/provenance notes.
- `tests/ai-tools.test.mjs`: static content, tool separation, order, assets, and capitalization coverage.
- `tests/editorial.test.mjs`, `tests/redesign.test.mjs`: approved order and changed text expectations.
- `docs/AI-TOOLS-TITLE-CASE.md`: this report.

Generated output was rebuilt in ignored `public/`. Before-change source copies and QA evidence are retained in ignored `.qa/ai-tools/`. Existing uncommitted work was preserved; no commit, push, or deployment was made.

## Validation Results

- New AI/order/capitalization tests were observed failing before implementation, then passing afterward.
- `npm test`: **55 passed, 0 failed** with localhost access enabled. This includes the preview-server test that previously failed under sandbox loopback restrictions.
- `npm run build`: passes; generates ten pages and a 404 in draft mode.
- `node --check scripts/templates.mjs`, `node --check assets/app.js`, `node --check assets/home.js`: pass.
- `git diff --check`: passes. Most current site files were already untracked, so scoped comparisons against the saved before-change copies were also reviewed.
- No configured lint or type-check scripts exist; no dependencies were added to create them.
- Browser matrix: **11 routes × 5 widths × 2 themes = 110 checks**. Widths: 360, 390, 768, 1366, 1440px. No document overflow, clipped headings, overlapping navigation, failed loaded images, or AI card overflow. AI columns measured 1/1/2/4/4 at those widths in both themes.
- Mobile menu exposes all seven links; Escape closes it, returns focus to its button, and leaves a visible focus outline.
- Project filters produce 1 mobile result, 0 results for an unmatched query, and 2 after reset. Screenshot preview opens with a Title Case title, advances from 1/6 to 2/6, and closes with Escape while restoring opener focus.
- Contact required-field and invalid-email validation block submission. No inquiry was sent.
- Theme choice persists across route navigation. All four AI logos load. Measured AI body-copy contrast: **5.25:1 light**, **8.90:1 dark**; category/heading contrast is higher.
- Generated HTML includes all four complete AI cards without hidden flags or a JavaScript dependency for visibility. Original profile fields and project prose/assets/identifiers were compared with the saved originals and match, apart from the intended display-label/heading changes. New SVGs were checked for scripts, event handlers, foreign objects, and remote resource references.
- Separate read-only code review: no findings; reviewer independently passed the 12 focused AI/editorial/redesign tests.

## Remaining Limits

No physical-device, other-browser-engine, screen-reader, OS-level reduced-motion, or JavaScript-disabled browser session was run. Static no-JavaScript rendering and the added reduced-motion CSS were inspected instead. Image checks in the responsive matrix cover loaded images; generated local asset destinations are covered by the build/link tests.

Existing owner-content approval and canonical-origin release gates remain in place. Production hosting, production performance, and a new contact-delivery test were outside this change.

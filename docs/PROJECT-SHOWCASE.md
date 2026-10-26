# Project showcase — 26 October 2026

## Current revision — STI only (v3)

STI Vio-Log selects four 1920 × 1080 compositions: System Overview, Sign-in Across Themes, Dashboard Across Devices, and Attendance & Records. Their PNG masters are `design/project-showcase/sti-{overview,signin,dashboard,workflows}-v3.png`. Published versions use `assets/projects/sti-vio-log-mockup-{overview,signin,dashboard,workflows}-v3.webp`, with 960 × 540 `-small.webp` thumbnails. Previous STI artwork and source files are retained.

Kwiztorya selects its original supplied Home, Quiz, Story Mode, and Settings compositions, at 1536 × 1024 with 960 × 640 thumbnails. Its original native screenshot dialog, captions, controls, and motion remain in use. Unselected Kwiztorya v2 derivatives are outside public assets. These supplied presentations do not establish an iOS release or additional implemented features.

Home and Projects retain the responsive 55/45 project rows. Only STI opens the new details dialog: 55/45 artwork/details, a compact sticky header, 16:9 uncropped sharp foreground, a 24px blurred ambient duplicate, and a 12px dimmed page backdrop. The 300ms transition preserves the existing OS-independent motion policy. Below 768px the artwork and details stack with internal scrolling. More Work is a normal link to the unchanged Kwiztorya case study. Source, contact, case-study, and STI live actions remain available. Both case studies retain their existing deck galleries.

### Sources, composition, and privacy

The public STI site and `/login` were inspected at `https://sti-vio-log.vercel.app/` on 26 October 2026. The authentic 420 × 236 logo comes from `/assets/sti-logo-web-transparent-CuPCfkiT.png` on that origin. Live desktop sign-in (1440 × 960) and mobile dark/light sign-in captures remain in ignored `.qa/showcase/`. No authenticated dashboard was accessed.

| Composition | Authentic screens | Placement (x, y, width) on 1920 × 1080 canvas |
| --- | --- | --- |
| System Overview | Live desktop sign-in, supplied masked 08 dashboard, live dark mobile sign-in | Laptop (870,200,990), tablet (315,280,510), phone (40,440,245) |
| Sign-in Across Themes | Live desktop sign-in, supplied 05 light tablet sign-in, live light mobile sign-in | Laptop (870,200,990), tablet (315,260,510), phone (40,440,245) |
| Dashboard Across Devices | Supplied masked 06 light laptop and 08 dark tablet | Laptop (755,160,1130), tablet (65,220,590) |
| Attendance & Records | Supplied masked 07 QR attendance and 09 violation management | Laptops (745,165,1120), (35,350,690) |

HTML/CSS places original screen pixels, supplied device frames, the authentic logo, text, and SVG feature icons over a generated background. Live captures receive CSS device bezels. Full edges and source proportions are retained; mild CSS perspective adds depth. Before export, opaque masks hide Google account names/email/avatar prompts and supplied student/profile names, numbers, and initials. Raw captures and embedded source imagery stay outside published assets. The visible Student Records, Violation Tracking, Service Hours, and Student Progress labels describe verified project features.

Background-only image-generation prompt: “Photorealistic cool-white office background plate, intended 1920 × 1080. Glossy white desk, soft daylight, blurred pale window panels/city view and a small blurred green plant at the far right. Wide clear central stage. No devices, screens, interface, text, logos, people, school seal, or invented app graphics.” The generated plate is `backgrounds/sti-office-v3.png` (1672 × 941, fitted to canvas). Browser-rendered compositions were normalized to actual PNG masters; bundled Sharp exports quality-94 full WebP and quality-90 thumbnails. No new dependency or AI-redrawn interface was introduced. Private reproducible composition/export scripts remain in ignored `.qa/showcase/`.

### Current verification

- Complete automated suite: **94 passing tests**, including STI-only dialog routing, all image pairings, PNG signatures/dimensions, direct-image fallback, keyboard controls, focus restoration, and ID checks that match real `id` attributes rather than `data-project-id`.
- Browser: Home, Projects, and both case studies × six requested widths × both themes = **48 page checks**, with no horizontal overflow or broken images. Home and Projects × those widths/themes × both popup types = **48 popup checks**, with no horizontal clipping and correct contain fitting/ratios.
- Browser: Home/Projects × desktop-dark/mobile-light × both projects × four thumbnail selections = **32 loaded-image checks**. STI keyboard arrows wrap 1/4 → 4/4 → 1/4. Close, Escape, backdrop dismissal, focus trapping/restoration, scroll unlock, More Work case navigation, filter/no-result/reset, and both case-study next/previous controls were checked.
- Browser fallback fixtures: script-free and unsupported-dialog links open the full STI image directly. Disabling backdrop-filter retains a visible dim overlay. Sharp artwork remains `filter:none`; only the ambient duplicate receives 24px blur.
- Four STI masters were visually inspected for clipping, distortion, legible branding, and privacy masks. Original Kwiztorya master hashes match the supplied files. A fresh read-only review passed 14 focused tests with no runtime findings; its stale-documentation note was resolved here.
- Syntax checks, whitespace checks, and the release build pass. Desktop/mobile captures and JSON evidence are in ignored `.qa/showcase/*-v3.*`.

This verification was completed locally before publication. Production publishing is performed separately after owner approval. Authenticated production acceptance, physical devices, alternate browser engines, and a screen-reader audit were not performed.

## Historical first-pass record (superseded for STI)

Home and Projects now share the same image-left project row: approximately 55% artwork and 45% details, separated by a thin divider. Below 768px the artwork appears above the details. The covers are static; clicking either the cover or View Project opens the existing four-image native dialog. Case studies retain their independent manual/autoplay galleries. Search, Web/Mobile filters, contributions disclosures, source links, and STI's live link remain available.

Only STI is labeled Featured. Both projects retain their actual academic status and verified technology lists; the new badges use local icons. The new supplied Kwiztorya presentation artwork does not establish an iOS release, a redesigned runtime, or additional implemented features. Its captions identify it as owner-supplied presentation mockups. Existing case-study implementation evidence is unchanged.

## Assets and production

The eight PNG masters are in `design/project-showcase/`; four generated background plates are in its `backgrounds/` directory. Published full-size WebP assets are 1536 × 1024; their 960 × 640 thumbnails are selected through srcset. The 16 WebP files together are approximately 2.5 MB. Masters and background plates are outside the build's public asset directory.

| STI composition | Inputs | Placement in 1536 × 1024 canvas (x, y, width) |
| --- | --- | --- |
| Landing & Access | Earlier desktop landing capture, transparent 04, transparent 01 | Desktop (370,265,1110), tablet (32,100,330), phone (85,605,211) |
| Sign-in Across Themes | Transparent 02, 03, 05 | Laptop (385,215,1120), dark tablet (25,115,350), light tablet (55,574,310) |
| Dashboard Across Devices | Transparent 06, 08 | Laptop (12,214,1110), tablet (1115,320,385) |
| Attendance & Records | Transparent 07, 09 | Laptops (10,235,758), (768,275,758) |

Source device images were placed with HTML/CSS at their original proportions, using their existing alpha and device frames. The raw desktop landing image received a CSS laptop bezel. Native browser screenshots exported the final PNGs; Sharp from the existing bundled runtime produced full-size quality-92 WebP and quality-87 thumbnails. Sharp is not a project dependency. No interface was redrawn by an image model. Full device edges are preserved and screens do not overlap.

Opaque CSS masks were applied before export to the Google account prompt on inputs 01/02/03/05, the profile header on 06/07/08/09, and student names/IDs/initials on 06/08/09. No unredacted source or CSS-embedded source image is copied to public assets. Original input files remain unchanged in the owner's Downloads/attachment locations. The private composition generator and masks are retained in ignored `.qa/showcase/compose.cjs` for local reproduction.

Kwiztorya uses the supplied PNGs unmodified: Philippine History (Home), Philippine History Quiz, Story Mode, and History Settings. The originals were copied as PNG masters and exported to optimized WebP. Previous portfolio image files remain unchanged but are no longer selected by the project records.

## Image-generation prompts

Built-in image generation produced background plates only. Shared prompt: “Photorealistic background plate for STI Vio-Log portfolio mockups, landscape 3:2. Warm ivory and cream, restrained navy and muted gold, realistic soft daylight and surface texture. Wide unobstructed central stage. No devices, screens, interface, logos, text, people, or buildings. Opaque full-bleed background; intended 1536 × 1024 compositing canvas.”

- Landing: warm ivory limestone desktop, pale cream seamless backdrop, navy fabric and muted gold pencil confined to the outer margin; light from upper left.
- Sign-in: softly textured ivory surface, cream backdrop, closed navy notebook at the far upper right, small gold accent; natural window light.
- Dashboard: clean ivory matte academic desk, subtle blue shadow at the distant right, navy stationery at the top margin; warm daylight.
- Workflows: pale stone tabletop, ivory backdrop, diagonal daylight shadows, muted gold accent and navy notebook corner at the distant edge.

## Verification

- Baseline: 85 tests pass after the initial draft build (the existing dev-server test requires generated public routes).
- Updated automated suite: 87 tests, including static covers, gallery destinations, landscape assets, provenance, filters, and unchanged keyboard/fallback behavior.
- Browser: Home and Projects × six widths (360,390,768,1024,1366,1440) × two themes = 24 layout checks. Two case studies across the same matrix = 24 additional checks. No horizontal overflow, clipped badge rows, or extra device frames. Project actions are at least 44px high.
- Browser: both overview pages × desktop-dark/mobile-light × both projects × four slides = 32 loaded gallery-image checks. Each loads its 1536px source with contain fitting. Escape restores opener focus and unlocks scrolling.
- Browser: Mobile filtering returns Kwiztorya, adding PostgreSQL returns zero, and Clear Filters restores both projects. Case-study Home → next → previous returns 1/4 → 2/4 → 1/4. Keyboard focus reveals the cover arrow, zoom treatment, and visible outline. Checked browser warning/error log is empty.
- Script-free mobile fixture: zero script tags, two static covers, no document overflow, and View Project navigates directly to the full-size WebP. The existing no-script mobile navigation remains expanded over upper content; its separate project action remains usable.
- A fresh read-only review found no actionable issues in the changed templates, filters, provenance, privacy masks, or native gallery behavior; 20 focused tests passed.
- Evidence is stored in ignored `.qa/showcase/`: layouts.json, case-layouts.json, galleries.json, screenshots, tests.log, and build logs.

No publishing, physical-device testing, alternate-engine testing, screen-reader audit, or physical-pointer hover test was performed. The hover rule and equivalent keyboard state were inspected; physical hardware behavior is not claimed.

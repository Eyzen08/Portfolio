# Project showcase — 27 October 2026

## Current revision — one showcase photo per project

Each project now selects exactly one image throughout Home, Projects, its popup, its case study, and related-project previews. STI uses the unchanged v8 4K PNG, published as `assets/projects/sti-vio-log-overview-v8-4k.png` (3840 × 2160). Kwiztorya uses the unchanged owner-supplied `Kwiztorya Philippine History pics.png`, published as `assets/projects/kwiztorya-history-showcase.png` (1536 × 1024). Both published PNGs are byte-identical to their supplied/master files. Previous artwork files remain saved but are no longer selected or rendered.

The STI cover retains its 960 × 540 v8 WebP thumbnail. Kwiztorya has a matching 960 × 640 quality-94 WebP thumbnail, `kwiztorya-history-showcase-small.webp`. Responsive cover images use these optimized derivatives when the browser selects them; full popup images and image links use the chosen PNGs. The STI source is the completed privacy-masked 4K composition. Kwiztorya remains labeled as an owner-supplied presentation mockup, without claiming a changed runtime or an iOS release.

Project templates no longer render previous/next arrows, counters, selector buttons, or thumbnail strips. Case-study artwork is static, uncropped, and outside the carousel/tilt initialization. Popup handlers tolerate absent navigation elements and leave left/right arrow keys alone for a single image. Close, Escape, opener focus restoration, direct-image links, project filters, source/live links, badges, and all project text remain. Unrelated personal/background decks and their motion policy are unchanged. No data fields, dependencies, CSS, deployment settings, or public routes were added.

### Verification

- All 112 automated tests and the draft build pass. New single-image assertions and the missing-controls popup regression failed before implementation. Shared multi-image deck and preview fixtures continue to verify unrelated gallery behavior. STI's published image is checked against its original 4K master.
- Browser: 16 page checks across Home, Projects, and both case studies at 390px/1440px in light/dark themes; 16 popup checks covering both cover and View Project openers; and four script-free/unsupported-dialog View Project image-link fallbacks pass. Each popup contains one image and no navigation controls, closes through Escape and its close button, and restores opener focus. Static case-study images use contain fitting, and no page/dialog horizontal overflow or page JavaScript errors occur. Project search/no-results/reset also pass. Evidence and both original-PNG byte comparisons are recorded in ignored `.qa/single-showcase/`; full-image links use PNGs with the correct native dimensions.

Previous artwork files are retained. Production releases require owner approval.

## Previous revision — STI main cover (v8)

The cover keeps the v7 four-device positions, larger rear monitor, perspective angles, original logo, and two approved description lines. All four screen inserts now use the owner's newly supplied screenshots: dashboard (1904 × 936), login (1900 × 902), landing page (1719 × 895), and phone (543 × 893). The existing v7 blank-device background is reused unchanged; no image-generation call, new background asset, or runtime UI change was needed.

### Sources and rendering

- The phone app area is extracted at (96,118), 358 × 663, retaining the complete application header, QR card, and bottom navigation while excluding the original device frame, OS status area, and browser toolbar. This avoids nesting the supplied phone frame inside the composition's phone.
- Privacy masks are remeasured against the new inputs: the dashboard account and two student name/ID/avatar areas, the login Google account name/email/avatar, and the phone account/avatar and entire QR payload. Neutral labels and a nonfunctional decorative QR placeholder are flattened into native-resolution, lossless masked screen PNGs before composition. Raw sources and embedded-source HTML remain in ignored `.qa/sti-cover-v8/`.
- The existing projective four-corner mapping fits the refreshed images into their device displays with contain fitting and no source-content crop. Chromium renders the 1920 × 1080 layout at device scale factor 2, producing the actual 3840 × 2160 PNG. Each smaller export is downsampled directly from that master once with Lanczos3; WebP qualities remain 96 and 94. No blur, sharpening, or invented interface detail is added. Final detail remains bounded by the supplied sources.
- Outputs: `design/project-showcase/sti-overview-v8-4k.png` (3840 × 2160, 4,038,489 bytes), `sti-overview-v8.png` (1920 × 1080), and `assets/projects/sti-vio-log-mockup-overview-v8.webp` (1920 × 1080, 243,592 bytes) plus its `-small.webp` thumbnail (960 × 540, 78,546 bytes). The 4K file is delivered as a workspace artifact; normal portfolio image links retain the optimized web sizes.
- Only the first STI preview entry and its descriptions change. Other gallery images, project records, dimensions in the public data interface, templates, CSS, JavaScript, and dependencies remain unchanged. Previous cover exports are retained. Private source-mask and composition scripts, self-contained HTML, detail crops, and verification logs are in `.qa/sti-cover-v8/`.

### Verification

- All 110 automated tests pass, including a new 3840 × 2160 PNG master assertion and updated v8 image-pair assertions. The new asset assertions failed before implementation. The draft build and whitespace checks pass.
- Composition checks confirm all four inputs load, contain fitting, exact approved background copy, valid output dimensions, accurate projective corners, and no intersecting or clipped display bounds. Native masked sources, full-size output, and 100% 4K crops of the login form, dashboard records, and QR phone are visually inspected.
- Home, Projects, and the STI case study pass 12 browser checks at 390px/1440px in both themes. All four gallery selections load and navigate, Escape closes the dialog and restores focus, there is no page/dialog horizontal overflow, and no page JavaScript errors occur. A data comparison confirms the other STI images and all Kwiztorya data are unchanged.

No publication or physical-device testing was performed.

## Previous revision — STI main cover (v7)

The four-device cover now places a much larger, gently angled desktop login monitor behind the foreground dashboard laptop, QR phone, and landing-page tablet. The rear display is approximately 1.8 times the width of the intermediate v6 rear display. A small hardware-bezel overlap adds depth; all four display areas remain fully visible. The upper-left branding uses the original logo beside “Student Violation & Support Platform” and “Records · Service · Clearance,” with no additional background copy.

The 1920 × 1080 master is `design/project-showcase/sti-overview-v7.png`; published files are `assets/projects/sti-vio-log-mockup-overview-v7.webp` and its 960 × 540 `-small.webp` companion. Export qualities remain 96 and 94. The final 1672 × 941 photographic plate is `design/project-showcase/backgrounds/sti-office-devices-v7.png`. Previous v4, v5, and intermediate v6 exports remain available. Only the first STI preview entry changes; the other three images, all other STI data, and Kwiztorya remain unchanged.

### Sources and production

- The built-in `image_gen` tool edits the v6 blank-device plate to enlarge the desktop monitor and improve the angle and depth. It generates only the scene and hardware. The source login page is the owner's latest 1901 × 904 attachment; the dashboard, landing page, student QR screen, and logo use the existing supplied assets.
- Before composition, an opaque mask covers the login Google account name, email, and avatar, replacing the personal prompt with “Continue with Google.” Existing opaque student/account/QR masks remain. Raw captures and embedded-source HTML stay in ignored `.qa/`; public files contain flattened redacted pixels.
- Browser-rendered HTML/CSS maps the authentic screenshots to the four display quadrilaterals with projective `matrix3d` transforms. Each original screen uses contain fitting before projection, preserving all screen content. The corner-mapping math is self-checked, all four screen bounds are checked for intersection and clipping, and the two approved background lines are asserted exactly.
- The current private `compose.cjs`, masked inputs, `composition.html`, screenshots, and verification logs are in `.qa/sti-cover-v7/`. The intermediate login mask source and neutral-account export are in `.qa/sti-cover-v6/`. No runtime template, stylesheet, JavaScript, dependency, or public API changes are needed.

### Verification

- All 109 automated tests, the draft build, and whitespace checks pass. The new v7 asset assertions failed before implementation. Export dimensions and four-corner perspective mappings are verified by the private composition self-check.
- Home, Projects, and the STI case study pass 12 browser checks across 390px/1440px and both themes. All four gallery images load and navigate, Escape restores opener focus, there is no page/dialog horizontal overflow, and no page JavaScript errors occur. A data comparison confirms only the first STI preview changed.
- The master and WebP exports are visually inspected for the larger rear login view, correct screen alignment, fully visible frames/content, privacy masks, and approved branding. Desktop/mobile evidence is stored in `.qa/sti-cover-v7/`.

Built-in image-generation edit prompt:

> Refine this FOUR-DEVICE portfolio mockup into a more compelling realistic three-quarter product photography composition. MAIN CHANGE: make the desktop monitor in the upper-right rear approximately 1.7 TIMES WIDER and taller than it is now, occupying much of the upper-right half. It must feel like a full-size desktop PC display behind the foreground laptop, not a tiny remote screen. Move it backward and slightly upward; shift the foreground laptop, phone and tablet lower if needed. Keep the entire monitor display visible and unoccluded, with complete monitor corners inside the image. A little overlap of the monitor stand behind foreground hardware is fine for natural depth, but do not cover any display or app area. Suggested arrangement on this1672x941 plate: rear monitor screen/frame roughly x850..1620, y45..435; its stand ends around y550; laptop frame/keyboard roughly x270..1050,y455..910; phone x60..235,y600..910; tablet x1120..1620,y660..910. Four devices, all screens readable and fully visible. The laptop remains the largest foreground hero with the phone far left and landing-page tablet lower-right. Give the monitor a subtle realistic 8-12 degree three-quarter viewing angle toward the camera; a slight complementary angle on the tablet is welcome, avoid steep foreshortening. Large flat blank-black screens, no glare. All displays must remain blank for later precise insertion of original screenshots. Preserve the bright cool-white desk, subtle reflected devices, premium black/silver materials, soft daylight, pale blue background, small blurred plant far left. Leave the upper-left area x5%-48%, y7%-24% EMPTY for logo and short information. No branding, text, UI, symbols, or extra objects anywhere. No extra devices. Full silhouettes and desk contact shadows. The point is bigger monitor, cohesive depth, and a better angle with all four screen contents unobstructed.

No publication or physical-device testing was performed.

## Previous revision — STI main cover (v5)

The main cover now uses the owner's fourth attachment, the complete 1898 × 903 public landing page, on the right tablet. The masked dashboard remains on the central laptop, and the masked student QR view remains on the left phone. All three physical devices have visible gaps; every screenshot uses contain fitting with uniform scaling. There is no screenshot crop, stretch, or generated interface. The existing STI logo is the only artwork placed on the background; all headings, taglines, and handwritten messages from v4 are removed.

Exports are `design/project-showcase/sti-overview-v5.png` and `assets/projects/sti-vio-log-mockup-overview-v5.webp` at 1920 × 1080, plus `sti-vio-log-mockup-overview-v5-small.webp` at 960 × 540. WebP quality is 96 for the full image and 94 for the thumbnail. The generated 1672 × 941 plate is retained as `design/project-showcase/backgrounds/sti-office-devices-v5.png`. Previous cover versions remain available. Only the first STI preview entry changes; the other STI images and all Kwiztorya data remain unchanged.

The built-in `image_gen` tool edited the v4 blank-device plate to separate the hardware. Browser-rendered HTML/CSS adds the original logo and authentic screenshot pixels. Existing opaque account, student, avatar, and QR masks are retained. Private composition, source masks, and check evidence are in ignored `.qa/sti-cover-v5/`.

The composition self-check asserts that the full device bounds do not intersect, all three source screens load with contain fitting, output dimensions are correct, and no background text nodes exist. The 109-test suite and draft build pass; responsive gallery checks are recorded in `.qa/sti-cover-v5/browser-checks.json`. Final PNG and WebP exports are visually inspected for full screen fitting, gaps, sharpness, and absence of background copy.

Built-in image-generation edit prompt:

> Edit this photorealistic cool blue-white product photography scene into a clean portfolio showcase background plate, intended widescreen 1920x1080. Keep the soft daylight, pale desk, gently blurred small plant and realistic premium devices. CHANGE THE ARRANGEMENT so all three devices are SIDE BY SIDE WITH REAL VISIBLE AIR GAPS, absolutely NO overlapping device silhouettes or screens. No device in front of another. Camera straight-on, front faces and display planes parallel to image plane. Laptop is the largest central focus, phone is well separated at far left, landscape tablet is well separated at far right. All three sit on same desk with bases on approximately the same horizontal line. Target allocation across image width: phone 2%-15%, laptop including full keyboard/base 19%-68%, tablet 72%-98%; keep at least 3% visible background gap between the complete devices. Laptop screen around 2:1 landscape; tablet screen wide around 2.1:1 landscape; phone screen around0.586:1 portrait. Use narrow realistic bezels, perfectly flat rectangular displays with small rounded corners, no angle/perspective, no glare. All three displays completely BLANK BLACK for authentic screenshots to be composited later. Laptop around53% image height, phone around40% image height, tablet around30% image height; lower devices on shared desk level; no enormous empty margins. Entire physical devices including corners, keyboard and feet inside image. Keep clean open space at top left for a logo to be added later. Background MUST have NO text, NO slogans, NO messages, NO symbols, NO logos, NO charts, NO decorations. No written copy anywhere. Refined realistic product photograph with crisp hardware and subtle contact shadows. Prioritize clearly separated devices and correct screen geometry over copying their previous positions.

No publication or physical-device testing was performed.

## Previous revision — STI main cover (v4)

Only STI Vio-Log's first `previewScreens` entry now selects the v4 System Overview. It shows the supplied light dashboard on a large central laptop, the supplied student QR screen on a phone at left, and a cropped dashboard detail on a landscape tablet at right. The other three STI images remain v3, and Kwiztorya is unchanged. Home, Projects, the STI details dialog, and the case-study gallery consume this shared entry without template, CSS, JavaScript, or public API changes.

The master is `design/project-showcase/sti-overview-v4.png` (1920 × 1080). Published assets are `assets/projects/sti-vio-log-mockup-overview-v4.webp` (1920 × 1080, quality 94, 183,958 bytes) and `sti-vio-log-mockup-overview-v4-small.webp` (960 × 540, quality 90, 55,924 bytes). Previous masters and exports are retained.

### Sources and production

- Reference: the owner's first attached laptop/phone/tablet composition. Authentic UI inputs: the second attachment's 1901 × 938 light dashboard and the fifth attachment's 538 × 864 phone image. The phone app area is cropped at (92,130), 368 × 628, excluding its existing frame and browser chrome. The existing transparent 420 × 236 STI logo is used unchanged.
- The built-in `image_gen` tool produced the photographic scene and blank device frames only. Its 1672 × 941 output is saved as `design/project-showcase/backgrounds/sti-office-devices-v4.png`. Browser-rendered HTML/CSS overlays the original, redacted screen pixels, logo, exact requested branding, and handwritten caption. Screens retain uniform scaling; the tablet intentionally crops the dashboard's right side. A local Segoe Script font supplies the handwriting. No dependency was added.
- Opaque masks replace the dashboard account/avatar area and both attendance names, IDs, and avatars with neutral labels. The phone's avatar, name, ID, and entire QR payload are covered before composition. Its nonfunctional checker pattern and “QR hidden” label are decorative, without an encoded student token. Only flattened redacted exports are published; original captures and embedded-source HTML remain in ignored `.qa/sti-cover-v4/`.
- The private `compose.cjs`, `composition.html`, masked screen PNGs, and browser evidence remain in `.qa/sti-cover-v4/`. Chromium renders the final master; bundled Sharp exports the WebP pair and asserts all three output dimensions.

Built-in image-generation prompt, with the first attachment as the sole reference image:

> Create a new photorealistic portfolio product showcase BACKGROUND PLATE inspired closely by this reference's clean cool-white desk scene and device arrangement. Landscape widescreen intended 1920x1080 (16:9). IMPORTANT: NO branding, NO text, NO logos, NO app UI, NO QR codes; all three displays are perfectly flat blank matte near-black placeholders for later insertion of authentic screenshots. Keep generous blank pale blue-white space across upper 170 pixels for branding and a small handwritten caption which will be added later. A large premium slim silver laptop CENTER, front-facing, screen plane parallel to image plane, laptop top near (280,200), outer screen bottom near y870, keyboard/base to y950. Laptop display is an unobstructed clean rectangle, around x320 y240 width1250 height617, aspect 2.026:1, with small rounded corners and black bezel. A modern upright black phone in the LEFT foreground around x50 y480 to x315 y1005; its display is blank black, portrait aspect about0.586:1, front-facing and parallel to image plane. A premium black landscape tablet in RIGHT foreground around x1220 y640 to x1860 y1015, display blank black, aspect around2.026:1, face parallel to image plane. Tablet and phone may overlap only the lower outer corners of laptop, don't overlap each other. Complete device silhouettes and bases visible, no clipped devices. Pale softly textured desk with subtle reflections and believable contact shadows, diffuse bright daylight, softly blurred pale blue-gray wall/windows, a small unfocused green potted plant at far left rear. Minimal elegant professional product photography, realistic aluminum and glass, crisp devices, restrained cool navy undertones. No decorative props beyond the small plant. Match the reference's physical realism and laptop-center/phone-left/tablet-right balance, not its exact output ratio. NO TEXT ANYWHERE; no icons or content on the screens. No screen glare, keep displays plain and flat.

### Verification

- All 109 automated tests pass. Showcase assertions require the v4 overview, its matching thumbnail, v3 paths for the other three images, and the selected masters' 1920 × 1080 dimensions. The new assertions were observed failing before the cover was added.
- The draft production build and whitespace checks pass. The PNG master and both exports were visually inspected for branding, complete device edges, proportionate screens, and opaque privacy masks.
- Browser: Home, Projects, and the STI case study at 390px and 1440px, in light and dark themes, pass all 12 page checks. The new cover and all four gallery selections load; overview covers and dialog images retain contain fitting. There is no page or dialog horizontal overflow, Escape closes the dialog and restores opener focus, and no page JavaScript errors occur. A data comparison confirms the other three STI records, all non-cover STI fields, and the complete Kwiztorya record remain unchanged. Results and screenshots are recorded in ignored `.qa/sti-cover-v4/`.

No publication or authenticated STI application testing was performed.

## Previous revision — STI only (v3)

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

# Asset sources

## Certificate privacy previews — 27 October 2026

This entry supersedes earlier public-original and image-viewer descriptions below. Only seven static certificate previews are published. Eight signature regions, including the Code to Success digital-signature annotation, are blurred directly in four lossless `*-redacted.png` images. Pixel comparisons verify that every pixel outside those regions is unchanged. The three unsigned WebP previews are byte-identical to their prior versions.

Original PDFs/images and the four unblurred previews are archived locally in Git-ignored `.private/certificate-originals/`, outside published assets. The build publishes only certificate preview paths listed in the profile and clears old certificate output before copying them. No original-file links or certificate image viewer remain. Earlier published deployments and Git history are not erased by this change. The résumé PDF is unchanged.

## 20 October 2026 AI tool logos

These marks identify tools used in EJ's workflow; they do not imply ownership, sponsorship, or endorsement. Original vendor files are served locally without recoloring, redrawing, or changed proportions. Small white logo surfaces preserve the supplied marks in both site themes. No general open-source license is asserted for these vendor trademarks.

| Local file | Exact source and verification | Applicable notice |
| --- | --- | --- |
| `icons/gemini.svg` | Unmodified 66 × 66 monochrome Gemini spark supplied on [Google's Gemini site](https://gemini.google/about/): [original SVG](https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/c546a20243c57b297546630cf76e417a2483acb8.svg) | Google trademark; [Brand Resource Center](https://about.google/intl/ALL/brand-resource-center/) |
| `icons/chatgpt.svg` | `OpenAI-logos(new)/SVGs/OpenAI-black-monoblossom.svg` from the [official OpenAI logo kit](https://cdn.openai.com/brand/OpenAI-Logos-2025.zip). OpenAI's [ChatGPT icon reference](https://help.openai.com/en/articles/7905742-what-does-the-official-chatgpt-ios-app-icon-look-like) identifies this knot mark. | OpenAI trademark; [brand guidelines](https://openai.com/brand/) |
| `icons/codex.png` | Unmodified 400 × 400 icon from [OpenAI's official Codex extension listing](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt), version `26.51007.21434`: [original PNG](https://openai.gallerycdn.vsassets.io/extensions/openai/chatgpt/26.51007.21434/1791508178385/Microsoft.VisualStudio.Services.Icons.Default). This published product icon uses the shared OpenAI knot on black; it is not a separately invented Codex symbol. | OpenAI trademark; [brand guidelines](https://openai.com/brand/) |
| `icons/claude.svg` | `Anthropic media resources/Anthropic logos/Claude logos/3 Claude Spark/SVG/Claude Spark - Clay.svg` from [Anthropic's official press kit](https://anthropic.com/press-kit), linked by its [newsroom](https://www.anthropic.com/news). Retrieved archive: [vendor ZIP](https://www-cdn.anthropic.com/ae59ca4ca194dac9c9dc3bc78c5829468cb0e8af.zip). | Anthropic/Claude trademark; supplied press asset |

Downloaded brand kits and source-page evidence remain in ignored `.qa/ai-tools/sources/`; only the four selected files are published.

Retrieved 13 October 2026. Original downloads are kept unmodified. Lossless WebP derivatives of the STI login captures and Kwiztorya welcome artwork reduce transfer size without changing pixels. Fonts, logos, and project images are served locally so the site does not depend on an image or font CDN at runtime.

## Fonts — current remake

`fonts/inter-latin-variable.woff2` is Inter's normal Latin variable subset (100–900), 48,256 bytes, from pinned `@fontsource-variable/inter@5.2.8`. Source: https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5.2.8/files/inter-latin-wght-normal.woff2. SIL Open Font License 1.1 is preserved in `fonts/Inter-OFL.txt`. Font loading uses swap and system fallbacks. Retired Sora/Source Sans assets are no longer published.

## Technology and social logos

The following original SVG variants came from [Devicon](https://github.com/devicons/devicon/tree/6a37858047b0e8d9c9c0e68f4a071fc410652e89/icons), pinned to commit `6a37858047b0e8d9c9c0e68f4a071fc410652e89`. Each source is `icons/<name>/<name>-original.svg`; each local filename is `icons/<name>.svg`.

`javascript`, `java`, `html5`, `css3`, `react`, `vite`, `nodejs`, `express`, `postgresql`, `supabase`, `sqlite`, `firebase`, `android`, `androidstudio`, `git`, `github`, `gradle`, `vercel`, `socketio`, `linkedin`, `facebook`.

Devicon's MIT notice is retained at [icons/Devicon-LICENSE](icons/Devicon-LICENSE). Product names and trademarks remain the property of their respective owners; the logos identify technologies and profile destinations and do not imply endorsement. The Vite file is the current original blue mark supplied by that pinned Devicon release.

| Local file | Source | Notice |
| --- | --- | --- |
| `icons/render.svg` | Black logomark in the official [Render brand kit](https://cdn.sanity.io/files/hvk0tap5/production/40134cba8baae95e988e65d2a0675c2521e9c731.zip), linked by [Render's newsroom](https://render.com/newsroom) | [Supplied brand guidelines](icons/Render-logo-guidelines.pdf); no general open-source license supplied for the trademark |
| `icons/instagram.svg` | [Simple Icons original SVG](https://github.com/simple-icons/simple-icons/blob/4d29a35c954699b389a834aacc97dd6e7e74143c/icons/instagram.svg), pinned to commit `4d29a35c954699b389a834aacc97dd6e7e74143c` | [CC0-1.0 notice](icons/Simple-Icons-LICENSE.md), [trademark disclaimer](icons/Simple-Icons-DISCLAIMER.md); Instagram remains a Meta trademark |

`express`, `github`, `gradle`, `vercel`, `socketio`, `render`, and `instagram` need the site's monochrome logo treatment on dark backgrounds. For external SVG images, use an appropriate light CSS filter in the dark theme. Do not apply that filter to the colored technology or LinkedIn/Facebook logos. Keep adequate clear space around the Render mark; use black on light backgrounds and white on dark backgrounds.

All 23 SVG files parse as SVG, declare a `viewBox`, and contain no embedded scripts or JavaScript links. Link labels and decorative-image `alt` handling belong to the site templates.

## Public project images

Only the owner's public repository assets below were copied. The public trees contained no `LICENSE` or `COPYING` file at the inspected revisions; do not infer a general third-party reuse license from their public availability. They are retained here for the owner's authorized portfolio use, with upstream provenance. No production login or student-data endpoint was accessed.

| Local file | Dimensions | Original source and meaning |
| --- | --- | --- |
| `projects/sti-vio-log-login-desktop.png` | 1440 × 900 | [Public desktop login capture](https://github.com/Eyzen08/STI-Vio-Log/blob/6e4b7314c6a801ad1f03a688acc879b757cc3ddb/frontend/login-after-desktop.png). Actual sign-in screen with empty fields. |
| `projects/sti-vio-log-login-mobile.png` | 500 × 900 | [Public mobile login capture](https://github.com/Eyzen08/STI-Vio-Log/blob/6e4b7314c6a801ad1f03a688acc879b757cc3ddb/frontend/login-after-mobile.png). Actual sign-in screen with empty fields. |
| `projects/sti-vio-log-social-preview.jpg` | 1200 × 630 | [Public social preview](https://github.com/Eyzen08/STI-Vio-Log/blob/6e4b7314c6a801ad1f03a688acc879b757cc3ddb/frontend/public/social-preview.jpg). Promotional artwork, not a dashboard capture. |
| `projects/kwiztorya-logo.png` | 373 × 742 | [Public app launch artwork](https://github.com/Eyzen08/Kwiztorya/blob/c92ccde5d44df0d4935cbe31e4999c1da17ddf10/app/src/main/res/drawable/startlogoo.png). Original logo artwork on its original background. |
| `projects/kwiztorya-welcome-art.png` | 373 × 742 | [Public welcome artwork](https://github.com/Eyzen08/Kwiztorya/blob/c92ccde5d44df0d4935cbe31e4999c1da17ddf10/app/src/main/res/drawable/wcpage.png). Precomposed welcome/home artwork with the generic label “Young Learner” and score 0; label it app artwork, not a captured gameplay screen. |

Each downloaded raster was visually inspected. The sign-in screens have no filled credentials or identifiable student records. The Kwiztorya welcome artwork uses only a generic learner label. Images were not retouched, cropped, synthesized, or enlarged.

## Pending owner assets

- The owner-supplied portrait was installed on 19 October 2026 with approved ordinary crops. The latest supplied résumé was installed unchanged on 19 October 2026. The old root `picme.jpg` and `resume.pdf` are not approved for publication and must not be linked by the site.
- Approved STI Vio-Log application/dashboard captures are installed; see the 20 October 2026 entry. Kwiztorya now uses real frames from the owner-supplied device-demo video, documented below. Repository login captures and app artwork remain distinct from gameplay screens.
- Any site-created workflow SVG must be labeled as an illustration, with no invented results or student records.

## 17 October 2026 additions

The owner explicitly selected ordinary cropping and perspective correction without AI redrawing. Source: the supplied 720 × 1280 device-demo MP4 (36.53 seconds). Offline FFmpeg extracted the frames; Pillow performed one bicubic projective transform and WebP encoding at quality 90. No content reconstruction, color replacement, sharpening, or AI synthesis was used. The camera image retains its softness and visible app imperfections. Android status/navigation bars, physical phone edges, desk, and cable are outside the selected app viewport; a small peripheral fingertip remains at the era screen’s upper-left edge without covering its text or controls.

All outputs are 420 × 860, smaller than the sampled display region. Quad order is top-left, top-right, bottom-right, bottom-left in source-frame pixels. The common approximately 1:2.05 viewport follows the photographed app area; no 9:16 video aspect ratio is imposed.

| File | Timestamp | Source quadrilateral | Bytes |
| --- | --- | --- | ---: |
| projects/kwiztorya-quiz.webp | 7.5s | (15,110), (513,70), (582,1040), (124,1090) | 25,496 |
| projects/kwiztorya-eras.webp | 5.0s | (29,195), (526,146), (621,1134), (140,1187) | 34,234 |
| projects/kwiztorya-story.webp | 22.0s | (111,169), (560,190), (599,1101), (127,1143) | 45,068 |

The CSS phone frame is a presentation aid, with no invented device controls. The Story Mode chapter-count placeholders remain visible. Captions identify the recorded demo as the source. The research PDF provides context and design material; it is not published or used as proof of measured learning outcomes.

`icons/python.svg`, `php.svg`, `csharp.svg`, `mysql.svg`, and `vscode.svg` use the same pinned Devicon revision and MIT notice above. `database.svg`, `code.svg`, and `document.svg` are general interface symbols for SQL, XML/SharedPreferences, and export libraries; they are not invented product logos. The EJ mark, workflow illustrations, and social preview were recolored to the approved neutral/blue palette; the social PNG was regenerated from its SVG.

`resume/ej-christian-medilo-resume.pdf` is the owner-supplied updated document, 50,846 bytes. SHA-256 matches the supplied file: `8b918650807cfb1c629702f47d8e9d66d03f2f2d83b598d5b83681ddfd21c818`. Its contents were not edited.

## 19 October 2026 paper theme and résumé synchronization

The owner supplied the latest one-page résumé and confirmed its use as the current source of personal/professional facts. The public PDF is a byte-for-byte copy; its source filename is `EJ_Christian_Medilo_Resume.pdf`. The HTML reflects Moreh Admission Office training (54 hours), BCiS immersion (80 hours), current education, and the five listed credentials. MySQL is no longer a résumé-backed skill. The PDF still describes SQLite more broadly than the source-reviewed active progress implementation; the case study retains the SharedPreferences/SQLite-helper distinction for final owner review.

The earlier paper theme and grain tile were retired by the full visual remake. The current background uses original CSS pastel washes and dots; the social graphic uses the current violet/dark palette. Application screenshots and technology logos retain their original colors.

## 19 October 2026 portrait and photo logo

Source: the owner-supplied 1535 × 2048 PNG. SHA-256: `9797b72166fbd404493ac867486d61a76154d07147795db2383a688d2e33cff8`. The original remains unchanged and is preserved under ignored `.qa/portrait-research/original.png`; only optimized derivatives are published. No temporary absolute source path is included in public pages.

Pillow applied ordinary rectangular cropping, Lanczos downsampling and WebP encoding. Portrait crop bounds in source pixels: `(400,620)` to `(1300,1820)`; avatar bounds: `(650,670)` to `(1080,1100)`. No recoloring, background reconstruction, face reconstruction, sharpening, or generative editing was applied. The cap's natural shadow remains. Exported derivatives contain no source EXIF data.

| Asset | Dimensions | Encoding / bytes |
| --- | --- | --- |
| personal/ej-portrait.webp | 800 × 1067 | WebP quality 86 / 94,452 |
| personal/ej-portrait-400.webp | 400 × 533 | WebP quality 86 / 34,778 |
| personal/ej-avatar.webp | 192 × 192 | WebP quality 88 / 7,012 |
| brand/favicon-32.png | 32 × 32 | PNG, circular alpha mask |
| brand/favicon-48.png | 48 × 48 | PNG, circular alpha mask |

Home and About use the same portrait crop with responsive sources and reserved dimensions. The header/footer use the square avatar inside a CSS circle. The social SVG embeds only the cropped portrait JPEG and avatar PNG derivatives; its PNG was regenerated and visually reviewed. The former EJ initials SVG and four Home-only workflow SVGs were retired. STI Vio-Log's textual case-study process and Kwiztorya's real phone previews remain.

## Interactive bento illustrations — 19 October 2026

The layout was inspired by the owner-selected https://www.pszostak.pl/ reference. No code, portrait, personal imagery, hobby photos, map tiles or logos were copied from that site. `hobbyArtwork()` in the shared templates creates three original inline SVG motifs: a game controller, cinema clapperboard, and illustrated storybook/star. They decorate the owner's confirmed Gaming, Movies and Anime interests without inventing favorite titles or actual hobby photographs.

The location tile's original SVG curves and marker are a decorative geographic motif, not a real street map or precise coordinate. Public location remains Taguig City, Philippines, with Philippine Standard Time (UTC+8). The existing real portrait crop, photo logo, project screenshots, official technology logos, paper texture and licenses are unchanged.

## Hobby media — 19 October 2026

Selected representative publisher imagery for the owner's confirmed interests. These are small, locally encoded WebP thumbnails, not claims of authorship or publisher endorsement. Publisher artwork remains copyrighted; source provenance is not a blanket redistribution license. Final imagery/rights review remains part of the existing owner approval gate before publication. The Naruto special wallpaper collection explicitly excluded by the brief was not used.

| File | Source and treatment |
| --- | --- |
| `hobbies/naruto.webp` | NARUTO official anime key visual, https://naruto-official.com/anime/series/naruto1_visual.webp; source page https://naruto-official.com/en/anime/naruto1. Kishimoto / Shueisha / TV Tokyo / Pierrot. Resized within 480×640, no content reconstructed. |
| `hobbies/mlbb.webp` | MOONTON official gallery social artwork: https://akmweb.youngjoygame.com/web/gms/image/c3d1596795b86dc26e5f1ef2d48c3dfd.jpg from https://www.mobilelegends.com/gallery. Official emblem image, not a claimed favorite hero. |
| `hobbies/valorant.webp` | Riot VALORANT media, https://playvalorant.com/en-us/media/; image https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/083baed63d306ee9ba41df4971ac0f6bb0222032-1920x1080.jpg?accountingTag=VAL. Use remains subject to Riot's linked fan-content policy. Representative agent artwork, not a favorite-agent claim. |
| `hobbies/spiderman.webp` | Sony Pictures theatrical artwork, https://www.sonypictures.com/sites/default/files/title-key-art/spiderman_onesheet_1400x2100.jpg from https://www.sonypictures.com/movies/spiderman. Representative franchise imagery; no favorite actor/installment is claimed. |
| `hobbies/thrillers.webp` | The Lodger (1927) poster by E. McKnight Kauffer, public-domain scan from https://commons.wikimedia.org/wiki/File:The_Lodger_(1927_film_poster).jpg. Used to illustrate the genre; the site does not claim this is EJ's favorite movie. |

All five derivatives preserve the full source image and natural colors; CSS crops the display inside cards. Original downloads stay under ignored `.qa/remake/`. Alt text, dimensions, credits and source-page links are recorded in `data/profile.json` and exposed in the artwork credits disclosure. Combined WebP transfer: 211,492 bytes. There is no runtime hotlinking.

`profile.gallery` currently contains only the approved portrait. Its source/crop provenance above remains unchanged. Additional personal photographs must be supplied by the owner; no substitute personal scenes were invented.

## 20 October 2026 project picture decks

Six owner-supplied STI Vio-Log screenshots replace the earlier login-only presentation. The combined Kwiztorya showcase and Background screenshot attachments were layout references only. Original STI PNGs remain unchanged in ignored research storage; only sanitized WebP derivatives are published. No absolute temporary source paths are emitted.

Opaque color masks hide visible account names, student names/IDs, account initials and populated username/password/account areas. Coordinates below use original pixels (left, top, right, bottom). Resizing preserves aspect ratio; WebP quality 92 for masters and 90 for small sources, method 6. Small desktop sources fit within 960×960 without upscaling. Mobile captures already include device frames, so no second frame is rendered. Counts are interface content, not measured adoption or outcomes.

| Screen | Source SHA-256 | Dimensions | Mask rectangles |
|---|---|---|---|
| dashboard | `ac36a03e50eb79eaa7f34e259763ada9d496bdb4349335166ca49584c22cfc43` | 1905×994 | `[[1668, 14, 1872, 63], [297, 447, 550, 537], [286, 807, 548, 994]]` |
| attendance | `590efa5a2abf0968ec4f614c87e405a88bb4e6d0d5aef0c8066e2ccccfa5ff69` | 1919×994 | `[[1678, 14, 1874, 63]]` |
| student | `1887d33aa6335a606eea278559403afd6ed917eeeb8fc817d38bd34d0e86545f` | 483×892 | `[[77, 228, 393, 261], [360, 139, 409, 187]]` |
| navigation | `71a02fd7f50802970ae7e4c0bc0d449e63f124c8233726211f4a8633f6083662` | 504×899 | `[[387, 141, 435, 188]]` |
| landing | `f35956383f7e0557bc2a64bb022d48f56318b94e7705c058cd694dc8c0a6ddb6` | 1901×992 | `[]` |
| signin | `337f20c2666997e8b2a69302100b16f2afbdf8365d28817f84725781f403d962` | 1919×994 | `[[1260, 352, 1635, 384], [1260, 421, 1620, 450], [1245, 610, 1668, 665]]` |

### Kwiztorya enhancement

The built-in imagegen tool edited Quiz, Era selection and Story Mode separately from the unchanged 420×860 recorded-demo WebPs. Instructions requested deblurring, contrast/lighting correction and compression cleanup at about 2× resolution, preserving readable text, colors, controls, screen layout and progress states. No CLI/API key or new dependency was used. All original captures remain unchanged and separately linked from each active caption.

Quiz was corrected after an early result duplicated the ending of option B. Era selection was corrected after a result changed the Modern Era description; the accepted wording is “Post-war Philippines to contemporary times.” Its count remains 0 Questions; the other eras show 6 Questions. Story Mode retains literal `%1$d Story Chapters` and `%1$d-%2$d min`, plus the disabled “Complete Journey 1 First” control. Captions say **Enhanced from the recorded device demo.**

Outputs were downsampled within 840×1720 and small variants within 420×860 using Lanczos, with no additional upscaling. Restoration changes edge/typographic rendering and illumination; it is not a pixel-identical device capture. The original remains the factual reference.

| Screen | Original SHA-256 | Enhanced SHA-256 | Enhanced dimensions / bytes |
|---|---|---|---|
| quiz | `a9ad252516e08dab623124d84ee5d985c52e2b644ba4643de9a4875374ecb95a` | `9e2c230f06486359fecc3413e982abee444a7cd701feafff8e34adcc8fca60fc` | 840×1717 / 62,442 |
| eras | `2b2e4b242e1362643eaca26b7e0b05680c2598b15f2b9ad3c1e890244dd80696` | `c47499dc734e4c1106be0aceea7a49557aca4938ba6e9c527b0efb1c7c6bbbe1` | 840×1717 / 120,674 |
| story | `22f4fc8a58a2f35ab5d276643a1f440717258df077921f2bdf996d3ec1b588e7` | `450c5717c023c6e87f679cf83f53b7063ba717b22122d00fa9bdf71a42745308` | 840×1718 / 132,004 |

Accepted generated PNG copies and full-size side-by-side comparisons are preserved under ignored `.qa/picture-decks/`. The six STI input hashes, original dimensions and mask coordinates are also recorded there in `sti-provenance.json`. Public derivatives live under `assets/projects/`; no raw private STI inputs are published.


## 20 October 2026 Compact Previews and Phone Crops

The owner requested and approved a clean recreation of the supplied Kwiztorya Home photograph, including the single-line **KWIZTORYA** title. The other three attachments in that request were presentation references only. The unchanged 946×2048 photo remains outside published output. Its SHA-256 is `32ed586603c3e83e01beb705db2353c36f58bbb6238d96c77addfe247881006e`.

The public `projects/kwiztorya-home-capture.webp` is an ordinary app-only perspective crop, 420×860, encoded with bicubic resampling and WebP quality 92/method 6. Source quadrilateral (TL, TR, BR, BL): `(89,311), (777,279), (843,1691), (143,1723)`. It excludes the hardware, surrounding scene, and OS bars, while retaining the photographed split title and original interface as a comparison reference.

The built-in imagegen tool produced the separately labeled recreation. Requested approximately 840×1720 portrait output, upright app screen only; orange palette; single-line KWIZTORYA; yellow underline; exact subtitle “Philippine History Trivia”; History Novice panel with `Total Score: 0 | Eras: 0/5`; Play, Story Mode, Chapter Selection, and Settings buttons; footer “Learn · Play · Discover Philippine History”. The prompt excluded invented controls, scores, device chrome, and new subtitles. Book/crown icon rendering and typography were recreated; this is not an unmodified application capture. The source/recreated comparison was reviewed for all text and progress states.

The generated PNG was proportionally downsampled with Lanczos, without further upscaling, to `projects/kwiztorya-home-recreated.webp` (840×1718, 70,252 bytes, quality 92) and a small variant within 420×860 (quality 90). Master SHA-256: `a1cf24ff35b5dd2301089f6bb285626d9e242e13e2611bfa4d2e08c019c013ad`. The image is visibly labeled **Recreated Preview** in overview cards; its case-study caption explains the correction and links to the original app crop. Home precedes Quiz, Era Selection, and Story Mode. The three earlier enhanced images retain their distinct attribution and original comparison links.

### STI Mobile Transparent Derivatives

These were made from the existing full-resolution **sanitized WebP assets**, not the reduced portfolio screenshots or raw private inputs. The original sanitized assets remain unchanged. Crop bounds are in those sanitized source pixels. A 60px rounded mask was antialiased at 4× resolution and downsampled to the output alpha channel. WebP quality 94/method 6 preserves exact alpha. All four corners are transparent; central screen pixels remain opaque. No second device frame is rendered.

| Derivative | Sanitized Source SHA-256 | Crop (L,T,R,B) | Output | Output SHA-256 |
|---|---|---|---|---|
| `projects/sti-vio-log-student-cropped.webp` | `f26cf1b53f353e5f74cb7c5f7f1a6b4bb85ae0e527b945064daad5dff08ec653` | `(36,24,434,871)` | 398×847; 30,786 bytes | `19a546e2f70ab1841ffeb67fe0ce7013da36e540b7536926066fe45e369acf7a` |
| `projects/sti-vio-log-navigation-cropped.webp` | `f437264c7a3e00fb3925727fb837b938348db1b2a8fa3847c9b8c67d89265ab2` | `(55,24,456,871)` | 401×847; 28,582 bytes | `61d7cf480c3b398d03caa45144e69be0df7703b37d250939ac6dec01c6b0de96` |

The full hardware frame, screen, browser interface, and existing opaque redactions remain. Before/after comparisons were inspected at full output resolution. These captures are interface demonstrations; dashboard counts are not adoption or outcome claims. Both already-small mobile derivatives are served at their native width without a redundant smaller export or upscaling. Other images retain existing responsive variants and reserved dimensions. Local comparisons, exact transformation records, and original personal inputs remain in ignored review storage and are not copied to public output.

## Training certificates

The owner supplied three certificate images and a one-page Cyber Threat Management PDF for public portfolio previews. Files in `certifications/` preserve these original documents unchanged. WebP thumbnails retain the full page and aspect ratio, with a maximum dimension of 1100 pixels. The PDF thumbnail renders its first page. Introduction to Modern AI has no supplied certificate and uses a neutral preview-unavailable placeholder without an invented document. All five cards share equal dimensions and full-page, contained preview areas.

## Campus photo and interactive location map — 20 October 2026

`education/sti-global-city.jpg` is the unchanged 1200×825, 279,413-byte campus photograph published on STI's official [Global City campus page](https://www.sti.edu/campuses-details.asp?campus_id=R0xP), from `https://www.sti.edu/cms/images/school/all/global.jpg`. Credit: STI College. The Education highlight uses an ordinary CSS crop. Project Leadership reuses the existing sanitized STI dashboard and Kwiztorya Home preview; Training reuses the supplied Code to Success and Cyber Threat Management certificate previews. No team photograph or new project screenshot was fabricated.

The location card now uses MapLibre GL JS 6.15.0 with OpenFreeMap Positron/Dark styles and live OpenStreetMap data. Required attribution remains on the map. The map shows a city-level Taguig view, not a home address, and never requests browser geolocation. MapLibre's browser module, worker, stylesheet and license are copied locally by the build. Styles, sprites, glyphs and tiles load from `tiles.openfreemap.org`; the deployment CSP permits that host and the local worker without allowing inline scripts or eval. Source licenses remain in the dependency and published vendor directory.



## Résumé-led redesign — 25 October 2026

This entry supersedes earlier résumé and social-preview notes. The existing public résumé was replaced byte-for-byte by the owner's matching updated `EJ_Christian_Medilo_RESUME.pdf` (70,415 bytes; SHA-256 `789013513f4916e26205c61831ee166379b0d714c8a807b96a5683f3e713e641`). The document includes fourth-year BSIT status, the MIT Department placement and seven professional-development entries. No PDF contents were edited. The source filename differs from the `(3)` filename mentioned in the brief; extracted contents match the requested updated facts.

The existing social SVG/PNG uses the neutral charcoal/sage palette and aspiring-developer positioning. Existing portrait images, authentic application captures, enhanced/recreated labels, original-capture links, certificate documents and image provenance remain unchanged. Four certificate previews are available; the remaining three résumé entries have no invented image, issuer or verification link.


## Reference recreation — 26 October 2026

This entry supersedes the prior social-preview palette and hero notes. `personal/ej-formal-cutout.png` is the owner's unchanged 408×612 transparent PNG supplied from `formal_pic-removebg-preview.png`. SHA-256: `2bda32198b054d733abdf364152099b26f8059320e6f2de1267dc4b13ddb7de3`. Only CSS sizing, positioning and a lower-edge fade are applied; there is no generated or reconstructed facial detail. The original casual portrait, optimized variants and photo logo remain available and are used on About and shared branding.

`fonts/archivo-variable.ttf` is the official Google Fonts Archivo width/weight variable font, downloaded from the google/fonts repository's `ofl/archivo/Archivo[wdth,wght].ttf`; its OFL license is `fonts/Archivo-OFL.txt`. The hero and section headings use 115% width. Existing self-hosted Inter remains the body font. `brand/grain.svg` is a small original SVG turbulence texture authored for this implementation. No reference-site photograph, logo, personal text or commercial testimonial was copied.

The social preview SVG/PNG uses the monochrome palette and embeds the same owner-supplied formal PNG. Existing certificate documents/previews, sanitized application screens, recreated/enhanced labels and original-capture links remain unchanged. Four certificate previews are available across seven records; three records correctly state that no preview is available.


## Remaining certificate originals supplied — 26 October 2026

This entry supersedes earlier statements that three previews were unavailable. The owner supplied the remaining three one-page PDF certificates. All originals were copied byte-for-byte into `certifications/` under clean public filenames. Poppler rendered the entire first page at a maximum dimension of 1100px; WebP quality 90 thumbnails preserve the full page and aspect ratio. Original PDFs and all rendered previews were visually inspected. All seven training records now have authentic previews and original-document links on Home and Training. The résumé PDF remains unchanged.

| Public PDF | Supplied source | Issuer / completion | Preview |
|---|---|---|---|
| `azure-ai-fundamentals.pdf` | `Certificate_of_Completion (1).pdf` | TESDA Online Program, 24 October 2026 | 1100×778; 56,412 bytes |
| `introduction-to-modern-ai.pdf` | Owner's Introduction to Modern AI certificate PDF | DICT-ITU DTC Initiative through Cisco Networking Academy, 25 October 2026 | 1100×746; 57,710 bytes |
| `fundamentals-of-artificial-intelligence.pdf` | `Certificate_of_Completion.pdf` | TESDA Online Program, 24 October 2026 | 1100×778; 53,158 bytes |

The TESDA course named Microsoft Artificial Intelligence Course: Azure AI Fundamentals is represented as a TESDA Online Program completion certificate. No Microsoft certification exam or Microsoft-issued credential is implied. Existing month-level dates are retained consistently across the site; these source records supply the exact days.

Original SHA-256 fingerprints:
- `azure-ai-fundamentals.pdf`: `b2dc0255e8690b4578825a5dc836af54bdae992501d3c5e63206b4f57e8e8f26`
- `introduction-to-modern-ai.pdf`: `f110423ed4b52e0efb1d221b443dfde5b787f8a6a3705bd61b6ab2fd5968ffc2`
- `fundamentals-of-artificial-intelligence.pdf`: `65c68cdb3ec376d7172508f2430bd4fe810cb91e197e2e3ffdf08cefc2510ea8`

## 26 October 2026 — supplied project mockups

Current revision: STI selects the four 1920 × 1080 `sti-vio-log-mockup-*-v3.webp` compositions (960 × 540 thumbnails), with the authentic live-site logo and masked public sign-in captures over the cool-white office background. Kwiztorya retains the four original supplied 1536 × 1024 compositions and original screenshot popup. PNG masters/backgrounds are in `design/project-showcase/`; raw live captures stay in ignored `.qa/`. See the current-revision section of `docs/PROJECT-SHOWCASE.md` for provenance, privacy masks, and verification. The following paragraph records the earlier version.

Home, Projects and both case-study galleries now use the eight owner-approved landscape compositions. STI combines the nine supplied transparent devices and the supplied desktop landing image over four AI-generated studio background plates. UI pixels are supplied imagery, with account/student identifiers masked before native-browser PNG export. Kwiztorya uses four supplied phone/tablet presentation compositions unchanged. These are labeled presentation mockups, not unmodified device screenshots. PNG masters and generated backgrounds are outside the published assets, in design/project-showcase/. Full provenance, generation prompts, composition groupings and QA are documented in docs/PROJECT-SHOWCASE.md. Existing source assets remain unchanged; unredacted new source captures are not published.

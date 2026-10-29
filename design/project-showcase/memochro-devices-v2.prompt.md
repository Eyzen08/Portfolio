# MemoChro device scene — generation prompt

Generated with the built-in ImageGen tool on 29 October 2026. The saved scene is `memochro-devices-v2.png` in this directory. It contains blank devices; the real screenshots are added locally by `scripts/render-memochro-mockup.py` using Pillow and NumPy. No interface text is generated.

## Prompt

Create a premium photorealistic 3D product rendering for a web designer's portfolio. Landscape 16:9 composition, target 2400x1350. Matte charcoal studio backdrop and dark stone surface, warm bronze rim light, soft directional key light from upper left, realistic soft contact shadows and restrained glass reflections. Exactly THREE devices: a large elegant black desktop monitor with a slim stand dominating the left 63% of the image, a black tablet upright in portrait orientation on the right, and a black smartphone upright near the lower center-right. All devices are fully within frame with comfortable 5% margins. Camera angles only slightly oblique so text can later be placed legibly. The desktop has a 16:10 active screen; tablet screen aspect ratio 820:1100; phone screen aspect ratio 390:844. CRITICAL: EVERY active display is a completely uniform light warm ivory blank rectangle, no interface, no text, no symbols, no logos, no image, no browser chrome. All four screen edges must be crisp and easy to identify, with rounded inner corners. Realistic solid machined dark graphite frames with fine warm edge highlights, subtle thickness, physically accurate rounded glass corners. Devices may overlap only at their outer housing/stands: every active display area must remain fully visible and NOT be covered by another device. Arrange the phone in front and between the desktop and tablet without obscuring their active screen areas; keep the tablet and phone large enough to be seen at thumbnail size. A sophisticated commercial device mockup scene, tangible depth and tasteful dimensionality. No additional objects, no people, no cables, no floating decorative shapes, no lettering anywhere. Leave most background very dark and neutral, with no bright spotlight circle. Output one finished high-resolution studio render.

## Finished assets

- `assets/projects/memochro-featured-v2.png` — 2400 × 1350.
- `assets/projects/memochro-featured-v2-small.webp` — 960 × 540.
- The original supplied image remains unchanged at `assets/projects/memochro-featured.png`.

The generated master is 1672 × 941. Screenshots are fitted without stretching, mapped into the measured screen quadrilaterals, and masked against the glass to preserve corners, bezels, and the phone camera cutout. The phone's small overlap with the monitor is excluded from the monitor mask. The final composite is resized proportionally and center-cropped by less than one source pixel to the output aspect ratio.

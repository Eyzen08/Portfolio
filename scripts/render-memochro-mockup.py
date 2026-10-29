"""Fit real MemoChro captures into the generated studio render.

Offline asset tool; requires Pillow and NumPy, not portfolio runtime packages.
Coordinates are measured against the 1672 x 941 generated master.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "design/project-showcase/memochro-devices-v2.png"
OUTPUT = ROOT / "assets/projects"
SIZE = (2400, 1350)


def inverse_perspective(quad, width, height):
    """Return Pillow's output-to-input homography for four screen corners."""
    equations, values = [], []
    for (x, y), (u, v) in zip(quad, [(0, 0), (width-1, 0), (width-1, height-1), (0, height-1)]):
        equations.extend([[x, y, 1, 0, 0, 0, -u*x, -u*y],
                          [0, 0, 0, x, y, 1, -v*x, -v*y]])
        values.extend([u, v])
    return np.linalg.solve(equations, values)


def render():
    original = Image.open(MASTER).convert("RGB")
    scale = SIZE[0] / original.width
    crop_y = (original.height * scale - SIZE[1]) / 2
    scene = ImageOps.fit(original, SIZE, method=Image.Resampling.LANCZOS)
    pixels = np.asarray(scene)
    # Preserve the generated glass corners, dark bezels, and phone camera cutout.
    ivory = (pixels[:, :, 0] > 190) & (pixels[:, :, 1] > 180) & (pixels[:, :, 2] > 160)
    devices = [
        ("desktop", [(118, 71), (1042, 115), (1057, 611), (122, 626)], (1440, 830), 0),
        ("tablet", [(1223, 289), (1576, 271), (1576, 792), (1223, 774)], (820, 1190), 0),
        ("phone", [(1032, 502), (1172, 502), (1174, 819), (1034, 823)], (390, 880), 34),
    ]
    for name, corners, plane_size, safe_top in devices:
        capture = Image.open(OUTPUT / f"memochro-{name}.png").convert("RGB")
        plane = Image.new("RGB", plane_size, capture.getpixel((0, 0)))
        fitted = ImageOps.contain(capture, (plane.width, plane.height - safe_top), Image.Resampling.LANCZOS)
        plane.paste(fitted, ((plane.width - fitted.width)//2, safe_top))
        quad = [(x*scale, y*scale-crop_y) for x, y in corners]
        warped = plane.transform(SIZE, Image.Transform.PERSPECTIVE,
                                 inverse_perspective(quad, *plane.size), Image.Resampling.BICUBIC,
                                 fillcolor=plane.getpixel((0, 0)))
        mask = Image.new("L", SIZE)
        draw = ImageDraw.Draw(mask)
        draw.polygon(quad, fill=255)
        if name == "desktop":
            # The foreground phone housing slightly overlaps the monitor glass.
            draw.rounded_rectangle((1019*scale, 494*scale-crop_y,
                                    1180*scale, 830*scale-crop_y), radius=26*scale, fill=0)
        mask = Image.fromarray(np.where(ivory, np.asarray(mask), 0).astype("uint8"))
        scene.paste(warped, (0, 0), mask)
    scene.save(OUTPUT / "memochro-featured-v2.png", optimize=True)
    scene.resize((960, 540), Image.Resampling.LANCZOS).save(
        OUTPUT / "memochro-featured-v2-small.webp", quality=88, method=6)
    print("Rendered MemoChro v2: 2400 x 1350 master and 960 x 540 thumbnail")


if __name__ == "__main__":
    render()

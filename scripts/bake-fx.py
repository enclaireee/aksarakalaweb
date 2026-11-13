"""Bake the Journey scene's colour filters into tinted PNG copies.

journey/data.ts points sil/dim/dark props at `name.<tone>.png`; this writes those
files next to the originals. Re-run after changing the art or the scatter:

  node --experimental-strip-types --no-warnings -e 'import("./components/scenes/journey/data.ts").then(m=>console.log([...new Set([...Object.values(m.LAYER_ITEMS),...Object.values(m.LAYER_CRITTERS)].flat().map(i=>i.src))].join("\\n")))' | python3 scripts/bake-fx.py
"""

import re
import sys

from PIL import Image

# tone: (brightness, saturate), the CSS filters these copies replace.
TONES = {"black": (0, 1), "sil": (0.22, 0.6), "dim": (0.6, 0.85), "dark": (0.12, 0.6)}


def matrix(b, s):
    # CSS brightness() then saturate(), per the Filter Effects spec.
    return tuple(
        b * v
        for v in (
            0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0,
            0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0,
            0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0,
        )
    )


for src in sys.stdin.read().split():
    m = re.fullmatch(r"(.+)\.(black|sil|dim|dark)\.png", src)
    if not m:
        continue
    img = Image.open(f"public{m[1]}.png").convert("RGBA")
    out = img.convert("RGB").convert("RGB", matrix(*TONES[m[2]]))
    out.putalpha(img.getchannel("A"))
    out.save(f"public{src}", optimize=True)
    print("baked", src)

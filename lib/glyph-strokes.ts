/**
 * Single-stroke glyph templates, copied from the game's recogniser data
 * (`.docs/glyph_strokes.py` STROKES / `data/glyphs/<id>.tres`). Raw points are
 * in the game's authoring space; `glyphStroke()` normalises them into a
 * 0..100-wide box (aspect preserved) for SVG use.
 */
export type Pt = readonly [x: number, y: number];

const RAW = {
  sunda_ka: [
    [120, 113], [255, 113], [140, 395], [290, 113], [425, 113], [310, 395],
  ],
  sunda_ga: [
    [620, 113], [750, 113], [650, 380], [840, 380], [880, 265], [775, 265],
  ],
  sunda_nga: [
    [1135, 113], [1265, 113], [1160, 380], [1355, 380], [1315, 250],
  ],
  sunda_ca: [
    [1640, 113], [1770, 113], [1700, 300], [1660, 345], [1640, 375], [1615, 385],
    [1595, 370], [1590, 345], [1605, 315], [1630, 302], [1660, 310], [1690, 335],
    [1730, 375], [1770, 398], [1800, 392], [1825, 360], [1840, 320], [1910, 113],
  ],
} as const satisfies Record<string, readonly Pt[]>;

export type GlyphId = keyof typeof RAW;

export interface GlyphStroke {
  /** Normalised polyline: x in 0..100, y in 0..height. */
  points: Pt[];
  width: number;
  height: number;
  /** `points` attribute for an SVG <polyline>. */
  polyline: string;
  /** Path data (`M x y L x y ...`), e.g. for CSS offset-path. */
  path: string;
}

const round = (v: number) => Math.round(v * 100) / 100;

export function glyphStroke(id: GlyphId): GlyphStroke {
  const raw: readonly Pt[] = RAW[id];
  const xs = raw.map((p) => p[0]);
  const ys = raw.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const k = 100 / (Math.max(...xs) - minX);
  const points = raw.map(
    ([x, y]) => [round((x - minX) * k), round((y - minY) * k)] as const
  );
  return {
    points,
    width: 100,
    height: round((Math.max(...ys) - minY) * k),
    polyline: points.map((p) => p.join(",")).join(" "),
    path: points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" "),
  };
}

export const GLYPH_STROKES: Record<GlyphId, GlyphStroke> = {
  sunda_ka: glyphStroke("sunda_ka"),
  sunda_ga: glyphStroke("sunda_ga"),
  sunda_nga: glyphStroke("sunda_nga"),
  sunda_ca: glyphStroke("sunda_ca"),
};

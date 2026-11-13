/**
 * World data for the journey side-scroller.
 *
 * Everything is measured in "u" = one game pixel (the scene is designed as a
 * 270u-tall frame, anchored to the bottom of the stage). World x = 0 is the
 * hero's column at --p = 0; the hero has walked TRAVEL u by --p = 1.
 *
 * Props are scattered with a seeded PRNG so server and client render the
 * exact same markup.
 */

const ART = "/game/art";

/** Distance the hero covers across the scene, in u. */
export const TRAVEL = 2040;
/** Height of the ground band (6 tile rows of 16u). */
export const GROUND_H = 96;

export type RegionId =
  | "purwa"
  | "sunda"
  | "mataram"
  | "kidul"
  | "kala";

export type LayerId = "ridge" | "far" | "mid" | "back" | "front" | "near";

/** Parallax factor per layer (1 = moves with the ground). */
export const LAYER_FACTOR: Record<LayerId, number> = {
  ridge: 0.2,
  far: 0.45,
  mid: 0.72,
  back: 1,
  front: 1,
  near: 1.7,
};

export interface Region {
  id: RegionId;
  /** File suffix used by props/ground art. */
  art: string;
  /** World range in u. */
  a: number;
  b: number;
  /** ground_<art>.png sheet rows used for the six 16u ground rows, top to bottom. */
  rows: number[];
}

export const REGIONS: Region[] = [
  { id: "purwa", art: "sunda", a: -260, b: 200, rows: [0, 0, 1, 1, 0, 0] },
  { id: "sunda", art: "sunda", a: 200, b: 660, rows: [0, 0, 1, 1, 0, 0] },
  { id: "mataram", art: "mataram", a: 660, b: 1120, rows: [0, 0, 2, 2, 0, 0] },
  { id: "kidul", art: "kidul", a: 1120, b: 1580, rows: [3, 3, 4, 4, 3, 3] },
  { id: "kala", art: "kala", a: 1580, b: 2560, rows: [0, 3, 2, 2, 3, 0] },
];

/** --p at which the hero steps into each region (after purwa). */
export const REGION_P = REGIONS.slice(1).map((r) => r.a / TRAVEL);

export type ItemFx = "sil" | "dim" | "dark" | "mist" | "glow" | "firefly";

export interface Item {
  src: string;
  /** Rendered size and position in u (already multiplied by scale). */
  w: number;
  h: number;
  x: number;
  /** Distance of the sprite's bottom edge from the stage bottom. */
  b: number;
  flip?: boolean;
  fx?: ItemFx;
  /** Animation delay in seconds for looping fx. */
  delay?: number;
}

export type Motion = "none" | "patrol" | "bob" | "flutter";

export interface Critter {
  src: string;
  /** Source frame + sheet size in px. */
  fw: number;
  fh: number;
  sw: number;
  sh: number;
  frames: number;
  row: number;
  start?: number;
  fps: number;
  scale: number;
  x: number;
  b: number;
  flip?: boolean;
  motion: Motion;
  delay?: number;
  dim?: boolean;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(0x4b414c41);
const r1 = (n: number) => Math.round(n * 10) / 10;

type Def = readonly [src: string, w: number, h: number];

/** Real sizes of the per-region props (verified with `file`). */
const PROP_SIZE: Record<string, readonly [number, number]> = {
  tree_acacia: [32, 48],
  tree_banyan: [32, 48],
  tree_crystal: [32, 48],
  tree_dead: [32, 48],
  tree_mangrove: [32, 48],
  tree_palm: [32, 48],
  tree_spire: [32, 48],
  tree_teak: [32, 48],
  bamboo: [32, 48],
  candi_arch: [30, 28],
  candi_pillar: [14, 24],
  candi_block: [20, 16],
  shrine: [28, 30],
  lantern: [14, 24],
  rock_l: [27, 20],
  rock_m: [17, 13],
  rock_s: [11, 9],
  boat: [40, 18],
  coral_0: [20, 20],
  coral_1: [20, 20],
  crystal_s: [16, 22],
  bush: [16, 16],
  tuft_0: [8, 6],
  tuft_1: [8, 6],
  tuft_2: [8, 6],
  flower_0: [7, 9],
  flower_1: [7, 9],
  flower_2: [7, 9],
  pebbles_0: [9, 5],
  pebbles_1: [9, 5],
  bones_0: [20, 11],
  bones_1: [20, 11],
  jar: [12, 15],
};

const prop = (name: string, art: string): Def => {
  const [w, h] = PROP_SIZE[name];
  return [`${ART}/props/${name}_${art}.png`, w, h];
};
const props = (names: string[], art: string) => names.map((n) => prop(n, art));

const STORY: Record<string, Def> = {
  tangkuban: [`${ART}/story/tangkuban_perahu.png`, 36, 26],
  candi: [`${ART}/story/candi_seribu.png`, 36, 32],
  nyiRoro: [`${ART}/story/nyi_roro_kidul.png`, 32, 32],
  veil: [`${ART}/story/eclipse_veil.png`, 48, 40],
  crater: [`${ART}/story/crater_seal.png`, 26, 28],
  kalaStone: [`${ART}/story/batara_kala.png`, 28, 28],
  well: [`${ART}/story/purwa_well.png`, 28, 30],
  stageLamps: [`${ART}/story/purwa_stage_lamps.png`, 50, 42],
  stake: [`${ART}/props/curse_stake.png`, 36, 24],
};
const petilasan = (art: string): Def => [
  `${ART}/story/petilasan_${art}.png`,
  34,
  40,
];
const MIST: Def = [`${ART}/world_fx/fx_mist.png`, 48, 24];
const DOT: Def = [`${ART}/world_fx/fx_dot.png`, 3, 3];
const GLOW: Def = [`${ART}/cutscene/lamp_glow.png`, 240, 240];

export const LAYER_ITEMS: Record<LayerId, Item[]> = {
  ridge: [],
  far: [],
  mid: [],
  back: [],
  front: [],
  near: [],
};
export const LAYER_CRITTERS: Record<"mid" | "back" | "front", Critter[]> = {
  mid: [],
  back: [],
  front: [],
};

/** Range a region occupies inside a layer's own coordinate space. */
function span(layer: LayerId, region: Region): [number, number] {
  const f = LAYER_FACTOR[layer];
  const off = f < 1 ? (1 - f) * 160 : 0;
  const lo = region.id === "purwa" ? region.a : region.a * f + off;
  return [lo, region.b * f + off];
}

function put(
  layer: LayerId,
  def: Def,
  x: number,
  b: number,
  scale: number,
  extra: Partial<Item> = {}
) {
  // Colour fx are baked into tinted copies (scripts/bake-fx.py): a CSS filter on
  // every prop is a GPU pass per frame. The ridge silhouettes are pure black.
  const fx = extra.fx;
  const tone =
    fx === "sil" && layer === "ridge"
      ? "black"
      : fx === "sil" || fx === "dim" || fx === "dark"
        ? fx
        : null;
  LAYER_ITEMS[layer].push({
    src: tone ? def[0].replace(/\.png$/, `.${tone}.png`) : def[0],
    w: r1(def[1] * scale),
    h: r1(def[2] * scale),
    x: r1(x),
    b: r1(b),
    ...extra,
  });
}

/** Place something at fraction t (0..1) of a region within a layer, centred on x. */
function at(
  layer: LayerId,
  region: Region,
  def: Def,
  t: number,
  b: number,
  scale: number,
  extra: Partial<Item> = {}
) {
  const [lo, hi] = span(layer, region);
  put(layer, def, lo + t * (hi - lo) - (def[1] * scale) / 2, b, scale, extra);
}

/** Jittered, evenly spread scatter of `n` sprites from `pool`. */
function scatter(
  layer: LayerId,
  region: Region,
  pool: Def[],
  n: number,
  bRange: [number, number],
  sRange: [number, number],
  extra: Partial<Item> = {},
  randomFlip = true
) {
  const [lo, hi] = span(layer, region);
  for (let i = 0; i < n; i++) {
    const def = pool[Math.floor(rnd() * pool.length)];
    const scale = Math.round((sRange[0] + rnd() * (sRange[1] - sRange[0])) * 4) / 4;
    const x = lo + ((i + rnd()) / n) * (hi - lo) - (def[1] * scale) / 2;
    const b = bRange[0] + rnd() * (bRange[1] - bRange[0]);
    put(layer, def, x, b, scale, {
      ...extra,
      flip: randomFlip && rnd() < 0.5 ? true : undefined,
      delay: extra.fx === "mist" || extra.fx === "firefly" ? r1(rnd() * 6) : undefined,
    });
  }
}

function critter(
  layer: "mid" | "back" | "front",
  region: Region,
  t: number,
  c: Omit<Critter, "x">
) {
  const [lo, hi] = span(layer, region);
  LAYER_CRITTERS[layer].push({
    ...c,
    src: c.dim ? c.src.replace(/\.png$/, ".dim.png") : c.src,
    x: r1(lo + t * (hi - lo)),
    delay: c.delay ?? r1(rnd() * 3),
  });
}

/** 4x4 enemy sheet: row 0 idle @4fps, row 1 walk @9fps. */
const enemy = (
  id: string,
  cellW: number,
  cellH: number,
  walk: boolean,
  b: number,
  extra: Partial<Critter> = {}
): Omit<Critter, "x"> => ({
  src: `${ART}/enemies/${id}.png`,
  fw: cellW,
  fh: cellH,
  sw: cellW * 4,
  sh: cellH * 4,
  frames: 4,
  row: walk ? 1 : 0,
  fps: walk ? 9 : 4,
  scale: 1,
  b,
  motion: walk ? "patrol" : "none",
  ...extra,
});

const animal = (
  id: string,
  fw: number,
  fh: number,
  sw: number,
  sh: number,
  frames: number,
  row: number,
  b: number,
  motion: Motion,
  extra: Partial<Critter> = {}
): Omit<Critter, "x"> => ({
  src: `${ART}/ambient/${id}.png`,
  fw,
  fh,
  sw,
  sh,
  frames,
  row,
  fps: motion === "patrol" ? 8 : 4,
  scale: 1,
  b,
  motion,
  ...extra,
});

const torch = (b: number): Omit<Critter, "x"> => ({
  src: `${ART}/props/oncor.png`,
  fw: 16,
  fh: 34,
  sw: 64,
  sh: 34,
  frames: 3,
  start: 1,
  row: 0,
  fps: 9,
  scale: 1,
  b,
  motion: "none",
});

const kalaEye = (b: number): Omit<Critter, "x"> => ({
  src: `${ART}/world_fx/kala_eye.png`,
  fw: 10,
  fh: 10,
  sw: 30,
  sh: 10,
  frames: 3,
  row: 0,
  fps: 1.5,
  scale: 1,
  b,
  motion: "none",
});

const butterfly = (row: number, b: number): Omit<Critter, "x"> => ({
  src: `${ART}/ambient/butterfly.png`,
  fw: 7,
  fh: 6,
  sw: 28,
  sh: 24,
  frames: 4,
  row,
  fps: 8,
  scale: 1,
  b,
  motion: "flutter",
});

/* ------------------------------------------------------------------ */
/* per-region flora                                                    */
/* ------------------------------------------------------------------ */

interface Flora {
  ridge: string[];
  ridgeN: number;
  mid: string[];
  midN: number;
  back: string[];
  backN: number;
  edge: string[];
  deco: string[];
  front: string[];
  near: string[];
}

const TUFTS = ["tuft_0", "tuft_1", "tuft_2"];
const FLOWERS = ["flower_0", "flower_1", "flower_2"];
const PEBBLES = ["pebbles_0", "pebbles_1", "rock_s"];

const FLORA: Record<RegionId, Flora> = {
  purwa: {
    ridge: ["tree_spire", "tree_banyan"],
    ridgeN: 5,
    mid: ["tree_banyan", "tree_palm", "tree_teak", "bamboo"],
    midN: 11,
    back: ["tree_banyan", "tree_palm", "tree_teak", "lantern"],
    backN: 9,
    edge: ["bush", "bush", "rock_m"],
    deco: [...TUFTS, ...FLOWERS, "jar"],
    front: ["bush", "tree_palm", "lantern"],
    near: ["tree_banyan", "tree_palm"],
  },
  sunda: {
    ridge: ["tree_spire"],
    ridgeN: 7,
    mid: ["bamboo", "bamboo", "tree_banyan", "tree_teak", "tree_mangrove"],
    midN: 16,
    back: ["bamboo", "bamboo", "tree_banyan", "tree_teak", "tree_acacia", "rock_l"],
    backN: 13,
    edge: ["bush", "bush", "rock_m", "bamboo"],
    deco: [...TUFTS, ...TUFTS, ...FLOWERS, "pebbles_0"],
    front: ["bush", "bamboo", "rock_l", "tree_teak"],
    near: ["bamboo", "tree_banyan", "bamboo"],
  },
  mataram: {
    ridge: ["tree_spire", "candi_arch"],
    ridgeN: 6,
    mid: ["candi_arch", "candi_pillar", "tree_banyan", "tree_acacia", "candi_pillar"],
    midN: 14,
    back: ["candi_arch", "candi_pillar", "candi_block", "tree_banyan", "tree_acacia", "rock_l"],
    backN: 13,
    edge: ["candi_block", "bush", "rock_m", "candi_pillar"],
    deco: [...TUFTS, ...PEBBLES, "flower_1"],
    front: ["candi_block", "candi_pillar", "bush", "rock_l"],
    near: ["candi_arch", "candi_pillar", "tree_banyan"],
  },
  kidul: {
    ridge: ["tree_spire"],
    ridgeN: 4,
    mid: ["tree_mangrove", "tree_spire", "rock_l"],
    midN: 5,
    back: ["tree_palm", "tree_palm", "tree_mangrove", "coral_0", "coral_1", "rock_l", "boat"],
    backN: 12,
    edge: ["coral_0", "coral_1", "rock_m", "bush", "crystal_s"],
    deco: [...PEBBLES, "coral_1", "tuft_0", "rock_s"],
    front: ["coral_0", "boat", "rock_l", "tree_palm"],
    near: ["tree_palm", "tree_mangrove", "rock_l"],
  },
  kala: {
    ridge: ["tree_spire", "tree_dead"],
    ridgeN: 12,
    mid: ["tree_dead", "tree_crystal", "tree_spire", "tree_banyan", "candi_pillar"],
    midN: 26,
    back: ["tree_dead", "tree_crystal", "crystal_s", "candi_pillar", "lantern", "rock_l", "tree_banyan"],
    backN: 24,
    edge: ["rock_m", "crystal_s", "bush", "bones_0"],
    deco: [...PEBBLES, "bones_0", "bones_1", "tuft_0", "crystal_s"],
    front: ["crystal_s", "rock_l", "tree_dead", "lantern"],
    near: ["tree_dead", "tree_spire", "tree_crystal"],
  },
};

for (const region of REGIONS) {
  const fl = FLORA[region.id];
  const art = region.art;
  const wide = (region.b - region.a) / 460;

  // Distant ridge: flat silhouettes just above the horizon.
  scatter("ridge", region, props(fl.ridge, art), fl.ridgeN, [84, 90], [1.25, 2], { fx: "sil" });

  // Mid: a tall dimmed wall of trees / ruins behind the playfield.
  scatter("mid", region, props(fl.mid, art), fl.midN, [86, 93], [1.5, 2], { fx: "dim" });

  // Back: props standing along the upper edge of the ground, behind the hero.
  scatter("back", region, props(fl.back, art), fl.backN, [84, 97], [1, 1.5]);
  scatter("back", region, props(fl.edge, art), Math.round(12 * wide), [88, 96], [1, 1]);
  scatter("back", region, props(fl.deco, art), Math.round(10 * wide), [66, 88], [1, 1]);

  // Front: things between the hero and the camera.
  scatter("front", region, props(fl.deco, art), Math.round(8 * wide), [2, 26], [1, 1]);
  scatter("front", region, props(fl.front, art), Math.round(5 * wide), [-12, 12], [1, 1.5]);

  // Near: big dark shapes rushing past.
  scatter("near", region, props(fl.near, art), Math.round(3 * wide), [-46, -24], [3, 4], { fx: "dark" });
}

/* ------------------------------------------------------------------ */
/* hand-placed landmarks, fx and life                                  */
/* ------------------------------------------------------------------ */

const [purwa, sunda, mataram, kidul, kala] = REGIONS;

// --- Desa Purwa: huts, lamps, the well
at("far", purwa, prop("shrine", "sunda"), 0.3, 88, 3, { fx: "sil" });
at("far", purwa, prop("shrine", "sunda"), 0.62, 88, 2.5, { fx: "sil", flip: true });
at("far", purwa, prop("tree_banyan", "sunda"), 0.85, 88, 2, { fx: "sil" });
at("back", purwa, GLOW, 0.42, 0, 0.9, { fx: "glow" });
at("back", purwa, GLOW, 0.74, 20, 0.7, { fx: "glow" });
at("back", purwa, prop("shrine", "sunda"), 0.34, 92, 2);
at("back", purwa, prop("shrine", "sunda"), 0.5, 94, 1.5, { flip: true });
at("back", purwa, STORY.stageLamps, 0.43, 80, 1);
at("back", purwa, STORY.well, 0.66, 86, 1);
at("back", purwa, prop("shrine", "sunda"), 0.78, 92, 1.5);
critter("back", purwa, 0.38, torch(84));
critter("back", purwa, 0.585, torch(88));
critter("back", purwa, 0.72, torch(82));
critter("back", purwa, 0.86, torch(86));
critter("front", purwa, 0.62, torch(4));
critter("back", purwa, 0.6, animal("animal_dog", 16, 13, 128, 39, 6, 0, 72, "patrol"));
critter("back", purwa, 0.47, animal("animal_duck", 12, 12, 96, 24, 6, 0, 68, "patrol", { flip: true }));

// --- Tatar Sunda: the crater, bamboo, mist, fireflies
at("far", sunda, STORY.tangkuban, 0.52, 86, 3.5, { fx: "sil" });
at("far", sunda, STORY.tangkuban, 0.14, 88, 2, { fx: "sil", flip: true });
at("far", sunda, prop("bamboo", "sunda"), 0.3, 86, 1.75, { fx: "sil" });
at("far", sunda, prop("bamboo", "sunda"), 0.8, 86, 2, { fx: "sil" });
at("far", sunda, STORY.crater, 0.93, 88, 2.5, { fx: "sil" });
at("back", sunda, petilasan("sunda"), 0.55, 90, 1.5);
scatter("back", sunda, [MIST], 5, [78, 96], [4, 6], { fx: "mist" }, false);
scatter("mid", sunda, [MIST], 3, [92, 110], [5, 7], { fx: "mist" }, false);
scatter("front", sunda, [MIST], 3, [-10, 10], [5, 6], { fx: "mist" }, false);
scatter("back", sunda, [DOT], 12, [70, 140], [1, 1], { fx: "firefly" }, false);
scatter("front", sunda, [DOT], 8, [10, 70], [1, 1], { fx: "firefly" }, false);
critter("back", sunda, 0.2, animal("animal_kerbau", 28, 20, 224, 40, 4, 0, 74, "none"));
critter("back", sunda, 0.44, enemy("kuntilanak", 32, 32, false, 86, { flip: true }));
critter("mid", sunda, 0.6, enemy("kuntilanak", 32, 32, false, 98, { flip: true, dim: true, scale: 1.5 }));
critter("back", sunda, 0.72, enemy("jurig_leuweung", 40, 36, true, 80));
critter("back", sunda, 0.9, enemy("jurig_leuweung", 40, 36, false, 84, { flip: true }));
critter("back", sunda, 0.3, butterfly(0, 92));
critter("back", sunda, 0.36, butterfly(1, 76));
critter("front", sunda, 0.66, butterfly(2, 22));

// --- Mataram: a thousand temples
const candiSpots: Array<[number, number, number]> = [
  [0.04, 2, 88], [0.14, 2.5, 86], [0.24, 2, 90], [0.33, 2.5, 88], [0.44, 3, 86],
  [0.55, 2, 90], [0.63, 3, 87], [0.73, 2, 90], [0.82, 2.75, 86], [0.93, 2.5, 88],
];
for (const [t, s, b] of candiSpots) {
  at("far", mataram, STORY.candi, t, b, s, { fx: "sil" });
}
for (const t of [0.08, 0.3, 0.5, 0.7, 0.9]) {
  at("ridge", mataram, STORY.candi, t, 88, 2, { fx: "sil" });
}
at("back", mataram, STORY.candi, 0.3, 90, 2);
at("back", mataram, STORY.candi, 0.64, 92, 1.5);
at("back", mataram, petilasan("mataram"), 0.48, 88, 1.5);
critter("back", mataram, 0.22, enemy("arca", 32, 32, false, 84, { flip: true }));
critter("back", mataram, 0.76, enemy("arca", 32, 32, false, 88));
critter("back", mataram, 0.4, enemy("prajurit_terkutuk", 40, 36, true, 78));
critter("back", mataram, 0.86, enemy("prajurit_terkutuk", 40, 36, false, 80, { flip: true }));
critter("back", mataram, 0.6, animal("animal_goat", 18, 16, 144, 32, 6, 0, 70, "patrol"));

// --- Segara Kidul: the southern sea
at("far", kidul, STORY.nyiRoro, 0.5, 98, 2.5, { fx: "sil" });
at("far", kidul, prop("candi_arch", "kidul"), 0.2, 98, 2.5, { fx: "sil" });
at("far", kidul, prop("tree_spire", "kidul"), 0.8, 96, 1.75, { fx: "sil" });
at("back", kidul, petilasan("kidul"), 0.5, 88, 1.5);
at("back", kidul, STORY.nyiRoro, 0.76, 92, 1.5);
scatter("front", kidul, [MIST], 2, [-8, 6], [5, 6], { fx: "mist" }, false);
critter("back", kidul, 0.3, enemy("yuyu_kangkang", 44, 32, true, 74));
critter("back", kidul, 0.84, enemy("yuyu_kangkang", 44, 32, false, 80, { flip: true }));
critter("front", kidul, 0.62, enemy("yuyu_kangkang", 44, 32, false, 2));

// --- Gua Kala: the Maw of Time
at("far", kala, STORY.veil, 0.36, 92, 2.25, { fx: "sil" });
at("far", kala, STORY.kalaStone, 0.12, 88, 3, { fx: "sil" });
at("far", kala, STORY.kalaStone, 0.62, 88, 3, { fx: "sil", flip: true });
at("far", kala, prop("tree_dead", "kala"), 0.24, 88, 2, { fx: "sil" });
at("far", kala, prop("tree_dead", "kala"), 0.5, 88, 1.75, { fx: "sil", flip: true });
at("far", kala, prop("tree_spire", "kala"), 0.8, 86, 2, { fx: "sil" });
at("back", kala, petilasan("kala"), 0.12, 88, 1.5);
at("back", kala, STORY.stake, 0.2, 80, 1);
at("back", kala, STORY.stake, 0.33, 86, 1, { flip: true });
at("back", kala, STORY.kalaStone, 0.27, 90, 1.5);
// The Maw itself, a little ahead of where the hero stops (world x = TRAVEL).
put("back", STORY.veil, TRAVEL + 70, 74, 3);
put("back", STORY.kalaStone, TRAVEL + 30, 84, 2);
put("back", STORY.kalaStone, TRAVEL + 232, 84, 2, { flip: true });
scatter("back", kala, [MIST], 7, [76, 96], [4, 6], { fx: "mist" }, false);
scatter("front", kala, [MIST], 5, [-10, 8], [5, 6], { fx: "mist" }, false);
critter("back", kala, 0.08, enemy("faceless", 32, 32, false, 84, { flip: true }));
critter("back", kala, 0.17, enemy("faceless", 32, 32, true, 76, { flip: true }));
critter("back", kala, 0.25, enemy("faceless", 32, 32, false, 88, { flip: true }));
critter("back", kala, 0.31, enemy("faceless", 32, 32, false, 80, { flip: true }));
critter("back", kala, 0.38, enemy("faceless", 32, 32, true, 74, { flip: true }));
critter("back", kala, 0.43, enemy("faceless", 32, 32, false, 86, { flip: true }));
critter("mid", kala, 0.2, enemy("faceless", 32, 32, false, 96, { flip: true, dim: true, scale: 1.5 }));
critter("mid", kala, 0.4, enemy("faceless", 32, 32, false, 96, { flip: true, dim: true, scale: 1.5 }));
for (const [t, b] of [[0.1, 118], [0.19, 132], [0.28, 112], [0.36, 126], [0.45, 116]] as const) {
  critter("back", kala, t, kalaEye(b));
}

// Draw order inside a layer: higher on screen (further away) first.
for (const id of Object.keys(LAYER_ITEMS) as LayerId[]) {
  LAYER_ITEMS[id] = LAYER_ITEMS[id]
    .map((item, i) => ({ item, i }))
    .sort((p, q) => {
      const pg = p.item.fx === "glow" ? 1 : 0;
      const qg = q.item.fx === "glow" ? 1 : 0;
      return qg - pg || q.item.b - p.item.b || p.i - q.i;
    })
    .map(({ item }) => item);
}

/** The eclipse hanging over Gua Kala (ridge layer coordinates). */
export const ECLIPSE = { src: "/assets/pixel/kala_eclipse.png", x: 468, b: 112, size: 80 };

/** The southern sea: a band of water in the mid layer (layer coordinates, u). */
export const SEA = { x: 878, w: 300, b: 90, h: 44 };

/** Boats and serpents that sit on the sea (mid layer, drawn after it). */
export const SEA_ITEMS: Item[] = [
  { src: `${ART}/props/boat_kidul.png`, w: 60, h: 27, x: SEA.x + 44, b: 106 },
  { src: `${ART}/props/boat_kidul.png`, w: 40, h: 18, x: SEA.x + 150, b: 120, flip: true },
  { src: `${ART}/props/boat_kidul.png`, w: 80, h: 36, x: SEA.x + 206, b: 98 },
];
export const SEA_CRITTERS: Critter[] = [
  {
    src: `${ART}/enemies/ula_segara.png`,
    fw: 40, fh: 36, sw: 160, sh: 144, frames: 4, row: 0, fps: 4,
    scale: 1.5, x: SEA.x + 108, b: 94, motion: "bob", delay: 0.4,
  },
  {
    src: `${ART}/enemies/ula_segara.png`,
    fw: 40, fh: 36, sw: 160, sh: 144, frames: 4, row: 0, fps: 4,
    scale: 1, x: SEA.x + 248, b: 112, motion: "bob", flip: true, delay: 1.6,
  },
];

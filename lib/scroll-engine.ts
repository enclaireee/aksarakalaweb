/**
 * Scroll engine: one rAF loop for the whole page.
 *
 * Each registered scene is a tall <section> with a sticky, viewport-sized pin
 * inside it. Every frame the engine works out how far the (smoothed) scroll
 * position is through each scene and writes that to CSS custom properties on
 * the section, so scene visuals are driven by CSS `calc()` instead of React
 * re-renders.
 *
 *   --p      0..1 across the pinned range of the scene
 *   --fade   0..1 opacity envelope (fades in at the start, out at the end)
 *   --<name> 0..1 for every named sub-range passed in `vars`
 */

export type Range = readonly [start: number, end: number];

export interface SceneConfig {
  id: string;
  el: HTMLElement;
  vars?: Record<string, Range>;
  /** Fraction of the scene spent fading in / out. 0 disables that side. */
  fadeIn?: number;
  fadeOut?: number;
  /** Called whenever progress changes (use for discrete state, not styling). */
  onProgress?: (p: number) => void;
}

interface Entry extends SceneConfig {
  lastP: number;
  lastOn: boolean | null;
}

const entries = new Set<Entry>();
const activeListeners = new Set<(id: string | null) => void>();

let rafId = 0;
let smoothY = 0;
let activeId: string | null = null;
let reducedMotion = false;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const range = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

function frame() {
  const targetY = window.scrollY;
  const diff = targetY - smoothY;
  smoothY =
    reducedMotion || Math.abs(diff) < 0.5 ? targetY : smoothY + diff * 0.14;
  const lag = targetY - smoothY;
  const vh = window.innerHeight;

  // Read phase
  const measured: Array<[Entry, number, boolean, boolean]> = [];
  for (const e of entries) {
    const rect = e.el.getBoundingClientRect();
    const top = rect.top + lag; // where the section top sits at the smoothed position
    const span = Math.max(1, rect.height - vh);
    const p = clamp01(-top / span);
    const on = top < vh * 1.25 && top + rect.height > -vh * 0.25;
    const centred = top <= vh * 0.5 && top + rect.height > vh * 0.5;
    measured.push([e, p, on, centred]);
  }

  // Write phase
  let nextActive: string | null = null;
  for (const [e, p, on, centred] of measured) {
    if (centred) nextActive = e.id;
    if (on !== e.lastOn) {
      e.lastOn = on;
      e.el.dataset.on = on ? "true" : "false";
    }
    if (Math.abs(p - e.lastP) < 0.0002) continue;
    e.lastP = p;
    const s = e.el.style;
    s.setProperty("--p", p.toFixed(4));
    const fi = e.fadeIn ?? 0.06;
    const fo = e.fadeOut ?? 0.06;
    const fade = Math.min(
      fi > 0 ? clamp01(p / fi) : 1,
      fo > 0 ? clamp01((1 - p) / fo) : 1
    );
    s.setProperty("--fade", fade.toFixed(4));
    if (e.vars) {
      for (const name in e.vars) {
        const [a, b] = e.vars[name];
        s.setProperty(`--${name}`, range(p, a, b).toFixed(4));
      }
    }
    e.onProgress?.(p);
  }

  if (nextActive !== activeId) {
    activeId = nextActive;
    activeListeners.forEach((cb) => cb(activeId));
  }

  rafId = requestAnimationFrame(frame);
}

function start() {
  if (rafId) return;
  smoothY = window.scrollY;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  rafId = requestAnimationFrame(frame);
}

function stop() {
  cancelAnimationFrame(rafId);
  rafId = 0;
}

export function registerScene(config: SceneConfig) {
  const entry: Entry = { ...config, lastP: -1, lastOn: null };
  entries.add(entry);
  start();
  return () => {
    entries.delete(entry);
    if (entries.size === 0) stop();
  };
}

/** Subscribe to the id of the scene currently under the middle of the viewport. */
export function onActiveScene(cb: (id: string | null) => void) {
  activeListeners.add(cb);
  cb(activeId);
  return () => {
    activeListeners.delete(cb);
  };
}

/** Smooth-scroll to a point (0..1) inside a scene's pinned range. */
export function scrollToScene(id: string, at = 0) {
  for (const e of entries) {
    if (e.id !== id) continue;
    const rect = e.el.getBoundingClientRect();
    const span = Math.max(0, rect.height - window.innerHeight);
    window.scrollTo({
      top: window.scrollY + rect.top + span * at,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    return;
  }
}

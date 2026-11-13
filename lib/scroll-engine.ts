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
let listening = false;
let smoothY = 0;
let lastTargetY = 0;
let activeId: string | null = null;
let reducedMotion = false;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const range = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

/** Smoothing time constant in ms: higher = floatier scroll, lower = snappier. */
const SMOOTH_MS = 170;
let lastT = 0;

function frame(now: number) {
  // Time-based easing so 60Hz and 120Hz screens feel the same (a fixed
  // per-frame factor is twice as stiff at 120Hz). dt is capped so a
  // background-tab pause doesn't land as one big jump.
  const dt = Math.min(64, lastT ? now - lastT : 16.7);
  lastT = now;
  const targetY = window.scrollY;
  const vh = window.innerHeight;
  // A jump of over a screen in one frame (Home key, logo click, scrollbar drag)
  // teleports; easing it would replay every scene in between, e.g. the gate
  // zooming back out for a second after you land on the hero.
  const jumped = Math.abs(targetY - lastTargetY) > vh;
  lastTargetY = targetY;
  const diff = targetY - smoothY;
  smoothY =
    reducedMotion || jumped || Math.abs(diff) < 0.5
      ? targetY
      : smoothY + diff * (1 - Math.exp(-dt / SMOOTH_MS));
  // Fast flicks: never trail more than a screen behind what's actually on screen.
  smoothY = Math.min(targetY + vh, Math.max(targetY - vh, smoothY));
  const lag = targetY - smoothY;

  // Read phase
  const measured: Array<[Entry, number, boolean, boolean]> = [];
  for (const e of entries) {
    const rect = e.el.getBoundingClientRect();
    const top = rect.top + lag; // where the section top sits at the smoothed position
    const span = Math.max(1, rect.height - vh);
    const p = clamp01(-top / span);
    // Visibility follows the real position: the pin is on screen there, not at the smoothed one.
    const on = rect.top < vh * 1.25 && rect.bottom > -vh * 0.25;
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

  // Settled: sleep until the next scroll/resize instead of spinning 60 times a second.
  rafId = smoothY === targetY ? 0 : requestAnimationFrame(frame);
}

function wake() {
  if (rafId) return;
  lastT = 0;
  rafId = requestAnimationFrame(frame);
}

function start() {
  if (listening) return;
  listening = true;
  smoothY = lastTargetY = window.scrollY;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", wake);
}

function stop() {
  cancelAnimationFrame(rafId);
  rafId = 0;
  listening = false;
  window.removeEventListener("scroll", wake);
  window.removeEventListener("resize", wake);
}

export function registerScene(config: SceneConfig) {
  const entry: Entry = { ...config, lastP: -1, lastOn: null };
  entries.add(entry);
  start();
  wake();
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

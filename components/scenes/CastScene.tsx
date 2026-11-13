"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Scene, useCopy } from "@/components/Scene";
import { scrollToScene } from "@/lib/scroll-engine";
import { castCopy } from "@/lib/copy/cast";
import { GLYPH_STROKES, type GlyphStroke } from "@/lib/glyph-strokes";
import { GroundRows, PxSprite } from "./cast/PxSprite";
import s from "./cast.module.css";

const ART = "/game/art";
const HERO = `${ART}/hero_mage.png`;

/** Scroll ranges (fractions of the pinned scene) exposed as CSS variables. */
const VARS = {
  adv: [0.02, 0.165], // enemies charge in
  creep: [0.165, 0.47], // ...and barely move while time is slowed
  slow: [0.165, 0.215],
  slowOut: [0.455, 0.475],
  gIn: [0.27, 0.29],
  draw: [0.29, 0.45], // Ka is written
  adv2: [0.485, 0.545], // the survivors lunge
  slow2In: [0.54, 0.555],
  slow2Out: [0.635, 0.65],
  draw2: [0.56, 0.635], // Ca is written, faster
} as const;

/**
 * Discrete steps, entered when --p crosses each cut:
 * 0 charge · 1 time slows · 2 writing Ka · 3 release (Bolt) · 4 slow again,
 * writing Ca · 5 release (Burst) · 6 aftermath + call to action
 */
const CUTS = [0.165, 0.28, 0.47, 0.545, 0.645, 0.72];

interface Enemy {
  src: string;
  cell: number;
  sheet: number;
  /** Offset from the lead enemy, in spread units (~vw). */
  ox: number;
  /** Depth lane in source px (positive = further back). */
  lane: number;
  /** How far behind the pack it starts. */
  lag: number;
  fly?: boolean;
  wideOnly?: boolean;
}

const ENEMIES: Enemy[] = [
  { src: "kuntilanak", cell: 32, sheet: 128, ox: 0, lane: 0, lag: 0 },
  { src: "pocong", cell: 32, sheet: 128, ox: 11, lane: 3, lag: 0.35 },
  { src: "faceless", cell: 32, sheet: 128, ox: 21, lane: -3, lag: 0.15 },
  { src: "banaspati", cell: 24, sheet: 96, ox: 15, lane: 0, lag: 0.6, fly: true },
  { src: "faceless", cell: 32, sheet: 128, ox: 32, lane: 2, lag: 0.5 },
  { src: "pocong", cell: 32, sheet: 128, ox: 42, lane: -2, lag: 0.8, wideOnly: true },
];

const TREES = ["bamboo", "tree_banyan", "tree_teak", "tree_dead"] as const;
const tree = (i: number) => `${ART}/props/${TREES[i % TREES.length]}_sunda.png`;

const FAR_ROW = Array.from({ length: 16 }, (_, i) => ({
  src: tree([0, 2, 1, 0, 2, 3, 1, 0, 0, 2, 1, 2, 0, 3, 1, 0][i]),
  x: i * 7.6 + (i % 3) * 1.4,
}));

const MID_ROW = [
  { src: tree(0), x: 2 },
  { src: tree(1), x: 15 },
  { src: tree(0), x: 27 },
  { src: tree(3), x: 47 },
  { src: tree(0), x: 60 },
  { src: tree(2), x: 73 },
  { src: tree(0), x: 86 },
  { src: tree(1), x: 97 },
  { src: tree(0), x: 109 },
];

const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 43 + 9) % 100,
  y: (i * 17 + 4) % 40,
  d: (i * 0.6) % 3,
}));

const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 29 + 6) % 100,
  y: 30 + ((i * 13) % 34),
  d: (i * 0.9) % 6,
  t: 5 + (i % 4) * 1.3,
}));

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  x: 34 + ((i * 17) % 62),
  d: (i * 0.45) % 4,
  t: 3.4 + (i % 4) * 0.8,
}));

/** One-shot effect wrapper: invisible until `delay`, visible for `dur`, then gone. */
function Fx({
  className,
  dur,
  delay = 0,
  children,
}: {
  className: string;
  dur: number;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${s.fx} ${className}`}
      style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/** The aksara as a single glowing stroke, scrubbed by the wrapper's --d (0..1). */
function GlyphSvg({ glyph }: { glyph: GlyphStroke }) {
  const pad = 14;
  return (
    <svg
      className={s.glyphSvg}
      viewBox={`${-pad} ${-pad} ${glyph.width + pad * 2} ${glyph.height + pad * 2}`}
      fill="none"
      aria-hidden="true"
    >
      <polyline className={s.guide} points={glyph.polyline} />
      <polyline className={`${s.stroke} ${s.strokeGlow}`} points={glyph.polyline} pathLength={1} />
      <polyline className={`${s.stroke} ${s.strokeInk}`} points={glyph.polyline} pathLength={1} />
      <polyline className={`${s.stroke} ${s.strokeCore}`} points={glyph.polyline} pathLength={1} />
      <g className={s.tip} style={{ offsetPath: `path('${glyph.path}')` }}>
        <g className={s.tipPulse}>
          <circle r="9" className={s.tipHalo} />
          <path d="M0 -13 L2.4 -2.4 L13 0 L2.4 2.4 L0 13 L-2.4 2.4 L-13 0 L-2.4 -2.4 Z" className={s.tipStar} />
          <circle r="3.2" className={s.tipDot} />
        </g>
      </g>
    </svg>
  );
}

export function CastScene() {
  const t = useCopy(castCopy);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  const onProgress = (p: number) => {
    let next = 0;
    for (const cut of CUTS) if (p >= cut) next++;
    if (next !== stepRef.current) {
      stepRef.current = next;
      setStep(next);
    }
  };

  const slowed = step === 1 || step === 2 || step === 4;
  const bolted = step >= 3;
  const burst = step >= 5;
  const threat = step === 3 || step === 4;

  // Hero pose per step (hero_mage.png, 32px cells; row 1 idle, rows 6-8 staff attacks).
  const hero =
    step === 0 || step === 6
      ? { row: 1, start: 0, frames: 4, fps: 4, once: false }
      : step <= 2
        ? { row: 6, start: 0, frames: 3, fps: 6, once: true }
        : step === 3
          ? { row: 6, start: 3, frames: 3, fps: 10, once: true }
          : step === 4
            ? { row: 7, start: 0, frames: 3, fps: 6, once: true }
            : { row: 8, start: 0, frames: 6, fps: 12, once: true };
  const heroKey = step === 6 ? 0 : step === 2 ? 1 : step;

  return (
    <Scene id="cast" length={340} vars={VARS} fadeOut={0.05} onProgress={onProgress}>
      <div className={`${s.stage} ${slowed ? s.slowed : ""}`}>
        <div className={`${s.shakeBox} ${burst ? s.shaking : ""}`}>
          {/* ---------- night forest ---------- */}
          <div className={s.world} aria-hidden="true">
            <div className={s.sky} />
            {STARS.map((st, i) => (
              <span
                key={i}
                className={`${s.star} animate-twinkle`}
                style={{ left: `${st.x}%`, top: `${st.y}%`, animationDelay: `${st.d}s` }}
              />
            ))}
            <div className={s.backdrop}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={`${s.hills} pixelated`} src={`${ART}/ui/title_far.png`} alt="" />
            </div>

            <div className={`${s.treeRow} ${s.farRow}`}>
              {FAR_ROW.map((tr, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} className={`${s.tree} pixelated`} src={tr.src} alt="" style={{ left: `${tr.x}vw` }} />
              ))}
            </div>

            <div className={`${s.treeRow} ${s.midRow}`}>
              {MID_ROW.map((tr, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} className={`${s.tree} pixelated`} src={tr.src} alt="" style={{ left: `${tr.x}vw` }} />
              ))}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={`${s.shrine} pixelated`} src={`${ART}/props/shrine_sunda.png`} alt="" />
              {[38, 92].map((x) => (
                <div key={x} className={s.lantern} style={{ left: `${x}vw` }}>
                  <span className={s.lanternGlow} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pixelated" src={`${ART}/props/lantern_sunda.png`} alt="" />
                </div>
              ))}
            </div>

            <GroundRows rows={[0, 1, 0, 0, 0, 0, 0, 0, 0, 0]} className={s.ground} />
            <div className={s.groundShade} />

            {FIREFLIES.map((f, i) => (
              <span
                key={i}
                className={s.firefly}
                style={
                  {
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    animationDelay: `-${f.d}s`,
                    "--t": `${f.t}s`,
                  } as CSSProperties
                }
              />
            ))}

            {/* ---------- the ones who come ---------- */}
            {ENEMIES.map((e, i) => {
              const lead = i === 0;
              const sheet = `${ART}/enemies/${e.src}.png`;
              const row = !lead && threat ? 2 : 1;
              const sprite = (r: number, frames: number, fps: number) => (
                <PxSprite
                  key={r}
                  src={sheet}
                  fw={e.cell}
                  fh={e.cell}
                  sw={e.sheet}
                  sh={e.sheet}
                  row={r}
                  frames={frames}
                  fps={fps}
                  flip
                />
              );
              return (
                <div
                  key={i}
                  className={`${s.enemy} ${e.wideOnly ? s.wideOnly : ""}`}
                  style={
                    {
                      "--ox": e.ox,
                      "--lane": e.lane,
                      "--lag": e.lag,
                      "--cell": e.cell,
                      zIndex: 10 - e.lane,
                    } as CSSProperties
                  }
                >
                  {!e.fly && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={`${s.shadow} pixelated ${(lead ? bolted : burst) ? s.shadowGone : ""}`}
                      src={`${ART}/hero_shadow.png`}
                      alt=""
                    />
                  )}
                  <div
                    className={`${s.enemyBody} ${e.fly ? s.fly : ""} ${!lead && burst ? s.blown : ""}`}
                    style={{ animationDelay: !lead && burst ? `${i * 0.05}s` : undefined }}
                  >
                    {lead ? (
                      <>
                        <div className={bolted ? s.struck : undefined}>{sprite(1, 4, 9)}</div>
                        {bolted && <div className={s.dead}>{sprite(3, 1, 4)}</div>}
                      </>
                    ) : (
                      sprite(row, 4, row === 2 ? 8 : 9)
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* time slows: the world drains and dims, the hero does not */}
          <div className={s.desat} aria-hidden="true" />
          <div className={s.dimmer} aria-hidden="true" />

          {/* ---------- the one who remembers ---------- */}
          <div className={s.hero} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.shadow} pixelated`} src={`${ART}/hero_shadow.png`} alt="" />
            <span className={s.heroAura} />
            <PxSprite key={heroKey} src={HERO} fw={32} fh={32} sw={192} sh={576} {...hero} />
          </div>

          {/* ---------- cast 1: Bolt ---------- */}
          {bolted && (
            <>
              <Fx className={s.sigil} dur={0.5}>
                <PxSprite src={`${ART}/fx/spells/cast_sigil_mage.png`} fw={64} fh={64} sw={384} sh={64} frames={6} fps={12} once />
              </Fx>
              <Fx className={s.bolt} dur={0.26} delay={0.04}>
                <span className={s.boltTrail} />
                <PxSprite src={`${ART}/fx/spells/bolt_fly_mage.png`} fw={24} fh={12} sw={96} sh={12} frames={4} fps={16} />
              </Fx>
              <Fx className={s.hit} dur={0.3} delay={0.28}>
                <PxSprite
                  src={`${ART}/fx/spells/hit_burst_mage.png`}
                  fw={32}
                  fh={32}
                  sw={160}
                  sh={32}
                  frames={5}
                  fps={17}
                  once
                  mult={2}
                  style={{ animationDelay: "0.28s" }}
                />
              </Fx>
            </>
          )}

          {/* ---------- cast 2: Burst ---------- */}
          {burst && (
            <>
              <Fx className={`${s.sigil} ${s.amber}`} dur={0.5}>
                <PxSprite src={`${ART}/fx/spells/cast_sigil.png`} fw={64} fh={64} sw={384} sh={64} frames={6} fps={12} once />
              </Fx>
              <Fx className={`${s.shock} ${s.amber}`} dur={0.6} delay={0.05}>
                <PxSprite
                  src={`${ART}/fx/spells/shock.png`}
                  fw={128}
                  fh={128}
                  sw={768}
                  sh={128}
                  frames={6}
                  fps={10}
                  once
                  style={{ animationDelay: "0.05s" }}
                />
              </Fx>
              {SPARKS.map((sp, i) => (
                <span
                  key={i}
                  className={s.spark}
                  aria-hidden="true"
                  style={{ left: `${sp.x}%`, animationDelay: `${sp.d}s`, animationDuration: `${sp.t}s` }}
                />
              ))}
            </>
          )}

          {/* near silhouettes frame the fight */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${s.near} ${s.nearL} pixelated`} src={tree(0)} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${s.near} ${s.nearR} pixelated`} src={tree(0)} alt="" />
        </div>

        {/* ---------- the aksara, written in the air ---------- */}
        <div
          className={`${s.glyph} ${s.glyphKa} ${bolted ? s.spent : ""}`}
          aria-hidden="true"
        >
          <div className={s.glyphInner}>
            <GlyphSvg glyph={GLYPH_STROKES.sunda_ka} />
          </div>
        </div>
        <div
          className={`${s.glyph} ${s.glyphCa} ${step < 4 ? s.unwritten : ""} ${burst ? s.spent : ""}`}
          aria-hidden="true"
        >
          <div className={s.glyphInner}>
            <GlyphSvg glyph={GLYPH_STROKES.sunda_ca} />
          </div>
        </div>

        {bolted && (
          <Fx className={`${s.seal} ${s.blue}`} dur={0.5}>
            <PxSprite src={`${ART}/fx/ink/seal.png`} fw={64} fh={64} sw={448} sh={64} frames={7} fps={14} once />
          </Fx>
        )}
        {burst && (
          <Fx className={`${s.seal} ${s.amber}`} dur={0.5}>
            <PxSprite src={`${ART}/fx/ink/seal.png`} fw={64} fh={64} sw={448} sh={64} frames={7} fps={14} once />
          </Fx>
        )}

        <div className={s.vignette} aria-hidden="true" />
        {bolted && <div className={`${s.flash} ${s.flashBlue}`} aria-hidden="true" />}
        {burst && <div className={`${s.flash} ${s.flashAmber}`} aria-hidden="true" />}

        {/* ---------- copy ---------- */}
        <div className={s.scrim} aria-hidden="true" />
        <div className={s.copy}>
          <div className={s.block} data-on={step === 0}>
            <h2 className={`${s.line} font-display`}>{t.come}</h2>
          </div>
          <div className={s.block} data-on={step === 1}>
            <p className={`${s.big} font-display`}>{t.slow}</p>
            <p className={`${s.sub} ${s.subCyan} font-pixel`}>{t.slowSub}</p>
          </div>
          <div className={s.block} data-on={step === 2}>
            <p className={`${s.big} font-display`}>{t.write}</p>
            <p className={`${s.sub} ${s.subBolt} font-pixel`}>
              <span className={`${s.subGlyph} font-sunda`} aria-hidden="true">
                ᮊ
              </span>
              {t.writeSub}
            </p>
          </div>
          <div className={s.block} data-on={step >= 3 && step <= 5}>
            <p className={`${s.big} font-display`}>{t.release}</p>
            <p className={`${s.sub} ${step === 3 ? s.subBolt : s.subBurst} font-pixel`}>
              <span className={`${s.subGlyph} font-sunda`} aria-hidden="true">
                {step === 3 ? "ᮊ" : "ᮎ"}
              </span>
              {step === 3 ? t.writeSub : t.releaseSub}
            </p>
          </div>
          <div className={`${s.block} ${s.cta}`} data-on={step === 6} inert={step !== 6}>
            <p className={`${s.ctaLine} font-display`}>{t.cta}</p>
            <button
              type="button"
              className={`${s.btn} font-display`}
              onClick={() => scrollToScene("download", 1)}
            >
              {t.download}
            </button>
          </div>
        </div>
      </div>
    </Scene>
  );
}

"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Scene, useCopy } from "@/components/Scene";
import type { Range } from "@/lib/scroll-engine";
import { gameCopy } from "@/lib/copy/game";
import { PxSprite } from "./cast/PxSprite";
import s from "./game.module.css";

/*
 * The game, played by scrolling. A pinned "game screen" over a real area
 * rendered from the Godot project (public/assets/pixel/world_leuweung.png,
 * 480px tall, the road through the middle): the hero walks into a moonlit
 * clearing, is ambushed, and the fight plays out one beat per scroll step.
 * (Walking the world is Journey's job; this scene is the fight.) Positions are source pixels (--u) from the
 * screen's centre; the hero's feet sit on (0, 0).
 */

const ART = "/game/art";
const HERO = `${ART}/hero_warrior.png`;
const FACELESS = `${ART}/enemies/faceless.png`;

const VARS: Record<string, Range> = {
  enter: [0.02, 0.22], // the hero walks into the clearing
  app: [0.16, 0.31], // enemies close in
  zoom: [0.17, 0.31], // the camera leans in for the fight
};

/** Light pools in world pixels: x, y, radius, kind. Warm = lamp, cool = spirit. */
type Light = [number, number, number, "warm" | "cool"];
// The clearing (see public/assets/pixel/leuweung_clearing.png): stone lanterns
// and the shrine's spirit light.
const FOREST_LIGHTS: Light[] = [
  [1124, 190, 20, "warm"], [1176, 190, 20, "warm"], [1000, 286, 22, "warm"],
  [1240, 286, 22, "warm"], [1150, 188, 30, "cool"], [905, 190, 16, "cool"],
];

// Screen-space atmosphere, in % of the screen; d = delay, t = duration (s).
const LEAVES = [
  { x: 6, y: -4, d: 0, t: 11 }, { x: 22, y: -8, d: 4.2, t: 13 }, { x: 41, y: -2, d: 7.5, t: 10 },
  { x: 58, y: -6, d: 2.1, t: 12 }, { x: 74, y: -3, d: 9.3, t: 14 }, { x: 88, y: -7, d: 5.6, t: 11 },
  { x: 33, y: -5, d: 11.1, t: 12 }, { x: 66, y: -9, d: 13.4, t: 13 },
];
const FIREFLIES = [
  { x: 12, y: 30, d: 0, t: 6 }, { x: 24, y: 72, d: 1.4, t: 7 }, { x: 37, y: 22, d: 3.1, t: 5 },
  { x: 48, y: 64, d: 2.2, t: 8 }, { x: 61, y: 28, d: 4.6, t: 6 }, { x: 70, y: 70, d: 0.8, t: 7 },
  { x: 82, y: 36, d: 3.7, t: 5 }, { x: 91, y: 62, d: 5.2, t: 6 }, { x: 18, y: 50, d: 6.1, t: 7 },
  { x: 77, y: 18, d: 2.9, t: 8 }, { x: 54, y: 80, d: 1.1, t: 6 }, { x: 5, y: 76, d: 4.1, t: 7 },
];
const MISTS = [
  { y: 30, d: 0, t: 46 }, { y: 58, d: 17, t: 52 }, { y: 44, d: 31, t: 40 }, { y: 72, d: 8, t: 58 },
];

/**
 * Steps, entered when --p crosses each cut:
 * 0 arrival · 1 enemies come · 2-4 the combo · 5 wind-up · 6 dodge (perfect) · 7 counter
 */
const CUTS = [0.17, 0.31, 0.39, 0.47, 0.58, 0.66, 0.75];

type Pose = { row: number; start?: number; frames: number; fps: number; once?: boolean };
// hero_warrior.png: row 1 side idle, 4 side walk, 6-8 the side combo, 9 dodge.
const IDLE: Pose = { row: 1, frames: 4, fps: 5 };
const WALK: Pose = { row: 4, frames: 6, fps: 10 };
const HERO_POSE: Record<number, Pose> = {
  2: { row: 6, frames: 6, fps: 16, once: true },
  3: { row: 7, frames: 6, fps: 16, once: true },
  4: { row: 8, frames: 6, fps: 14, once: true },
  6: { row: 9, frames: 6, fps: 14, once: true },
  7: { row: 8, frames: 6, fps: 16, once: true },
};

// faceless.png: rows 0 idle, 1 walk, 2 attack (0-1 wind-up, 2-3 strike), 3 hurt.
const F_IDLE: Pose = { row: 0, frames: 4, fps: 5 };
const F_WALK: Pose = { row: 1, frames: 4, fps: 8 };
const F_WIND: Pose = { row: 2, frames: 2, fps: 3 };
const F_STRIKE: Pose = { row: 2, start: 2, frames: 2, fps: 8, once: true };
const F_HURT: Pose = { row: 3, frames: 4, fps: 12, once: true };

interface Foe {
  x: number;
  y: number;
  /** Where it closes in to for the dodge beat. */
  x2: number;
  y2: number;
  /** Extra distance behind the first one on the way in. */
  lag: number;
  dies: number;
}
const FOES: Foe[] = [
  { x: 2, y: 0, x2: 2, y2: 0, lag: 0, dies: 4 },
  { x: 28, y: -16, x2: 4, y2: -7, lag: 40, dies: 7 },
  { x: 34, y: 15, x2: 14, y2: 11, lag: 80, dies: 7 },
];

const at = (x: number, y: number) => ({ "--x": x, "--y": y }) as CSSProperties;

/** World-anchored light pools; the wrapper scrolls with its area's map. */
function Lights({ lights, className }: { lights: Light[]; className: string }) {
  return (
    <div className={`${s.world} ${s.lights} ${className}`} aria-hidden="true">
      {lights.map(([x, y, r, kind], i) => (
        <span
          key={i}
          className={`${s.light} ${kind === "cool" ? s.cool : ""}`}
          style={{ "--lx": x, "--ly": y, "--lr": r, animationDelay: `${-i * 0.37}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** One-shot effect centred on (x, y): plays once, then hides itself. */
function Fx({ x, y, delay = 0, children }: { x: number; y: number; delay?: number; children: ReactNode }) {
  return (
    <div className={`${s.pos} ${s.fx}`} style={{ ...at(x, y), animationDelay: `${delay}s` }} aria-hidden="true">
      {children}
    </div>
  );
}

const sheet = (name: string, f: number, n: number, fps: number, delay = 0, flip = false) => (
  <PxSprite
    src={`${ART}/fx/${name}.png`}
    fw={f}
    fh={f}
    sw={f * n}
    sh={f}
    frames={n}
    fps={fps}
    once
    flip={flip}
    style={{ animationDelay: `${delay}s` }}
  />
);
const smear = (name: string, flip = false) => sheet(name, 48, 4, 18, 0, flip);
const spark = (delay: number) => sheet("spark_warrior", 24, 4, 14, delay);
const puff = (delay: number) => sheet("ink_puff", 32, 5, 12, delay);

function Dmg({ x, y, n, kind = "" }: { x: number; y: number; n: number; kind?: string }) {
  return (
    <span className={`${s.pos} ${s.dmg} ${kind} font-pixel`} style={at(x, y)} aria-hidden="true">
      {n}
    </span>
  );
}

function caption(step: number) {
  if (step === 0) return "genre";
  if (step === 1) return "fight";
  if (step <= 4) return "combo";
  return step === 5 ? "dodge" : "perfect";
}

export function GameScene() {
  const t = useCopy(gameCopy);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onProgress = (p: number) => {
    // Scrolling is the hero's WASD: walk while the page moves, idle when it
    // stops. A data attribute, so the walk cycle never re-renders React.
    const el = stageRef.current;
    if (el) {
      el.dataset.moving = "true";
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (stageRef.current) stageRef.current.dataset.moving = "false";
      }, 140);
    }

    let next = 0;
    for (const cut of CUTS) if (p >= cut) next++;
    if (next !== stepRef.current) {
      stepRef.current = next;
      setStep(next);
    }
  };

  const hx = step === 6 ? -64 : -30;
  const pose = HERO_POSE[step];
  const shake = step === 4 || step === 7; // the finisher and the counter land hard
  const cap = caption(step);

  const hero = (p: Pose, key: string | number) => (
    <PxSprite key={key} src={HERO} fw={32} fh={32} sw={192} sh={576} {...p} />
  );

  return (
    <Scene id="game" length={360} vars={VARS} onProgress={onProgress}>
      <div
        ref={stageRef}
        className={`${s.stage} ${step === 6 ? s.slow : ""}`}
        data-moving="false"
      >
        <div className={s.cam}>
        <div key={shake ? step : "still"} className={`${s.screen} ${shake ? s.shaking : ""}`}>
          {/* ---------- the world: a real area, rendered from the game ---------- */}
          <div className={`${s.world} ${s.forest}`} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.fill} pixelated`} src="/assets/pixel/world_leuweung.png" alt="" draggable={false} />
            {/* the fight's clearing: tree walls, a shrine and its lanterns, drawn over the road */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.clearing} pixelated`}
              src="/assets/pixel/leuweung_clearing.png"
              alt=""
              draggable={false}
            />
          </div>

          {/* ---------- enemies ---------- */}
          {FOES.map((f, i) => {
              if (step > f.dies) return null;
              const close = step >= 5;
              const dying = step === f.dies;
              const hit = i === 0 && (step === 2 || step === 3);
              const p =
                hit || dying
                  ? F_HURT
                  : i === 1 && step === 6
                    ? F_STRIKE
                    : i === 1 && step === 5
                      ? F_WIND
                      : step === 1 || (i === 2 && step === 5)
                        ? F_WALK
                        : F_IDLE;
              const y = close ? f.y2 : f.y;
              return (
                <div
                  key={i}
                  className={`${s.pos} ${s.actor} ${s.foe}`}
                  style={{ ...at(close ? f.x2 : f.x, y), "--lag": f.lag, zIndex: 40 + y } as CSSProperties}
                  aria-hidden="true"
                >
                  <span className={s.shadow} />
                  <div key={step} className={`${hit || dying ? s.knock : ""} ${dying ? s.dying : ""}`}>
                    <PxSprite src={FACELESS} fw={32} fh={32} sw={128} sh={128} flip {...p} />
                  </div>
                  {i === 1 && step === 5 && (
                    <PxSprite
                      className={s.alert}
                      src={`${ART}/ambient/emotes.png`}
                      fw={11}
                      fh={10}
                      sw={55}
                      sh={10}
                      frames={1}
                      start={1}
                    />
                  )}
                </div>
              );
            })}

          {/* ---------- the hero ---------- */}
          <div className={`${s.pos} ${s.actor} ${s.hero}`} style={at(hx, 0)} aria-hidden="true">
            <span className={s.shadow} />
            {pose ? (
              hero(pose, step)
            ) : (
              <>
                <div className={s.walkPose}>{hero(step === 0 ? WALK : IDLE, "walk")}</div>
                <div className={s.idlePose}>{hero(IDLE, "idle")}</div>
              </>
            )}
          </div>

          {/* ---------- light: moonlight, lanterns and the shrine ---------- */}
          <div className={s.night} aria-hidden="true" />
          <Lights lights={FOREST_LIGHTS} className={s.forest} />
          <span className={`${s.pos} ${s.heroLight}`} style={at(hx, -10)} aria-hidden="true" />

          {/* ---------- the combo ---------- */}
          {step >= 2 && step <= 4 && (
            <>
              <Fx x={-20} y={-14}>
                {smear(["smear_core_warrior", "smear_light_warrior", "smear_finisher_warrior"][step - 2])}
              </Fx>
              <Fx x={0} y={-14} delay={0.06}>
                {spark(0.06)}
              </Fx>
              <Dmg x={4} y={-34} n={[14, 17, 41][step - 2]} kind={step === 4 ? s.big : ""} />
            </>
          )}
          {step === 4 && (
            <Fx x={2} y={-14} delay={0.3}>
              {puff(0.3)}
            </Fx>
          )}

          {/* ---------- the dodge ---------- */}
          {step === 6 && (
            <>
              <Fx x={-14} y={-20}>
                {smear("enemy_smear", true)}
              </Fx>
              <Fx x={-40} y={-5}>
                {sheet("dust", 16, 4, 10)}
              </Fx>
              <span className={`${s.pos} ${s.perfect} font-display`} style={at(-64, -42)} aria-hidden="true">
                {t.perfectPop}
              </span>
            </>
          )}

          {/* ---------- the counter ---------- */}
          {step === 7 && (
            <>
              <Fx x={-18} y={-14}>
                {smear("smear_finisher_warrior")}
              </Fx>
              <Fx x={4} y={-20} delay={0.06}>
                {spark(0.06)}
              </Fx>
              <Fx x={14} y={-4} delay={0.1}>
                {spark(0.1)}
              </Fx>
              <Fx x={4} y={-20} delay={0.32}>
                {puff(0.32)}
              </Fx>
              <Fx x={14} y={-4} delay={0.38}>
                {puff(0.38)}
              </Fx>
              <Dmg x={6} y={-42} n={62} kind={s.crit} />
              <Dmg x={22} y={-24} n={58} kind={s.crit} />
            </>
          )}

        </div>
        </div>

        {/* ---------- atmosphere ---------- */}
        <div className={s.air} aria-hidden="true">
          {MISTS.map((m, i) => (
            <span
              key={i}
              className={`${s.mist} pixelated`}
              style={{ top: `${m.y}%`, animationDelay: `${-m.d}s`, animationDuration: `${m.t}s` }}
            />
          ))}
          {LEAVES.map((l, i) => (
            <span
              key={i}
              className={`${s.leaf} pixelated`}
              style={{ left: `${l.x}%`, top: `${l.y}%`, animationDelay: `${-l.d}s`, animationDuration: `${l.t}s` }}
            />
          ))}
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className={s.firefly}
              style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${-f.d}s`, animationDuration: `${f.t}s` }}
            />
          ))}
        </div>
        {/* the forest's own canopy, close to the camera: it slides faster than the ground */}
        <div className={`${s.canopy} ${s.canopyTop} pixelated`} aria-hidden="true" />
        <div className={`${s.canopy} ${s.canopyBottom} pixelated`} aria-hidden="true" />
        <div className={s.shade} aria-hidden="true" />

        {/* perfect dodge: time slows, the world drains */}
        <div className={s.vignette} aria-hidden="true" />

        {/* ---------- the game's own HUD, once there is a fight ---------- */}
        <div className={s.hudBox} data-on={step >= 1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${s.hud} pixelated`} src="/assets/pixel/hud_bars.png" alt="" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${s.flasks} pixelated`} src="/assets/pixel/hud_flasks.png" alt="" draggable={false} />
        </div>

        <div className={s.banner} data-on={step === 0} aria-hidden="true">
          <p className={`${s.bannerRegion} font-display`}>{t.region}</p>
          <p className={`${s.bannerArea} font-pixel`}>{t.forest}</p>
        </div>

        {/* ---------- copy ---------- */}
        <div className={s.scrim} aria-hidden="true" />
        <div className={s.copy}>
          <div className={s.block} data-on={cap === "genre"}>
            <h2 className={`${s.line} font-display`}>{t.genre}</h2>
            <p className={`${s.sub} font-pixel`}>{t.genreSub}</p>
          </div>
          <div className={s.block} data-on={cap === "fight"}>
            <p className={`${s.line} font-display`}>{t.fight}</p>
            <p className={`${s.sub} font-pixel`}>{t.fightSub}</p>
          </div>
          <div className={s.block} data-on={cap === "combo"}>
            <p className={`${s.line} font-display`}>{t.combo}</p>
          </div>
          <div className={s.block} data-on={cap === "dodge"}>
            <p className={`${s.line} font-display`}>{t.dodge}</p>
          </div>
          <div className={s.block} data-on={cap === "perfect"}>
            <p className={`${s.line} font-display`}>{t.perfect}</p>
            <p className={`${s.sub} ${s.subCyan} font-pixel`}>{t.perfectSub}</p>
          </div>
        </div>
      </div>
    </Scene>
  );
}

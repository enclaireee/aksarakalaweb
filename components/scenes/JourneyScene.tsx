"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import type { Range } from "@/lib/scroll-engine";
import { journeyCopy, type JourneyRegionKey } from "@/lib/copy/journey";
import {
  ECLIPSE,
  LAYER_CRITTERS,
  LAYER_FACTOR,
  LAYER_ITEMS,
  REGIONS,
  REGION_P,
  SEA,
  SEA_CRITTERS,
  SEA_ITEMS,
  TRAVEL,
  type Critter,
  type Item,
  type LayerId,
} from "./journey/data";
import s from "./journey.module.css";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const TITLE_KEYS: JourneyRegionKey[] = [
  "sunda",
  "mataram",
  "kidul",
  "kala",
];

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Scroll choreography, derived from where the hero crosses each region border. */
const SCENE_VARS: Record<string, Range> = (() => {
  const v: Record<string, Range> = {
    openOut: [0.045, 0.08],
    dark: [0.9, 1],
  };
  REGION_P.forEach((p, i) => {
    const n = i + 1;
    const next = REGION_P[i + 1];
    // Sky starts turning as the next region slides in from the right.
    v[`s${n}`] = i === 0 ? [0.015, 0.09] : [r3(p - 0.08), r3(p + 0.02)];
    v[`t${n}In`] = i === 0 ? [0.085, 0.125] : [r3(p - 0.01), r3(p + 0.035)];
    v[`t${n}Out`] =
      next === undefined ? [0.94, 0.98] : [r3(next - 0.075), r3(next - 0.035)];
  });
  // The region before Gua Kala hands its second half to the "many more lands" line.
  const k = REGION_P.length - 1;
  const mid = r3((REGION_P[k - 1] + REGION_P[k]) / 2);
  v[`t${k}Out`] = [r3(mid - 0.035), mid];
  v.mIn = [mid, r3(mid + 0.035)];
  v.mOut = [r3(REGION_P[k] - 0.045), r3(REGION_P[k] - 0.01)];
  return v;
})();

const FX_CLASS: Record<NonNullable<Item["fx"]>, string> = {
  sil: s.sil,
  dim: "", // tint baked into the PNG
  dark: "",
  mist: s.mist,
  glow: s.glow,
  firefly: s.firefly,
};

const MOTION_CLASS: Record<Critter["motion"], string> = {
  none: "",
  patrol: s.patrol,
  bob: s.bob,
  flutter: s.flutter,
};

function Prop({ item }: { item: Item }) {
  const style: Vars = {
    "--x": item.x,
    "--b": item.b,
    "--w": item.w,
    "--h": item.h,
  };
  if (item.delay) style.animationDelay = `-${item.delay}s`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-x={item.x}
      data-w={item.w}
      className={`${s.item} ${item.fx ? FX_CLASS[item.fx] : ""} ${
        item.flip ? s.flip : ""
      }`}
      style={style}
    />
  );
}

/** A sprite-sheet animation sized in u (the shared <Sprite> is px-only). */
function USprite({ c }: { c: Critter }) {
  const k = c.scale;
  const start = c.start ?? 0;
  const style: Vars = {
    "--fw": c.fw * k,
    "--fh": c.fh * k,
    "--sw": c.sw * k,
    "--sh": c.sh * k,
    "--row": c.row * c.fh * k,
    "--sprite-from": `calc(var(--u) * ${-start * c.fw * k})`,
    "--sprite-to": `calc(var(--u) * ${-(start + c.frames) * c.fw * k})`,
    backgroundImage: `url('${c.src}')`,
    animationDuration: `${c.frames / c.fps}s`,
    animationTimingFunction: `steps(${c.frames})`,
    animationIterationCount: "infinite",
    animationDelay: c.delay ? `-${c.delay}s` : undefined,
    transform: c.flip ? "scaleX(-1)" : undefined,
  };
  return (
    <div
      aria-hidden="true"
      className={`sprite ${s.usprite}`}
      style={style}
    />
  );
}

function CritterEl({ c }: { c: Critter }) {
  const style: Vars = { "--x": c.x, "--b": c.b };
  if (c.delay && c.motion !== "none") style.animationDelay = `-${c.delay}s`;
  return (
    <div
      className={`${s.critter} ${MOTION_CLASS[c.motion]}`}
      style={style}
      data-x={c.x}
      data-w={c.fw * c.scale}
    >
      <USprite c={c} />
    </div>
  );
}

function Layer({
  id,
  className = "",
  before,
  after,
}: {
  id: LayerId;
  className?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
}) {
  const critters =
    id === "mid" || id === "back" || id === "front" ? LAYER_CRITTERS[id] : [];
  return (
    <div
      className={`${s.layer} ${className}`}
      style={{ "--travel": TRAVEL * LAYER_FACTOR[id] } as Vars}
    >
      {before}
      {LAYER_ITEMS[id].map((item, i) => (
        <Prop key={i} item={item} />
      ))}
      {critters.map((c, i) => (
        <CritterEl key={i} c={c} />
      ))}
      {after}
    </div>
  );
}

function Ground() {
  return (
    <>
      {REGIONS.map((r, ri) => {
        const overlap = ri === 0 ? 0 : 40;
        return (
          <div
            key={r.id}
            className={`${s.ground} ${ri === 0 ? "" : s.groundFade}`}
            data-x={r.a - overlap}
            data-w={r.b - r.a + overlap}
            style={{ "--x": r.a - overlap, "--w": r.b - r.a + overlap } as Vars}
          >
            {r.rows.map((row, i) => (
              <div
                key={i}
                className={s.strip}
                style={
                  {
                    "--i": i,
                    "--row": row,
                    backgroundImage: `url('/game/art/ground/ground_${r.art}.png')`,
                  } as Vars
                }
              />
            ))}
            <div className={s.groundShade} />
          </div>
        );
      })}
    </>
  );
}

/** Margin in u around the screen, enough for patrol/flutter drift. */
const CULL_PAD = 64;

export function JourneyScene() {
  const t = useCopy(journeyCopy);
  const stageRef = useRef<HTMLDivElement>(null);
  const cullRef = useRef<(p: number) => void>(() => {});

  // The layers are up to 20 screens wide; hide everything off screen so the GPU
  // only rasters (and animates) the strip you can see.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const layers = [...stage.querySelectorAll<HTMLElement>(`.${s.layer}`)].map(
      (el) => ({
        el,
        travel: Number(el.style.getPropertyValue("--travel")),
        boxes: [...el.querySelectorAll<HTMLElement>("[data-x]")].map((b) => ({
          el: b,
          lo: Number(b.dataset.x),
          hi: Number(b.dataset.x) + Number(b.dataset.w),
          shown: true,
        })),
      })
    );
    let left = 0;
    let right = 0;
    let lastP = 0;
    const measure = () => {
      const u = stage.clientHeight / 270;
      const hx = layers[0]?.el.offsetLeft ?? 0;
      left = hx / u + CULL_PAD;
      right = (stage.clientWidth - hx) / u + CULL_PAD;
    };
    const cull = (p: number) => {
      lastP = p;
      for (const layer of layers) {
        const cam = p * layer.travel;
        for (const b of layer.boxes) {
          const show = b.hi > cam - left && b.lo < cam + right;
          if (show === b.shown) continue;
          b.shown = show;
          b.el.style.display = show ? "" : "none";
        }
      }
    };
    const onResize = () => {
      measure();
      cull(lastP);
    };
    measure();
    cullRef.current = cull;
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Scene
      id="journey"
      length={560}
      vars={SCENE_VARS}
      fadeOut={0.05}
      onProgress={(p) => cullRef.current(p)}
    >
      <div ref={stageRef} className={s.stage}>
        {/* Sky: one gradient per region, crossfaded by scroll */}
        <div className={`${s.sky} ${s.skyPurwa}`} />
        <div className={`${s.sky} ${s.skySunda}`} />
        <div className={`${s.sky} ${s.skyMataram}`} />
        <div className={`${s.sky} ${s.skyKidul}`} />
        <div className={`${s.sky} ${s.skyKala}`} />

        <Layer
          id="ridge"
          className={s.ridge}
          before={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ECLIPSE.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`${s.item} ${s.eclipse}`}
              style={
                {
                  "--x": ECLIPSE.x,
                  "--b": ECLIPSE.b,
                  "--w": ECLIPSE.size,
                  "--h": ECLIPSE.size,
                } as Vars
              }
            />
          }
        />
        <div className={s.haze} />
        <Layer id="far" className={s.far} />
        <Layer
          id="mid"
          before={
            <div
              className={s.sea}
              data-x={SEA.x}
              data-w={SEA.w}
              style={
                { "--x": SEA.x, "--b": SEA.b, "--w": SEA.w, "--h": SEA.h } as Vars
              }
            />
          }
          after={
            <>
              {SEA_ITEMS.map((item, i) => (
                <Prop key={i} item={item} />
              ))}
              {SEA_CRITTERS.map((c, i) => (
                <CritterEl key={i} c={c} />
              ))}
            </>
          }
        />
        <Layer id="back" before={<Ground />} />

        {/* Near silhouettes sit behind the hero so they never hide it */}
        <Layer id="near" />

        {/* The hero marches in place while the world slides past */}
        <div className={s.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/game/art/hero_shadow.png"
            alt=""
            aria-hidden="true"
            className={s.heroShadow}
          />
          <USprite
            c={{
              src: "/game/art/hero_warrior.png",
              fw: 32,
              fh: 32,
              sw: 192,
              sh: 576,
              frames: 6,
              row: 4,
              fps: 10,
              scale: 1,
              x: 0,
              b: 0,
              motion: "none",
            }}
          />
        </div>

        <Layer id="front" />

        <div className={s.grade} />
        <div className={s.maw} />

        <div className={s.titles}>
          <div className={`${s.title} ${s.opening}`}>
            <p className={`font-display ${s.openingLine}`}>{t.opening}</p>
            <p className={`font-pixel ${s.line}`}>{t.openingSub}</p>
          </div>
          {TITLE_KEYS.map((key, i) => (
            <div
              key={key}
              className={`${s.title} ${key === "kala" ? s.titleKala : ""}`}
              style={
                {
                  "--in": `var(--t${i + 1}In)`,
                  "--out": `var(--t${i + 1}Out)`,
                } as Vars
              }
            >
              <h2 className={`font-display ${s.name}`}>{t.regions[key].name}</h2>
              <p className={`font-pixel ${s.line}`}>{t.regions[key].line}</p>
            </div>
          ))}
          <div
            className={s.title}
            style={{ "--in": "var(--mIn)", "--out": "var(--mOut)" } as Vars}
          >
            <p className={`font-display ${s.openingLine}`}>{t.more}</p>
          </div>
        </div>
      </div>
    </Scene>
  );
}

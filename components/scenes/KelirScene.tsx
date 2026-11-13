"use client";

import { useState, type CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import { kelirCopy } from "@/lib/copy/kelir";
import s from "./kelir.module.css";

const CUT = "/game/art/cutscene";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Shadow puppets, in order of entrance. `v` is the scene var that walks each one in. */
const PUPPETS = [
  { id: "semar", w: 24, h: 36, side: -1, slot: 1, v: "sem", sway: 4.6 },
  { id: "arjuna", w: 22, h: 38, side: 1, slot: 1, v: "arj", sway: 5.3 },
  { id: "cepot", w: 22, h: 34, side: -1, slot: 2, v: "cep", sway: 3.9 },
  { id: "putri", w: 20, h: 38, side: 1, slot: 2, v: "put", sway: 5.8 },
  { id: "ajisaka", w: 22, h: 50, side: -1, slot: 3, v: "aji", sway: 6.4 },
  { id: "buto", w: 26, h: 38, side: 1, slot: 3, v: "but", sway: 4.2 },
] as const;

const GAMELAN = [
  { kind: "gong", flip: false, delay: 0 },
  { kind: "saron", flip: false, delay: -0.35 },
  { kind: "kendang", flip: false, delay: 0 },
  { kind: "saron", flip: true, delay: -0.7 },
  { kind: "gong", flip: true, delay: -0.5 },
] as const;

const MOTES = [
  { left: 8, bottom: 30, dur: 7, delay: 0 },
  { left: 19, bottom: 44, dur: 9, delay: -3 },
  { left: 31, bottom: 36, dur: 8, delay: -5 },
  { left: 42, bottom: 52, dur: 10, delay: -1.5 },
  { left: 55, bottom: 40, dur: 7.5, delay: -6 },
  { left: 66, bottom: 48, dur: 9.5, delay: -2.5 },
  { left: 77, bottom: 34, dur: 8.5, delay: -4.2 },
  { left: 90, bottom: 46, dur: 7.8, delay: -0.8 },
];

function Station({
  kind,
  flip,
  delay,
}: {
  kind: "gong" | "saron" | "kendang";
  flip: boolean;
  delay: number;
}) {
  const player =
    kind === "kendang" ? (
      <div
        className={`${s.player} ${s.playerBob}`}
        style={{
          backgroundImage: `url('${CUT}/niyaga_kendang.png')`,
          animationDelay: `${delay}s`,
        }}
      />
    ) : (
      <div
        className={`${s.player} ${s.strip}`}
        style={
          {
            "--fw": 20,
            "--fh": 22,
            "--n": 3,
            "--fps": 3,
            "--sc": "var(--ms)",
            backgroundImage: `url('${CUT}/niyaga_${kind}.png')`,
            animationDelay: `${delay}s`,
          } as Vars
        }
      />
    );

  return (
    <div
      className={`${s.station} ${s[`station_${kind}`]}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {player}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${CUT}/${kind === "gong" ? "gong_ageng" : kind}.png`}
        alt=""
        className={`${s.instrument} pixelated`}
        draggable={false}
      />
    </div>
  );
}

export function KelirScene() {
  const t = useCopy(kelirCopy);
  const [gutter, setGutter] = useState(false);

  return (
    <Scene
      id="kelir"
      length={420}
      fadeOut={0.03}
      vars={{
        sem: [0.04, 0.12],
        arj: [0.08, 0.16],
        cep: [0.12, 0.2],
        put: [0.16, 0.24],
        aji: [0.2, 0.28],
        but: [0.24, 0.32],
        l1In: [0.1, 0.17],
        l1Out: [0.38, 0.44],
        kalaIn: [0.42, 0.6],
        // Step vars: jump 0 -> 1 at a threshold to switch Kala's pose.
        pose1: [0.52, 0.521],
        pose2: [0.63, 0.631],
        tide: [0.5, 0.78],
        dim: [0.48, 0.78],
        l2In: [0.53, 0.6],
        l2Out: [0.73, 0.78],
        black: [0.8, 0.806],
        end: [0.83, 0.86],
      }}
      onProgress={(p) => {
        const g = p > 0.7 && p < 0.82;
        setGutter((prev) => (prev === g ? prev : g));
      }}
    >
      <div className={s.root} data-gutter={gutter ? "true" : "false"}>
        <div className={s.set} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${CUT}/k0_screen.png`}
            alt=""
            className={`${s.screen} pixelated`}
            draggable={false}
          />

          {/* The cloth: everything in here is a shadow and is clipped to the kelir. */}
          <div className={s.cloth}>
            <div className={s.clothGlowDim}>
              <div className={s.clothGlow} />
            </div>

            <div className={s.gunungan}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${CUT}/puppet_gunungan.png`}
                alt=""
                className={`${s.sway} pixelated`}
                style={{ animationDuration: "7s" }}
                draggable={false}
              />
            </div>

            {PUPPETS.map((pp) => (
              <div
                key={pp.id}
                className={`${s.puppet} ${s[`slot${pp.slot}`]}`}
                style={
                  {
                    "--w": pp.w,
                    "--h": pp.h,
                    "--dir": pp.side,
                    "--v": `var(--${pp.v})`,
                  } as Vars
                }
              >
                <div
                  className={s.puppetFace}
                  style={pp.side === 1 ? { transform: "scaleX(-1)" } : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${CUT}/puppet_${pp.id}.png`}
                    alt=""
                    className={`${s.sway} pixelated`}
                    style={{
                      animationDuration: `${pp.sway}s`,
                      animationDelay: `${-pp.sway / 3}s`,
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            ))}

            {/* The shadow tide follows Kala across the cloth. */}
            <div className={s.tide}>
              <div className={s.tideEdge} />
              <div className={s.tideFill} />
            </div>

            <div className={s.kala}>
              <div className={s.kalaSprite} />
            </div>
          </div>

          {/* Gamelan along the foot of the screen */}
          <div className={s.gamelan}>
            {GAMELAN.map((g, i) => (
              <Station key={i} kind={g.kind} flip={g.flip} delay={g.delay} />
            ))}
          </div>

          <div
            className={`${s.stand} ${s.standL} ${s.strip}`}
            style={
              {
                "--fw": 14,
                "--fh": 24,
                "--n": 3,
                "--fps": 9,
                "--sc": 2.4,
                "--start": 1,
                backgroundImage: `url('${CUT}/lamp_stand.png')`,
              } as Vars
            }
          />
          <div
            className={`${s.stand} ${s.standR} ${s.strip}`}
            style={
              {
                "--fw": 14,
                "--fh": 24,
                "--n": 3,
                "--fps": 9,
                "--sc": 2.4,
                "--start": 1,
                backgroundImage: `url('${CUT}/lamp_stand.png')`,
                animationDelay: "-0.2s",
              } as Vars
            }
          />

          <div className={s.dim} />

          {/* The blencong: hangs in front of the cloth, so the tide never covers it. */}
          <div className={s.lamp}>
            <div className={s.lampFlicker}>
              <div className={s.lampHalo} />
              <div
                className={s.strip}
                style={
                  {
                    "--fw": 14,
                    "--fh": 22,
                    "--n": 3,
                    "--fps": 7,
                    "--sc": "var(--ls)",
                    backgroundImage: `url('${CUT}/blencong.png')`,
                  } as Vars
                }
              />
            </div>
          </div>
        </div>

        <div className={s.motes} aria-hidden="true">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className={s.mote}
              style={{
                left: `${m.left}%`,
                bottom: `${m.bottom}%`,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>

        <div className={s.vignette} aria-hidden="true" />

        <div className={s.copy}>
          <div className={`${s.line} ${s.line1}`}>
            <p className={`${s.place} font-pixel`}>{t.place}</p>
            <p className={`${s.headline} font-display`}>{t.anchor}</p>
          </div>
          <div className={`${s.line} ${s.line2}`}>
            <p className={`${s.headline} font-display`}>{t.eats}</p>
          </div>
        </div>

        <div className={s.black} aria-hidden="true" />

        <p className={`${s.final} font-display`}>{t.out}</p>
      </div>
    </Scene>
  );
}

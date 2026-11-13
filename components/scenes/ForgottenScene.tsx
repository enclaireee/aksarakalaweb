"use client";

import type { CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import { forgottenCopy } from "@/lib/copy/forgotten";
import { GroundRows } from "./cast/PxSprite";
import s from "./forgotten.module.css";

const ART = "/game/art";

/** Scroll ranges (fractions of the pinned scene) exposed as CSS variables. */
const VARS = {
  // Beat A: Ibu's line
  dlg: [0.05, 0.1],
  cups: [0.17, 0.22],
  dlgOut: [0.3, 0.36],
  // Beat B: Laras's face is erased while the ink closes in
  face: [0.36, 0.42],
  hB: [0.42, 0.47],
  erase: [0.44, 0.62],
  inkA: [0.4, 0.66],
  inkB: [0.66, 0.71],
  // Beat C: the torn lontar
  inkC: [0.72, 0.78],
  hC: [0.76, 0.8],
  k1: [0.8, 0.84],
  k2: [0.84, 0.88],
  k3: [0.88, 0.93],
} as const;

const EMBERS = [
  { x: -38, d: 0, t: 5.2 },
  { x: -22, d: 1.7, t: 6.4 },
  { x: -6, d: 3.1, t: 4.8 },
  { x: 9, d: 0.8, t: 7 },
  { x: 24, d: 2.4, t: 5.6 },
  { x: 37, d: 4, t: 6.1 },
  { x: -58, d: 2.9, t: 6.8 },
  { x: 60, d: 1.2, t: 5.9 },
];

const ASH = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  d: (i * 1.3) % 9,
  t: 9 + (i % 5) * 1.7,
}));

const STARS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 61 + 7) % 100,
  y: (i * 23 + 5) % 34,
  d: (i * 0.7) % 3,
}));

export function ForgottenScene() {
  const t = useCopy(forgottenCopy);

  return (
    <Scene id="forgotten" length={400} vars={VARS}>
      <div className={s.stage}>
        {/* ---------- the morning after: cold dawn over the burned kelir ---------- */}
        <div className={s.world} aria-hidden="true">
          <div className={s.sky} />
          {STARS.map((st, i) => (
            <span
              key={i}
              className={`${s.star} animate-twinkle`}
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                animationDelay: `${st.d}s`,
              }}
            />
          ))}
          <div className={s.backdrop}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.layer} ${s.far} pixelated`}
              src={`${ART}/intro/dawn_far.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.layer} ${s.mid} pixelated`}
              src={`${ART}/intro/dawn_mid.png`}
              alt=""
            />
          </div>

          <GroundRows rows={[0, 0, 1, 0, 0, 0, 0, 0]} className={s.ground} />
          <div className={s.groundShade} />

          {/* burned stage, centred on the ground line */}
          <div className={s.kelir}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.cloth} pixelated`}
              src={`${ART}/cutscene/kelir_cloth_burned.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.frame} pixelated`}
              src={`${ART}/cutscene/kelir_frame_burned.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.prop} ${s.gong} pixelated`}
              src={`${ART}/cutscene/gong_ageng_burned.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.prop} ${s.saron} pixelated`}
              src={`${ART}/cutscene/saron_burned.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.prop} ${s.kendang} pixelated`}
              src={`${ART}/cutscene/kendang_burned.png`}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.prop} ${s.mat} pixelated`}
              src={`${ART}/cutscene/mat_burned.png`}
              alt=""
            />
            {EMBERS.map((e, i) => (
              <span
                key={i}
                className={s.ember}
                style={
                  {
                    "--x": e.x,
                    animationDelay: `-${e.d}s`,
                    animationDuration: `${e.t}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          {/* drifting ground mist */}
          <div className={s.mistRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                className={`${s.mist} pixelated`}
                src={`${ART}/world_fx/fx_mist.png`}
                alt=""
                style={{
                  left: `${i * 24 - 10}%`,
                  bottom: `${(i % 3) * 14}%`,
                  animationDelay: `-${i * 5}s`,
                }}
              />
            ))}
          </div>

          {ASH.map((a, i) => (
            <span
              key={i}
              className={s.ash}
              style={{
                left: `${a.x}%`,
                animationDelay: `-${a.d}s`,
                animationDuration: `${a.t}s`,
              }}
            />
          ))}
        </div>

        {/* the world dims once she starts to go */}
        <div className={s.dim} aria-hidden="true" />

        {/* ---------- Beat B art: Laras's portrait, pixel-dissolving into no one ---------- */}
        <div className={s.faceBeat} aria-hidden="true">
          <div className={s.portrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.portraitFrame} pixelated`}
              src={`${ART}/ui/frame_portrait.png`}
              alt=""
            />
            <div className={s.portraitFace}>
              <div
                className={`${s.faceImg} pixelated`}
                style={{
                  backgroundImage: `url('${ART}/portraits/p_faceless.png')`,
                }}
              />
              {[0, 1, 2, 3].map((k) => (
                <div
                  key={k}
                  className={`${s.faceImg} ${s.dither} pixelated`}
                  data-k={k}
                  style={{
                    backgroundImage: `url('${ART}/portraits/p_laras.png')`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className={`${s.nameplate} font-pixel`}>{t.name}</p>
        </div>

        {/* ---------- Beat C art: the torn lontar, three fading Ka ---------- */}
        <div className={s.lontarBeat} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.lontarGlow}
            src={`${ART}/intro/glow_warm.png`}
            alt=""
          />
          <div className={s.lontar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${s.lontarImg} pixelated`}
              src={`${ART}/ui/lontar_card.png`}
              alt=""
            />
            <div className={`${s.kaRow} font-sunda`}>
              <span className={s.ka} data-k="1">
                ᮊ
              </span>
              <span className={s.ka} data-k="2">
                ᮊ
              </span>
              <span className={s.ka} data-k="3">
                ᮊ
              </span>
            </div>
          </div>
        </div>

        {/* ---------- the ink that eats names, closing in from the edges ---------- */}
        <div className={s.inkWrap} aria-hidden="true">
          {[0, 1, 2, 3].map((k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={k}
              className={`${s.ink} pixelated`}
              data-k={k}
              src={`${ART}/intro/ink_${k}.png`}
              alt=""
            />
          ))}
          <div className={s.inkFull} />
        </div>

        {/* ---------- copy ---------- */}
        <div className={s.dialogueWrap}>
          <div className={s.cups}>
            <p className={`${s.cupsLine} font-pixel`}>{t.cups}</p>
            <div className={s.table} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={s.tableGlow}
                src={`${ART}/intro/glow_warm.png`}
                alt=""
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`${s.tableImg} pixelated`}
                src={`${ART}/story/purwa_table.png`}
                alt=""
              />
            </div>
          </div>
          <div className={s.dialogue}>
            <div className={s.dlgPortrait} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`${s.dlgFrame} pixelated`}
                src={`${ART}/ui/frame_portrait.png`}
                alt=""
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`${s.dlgFace} pixelated`}
                src={`${ART}/portraits/p_woman.png`}
                alt=""
              />
            </div>
            <div className={s.dlgText}>
              <p className={`${s.speaker} font-pixel`}>{t.speaker}</p>
              <p className={`${s.line} font-display`}>{t.ibuLine}</p>
            </div>
          </div>
        </div>

        <h2 className={`${s.headline} ${s.headB} font-display`}>{t.erased}</h2>

        <div className={`${s.headline} ${s.headC}`}>
          <h2 className="font-display">{t.kaLine}</h2>
          <p className={`${s.by} font-pixel`}>{t.kaBy}</p>
        </div>
      </div>
    </Scene>
  );
}

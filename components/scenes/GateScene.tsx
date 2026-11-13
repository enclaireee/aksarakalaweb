"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import { scrollToScene } from "@/lib/scroll-engine";
import { gateCopy } from "@/lib/copy/gate";
import s from "./gate.module.css";

const ART = "/game/art";

const STARS = [
  { top: 5, left: 6, size: 3, delay: 0 },
  { top: 9, left: 17, size: 2, delay: 0.8 },
  { top: 4, left: 29, size: 2, delay: 1.9 },
  { top: 13, left: 38, size: 3, delay: 1.4 },
  { top: 7, left: 51, size: 2, delay: 0.3 },
  { top: 11, left: 63, size: 3, delay: 2.4 },
  { top: 5, left: 74, size: 2, delay: 1.1 },
  { top: 14, left: 83, size: 3, delay: 0.6 },
  { top: 8, left: 93, size: 2, delay: 2.0 },
  { top: 20, left: 11, size: 2, delay: 1.6 },
  { top: 23, left: 24, size: 3, delay: 0.4 },
  { top: 19, left: 46, size: 2, delay: 2.7 },
  { top: 25, left: 58, size: 2, delay: 1.2 },
  { top: 21, left: 71, size: 3, delay: 0.1 },
  { top: 27, left: 89, size: 2, delay: 1.8 },
  { top: 31, left: 4, size: 2, delay: 2.2 },
  { top: 33, left: 35, size: 2, delay: 0.9 },
  { top: 30, left: 79, size: 2, delay: 1.5 },
];

const GLYPHS = [
  { id: "ka", w: 24, h: 23, dur: 5.2, delay: 0 },
  { id: "ja", w: 32, h: 19, dur: 6.1, delay: -2.1 },
  { id: "la", w: 26, h: 23, dur: 5.6, delay: -3.4 },
  { id: "ra", w: 26, h: 19, dur: 6.6, delay: -1.2 },
];

export function GateScene() {
  const t = useCopy(gateCopy);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [titleGone, setTitleGone] = useState(false);

  // Mouse parallax: write --mx / --my straight to the DOM, never through React state.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      raf =
        Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Scene
      id="gate"
      length={260}
      fadeIn={0}
      vars={{
        push: [0.03, 0.97],
        cue: [0, 0.08],
        titleOut: [0.14, 0.4],
        dark: [0.48, 0.9],
        black: [0.76, 0.94],
      }}
      onProgress={(p) => {
        const gone = p > 0.4;
        setTitleGone((prev) => (prev === gone ? prev : gone));
      }}
    >
      <div ref={rootRef} className={s.root}>
        {/* Twilight parallax, native 480x270, bottom-anchored cover */}
        <div className={s.stage} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ART}/ui/title_sky.png`}
            alt=""
            className={`${s.layer} ${s.sky} pixelated`}
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ART}/ui/title_far.png`}
            alt=""
            className={`${s.layer} ${s.far} pixelated`}
            draggable={false}
          />
          <div className={`${s.layer} ${s.mawLayer}`}>
            <div className={s.maw} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ART}/ui/title_near.png`}
            alt=""
            className={`${s.layer} ${s.near} pixelated`}
            draggable={false}
          />
        </div>

        {/* Stars + constellation */}
        <div className={s.stars} aria-hidden="true">
          {STARS.map((st, i) => (
            <span
              key={i}
              className={s.star}
              style={{
                top: `${st.top}%`,
                left: `${st.left}%`,
                width: st.size,
                height: st.size,
                animationDelay: `${st.delay}s`,
              }}
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ART}/ui/title_constellation.png`}
            alt=""
            className={`${s.constellation} pixelated`}
            draggable={false}
          />
        </div>

        {/* Floating title glyphs */}
        <div className={s.glyphs} aria-hidden="true">
          {GLYPHS.map((g) => (
            <div
              key={g.id}
              className={`${s.glyph} ${s[`glyph_${g.id}`]}`}
              style={{ "--gw": g.w, "--gh": g.h } as CSSProperties}
            >
              <div
                className={s.glyphDrift}
                style={{
                  animationDuration: `${g.dur}s`,
                  animationDelay: `${g.delay}s`,
                }}
              >
                <span className={s.glyphGlow} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ART}/ui/title_glyph_${g.id}.png`}
                  alt=""
                  className="pixelated"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* The hero, from behind, facing the gate */}
        <div className={s.hero} aria-hidden="true">
          <div className={s.heroSprite}>
            <span className={s.staffGlow} />
          </div>
        </div>

        <div className={s.vignette} aria-hidden="true" />

        {/* Title block */}
        <div className={s.copy} inert={titleGone}>
          <div className={s.copyInner}>
            <h1 className={`${s.title} font-display`}>{t.title}</h1>
            <p className={`${s.subtitle} font-pixel`}>{t.subtitle}</p>
            <p className={s.hook}>{t.hook}</p>
            <div className={s.actions}>
              <button
                type="button"
                className={`${s.btn} ${s.btnPrimary} font-display`}
                onClick={() => scrollToScene("download", 1)}
              >
                {t.download}
              </button>
              <button
                type="button"
                className={`${s.btn} ${s.btnGhost} font-display`}
                onClick={() => scrollToScene("kelir", 0.1)}
              >
                {t.enter} <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`${s.cue} font-pixel`} aria-hidden="true">
          <span>{t.scroll}</span>
          <span className={s.cueArrow} />
        </div>

        <div className={s.black} aria-hidden="true" />
      </div>
    </Scene>
  );
}

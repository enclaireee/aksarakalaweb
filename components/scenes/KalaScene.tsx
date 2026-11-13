"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import { kalaCopy } from "@/lib/copy/kala";
import s from "./kala.module.css";

const ART = "/game/art/intro/";

/**
 * Sunda Ka as one stroke (template points from the game's .docs/glyph_strokes.py).
 * The intro writes it in light across Kala's face; here scroll is the pen.
 */
const KA_PATH = "M120 113 L255 113 L140 395 L290 113 L425 113 L310 395";
const KA_VIEWBOX = "100 93 345 322";

/** Shot boundaries in --p. Keep in sync with --closeOn in kala.module.css. */
const CUT_CLOSE = 0.45;
const CUT_WIDE = 0.635;
const IMPACT = 0.88;

const phaseOf = (p: number) =>
  p < CUT_CLOSE ? 0 : p < CUT_WIDE ? 1 : p < IMPACT ? 2 : 3;

const EMBERS = [
  { x: 6, d: 0, t: 5.2, c: "#f2b27a" },
  { x: 14, d: 1.9, t: 6.4, c: "#f49d5a" },
  { x: 23, d: 0.7, t: 4.8, c: "#fce09b" },
  { x: 31, d: 3.1, t: 6.9, c: "#f2b27a" },
  { x: 40, d: 1.2, t: 5.6, c: "#f49d5a" },
  { x: 48, d: 4.0, t: 6.1, c: "#f2b27a" },
  { x: 57, d: 2.4, t: 5.0, c: "#fce09b" },
  { x: 65, d: 0.3, t: 6.6, c: "#f49d5a" },
  { x: 72, d: 3.6, t: 5.4, c: "#f2b27a" },
  { x: 80, d: 1.5, t: 4.6, c: "#f49d5a" },
  { x: 88, d: 2.8, t: 6.2, c: "#fce09b" },
  { x: 95, d: 0.9, t: 5.8, c: "#f2b27a" },
];

function Layer({ name, className }: { name: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ART}${name}.png`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pixelated ${className}`}
    />
  );
}

export function KalaScene() {
  const t = useCopy(kalaCopy);
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);

  const onProgress = useCallback((p: number) => {
    const next = phaseOf(p);
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  }, []);

  return (
    <Scene
      id="kala"
      length={300}
      fadeOut={0}
      onProgress={onProgress}
      vars={{
        tilt: [0, 0.2],
        l1In: [0.05, 0.1],
        l1Out: [0.19, 0.23],
        form: [0.2, 0.34],
        l2In: [0.3, 0.345],
        eyes: [0.335, 0.375],
        l2Out: [0.405, 0.44],
        push: [CUT_CLOSE, CUT_WIDE],
        hIn: [0.66, 0.71],
        write: [0.67, 0.875],
        hOut: [0.885, 0.92],
        b1: [IMPACT, 0.965],
        b2: [0.895, 0.975],
        b3: [0.91, 0.985],
        flash: [0.915, 0.985],
        ink: [0.95, 0.99],
      }}
    >
      <div className={s.root} data-phase={phase}>
        <div className={s.shaker}>
          {/* ---------- wide shot: the storm over Desa Purwa ---------- */}
          <div className={s.wide} aria-hidden="true">
            <div className={s.skyWrap}>
              <Layer name="storm_sky" className={s.sky} />
            </div>
            <Layer name="dawn_sky" className={s.dawn} />

            <div className={s.skyBox}>
              <div className={s.kalaGlow} />
              <Layer name="kala_sky" className={s.kalaFace} />
              <div className={s.kalaEyes}>
                <Layer name="kala_sky_eyes" className={s.kalaEyesImg} />
              </div>
            </div>

            <div className={s.bolts}>
              <div className={`pixelated ${s.bolt} ${s.boltA}`} />
              <div className={`pixelated ${s.bolt} ${s.boltB}`} />
            </div>

            <div className={s.landBox}>
              <div className={`pixelated ${s.crater}`} />
              <Layer name="storm_far" className={`${s.land} ${s.far}`} />
              <Layer name="storm_mid" className={`${s.land} ${s.mid}`} />
              <div className={s.crag}>
                <div className={`pixelated ${s.beam}`} />
                <Layer name="storm_peak" className={s.land} />
                <div className={`pixelated ${s.gem}`} />
                <div
                  className={`pixelated ${s.hero} ${
                    phase >= 2 ? s.heroRaised : s.heroWind
                  }`}
                />
              </div>
            </div>

            <div className={s.skyBox}>
              <div className={`pixelated ${s.ring} ${s.ring1}`} />
              <div className={`pixelated ${s.ring} ${s.ring2}`} />
              <div className={`pixelated ${s.ring} ${s.ring3}`} />
              <svg
                className={s.ka}
                viewBox={KA_VIEWBOX}
                fill="none"
                shapeRendering="crispEdges"
              >
                <path d={KA_PATH} pathLength={1} className={s.kaHalo} />
                <path d={KA_PATH} pathLength={1} className={s.kaWet} />
                <path d={KA_PATH} pathLength={1} className={s.kaCore} />
                <path d={KA_PATH} pathLength={1} className={s.kaHot} />
              </svg>
            </div>
          </div>

          {/* ---------- close-up: Kala looks back ---------- */}
          <div className={s.close} aria-hidden="true">
            <div className={s.closeBox}>
              <Layer name="kala_close" className={s.closeFace} />
              <div className={s.closeDark} />
              <Layer name="kala_close_eyes" className={s.closeEyes} />
            </div>
          </div>

          <div className={s.embers} aria-hidden="true">
            {EMBERS.map((e) => (
              <span
                key={e.x}
                className={s.ember}
                style={
                  {
                    left: `${e.x}%`,
                    background: e.c,
                    animationDelay: `-${e.d}s`,
                    animationDuration: `${e.t}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className={s.vignette} aria-hidden="true" />
          <div className={s.stormFlash} aria-hidden="true">
            <div className={s.stormFlashInner} />
          </div>
          <div className={s.redFlash} aria-hidden="true" />
          <div className={s.cutFlash} aria-hidden="true" />
          <div className={s.whiteout} aria-hidden="true" />

          {/* the letter stays on the white, as ink on a page */}
          <div className={`${s.skyBox} ${s.inkBox}`} aria-hidden="true">
            <svg
              className={`${s.ka} ${s.kaInk}`}
              viewBox={KA_VIEWBOX}
              fill="none"
              shapeRendering="crispEdges"
            >
              <path d={KA_PATH} />
            </svg>
          </div>
        </div>

        {/* ---------- copy ---------- */}
        <div className={s.scrim} aria-hidden="true" />
        <div className={s.captions}>
          <p className={`font-display ${s.line} ${s.line1}`}>{t.eclipse}</p>
          <p className={`font-display ${s.line} ${s.line2}`}>{t.kala}</p>
          <div className={`${s.line} ${s.line3}`}>
            <h2 className={`font-display ${s.headline}`}>{t.headline}</h2>
            <p className={`font-pixel ${s.sub}`}>
              <span className={`font-sunda ${s.subGlyph}`} aria-hidden="true">
                ᮊ
              </span>
              {t.letter}
            </p>
          </div>
        </div>
      </div>
    </Scene>
  );
}

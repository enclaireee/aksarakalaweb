"use client";

import type { CSSProperties } from "react";
import { Scene, useCopy } from "@/components/Scene";
import type { Range } from "@/lib/scroll-engine";
import { PATHS_COPY, type ClassId } from "@/lib/copy/paths";
import styles from "./paths.module.css";

const ART = "/game/art";

/** Line-up order, left to right: each school next to its second path. */
const CLASSES: ClassId[] = [
  "warrior",
  "lancer",
  "archer",
  "herder",
  "rogue",
  "dancer",
  "mage",
  "dalang",
];

/** Entrance order: the middle pair first, then outwards. */
const RANK = [6, 4, 2, 0, 1, 3, 5, 7];

const VARS: Record<string, Range> = {
  lamp: [0.02, 0.3],
  head: [0.42, 0.6],
};
for (let r = 0; r < 8; r++) {
  VARS[`f${r}`] = [0.05 + r * 0.045, 0.2 + r * 0.045];
}

export function PathsScene() {
  const t = useCopy(PATHS_COPY);

  return (
    <Scene id="paths" length={170} vars={VARS}>
      <div className={styles.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ART}/intro/kelir.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.kelir} pixelated`}
          draggable={false}
        />
        <div className={styles.flicker} aria-hidden="true" />
        <div className={styles.floorGlow} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />

        <h2 className={`${styles.headline} font-display`}>{t.headline}</h2>

        <ul className={styles.lineup}>
          {CLASSES.map((id, i) => (
            <li
              key={id}
              className={styles.slot}
              style={
                {
                  "--f": `var(--f${RANK[i]}, 0)`,
                  "--dx": `${(i - 3.5) * 14}px`,
                } as CSSProperties
              }
            >
              <span className={styles.footShadow} aria-hidden="true" />
              <span
                aria-hidden="true"
                className={styles.fig}
                style={{
                  backgroundImage: `url('${ART}/portraits/class_${id}.png')`,
                  animationDelay: `${-((i * 5) % 6) * 0.15}s`,
                }}
              />
              <span className={`${styles.caption} font-pixel`}>
                {t.titles[id]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}

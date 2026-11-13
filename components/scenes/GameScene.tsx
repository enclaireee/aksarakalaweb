"use client";

import type { CSSProperties, ReactNode } from "react";
import { Scene, useCopy } from "@/components/Scene";
import type { Range } from "@/lib/scroll-engine";
import { gameCopy, type FeatureId } from "@/lib/copy/game";
import { PxSprite } from "./cast/PxSprite";
import s from "./game.module.css";

const ART = "/game/art";

const VARS: Record<string, Range> = {
  head: [0.04, 0.2],
  keys: [0.4, 0.55],
};
for (let i = 0; i < 4; i++) VARS[`f${i}`] = [0.12 + i * 0.06, 0.26 + i * 0.06];

/** Hero sheets: 32px cells, row 1 idle (4 frames), row 8 the combo finisher (6 frames). */
const hero = (cls: string, row = 1, frames = 4, fps = 5, flip = false) => (
  <PxSprite
    src={`${ART}/hero_${cls}.png`}
    fw={32}
    fh={32}
    sw={192}
    sh={576}
    row={row}
    frames={frames}
    fps={fps}
    flip={flip}
  />
);

const ART_FOR: Record<FeatureId, ReactNode> = {
  cast: (
    <div className={s.glyph}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ART}/ui/title_glyph_ka.png`} alt="" className="pixelated" draggable={false} />
    </div>
  ),
  combat: (
    <div className={s.duel}>
      {hero("warrior", 8, 6, 10)}
      <PxSprite src={`${ART}/enemies/faceless.png`} fw={32} fh={32} sw={128} sh={128} row={1} frames={4} fps={6} flip />
    </div>
  ),
  classes: (
    <div className={s.party}>
      {hero("dalang")}
      {hero("archer", 1, 4, 4)}
      {hero("warrior", 1, 4, 6)}
      {hero("dancer", 1, 4, 5)}
    </div>
  ),
  world: (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/pixel/java_map.png" alt="" className={`${s.map} pixelated`} draggable={false} />
  ),
};

const ORDER: FeatureId[] = ["cast", "combat", "classes", "world"];

export function GameScene() {
  const t = useCopy(gameCopy);

  return (
    <Scene id="game" length={220} vars={VARS}>
      <div className={s.root}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.inner}>
          <header className={s.head}>
            <p className={`${s.kicker} font-pixel`}>{t.kicker}</p>
            <h2 className={`${s.headline} font-display`}>{t.headline}</h2>
            <p className={s.premise}>{t.premise}</p>
          </header>

          <ul className={s.grid}>
            {ORDER.map((id, i) => (
              <li key={id} className={s.card} style={{ "--f": `var(--f${i}, 0)` } as CSSProperties}>
                <div className={s.art} aria-hidden="true">
                  {ART_FOR[id]}
                </div>
                <h3 className={`${s.title} font-display`}>{t.features[id].title}</h3>
                <p className={s.body}>{t.features[id].body}</p>
              </li>
            ))}
          </ul>

          <ul className={`${s.keys} font-pixel`}>
            {t.controls.map(([key, action]) => (
              <li key={key}>
                <kbd className={s.kbd}>{key}</kbd>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  );
}

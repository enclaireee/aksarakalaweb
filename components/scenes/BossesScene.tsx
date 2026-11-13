"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Scene, Sprite, useCopy } from "@/components/Scene";
import type { Range } from "@/lib/scroll-engine";
import { BOSSES_COPY, type BossCopy, type BossId } from "@/lib/copy/bosses";
import styles from "./bosses.module.css";

const ART = "/game/art";

/* ------------------------------------------------------------------ */
/* Scroll layout: one horde beat, then one slice of scroll per boss.   */
/* ------------------------------------------------------------------ */
const HORDE_END = 0.15;
const SLICE = 0.17;

interface Boss {
  id: BossId;
  /** Cell size in source px (base sheet = 4x4 cells, moves sheet = 4x7). */
  fw: number;
  fh: number;
  side: "left" | "right";
  /** Glow colours: core, falloff. */
  c1: string;
  c2: string;
  motif: string;
  /** Silhouetted scenery along the horizon: [file under art/, height in svh]. */
  skyline: Array<[string, number]>;
}

const BOSSES: Boss[] = [
  {
    id: "sandekala",
    fw: 56,
    fh: 72,
    side: "left",
    c1: "#9a6bff",
    c2: "#1f7a5c",
    motif: "mega",
    skyline: [
      ["props/bamboo_sunda.png", 30],
      ["props/bamboo_sunda.png", 20],
      ["props/tree_banyan_sunda.png", 26],
      ["props/bamboo_sunda.png", 16],
      ["props/bamboo_sunda.png", 22],
      ["props/tree_banyan_sunda.png", 18],
      ["props/bamboo_sunda.png", 28],
      ["props/bamboo_sunda.png", 34],
    ],
  },
  {
    id: "barma_wijaya",
    fw: 56,
    fh: 64,
    side: "right",
    c1: "#f7c04a",
    c2: "#b3261e",
    motif: "parang",
    skyline: [
      ["props/tree_teak_galuh.png", 30],
      ["props/lantern_galuh.png", 16],
      ["props/tree_teak_galuh.png", 22],
      ["props/lantern_galuh.png", 13],
      ["props/lantern_galuh.png", 13],
      ["props/tree_teak_galuh.png", 20],
      ["props/lantern_galuh.png", 16],
      ["props/tree_teak_galuh.png", 32],
    ],
  },
  {
    id: "bandung_bondowoso",
    fw: 64,
    fh: 72,
    side: "left",
    c1: "#ecc790",
    c2: "#8a5a34",
    motif: "stone",
    skyline: [
      ["props/candi_pillar_mataram.png", 30],
      ["props/candi_pillar_mataram.png", 20],
      ["props/candi_arch_mataram.png", 22],
      ["props/candi_pillar_mataram.png", 14],
      ["props/candi_pillar_mataram.png", 18],
      ["props/candi_pillar_mataram.png", 12],
      ["props/candi_arch_mataram.png", 18],
      ["props/candi_pillar_mataram.png", 24],
      ["props/candi_pillar_mataram.png", 34],
    ],
  },
  {
    id: "buto_ijo",
    fw: 80,
    fh: 80,
    side: "right",
    c1: "#ffb347",
    c2: "#b4541a",
    motif: "cinder",
    skyline: [
      ["props/tree_dead_timur.png", 32],
      ["props/tree_acacia_timur.png", 20],
      ["props/tree_dead_timur.png", 16],
      ["props/tree_acacia_timur.png", 24],
      ["props/tree_dead_timur.png", 20],
      ["props/tree_acacia_timur.png", 16],
      ["props/tree_dead_timur.png", 30],
    ],
  },
  {
    id: "nameless_hunter",
    fw: 64,
    fh: 72,
    side: "left",
    c1: "#cfd8e6",
    c2: "#4a5568",
    motif: "ash",
    skyline: [
      ["props/tree_dead_kala.png", 34],
      ["props/tree_spire_kala.png", 20],
      ["props/tree_dead_kala.png", 18],
      ["props/tree_spire_kala.png", 14],
      ["props/tree_dead_kala.png", 22],
      ["props/tree_spire_kala.png", 26],
      ["props/tree_dead_kala.png", 30],
    ],
  },
];

const LAST = BOSSES.length - 1;
const sliceStart = (i: number) => HORDE_END + i * SLICE;
/** Scroll point where boss i roars (once per pass). */
const roarAt = (i: number) => sliceStart(i) + 0.1;

const VARS: Record<string, Range> = {
  march: [0, HORDE_END + 0.02],
  lIn: [0.03, 0.07],
  hOut: [0.115, HORDE_END],
};
BOSSES.forEach((_, i) => {
  const s = sliceStart(i);
  VARS[`i${i}`] = [s, s + 0.03]; // layer in
  VARS[`b${i}`] = [s + 0.035, s + 0.09]; // silhouette -> full colour
  VARS[`t${i}`] = [s + 0.05, s + 0.085]; // name + line
  // The last boss leaves with the scene's own fade to black.
  VARS[`o${i}`] = i === LAST ? [1.01, 1.02] : [s + 0.14, s + SLICE];
});

/* ------------------------------------------------------------------ */
/* The horde                                                           */
/* ------------------------------------------------------------------ */
interface Mob {
  id: string;
  fw: number;
  fh: number;
  /** Float above the ground line, in source px. */
  lift?: number;
}

const MOB: Record<string, Mob> = {
  kuntilanak: { id: "kuntilanak", fw: 32, fh: 32 },
  pocong: { id: "pocong", fw: 32, fh: 32 },
  wewe: { id: "wewe_gombel", fw: 56, fh: 52 },
  genderuwo: { id: "genderuwo", fw: 48, fh: 48 },
  banaspati: { id: "banaspati_elite", fw: 40, fh: 36, lift: 20 },
  faceless: { id: "faceless", fw: 32, fh: 32 },
  ula: { id: "ula_segara", fw: 40, fh: 36 },
  champion: { id: "faceless_champion", fw: 40, fh: 36 },
  jurig: { id: "jurig_leuweung", fw: 40, fh: 36 },
};

const HORDE_ROWS: Array<{ cls: string; scale: number; mobs: Mob[] }> = [
  {
    cls: styles.rowFar,
    scale: 2,
    mobs: [
      MOB.faceless, MOB.pocong, MOB.faceless, MOB.kuntilanak, MOB.jurig,
      MOB.faceless, MOB.banaspati, MOB.pocong, MOB.champion, MOB.faceless,
      MOB.kuntilanak, MOB.genderuwo, MOB.faceless, MOB.pocong, MOB.banaspati,
      MOB.faceless,
    ],
  },
  {
    cls: styles.rowMid,
    scale: 3,
    mobs: [
      MOB.kuntilanak, MOB.genderuwo, MOB.pocong, MOB.banaspati, MOB.wewe,
      MOB.faceless, MOB.ula, MOB.kuntilanak, MOB.champion, MOB.pocong,
      MOB.genderuwo, MOB.jurig, MOB.banaspati, MOB.faceless,
    ],
  },
  {
    cls: styles.rowNear,
    scale: 5,
    mobs: [
      MOB.wewe, MOB.pocong, MOB.genderuwo, MOB.kuntilanak, MOB.banaspati,
      MOB.ula, MOB.wewe, MOB.faceless, MOB.genderuwo, MOB.pocong,
    ],
  },
];

function Horde({ line }: { line: string }) {
  return (
    <div className={styles.horde}>
      <div className={styles.hordeSky} />
      <div className={styles.hordeMotif} />
      <div className={styles.hordeMoon} />
      {HORDE_ROWS.map((row, r) => (
        <div key={r} className={`${styles.row} ${row.cls}`}>
          <div className={styles.rowDrift}>
            {row.mobs.map((m, i) => (
              <div
                key={i}
                className={styles.mob}
                style={{
                  marginBottom: (m.lift ?? 0) * row.scale,
                  // Uneven spacing so it reads as a crowd, not a parade.
                  marginLeft: ((i * 37 + r * 11) % 5) * 9 * row.scale - 8,
                }}
              >
                <Sprite
                  src={`${ART}/enemies/${m.id}.png`}
                  frameW={m.fw}
                  frameH={m.fh}
                  sheetW={m.fw * 4}
                  sheetH={m.fh * 4}
                  frames={4}
                  row={1}
                  fps={7}
                  scale={row.scale}
                  style={{ animationDelay: `${-((i * 3 + r) % 4) / 7}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.hordeFog} />
      <h2 className={`${styles.hordeLine} font-display`}>{line}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One boss reveal                                                     */
/* ------------------------------------------------------------------ */
function BossReveal({
  boss,
  index,
  roaring,
  onRoarEnd,
}: {
  boss: Boss;
  index: number;
  roaring: boolean;
  onRoarEnd: () => void;
}) {
  const t: BossCopy = useCopy(BOSSES_COPY).bosses[boss.id];
  const style = {
    "--in": `var(--i${index}, 0)`,
    "--b": `var(--b${index}, 0)`,
    "--t": `var(--t${index}, 0)`,
    "--out": `var(--o${index}, 0)`,
    "--fw": boss.fw,
    "--fh": boss.fh,
    "--c1": boss.c1,
    "--c2": boss.c2,
    "--motif": `url('${ART}/telegraph/motif_${boss.motif}.png')`,
    "--sheet": `url('${ART}/enemies/${boss.id}.png')`,
    "--moves": `url('${ART}/enemies/${boss.id}_moves.png')`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.reveal} ${
        boss.side === "right" ? styles.right : ""
      } ${roaring ? styles.roaring : ""}`}
      style={style}
    >
      <div className={styles.glow} />
      <div className={styles.motif} />
      <div className={styles.skyline} aria-hidden="true">
        {boss.skyline.map(([src, h], i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={`${ART}/${src}`}
            alt=""
            className="pixelated"
            style={{ height: `${h}svh` }}
            draggable={false}
          />
        ))}
      </div>
      <div className={styles.ground} />

      <div className={styles.boss} aria-hidden="true">
        <div className={styles.shadow} />
        <div className={styles.ring} />
        <div className={styles.bossLit}>
          <div className={styles.bossShake}>
            <div className={styles.idle} />
            <div
              className={styles.roar}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) onRoarEnd();
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        {t.epithet ? (
          <p className={`${styles.epithet} font-pixel`}>{t.epithet}</p>
        ) : null}
        <h3 className={`${styles.name} font-display`}>{t.name}</h3>
        <p className={`${styles.line} font-display`}>{t.line}</p>
        <div className={styles.hp} aria-hidden="true">
          <div className={styles.hpFill} />
        </div>
      </div>
    </div>
  );
}

const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 61 + 7) % 100}%`,
  size: 2 + (i % 3),
  duration: 9 + ((i * 5) % 8),
  delay: -((i * 13) % 17),
}));

export function BossesScene() {
  const t = useCopy(BOSSES_COPY);
  // 0 = horde, 1..5 = boss slices. Only neighbours of the current act are mounted.
  const [act, setAct] = useState(0);
  const [roar, setRoar] = useState(-1);
  const actRef = useRef(0);
  const firedRef = useRef<boolean[]>(BOSSES.map(() => false));

  const onProgress = (p: number) => {
    const next =
      p < HORDE_END
        ? 0
        : Math.min(BOSSES.length, 1 + Math.floor((p - HORDE_END) / SLICE));
    if (next !== actRef.current) {
      actRef.current = next;
      setAct(next);
    }
    const fired = firedRef.current;
    for (let i = 0; i < BOSSES.length; i++) {
      const at = roarAt(i);
      const end = i === LAST ? 2 : sliceStart(i) + SLICE;
      if (p >= at && p < end) {
        if (!fired[i]) {
          fired[i] = true;
          setRoar(i);
        }
      } else if (fired[i] && p < at - 0.01) {
        // Scrolled back above the trigger: re-arm so it can roar again.
        fired[i] = false;
      }
    }
  };

  return (
    <Scene id="bosses" length={440} vars={VARS} onProgress={onProgress}>
      <div className={styles.stage}>
        {act <= 1 ? <Horde line={t.horde} /> : null}

        {BOSSES.map((boss, i) =>
          Math.abs(act - (i + 1)) <= 1 ? (
            <BossReveal
              key={boss.id}
              boss={boss}
              index={i}
              roaring={roar === i}
              onRoarEnd={() => setRoar((r) => (r === i ? -1 : r))}
            />
          ) : null
        )}

        <div className={styles.motes} aria-hidden="true">
          {MOTES.map((m, i) => (
            <span
              key={i}
              style={{
                left: m.left,
                width: m.size,
                height: m.size,
                animationDuration: `${m.duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.vignette} />
      </div>
    </Scene>
  );
}

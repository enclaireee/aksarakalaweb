import type { CSSProperties } from "react";

interface PxSpriteProps {
  src: string;
  /** Frame and sheet size in source pixels. */
  fw: number;
  fh: number;
  sw: number;
  sh: number;
  frames: number;
  row?: number;
  start?: number;
  fps?: number;
  once?: boolean;
  flip?: boolean;
  /** Extra integer multiplier on top of the stage's `--u` pixel unit. */
  mult?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Like <Sprite>, but sized in the stage's responsive `--u` unit (CSS px per
 * source pixel) instead of a fixed scale, and its speed follows `--tm`
 * (time multiplier) so a parent can slow every sprite at once.
 */
export function PxSprite({
  src,
  fw,
  fh,
  sw,
  sh,
  frames,
  row = 0,
  start = 0,
  fps = 8,
  once = false,
  flip = false,
  mult = 1,
  className = "",
  style,
}: PxSpriteProps) {
  const u = (n: number) => `calc(var(--u) * ${n * mult})`;
  return (
    <div
      aria-hidden="true"
      className={`sprite ${className}`}
      style={
        {
          width: u(fw),
          height: u(fh),
          backgroundImage: `url('${src}')`,
          backgroundSize: `${u(sw)} ${u(sh)}`,
          backgroundPositionY: u(-row * fh),
          "--sprite-from": u(-start * fw),
          "--sprite-to": u(-(start + frames - (once ? 1 : 0)) * fw),
          animationDuration: `calc(${(frames / fps).toFixed(3)}s * var(--tm, 1))`,
          animationTimingFunction: once
            ? `steps(${frames}, jump-none)`
            : `steps(${frames})`,
          animationIterationCount: once ? 1 : "infinite",
          animationFillMode: once ? "both" : undefined,
          transform: flip ? "scaleX(-1)" : undefined,
          ...style,
        } as CSSProperties
      }
    />
  );
}

const GROUND = "/game/art/ground/ground_sunda.png";

/**
 * Ground band built from rows of the 16px ground sheet (8 seamless variants
 * per row). `rows` lists the sheet row to use for each band row, top to bottom.
 */
export function GroundRows({
  rows,
  className = "",
}: {
  rows: number[];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      {rows.map((sheetRow, i) => (
        <div
          key={i}
          className="pixelated"
          style={{
            height: "calc(var(--u) * 16)",
            backgroundImage: `url('${GROUND}')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "calc(var(--u) * 128) calc(var(--u) * 1152)",
            backgroundPosition: `calc(var(--u) * ${-16 * ((i * 3) % 8)}) calc(var(--u) * ${-16 * sheetRow})`,
          }}
        />
      ))}
    </div>
  );
}

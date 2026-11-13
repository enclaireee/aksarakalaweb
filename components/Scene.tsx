"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { registerScene, type Range } from "@/lib/scroll-engine";
import { useLanguage, type Lang } from "@/components/LanguageProvider";

interface SceneProps {
  /** Unique id; also the DOM id, used by the nav rail and scrollToScene(). */
  id: string;
  /** Total scroll length in viewport heights (100 = no pin, 300 = 2 screens of pinned scroll). */
  length?: number;
  /** Named sub-ranges of --p exposed as CSS variables, e.g. { title: [0.1, 0.3] } -> --title. */
  vars?: Record<string, Range>;
  /** Fraction of the scene used to fade in from / out to black. 0 disables. */
  fadeIn?: number;
  fadeOut?: number;
  /** Progress callback for discrete state changes. Keep it cheap; it runs every frame while scrolling. */
  onProgress?: (p: number) => void;
  className?: string;
  children: ReactNode;
}

/**
 * A pinned scroll scene. Children are rendered inside a sticky, viewport-sized
 * stage and can read --p, --fade and any named `vars` from CSS.
 */
export function Scene({
  id,
  length = 300,
  vars,
  fadeIn,
  fadeOut,
  onProgress,
  className = "",
  children,
}: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  // vars are static per scene; serialise so a fresh object literal doesn't re-register.
  const varsKey = JSON.stringify(vars ?? {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerScene({
      id,
      el,
      vars: JSON.parse(varsKey),
      fadeIn,
      fadeOut,
      onProgress: (p) => onProgressRef.current?.(p),
    });
  }, [id, varsKey, fadeIn, fadeOut]);

  return (
    <section
      ref={ref}
      id={id}
      data-scene={id}
      data-on="false"
      className="scene"
      style={{ height: `${length}vh` }}
    >
      <div className={`scene-pin ${className}`}>{children}</div>
    </section>
  );
}

interface SpriteProps {
  src: string;
  /** Size of one frame in source pixels. */
  frameW: number;
  frameH: number;
  /** Full sheet size in source pixels. */
  sheetW: number;
  sheetH: number;
  /** Number of frames to play, starting at `startFrame` on `row`. */
  frames: number;
  row?: number;
  startFrame?: number;
  fps?: number;
  /** Integer upscale factor (pixel art stays crisp). */
  scale?: number;
  /** Play once and hold the last frame instead of looping. */
  once?: boolean;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Animated pixel-art sprite from a horizontal strip / grid sheet. */
export function Sprite({
  src,
  frameW,
  frameH,
  sheetW,
  sheetH,
  frames,
  row = 0,
  startFrame = 0,
  fps = 8,
  scale = 2,
  once = false,
  flip = false,
  className = "",
  style,
}: SpriteProps) {
  const fromX = -startFrame * frameW * scale;
  // Looping: step past the last frame and wrap. Once: land on the last frame and hold it.
  const toX = -(startFrame + frames - (once ? 1 : 0)) * frameW * scale;
  return (
    <div
      aria-hidden="true"
      className={`sprite ${className}`}
      style={
        {
          width: frameW * scale,
          height: frameH * scale,
          backgroundImage: `url('${src}')`,
          backgroundSize: `${sheetW * scale}px ${sheetH * scale}px`,
          backgroundPositionY: -row * frameH * scale,
          "--sprite-from": `${fromX}px`,
          "--sprite-to": `${toX}px`,
          animationDuration: `${frames / fps}s`,
          animationTimingFunction: once
            ? `steps(${frames}, jump-none)`
            : `steps(${frames})`,
          animationIterationCount: once ? 1 : "infinite",
          animationFillMode: once ? "forwards" : undefined,
          transform: flip ? "scaleX(-1)" : undefined,
          ...style,
        } as CSSProperties
      }
    />
  );
}

/** Pick the current-language entry from a `{ en, id }` copy object. */
export function useCopy<T>(copy: Record<Lang, T>): T {
  const { lang } = useLanguage();
  return copy[lang];
}

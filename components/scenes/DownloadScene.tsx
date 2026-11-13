"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { Scene, Sprite, useCopy } from "@/components/Scene";
import { downloadCopy } from "@/lib/copy/download";
import { LINKS } from "@/lib/site";
import s from "./download.module.css";

const ART = "/game/art/";

type Platform = "windows" | "mac" | "other";

const subscribeNever = () => () => {};

function detectPlatform(): Platform {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const hint = `${nav.userAgentData?.platform ?? ""} ${nav.userAgent}`.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(hint)) return "other";
  if (/windows|win32|win64/.test(hint)) return "windows";
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  if (hint.includes("mac")) return nav.maxTouchPoints > 1 ? "other" : "mac";
  return "other";
}

const serverPlatform = (): Platform => "other";

const MOTES = [
  { x: 8, y: 78, d: 0, t: 9 },
  { x: 19, y: 64, d: 3.5, t: 11 },
  { x: 29, y: 86, d: 1.2, t: 8 },
  { x: 41, y: 72, d: 5.1, t: 10 },
  { x: 52, y: 90, d: 2.3, t: 12 },
  { x: 63, y: 68, d: 6.4, t: 9 },
  { x: 74, y: 82, d: 0.8, t: 11 },
  { x: 85, y: 70, d: 4.2, t: 8 },
  { x: 93, y: 88, d: 2.9, t: 10 },
];

function Layer({ name, className }: { name: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ART}intro/${name}.png`}
      alt=""
      draggable={false}
      className={`pixelated ${s.layer} ${className}`}
    />
  );
}

function DownloadIcon() {
  return (
    <svg
      className={s.icon}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M5 0h2v5h2v1H8v1H7v1H5V7H4V6H3V5h2zM1 9h1v1h8V9h1v3H1z"
      />
    </svg>
  );
}

export function DownloadScene() {
  const t = useCopy(downloadCopy);
  const platform = useSyncExternalStore(
    subscribeNever,
    detectPlatform,
    serverPlatform
  );

  const builds = [
    { id: "windows", href: LINKS.windows, label: t.windows, meta: t.windowsMeta },
    { id: "mac", href: LINKS.macArm, label: t.mac, meta: t.macMeta },
  ];
  // Promote the visitor's own platform: first in the row, and the only bright button.
  if (platform === "mac") builds.reverse();

  return (
    <Scene
      id="download"
      length={170}
      fadeIn={0}
      fadeOut={0}
      vars={{
        reveal: [0, 0.3],
        settle: [0, 0.85],
        logo: [0.02, 0.2],
        line: [0.15, 0.32],
        cta: [0.25, 0.48],
        foot: [0.4, 0.6],
      }}
    >
      <div className={s.root}>
        {/* ---------- dawn after the eclipse ---------- */}
        <div className={s.world} aria-hidden="true">
          <Layer name="dawn_sky" className={s.sky} />
          <div className={`pixelated ${s.sun}`} />
          <Layer name="dawn_far" className={s.far} />
          <Layer name="dawn_haze" className={s.haze} />
          <Layer name="dawn_mid" className={s.mid} />
          <div className={s.peak}>
            <Layer name="dawn_peak" className="" />
            <div className={s.heroBig}>
              <Sprite
                src={`${ART}portraits/class_mage.png`}
                frameW={96}
                frameH={128}
                sheetW={576}
                sheetH={128}
                frames={6}
                fps={6}
                scale={2}
              />
            </div>
            <div className={s.heroSmall}>
              <Sprite
                src={`${ART}hero_mage.png`}
                frameW={32}
                frameH={32}
                sheetW={192}
                sheetH={576}
                frames={4}
                row={2}
                fps={4}
                scale={2}
              />
            </div>
          </div>
        </div>

        <div className={s.motes} aria-hidden="true">
          {MOTES.map((m) => (
            <span
              key={m.x}
              className={s.mote}
              style={
                {
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  animationDelay: `-${m.d}s`,
                  animationDuration: `${m.t}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className={s.shade} aria-hidden="true" />
        <div className={s.veil} aria-hidden="true" />

        {/* ---------- the next step ---------- */}
        <div className={s.content}>
          <h2 className={s.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ART}ui/logo.png`}
              alt={t.logoAlt}
              width={140}
              height={84}
              draggable={false}
              className={`pixelated ${s.logoImg}`}
            />
          </h2>

          <p className={`font-display ${s.line}`}>{t.line}</p>

          <div className={s.cta}>
            <div className={s.buttons}>
              {builds.map((b) => (
                <a
                  key={b.id}
                  href={b.href}
                  className={`${s.btn} ${
                    platform === "other" || platform === b.id
                      ? s.btnBright
                      : s.btnQuiet
                  }`}
                >
                  <DownloadIcon />
                  <span className={s.btnText}>
                    <span className={`font-display ${s.btnLabel}`}>
                      {b.label}
                    </span>
                    <span className={`font-pixel ${s.btnMeta}`}>{b.meta}</span>
                  </span>
                </a>
              ))}
            </div>

            <p className={`font-pixel ${s.links}`}>
              <a href={LINKS.macZip}>{t.macZip}</a>
              <a href={LINKS.releases} target="_blank" rel="noopener noreferrer">
                {t.releases}
              </a>
              <a href={LINKS.repo} target="_blank" rel="noopener noreferrer">
                {t.source}
              </a>
            </p>

            <p className={`font-pixel ${s.facts}`}>{t.facts}</p>
          </div>
        </div>

        <footer className={`font-pixel ${s.footer}`}>
          <p>
            {t.footTitle} <span aria-hidden="true">·</span> {t.footEngine}
          </p>
          <p>
            Music: &quot;Night Vigil&quot; by Kevin MacLeod (
            <a
              href="https://incompetech.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              incompetech.com
            </a>
            ), licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>{" "}
            <span aria-hidden="true">·</span> {t.footFonts}
          </p>
        </footer>
      </div>
    </Scene>
  );
}

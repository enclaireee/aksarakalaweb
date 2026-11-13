"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { downloadCopy } from "@/lib/copy/download";
import { onActiveScene, scrollToScene } from "@/lib/scroll-engine";
import { LINKS, SCENES, detectPlatform, type Platform } from "@/lib/site";

const EMBERS = [
  { left: "8%", top: "72%", delay: "0s", color: "#fce09b" },
  { left: "21%", top: "38%", delay: "0.9s", color: "#5ef2ff" },
  { left: "37%", top: "83%", delay: "1.7s", color: "#f49d5a" },
  { left: "55%", top: "22%", delay: "0.4s", color: "#5ef2ff" },
  { left: "69%", top: "64%", delay: "1.3s", color: "#fce09b" },
  { left: "83%", top: "31%", delay: "2.1s", color: "#f49d5a" },
  { left: "93%", top: "78%", delay: "2.8s", color: "#5ef2ff" },
];

// Hard 1px dark pixel outline so chrome stays legible over bright and dark scenes alike.
const INK =
  "[text-shadow:1px_0_0_#090612,-1px_0_0_#090612,0_1px_0_#090612,0_-1px_0_#090612,1px_1px_0_#090612,-1px_-1px_0_#090612,1px_-1px_0_#090612,-1px_1px_0_#090612]";
const INK_IMG =
  "[filter:drop-shadow(1px_0_0_#090612)_drop-shadow(-1px_0_0_#090612)_drop-shadow(0_1px_0_#090612)_drop-shadow(0_-1px_0_#090612)]";

/** Fixed layer over every scene: header controls, scene rail, drifting embers. */
export function SiteChrome() {
  const { lang, toggleLang } = useLanguage();
  const [active, setActive] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [platform, setPlatform] = useState<Platform>("other");
  const t = downloadCopy[lang];

  useEffect(() => onActiveScene(setActive), []);

  useEffect(() => {
    // Low-end devices (<= 4 GB RAM or <= 4 cores) skip the purely decorative extras.
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4) {
      document.documentElement.dataset.lite = "";
    }
    return () => audioRef.current?.pause();
  }, []);

  const toggleAudio = async () => {
    // Created on first use so the track isn't fetched for visitors who never press play.
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/audio/title.ogg");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const atGate = active === null || active === "gate";
  const atEnd = active === "download";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => scrollToScene("gate")}
          aria-label="Aksara Kala"
          className={`pointer-events-auto cursor-pointer transition-opacity duration-500 ${
            atGate ? "pointer-events-none opacity-0" : "opacity-90 hover:opacity-100"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/game/art/ui/logo.png"
            alt="Aksara Kala"
            width={140}
            height={84}
            className={`pixelated h-10 w-auto ${INK_IMG}`}
          />
        </button>

        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={playing}
            className={`font-pixel ${INK} cursor-pointer text-xs tracking-wider transition-colors ${
              playing ? "text-[#5ef2ff]" : "text-[#f8f4ec]/65 hover:text-[#fce09b]"
            }`}
          >
            {playing ? "♪ ON" : "♪ OFF"}
          </button>
          <button
            type="button"
            onClick={toggleLang}
            className={`font-pixel ${INK} cursor-pointer text-xs tracking-wider text-[#f8f4ec]/75 transition-colors hover:text-[#fce09b]`}
          >
            {lang === "en" ? "EN | id" : "en | ID"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlatform(detectPlatform());
              dialogRef.current?.showModal();
            }}
            aria-haspopup="dialog"
            className={`font-pixel cursor-pointer border border-[#fce09b] px-3 py-1.5 text-xs tracking-wider transition-all duration-300 ${
              atEnd
                ? "pointer-events-none opacity-0"
                : "bg-[#fce09b] text-[#090612] shadow-[0_0_0_1px_#090612,0_0_18px_rgba(252,224,155,0.35)] hover:scale-105"
            }`}
          >
            {lang === "en" ? "Download" : "Unduh"}
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-labelledby="download-title"
        // A click on the backdrop lands on the <dialog> itself; inside, on its children.
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] border-2 border-[#fce09b] bg-[#0f0b1e] p-0 text-[#f8f4ec] shadow-[0_0_0_2px_#090612,0_0_40px_rgba(252,224,155,0.25)] backdrop:bg-[#090612]/80"
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="download-title" className="font-display text-2xl text-[#fce09b]">
                {lang === "en" ? "Download" : "Unduh"}
              </h2>
              <p className="font-pixel mt-1 text-[10px] tracking-wider text-[#f8f4ec]/60">
                {t.facts}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={lang === "en" ? "Close" : "Tutup"}
              className="font-pixel cursor-pointer px-1 text-sm text-[#f8f4ec]/70 hover:text-[#fce09b]"
            >
              ✕
            </button>
          </div>

          {(platform === "mac"
            ? [
                { id: "mac", href: LINKS.macArm, label: t.mac, meta: t.macMeta },
                { id: "windows", href: LINKS.windows, label: t.windows, meta: t.windowsMeta },
              ]
            : [
                { id: "windows", href: LINKS.windows, label: t.windows, meta: t.windowsMeta },
                { id: "mac", href: LINKS.macArm, label: t.mac, meta: t.macMeta },
              ]
          ).map((b) => (
            <a
              key={b.id}
              href={b.href}
              onClick={() => dialogRef.current?.close()}
              className={`flex flex-col gap-1 border-2 px-4 py-3 transition-colors ${
                platform === "other" || platform === b.id
                  ? "border-[#fce09b] bg-[#fce09b] text-[#090612] hover:bg-[#fff1c4]"
                  : "border-[#f8f4ec]/30 text-[#f8f4ec] hover:border-[#fce09b] hover:text-[#fce09b]"
              }`}
            >
              <span className="font-display text-lg leading-none">{b.label}</span>
              <span className="font-pixel text-[10px] tracking-wider opacity-70">{b.meta}</span>
            </a>
          ))}

          <a
            href={LINKS.macZip}
            onClick={() => dialogRef.current?.close()}
            className="font-pixel text-xs tracking-wider text-[#f8f4ec]/75 underline-offset-4 hover:text-[#fce09b] hover:underline"
          >
            {t.macZip}
          </a>
          <div className="font-pixel flex flex-wrap gap-x-5 gap-y-2 border-t border-[#f8f4ec]/15 pt-4 text-xs tracking-wider">
            <a
              href={LINKS.releases}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5ef2ff] underline-offset-4 hover:underline"
            >
              {t.releases} ↗
            </a>
            <a
              href={LINKS.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5ef2ff] underline-offset-4 hover:underline"
            >
              {t.source} ↗
            </a>
          </div>
        </div>
      </dialog>

      <nav
        aria-label={lang === "en" ? "Scenes" : "Adegan"}
        className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex"
      >
        {SCENES.map((scene) => {
          const on = active === scene.id;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => scrollToScene(scene.id, scene.id === "gate" ? 0 : 0.12)}
              aria-label={scene.label[lang]}
              aria-current={on ? "true" : undefined}
              className="group flex cursor-pointer items-center gap-2"
            >
              <span
                className={`font-pixel ${INK} text-[10px] tracking-wider text-[#fce09b] transition-opacity ${
                  on ? "opacity-90" : "opacity-0 group-hover:opacity-90"
                }`}
              >
                {scene.label[lang]}
              </span>
              <span
                className={`h-2 w-2 border transition-all ${
                  on
                    ? "scale-125 border-[#5ef2ff] bg-[#5ef2ff] shadow-[0_0_0_1px_#090612,0_0_10px_#5ef2ff]"
                    : "border-[#f8f4ec]/40 shadow-[0_0_0_1px_#090612] group-hover:border-[#fce09b]"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
        {EMBERS.map((e, idx) => (
          <span
            key={idx}
            className="ember animate-float-rune absolute h-1 w-1 opacity-50"
            style={{
              left: e.left,
              top: e.top,
              backgroundColor: e.color,
              animationDelay: e.delay,
              boxShadow: `0 0 8px ${e.color}`,
            }}
          />
        ))}
      </div>
    </>
  );
}

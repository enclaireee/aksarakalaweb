"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { onActiveScene, scrollToScene } from "@/lib/scroll-engine";
import { SCENES } from "@/lib/site";

const EMBERS = [
  { left: "8%", top: "72%", delay: "0s", color: "#fce09b" },
  { left: "21%", top: "38%", delay: "0.9s", color: "#5ef2ff" },
  { left: "37%", top: "83%", delay: "1.7s", color: "#f49d5a" },
  { left: "55%", top: "22%", delay: "0.4s", color: "#5ef2ff" },
  { left: "69%", top: "64%", delay: "1.3s", color: "#fce09b" },
  { left: "83%", top: "31%", delay: "2.1s", color: "#f49d5a" },
  { left: "93%", top: "78%", delay: "2.8s", color: "#5ef2ff" },
];

/** Fixed layer over every scene: header controls, scene rail, drifting embers. */
export function SiteChrome() {
  const { lang, toggleLang } = useLanguage();
  const [active, setActive] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => onActiveScene(setActive), []);

  useEffect(() => {
    const audio = new Audio("/assets/audio/title.ogg");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
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
            className="pixelated h-10 w-auto"
          />
        </button>

        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={playing}
            className={`font-pixel cursor-pointer text-xs tracking-wider transition-colors ${
              playing ? "text-[#5ef2ff]" : "text-[#f8f4ec]/65 hover:text-[#fce09b]"
            }`}
          >
            {playing ? "♪ ON" : "♪ OFF"}
          </button>
          <button
            type="button"
            onClick={toggleLang}
            className="font-pixel cursor-pointer text-xs tracking-wider text-[#f8f4ec]/75 transition-colors hover:text-[#fce09b]"
          >
            {lang === "en" ? "EN | id" : "en | ID"}
          </button>
          <button
            type="button"
            onClick={() => scrollToScene("download", 1)}
            className={`font-pixel cursor-pointer border border-[#fce09b] px-3 py-1.5 text-xs tracking-wider transition-all duration-300 ${
              atEnd
                ? "pointer-events-none opacity-0"
                : "bg-[#fce09b] text-[#090612] shadow-[0_0_18px_rgba(252,224,155,0.35)] hover:scale-105"
            }`}
          >
            {lang === "en" ? "Download" : "Unduh"}
          </button>
        </div>
      </header>

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
                className={`font-pixel text-[10px] tracking-wider text-[#fce09b] transition-opacity ${
                  on ? "opacity-90" : "opacity-0 group-hover:opacity-90"
                }`}
              >
                {scene.label[lang]}
              </span>
              <span
                className={`h-2 w-2 border transition-all ${
                  on
                    ? "scale-125 border-[#5ef2ff] bg-[#5ef2ff] shadow-[0_0_10px_#5ef2ff]"
                    : "border-[#f8f4ec]/40 group-hover:border-[#fce09b]"
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
            className="animate-float-rune absolute h-1 w-1 opacity-50"
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

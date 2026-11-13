"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { COPY } from "@/lib/i18n";

const STARS = [
  { top: "7%", left: "11%", size: 3, delay: "0s" },
  { top: "12%", left: "26%", size: 2, delay: "0.8s" },
  { top: "6%", left: "43%", size: 3, delay: "1.4s" },
  { top: "17%", left: "60%", size: 2, delay: "0.3s" },
  { top: "10%", left: "76%", size: 3, delay: "2.0s" },
  { top: "15%", left: "90%", size: 2, delay: "0.6s" },
  { top: "24%", left: "18%", size: 2, delay: "1.1s" },
  { top: "21%", left: "37%", size: 3, delay: "2.3s" },
  { top: "29%", left: "70%", size: 2, delay: "0.4s" },
  { top: "27%", left: "84%", size: 3, delay: "1.7s" },
];

const EMBERS = [
  { left: "15%", top: "68%", delay: "0s", color: "#fce09b" },
  { left: "28%", top: "74%", delay: "0.9s", color: "#5ef2ff" },
  { left: "42%", top: "62%", delay: "1.7s", color: "#f49d5a" },
  { left: "58%", top: "71%", delay: "0.4s", color: "#5ef2ff" },
  { left: "73%", top: "65%", delay: "1.3s", color: "#fce09b" },
  { left: "86%", top: "76%", delay: "2.1s", color: "#f49d5a" },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function range(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start));
}

function bell(
  p: number,
  start: number,
  peakIn: number,
  peakOut: number,
  end: number
) {
  if (p <= start || p >= end) return 0;
  if (p < peakIn) return clamp01((p - start) / (peakIn - start));
  if (p > peakOut) return clamp01(1 - (p - peakOut) / (end - peakOut));
  return 1;
}

export function ScrollExperience() {
  const { lang, toggleLang } = useLanguage();
  const t = COPY[lang];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetPRef = useRef(0);
  const currentPRef = useRef(0);
  const [p, setP] = useState(0);

  // Subtle mouse parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Beat 2: Lontar click whisper state
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [lontarPulse, setLontarPulse] = useState(false);

  // Beat 3: Interactive spell cast state
  const [activeSpellIdx, setActiveSpellIdx] = useState(0);
  const [castBurstKey, setCastBurstKey] = useState(0);

  // Beat 4: Eclipse pulse
  const [eclipsePulse, setEclipsePulse] = useState(false);

  // Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    const updateTarget = () => {
      const el = containerRef.current;
      if (!el) return;
      const maxScroll = el.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      targetPRef.current = clamp01(window.scrollY / maxScroll);
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: nx, y: ny });
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let rafId = 0;
    const tick = () => {
      const diff = targetPRef.current - currentPRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentPRef.current += diff * 0.14;
        setP(currentPRef.current);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const scrollToProgress = (target: number) => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: target * maxScroll, behavior: "smooth" });
  };

  const handleLontarClick = () => {
    setWhisperIdx((prev) => (prev + 1) % t.beat2Whispers.length);
    setLontarPulse(true);
    setTimeout(() => setLontarPulse(false), 450);
  };

  const handleCastSpell = (idx: number) => {
    setActiveSpellIdx(idx);
    setCastBurstKey((k) => k + 1);
  };

  const handleEclipseClick = () => {
    setEclipsePulse(true);
    setTimeout(() => setEclipsePulse(false), 500);
  };

  // Overlapping beat opacities (never an empty void)
  const beat1Opacity = clamp01(1 - range(p, 0.14, 0.3));
  const beat2Opacity = bell(p, 0.16, 0.27, 0.45, 0.56);
  const beat3Opacity = bell(p, 0.44, 0.54, 0.72, 0.82);
  const beat4Opacity = range(p, 0.72, 0.85);

  const twilightOpacity = 1 - range(p, 0.08, 0.36);
  const gatePush = range(p, 0, 0.3);
  const sigilDraw = range(p, 0.45, 0.64);
  const activeSpell = t.beat3Spells[activeSpellIdx];

  const activeBeat = p < 0.24 ? 0 : p < 0.52 ? 1 : p < 0.78 ? 2 : 3;

  return (
    <div ref={containerRef} className="relative h-[420vh] bg-[#090612]">
      {/* Minimal Floating Top-Right Controls */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-4">
        <button
          type="button"
          onClick={toggleAudio}
          className={`font-pixel text-xs tracking-wider transition-colors cursor-pointer ${
            playing ? "text-[#5ef2ff]" : "text-[#f8f4ec]/65 hover:text-[#fce09b]"
          }`}
        >
          {playing ? "♪ ON" : "♪ OFF"}
        </button>
        <button
          type="button"
          onClick={toggleLang}
          className="font-pixel text-xs tracking-wider text-[#f8f4ec]/75 transition-colors hover:text-[#fce09b] cursor-pointer"
        >
          {lang === "en" ? "EN | id" : "en | ID"}
        </button>
        <button
          type="button"
          onClick={() => scrollToProgress(1)}
          className="font-pixel border border-[#fce09b]/70 bg-[#090612]/60 px-3 py-1 text-xs text-[#fce09b] transition-colors hover:bg-[#fce09b] hover:text-[#090612] cursor-pointer"
        >
          {t.downloadTop}
        </button>
      </div>

      {/* Clickable 4-Beat Progress Rail */}
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3">
        {[0, 0.34, 0.62, 0.96].map((target, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToProgress(target)}
            aria-label={`Jump to scene ${idx + 1}`}
            className={`h-2.5 w-2.5 border transition-all cursor-pointer ${
              activeBeat === idx
                ? "scale-125 border-[#5ef2ff] bg-[#5ef2ff] shadow-[0_0_10px_#5ef2ff]"
                : "border-[#f8f4ec]/40 bg-transparent hover:border-[#fce09b]"
            }`}
          />
        ))}
      </div>

      {/* Pinned 100vh Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#090612]">
        {/* Twilight Sky */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: twilightOpacity,
            background:
              "linear-gradient(180deg, #0f0b1e 0%, #1b1433 34%, #592654 66%, #b25259 85%, #f49d5a 100%)",
          }}
        />

        {/* Beat 3 Slow-Mo Cyan Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: beat3Opacity * 0.8,
            background:
              "radial-gradient(circle at 50% 50%, rgba(94,242,255,0.06) 15%, rgba(9,6,18,0.9) 85%)",
          }}
        />

        {/* Beat 4 Crimson Eclipse Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: beat4Opacity * 0.9,
            background:
              "radial-gradient(circle at 50% 42%, rgba(190,18,60,0.38) 0%, rgba(244,157,90,0.12) 34%, rgba(9,6,18,0) 70%)",
          }}
        />

        {/* Pixel Stars */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {STARS.map((s, idx) => (
            <span
              key={idx}
              className="animate-twinkle absolute bg-[#f8f4ec]"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>

        {/* Drifting Pixel Embers */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {EMBERS.map((e, idx) => (
            <span
              key={idx}
              className="animate-float-rune absolute h-1.5 w-1.5 opacity-60"
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

        {/* ============================================================
            BEAT 1: THE TWILIGHT GATE
           ============================================================ */}
        <div
          className={`absolute inset-0 ${
            beat1Opacity > 0.2 ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ opacity: beat1Opacity }}
        >
          {/* Parallax Pixel Layers (capped scale so zero clipping) */}
          <div
            className="pixelated pointer-events-none absolute inset-x-0 bottom-8 h-[52vh] bg-bottom bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/pixel/hero_mountains_far.png')",
              backgroundSize: "cover",
              transform: `translate3d(${mouse.x * -6}px, ${gatePush * 30 + mouse.y * -4}px, 0) scale(${1 + gatePush * 0.14})`,
            }}
          />
          <div
            className="pixelated pointer-events-none absolute inset-x-0 bottom-0 h-[54vh] bg-bottom bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/pixel/hero_ruins_mid.png')",
              backgroundSize: "cover",
              transform: `translate3d(${mouse.x * -12}px, ${gatePush * 50 + mouse.y * -6}px, 0) scale(${1 + gatePush * 0.28})`,
            }}
          />
          <div
            className="pixelated pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] bg-bottom bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/pixel/hero_foreground.png')",
              backgroundSize: "cover",
              transform: `translate3d(${mouse.x * -18}px, ${gatePush * 70}px, 0) scale(${1 + gatePush * 0.35})`,
            }}
          />

          {/* Title & Enter CTA */}
          <div className="relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center pt-[16vh] px-5 text-center">
            <h1 className="font-display text-6xl leading-none tracking-wide text-[#f8f4ec] drop-shadow-[0_4px_0_#0f0b1e] sm:text-8xl">
              Akśārā Kālā
            </h1>
            <p className="mt-2 font-pixel text-sm tracking-[0.28em] text-[#fce09b] uppercase sm:text-base">
              {t.subtitle}
            </p>

            <button
              type="button"
              onClick={() => scrollToProgress(0.34)}
              className="font-pixel mt-8 border border-[#f8f4ec]/40 bg-[#090612]/55 px-5 py-2.5 text-xs tracking-widest text-[#f8f4ec] backdrop-blur-sm transition-all hover:border-[#5ef2ff] hover:text-[#5ef2ff] cursor-pointer"
            >
              {t.enterGate}
            </button>
          </div>
        </div>

        {/* ============================================================
            BEAT 2: THE TORN LONTAR (CLICKABLE MEMORY)
           ============================================================ */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center ${
            beat2Opacity > 0.25 ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ opacity: beat2Opacity }}
        >
          <button
            type="button"
            onClick={handleLontarClick}
            className={`group relative mb-6 cursor-pointer transition-transform duration-300 hover:scale-105 ${
              lontarPulse ? "scale-110" : ""
            }`}
            aria-label="Touch the lontar manuscript"
          >
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-300 ${
                lontarPulse ? "bg-[#5ef2ff]/45" : "bg-[#5ef2ff]/15"
              }`}
              aria-hidden="true"
            />
            <Image
              src="/assets/pixel/lontar_scroll.png"
              alt="Torn lontar manuscript"
              width={400}
              height={240}
              className="pixelated relative h-auto w-[260px] sm:w-[330px]"
            />
          </button>

          <p className="font-display max-w-2xl text-3xl leading-snug text-[#f8f4ec] sm:text-5xl">
            {t.beat2Line1}
          </p>
          <p className="mt-3 font-pixel text-xs tracking-wider text-[#5ef2ff] sm:text-sm">
            {t.beat2Line2}
          </p>
          <p className="mt-5 font-display text-2xl italic text-[#fce09b] transition-all">
            {t.beat2Whispers[whisperIdx]}
          </p>
        </div>

        {/* ============================================================
            BEAT 3: SLOW TIME · INTERACTIVE RUNE CASTING
           ============================================================ */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center ${
            beat3Opacity > 0.25 ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ opacity: beat3Opacity }}
        >
          {/* Central Scrubbed / Active Spell Sigil */}
          <button
            type="button"
            onClick={() => handleCastSpell(activeSpellIdx)}
            className="group relative mb-6 flex h-44 w-44 items-center justify-center cursor-pointer sm:h-52 sm:w-52"
            aria-label="Cast selected Aksara spell"
          >
            {/* Burst Ring on Click */}
            <span
              key={castBurstKey}
              className="pointer-events-none absolute inset-0 rounded-full border-2 animate-ping"
              style={{
                borderColor: activeSpell.color,
                animationIterationCount: 1,
                animationDuration: "650ms",
              }}
            />

            <svg
              viewBox="0 0 120 120"
              className="h-full w-full overflow-visible"
              fill="none"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={activeSpell.color}
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M30 88 L30 30 M30 56 L58 32 L58 88 M58 56 L88 32 L88 88"
                stroke={activeSpell.color}
                strokeWidth="4"
                strokeLinecap="square"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - sigilDraw}
                style={{
                  opacity: activeSpellIdx === 0 ? 1 : 0.25,
                  filter: `drop-shadow(0 0 12px ${activeSpell.color})`,
                }}
              />
            </svg>

            <span
              className="font-sunda absolute text-6xl transition-transform group-hover:scale-110"
              style={{
                color: activeSpell.color,
                textShadow: `0 0 22px ${activeSpell.color}`,
              }}
            >
              {activeSpell.char}
            </span>
          </button>

          <p className="font-display text-4xl text-[#f8f4ec] sm:text-5xl">
            {t.beat3Line1}
          </p>
          <p className="mt-2 font-pixel text-xs tracking-wider text-[#b8afc8]">
            {t.beat3Hint}
          </p>

          {/* 3 Clickable Spell Runes */}
          <div className="mt-6 flex items-center gap-3">
            {t.beat3Spells.map((sp, idx) => {
              const selected = idx === activeSpellIdx;
              return (
                <button
                  key={sp.name}
                  type="button"
                  onClick={() => handleCastSpell(idx)}
                  className={`flex items-center gap-2 border px-3.5 py-2 transition-all cursor-pointer ${
                    selected
                      ? "bg-[#1b1433] scale-105"
                      : "border-[#4d3a6b] bg-[#090612]/70 opacity-75 hover:opacity-100"
                  }`}
                  style={{
                    borderColor: selected ? sp.color : undefined,
                    color: sp.color,
                  }}
                >
                  <span className="font-sunda text-xl leading-none">
                    {sp.char}
                  </span>
                  <span className="font-pixel text-[11px]">{sp.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            BEAT 4: THE ECLIPSE & THE DOWNLOAD CALL
           ============================================================ */}
        <div
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center ${
            beat4Opacity > 0.25 ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ opacity: beat4Opacity }}
        >
          <button
            type="button"
            onClick={handleEclipseClick}
            className={`cursor-pointer transition-transform duration-300 hover:scale-105 ${
              eclipsePulse ? "scale-110" : ""
            }`}
            aria-label="Pulse the Eclipse of Batara Kala"
          >
            <Image
              src="/assets/pixel/kala_eclipse.png"
              alt="Eclipse of Batara Kala"
              width={240}
              height={240}
              className="pixelated mx-auto h-40 w-40 sm:h-52 sm:w-52"
            />
          </button>

          <h2 className="font-display mt-5 max-w-2xl text-4xl leading-tight text-[#f8f4ec] sm:text-6xl">
            {t.beat4Line1}
          </h2>

          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="https://github.com/enclaireee/AksaraKala/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel border-2 border-[#fce09b] bg-[#fce09b] px-8 py-4 text-sm font-bold tracking-wider text-[#090612] shadow-[0_0_36px_rgba(252,224,155,0.4)] transition-transform hover:scale-105"
            >
              {t.ctaDownload}
            </a>

            <a
              href="https://github.com/enclaireee/AksaraKala"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-xs tracking-wider text-[#b8afc8]/80 underline-offset-4 transition-colors hover:text-[#5ef2ff] hover:underline"
            >
              {t.ctaSource}
            </a>
          </div>
        </div>

        {/* Lone Pixel Hero Silhouette (anchored at bottom horizon) */}
        <div
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2"
          style={{ opacity: clamp01(1 - beat2Opacity * 0.85) }}
          aria-hidden="true"
        >
          <div
            className="sprite-class-2x scale-[0.55] origin-bottom sm:scale-[0.7]"
            style={{ backgroundImage: "url('/assets/sprites/class_mage.png')" }}
          />
        </div>
      </div>
    </div>
  );
}

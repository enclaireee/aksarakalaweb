/** Scene order, ids and shared links. Scene ids must match the `id` passed to <Scene>. */
export const SCENES = [
  { id: "gate", label: { en: "Aksara Kala", id: "Aksara Kala" } },
  { id: "game", label: { en: "The Game", id: "Gamenya" } },
  { id: "cast", label: { en: "Spellcasting", id: "Merapal Mantra" } },
  { id: "paths", label: { en: "Classes", id: "Kelas" } },
  { id: "journey", label: { en: "The World", id: "Dunia" } },
  { id: "bosses", label: { en: "Bosses", id: "Bos" } },
  { id: "download", label: { en: "Play", id: "Main" } },
] as const;

export const LINKS = {
  repo: "https://github.com/enclaireee/AksaraKala",
  releases: "https://github.com/enclaireee/AksaraKala/releases/latest",
  windows:
    "https://github.com/enclaireee/AksaraKala/releases/latest/download/AksaraKala.exe",
  macArm:
    "https://github.com/enclaireee/AksaraKala/releases/latest/download/AksaraKala-arm64.dmg",
  macZip:
    "https://github.com/enclaireee/AksaraKala/releases/latest/download/AksaraKala.zip",
} as const;

export type Platform = "windows" | "mac" | "other";

/** Browser-only: guess the visitor's OS so we can offer the matching build. */
export function detectPlatform(): Platform {
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

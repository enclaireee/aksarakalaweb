/** Scene order, ids and shared links. Scene ids must match the `id` passed to <Scene>. */
export const SCENES = [
  { id: "gate", label: { en: "The Gate", id: "Gerbang" } },
  { id: "kelir", label: { en: "The Night of the Wayang", id: "Malam Wayang" } },
  { id: "forgotten", label: { en: "The Erased Name", id: "Nama yang Terhapus" } },
  { id: "cast", label: { en: "Slow Time", id: "Perlambat Waktu" } },
  { id: "journey", label: { en: "The Road East", id: "Jalan ke Timur" } },
  { id: "bosses", label: { en: "What Waits", id: "Yang Menanti" } },
  { id: "paths", label: { en: "Eight Paths", id: "Delapan Jalan" } },
  { id: "kala", label: { en: "The Eclipse", id: "Gerhana" } },
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

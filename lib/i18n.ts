import type { Lang } from "@/components/LanguageProvider";

export const COPY = {
  en: {
    subtitle: "The Script of Time",
    enterGate: "Enter the Gate ↓",
    downloadTop: "Download",
    beat2Line1: "They erased her name from the world.",
    beat2Line2: "Click the fading ink to hear what remains.",
    beat2Whispers: [
      "\"...don't forget me, Kak...\"",
      "\"...follow the torn lontar...\"",
      "\"...only Ka still remembers...\"",
    ],
    beat3Line1: "Slow time. Cast the script.",
    beat3Hint: "Click a rune to unleash its power",
    beat3Spells: [
      { char: "ᮊ", name: "Ka · Fire Bolt", color: "#f49d5a" },
      { char: "ᮎ", name: "Ca · Shockwave", color: "#5ef2ff" },
      { char: "ᮌ", name: "Ga · Spirit Ward", color: "#fce09b" },
    ],
    beat4Line1: "Break the eclipse. Bring Laras home.",
    ctaDownload: "Download Aksara Kala",
    ctaSource: "View source on GitHub",
  },
  id: {
    subtitle: "Naskah Penjaga Waktu",
    enterGate: "Masuki Gerbang ↓",
    downloadTop: "Unduh",
    beat2Line1: "Mereka menghapus namanya dari dunia.",
    beat2Line2: "Klik tinta yang memudar untuk mendengar sisanya.",
    beat2Whispers: [
      "\"...jangan lupakan aku, Kak...\"",
      "\"...ikuti potongan lontar ini...\"",
      "\"...hanya Ka yang masih ingat...\"",
    ],
    beat3Line1: "Perlambat waktu. Rapalkan aksara.",
    beat3Hint: "Klik aksara untuk melepaskan kekuatannya",
    beat3Spells: [
      { char: "ᮊ", name: "Ka · Panah Api", color: "#f49d5a" },
      { char: "ᮎ", name: "Ca · Gelombang Kejut", color: "#5ef2ff" },
      { char: "ᮌ", name: "Ga · Perisai Roh", color: "#fce09b" },
    ],
    beat4Line1: "Patahkan gerhana. Bawa pulang Laras.",
    ctaDownload: "Unduh Aksara Kala",
    ctaSource: "Lihat kode di GitHub",
  },
} satisfies Record<Lang, unknown>;

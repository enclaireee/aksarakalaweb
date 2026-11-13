import type { Lang } from "@/components/LanguageProvider";

export const castCopy = {
  en: {
    come: "Enemies rush you in real time.",
    slow: "Hold to slow time.",
    slowSub: "Right mouse · the fight waits for you",
    write: "Draw the aksara.",
    writeSub: "Ka · Bolt",
    release: "Release to cast.",
    releaseSub: "Ca · Burst",
    cta: "Every spell is a letter you draw by hand.",
    download: "Download",
  },
  id: {
    come: "Musuh menyerbu secara real-time.",
    slow: "Tahan untuk memperlambat waktu.",
    slowSub: "Klik kanan · pertarungan menunggumu",
    write: "Goreskan aksaranya.",
    writeSub: "Ka · Sambaran",
    release: "Lepaskan untuk merapal.",
    releaseSub: "Ca · Ledakan",
    cta: "Tiap mantra adalah aksara yang kaugambar sendiri.",
    download: "Unduh",
  },
} satisfies Record<Lang, unknown>;

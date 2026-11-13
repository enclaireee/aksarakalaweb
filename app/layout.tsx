import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aksara Kala — The Script of Time | 2D Pixel Action RPG",
  description:
    "A top-down 2D pixel-art action RPG rooted in Sundanese and Javanese folklore. Draw ancient Aksara glyphs in slow motion to cast spells and break the curse of Batara Kala.",
  openGraph: {
    title: "Aksara Kala — The Script of Time",
    description:
      "Wield the forgotten scripts of Java and Sunda in a 2D pixel-art action RPG built with Godot 4.7.",
    images: ["/assets/poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-[#0f0b1e] text-[#f8f4ec] antialiased selection:bg-[#5ef2ff]/30 selection:text-[#fce09b]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

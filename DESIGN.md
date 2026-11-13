# DESIGN.md — Aksara Kala Website

**Project:** Aksara Kala (*The Script of Time*) Official Showcase Website  
**Game Repo:** [`enclaireee/AksaraKala`](https://github.com/enclaireee/AksaraKala) (Godot 4.7, 480×270 2D Pixel Action RPG)  
**Primary Audience:** Players & community discovery + *Budaya Go!* competition judges & cultural showcase  
**Structure:** Single-page scrolling landing page with smooth section navigation and **Bilingual (`EN` / `ID`)** toggle  

---

## 1. Visual Direction & Aesthetic

**Poster-Faithful Twilight Indigo-to-Amber + Modern Dark UI with Crisp Pixel Accents.**  
Instead of a cluttered full-retro OS or generic dark SaaS template, the site pairs clean, readable modern dark surfaces with **crisp pixel-art frames**, **RPG *lontar* dialogue/codex borders**, and **glowing cyan Aksara runes**.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-void` | `#0F0B1E` | Deepest page background, footer, night sky top |
| `--bg-indigo` | `#1B1433` | Primary section background, twilight cards |
| `--bg-plum` | `#3A214A` | Elevated cards, hover surfaces, twilight mid-band |
| `--twilight-rose` | `#7C3262` | Hero gradient transition |
| `--sunset-amber` | `#F49D5A` | Hero horizon glow, warm highlights, seal emblems |
| `--sunset-gold` | `#FCE09B` | Primary warm text highlights, active tab/button trim |
| `--aksara-cyan` | `#5EF2FF` | Signature glowing Aksara runes, spell canvas ink, focus rings |
| `--aksara-teal` | `#1CA3B8` | Secondary rune glow, border accents |
| `--text-primary` | `#F8F4EC` | Warm off-white body & heading text |
| `--text-muted` | `#B8AFC8` | Secondary descriptions, metadata, captions |
| `--border-pixel` | `#4D3A6B` | Crisp 2px pixel-style card borders |

### Pixel Art & Motion Rules
- All game sprites, tiles, and pixel illustrations MUST use `image-rendering: pixelated;` (`pixelated` utility class) so pixels stay razor-sharp at any zoom.
- Subtle atmospheric motion only: twinkling pixel stars in the hero sky, drifting ember/firefly motes, and smooth spell-particle bursts on the Aksara Canvas.
- Respect `prefers-reduced-motion` for all decorative animations.

---

## 2. Typography

We pull the game's actual open-licensed fonts from `enclaireee/AksaraKala/assets/fonts/` plus a clean modern sans-serif for long-form readability:

| Role | Font | Source |
|---|---|---|
| **Display / Hero / Section Titles** | `Jersey 10` / `Jersey 15` | `assets/fonts/Jersey10-Regular.ttf`, `Jersey15-Regular.ttf` |
| **Pixel Badges / HUD Micro-labels** | `Tiny5` | `assets/fonts/Tiny5-Regular.woff` |
| **Aksara Sunda & Jawa Glyphs** | `Noto Sans Sundanese`, `Noto Sans Javanese` | `assets/fonts/NotoSansSundanese.ttf`, `NotoSansJavanese.ttf` |
| **Body Copy & UI** | `Plus Jakarta Sans` (via `next/font/google`) | Clean legibility for EN/ID lore & judge/player info |

---

## 3. Page Architecture (Single-Page Sections)

### Sticky Top Navigation Bar
- Left: Pixel emblem + **Aksara Kala** wordmark
- Center: Smooth-scroll links (`Story`, `Aksara`, `World`, `Classes`, `Credits`)
- Right: **`EN` / `ID` Language Toggle** + optional **Ambient Audio Toggle** + **GitHub** icon link

### Section 1: Hero (`#hero`)
- **Visual:** Full-viewport twilight-to-sunset gradient sky (`#0F0B1E` → `#1B1433` → `#7C3262` → `#F49D5A`) with twinkling pixel stars, layered pixel *candi/gapura* ruins, and the hero sprite beneath a floating glowing cyan Aksara glyph (referencing the official poster).
- **Content:**
  - Title: **Akśārā Kālā** (*The Script of Time*)
  - Tagline (EN/ID): *"Wield the forgotten scripts of Java and Sunda. Draw ancient Aksara in slow motion to break the curse of Batara Kala."*
  - Primary CTA: **Try Aksara Casting** (scrolls to `#aksara`)
  - Secondary CTA: **Explore the World** (scrolls to `#world`) + **View on GitHub**

### Section 2: Story & Cultural Roots (`#story`)
- **The Hook:** The torn *lontar* manuscript—your sister **Laras** can hear True Names and is taken by the Hunter. Nobody in Desa Purwa remembers her except you, Semar, and your half of the *lontar*, where her fading *Ka* strokes serve as your ticking clock.
- **The Four Great Seals:** Interactive or visual 4-card breakdown of the seals rooted in Nusantara folklore (Sangkuriang's Crater, The Royal Name of Galuh, Bandung Bondowoso's Thousand Temples, Mpu Gandring's Keris).
- **Cultural Pillar Callout (for Budaya Go!):** Explains how *Aksara* (living script as magic) and *Kala* (Batara Kala, time & fate) unite authentic heritage with core gameplay mechanics.

### Section 3: Interactive Aksara Spell Canvas (`#aksara`) — *Signature Feature*
- **Concept:** Mirrors the game's core slow-motion casting mechanic directly in the browser.
- **Left Panel (Grimoire / Spell Selector):** Pick a spell glyph (e.g., **Ka** — *Burst / Api*, **Ca** — *Bolt / Cahaya*, **Na** — *Ward / Perisai*, **Ba** — *Heal / Jamu*, **Sa** — *Ombak / Gelombang*) showing its authentic Aksara Sunda/Jawa character, stroke guide, and in-game effect.
- **Right Panel (Drawing Canvas):** Visitors draw with mouse or touch on a dark *lontar*-framed HTML5 canvas. Glowing cyan ink (`#5EF2FF`) traces their stroke; on release, a lightweight stroke recognizer evaluates the shape and triggers a **pixel-art particle spell burst** + sound/visual feedback! Includes a "Quick Cast / Demo" button for mobile or quick testing.

### Section 4: World & 7 Regions Explorer (`#world`)
- **Interactive West-to-East Nusantara Map / Region Selector** covering all **7 regions (49 areas)**:
  0. **Desa Purwa** (1 Area) — Prologue & Home Village
  1. **Tatar Sunda** (8 Areas) — *Act I: The Crater Seal*
  2. **Keraton Galuh** (7 Areas) — *Act II: The Borrowed Face*
  3. **Mataram** (8 Areas) — *Act III: Blood on the Pamali*
  4. **Tanah Timur** (8 Areas) — *Act IV: The Seven-Generation Blade*
  5. **Segara Kidul** (7 Areas) — *Act V: The Sea Does Not Forget*
  6. **Gua Kala** (7 Areas) — *Act VI: Into the Maw of Time*
- Selecting a region updates a detail card with its Act subtitle, folklore inspiration, key landmarks, and authentic tileset/art preview from `assets/art/`.

### Section 5: Classes & Combat Showcase (`#classes`)
- **4 Schools × 2 Paths (8 Classes)** displayed in an interactive RPG class-select style grid/tabs:
  - **Warrior** / **Lancer**
  - **Archer** / **Herder**
  - **Rogue** / **Dancer**
  - **Mage** / **Dalang**
- Each card/panel displays the actual `hero_*.png` pixel sprite (scaled cleanly with `image-rendering: pixelated`), Indonesian & English title, combat role, core mechanic (3-hit combo, dodge i-frames, perfect dodge), and signature Aksara affinity.

### Section 6: Credits, Recognition & Footer (`#credits`)
- **Budaya Go!** recognition badge & cultural mission summary.
- **Tech Specs Pill Bar:** Godot 4.7 · 480×270 Pixel Art · 49 Areas · Aksara Sunda & Jawa · Open Source.
- **Links:** GitHub Repository (`enclaireee/AksaraKala`), Quick Start / Controls modal or summary, and credits.

---

## 4. Bilingual (`EN` / `ID`) Architecture

- Centralized typed dictionary in `lib/i18n.ts` with `en` and `id` keys for every UI label, story paragraph, region description, class profile, and spell description.
- `LanguageProvider` React context persisted to `localStorage` (defaulting to `en`, instant toggle in the header with zero page reload).

---

## 5. Asset Extraction Plan (from `enclaireee/AksaraKala`)

We will copy selected verified assets from `enclaireee/AksaraKala` into `public/`:
- `public/fonts/`: `Jersey10-Regular.ttf`, `Jersey15-Regular.ttf`, `Tiny5-Regular.woff`, `NotoSansJavanese.ttf`, `NotoSansSundanese.ttf`
- `public/assets/sprites/`: `hero_warrior.png`, `hero_lancer.png`, `hero_archer.png`, `hero_herder.png`, `hero_rogue.png`, `hero_dancer.png`, `hero_mage.png`, `hero_dalang.png`
- `public/assets/tiles/` & `public/assets/poster.jpg`: regional tilesets/props/portraits as needed + the official poster image for reference/meta/gallery.
- `public/assets/audio/`: 1–2 lightweight ambient/gamelan tracks (if present in `assets/audio/`) for the optional muteable sound toggle.

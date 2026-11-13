# DESIGN.md — Aksara Kala Website (v2)

Showcase site for Aksara Kala (*The Script of Time*), a Godot pixel-art action RPG built on Sundanese and Javanese folklore. One long page, seven pinned scenes. The site sells the game (genre, mechanics, classes, world, bosses), not the plot; keep story to a line at most; scrolling is the only interaction besides the header controls. Bilingual EN/ID.

## 1. Architecture

- `app/page.tsx` renders `<SiteChrome />` then the scenes in order: gate, game, cast, paths, journey, bosses, download.
- `components/Scene.tsx`: a tall `<section id>` with a sticky viewport-sized stage. Props: `length` (scroll length in viewport heights), `vars` (named sub-ranges of progress), `fadeIn`/`fadeOut`, `onProgress` (discrete state only).
- `lib/scroll-engine.ts`: a single rAF loop with smoothed scroll. Per scene it writes `--p` (0..1 pinned progress), `--fade` (opacity envelope) and one `--<name>` (0..1) per named range, plus `data-on` on scenes near the viewport. Scenes animate with CSS `calc()` on these vars, not React re-renders. It also tracks the active scene for the rail and exposes `scrollToScene`.
- `lib/site.ts`: scene ids/labels (EN/ID) and download links. Copy lives in `lib/copy/<scene>.ts`; `LanguageProvider` stores the language in `localStorage` (`aksarakala_lang`).
- `SiteChrome`: fixed layer with the logo (hidden at the gate, returns to gate), EN/ID toggle, looping title music toggle (`/assets/audio/title.ogg`), a scene rail, and drifting embers.

## 2. Visual direction

Twilight indigo-to-amber, crisp pixel art, glowing cyan Aksara runes. Art is authored for a 480x272 stage; scenes size it with `--u: max(100vw/480, 100svh/272)`. Sprites come from the game, in `public/game/art`.

| Token | Hex | Use |
|---|---|---|
| `--bg-void` | `#0f0b1e` | page background |
| `--bg-indigo` | `#1b1433` | twilight surfaces |
| `--bg-plum` | `#3a214a` | elevated surfaces |
| `--twilight-rose` | `#7c3262` | gradient transitions |
| `--sunset-amber` | `#f49d5a` | warm glow |
| `--sunset-gold` | `#fce09b` | highlights |
| `--aksara-cyan` | `#5ef2ff` | runes, spell ink, focus |
| `--aksara-teal` | `#1ca3b8` | secondary rune glow |
| `--text-primary` | `#f8f4ec` | body/headings |
| `--text-muted` | `#b8afc8` | captions |
| `--border-pixel` | `#4d3a6b` | pixel borders |

### Typography

| Role | Font |
|---|---|
| Display | Jersey 10 / Jersey 15 (`public/fonts`) |
| Pixel labels | Tiny5 |
| Aksara glyphs | Noto Sans Sundanese, Noto Sans Javanese |
| Body/UI | Plus Jakarta Sans (`next/font/google`, `--font-sans`) |

### Pixel and motion rules
- All pixel art uses `image-rendering: pixelated` (`.pixelated` class, `.sprite` sheets stepped by CSS animation).
- Scroll engine skips smoothing when `prefers-reduced-motion: reduce`; sprite, twinkle and float animations are disabled in `globals.css`.

## 3. Scenes

1. **gate** (260): Title screen. Layered sky, far/near hills, constellation and drifting glyphs, the hero in a storm; title, one-line genre pitch and Download/See-the-game buttons.
2. **game** (220): What the game is. Genre kicker, headline, one-line premise, four feature cards (draw to cast, real-time combat, eight classes, seven regions with the pixel Java map `public/assets/pixel/java_map.png`) and a desktop controls strip.
3. **cast** (480): The core mechanic. Hero fights enemies; time slows, a glyph (Ka, then Ca) is drawn as one glowing stroke scrubbed by scroll, and releases a Bolt or Burst. Ends on a Download button. Discrete steps via `onProgress`.
4. **paths** (240): The eight classes line up as portraits with their in-game title and role, middle pair first.
5. **journey** (560): Side-scrolling road east through the regions. Parallax layers, props, critters and a sea section; the hero walks as scroll advances, with a region name and biome line per border. Data in `components/scenes/journey/data.ts`.
6. **bosses** (600): Procession of bosses (Sandekala, Bandung Bondowoso, Buto Ijo, the Nameless Hunter), each in its own biome with telegraph motifs, a name and one line of dread, plus a boss HUD frame.
7. **download** (170): Logo, closing line, Windows/macOS download buttons and releases/GitHub links, footer credit.

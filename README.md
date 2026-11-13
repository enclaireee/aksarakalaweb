# Aksara Kala — website

Scroll-driven marketing site for **Aksara Kala** (*The Script of Time*), a 2D pixel-art action RPG rooted in Sundanese and Javanese folklore. The page is nine pinned scenes, in English and Indonesian. Game repo: https://github.com/enclaireee/AksaraKala

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 (via `@tailwindcss/turbopack`) plus per-scene CSS Modules. No animation library: one rAF loop drives everything.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Env: `NEXT_PUBLIC_SITE_URL` is the public origin used for `metadataBase` (og image). Defaults to `http://localhost:3000`.

## Layout

- `app/` — layout (metadata, fonts), `page.tsx` (renders the scenes in order), `globals.css` (tokens, fonts, utilities)
- `components/scenes/` — one `<Name>Scene.tsx` + `name.module.css` per scene; `journey/` and `cast/` hold extra data/helpers
- `components/Scene.tsx` — pinned-scene wrapper; `SiteChrome.tsx` — fixed header, scene rail, embers
- `lib/scroll-engine.ts` — the scroll loop; `lib/site.ts` — scene ids/labels and links; `lib/copy/*.ts` — EN/ID text per scene
- `public/game/art` — pixel art from the game; `public/assets` — poster, title music, eclipse sprite; `public/fonts`

## Add or edit a scene

1. Create `components/scenes/FooScene.tsx` returning `<Scene id="foo" length={200} vars={{ ... }}>` and a `foo.module.css` that reads `--p`, `--fade` and the named vars.
2. Add `{ id: "foo", label: { en, id } }` to `SCENES` in `lib/site.ts` (order matters; the id must match).
3. Add copy in `lib/copy/foo.ts` (`{ en, id } satisfies Record<Lang, unknown>`) and read it with `useCopy`.
4. Render it in `app/page.tsx`.

Pixel art is authored for a 480x272 stage; size things in `--u` units.

See [DESIGN.md](./DESIGN.md) for the design notes.

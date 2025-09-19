# Septviber — Cozy September Notes (React + TS)

A cozy September‑vibe notes app with falling leaves, built for the Codédex September 2025 Vibe Coding Challenge.

- React + TypeScript + Vite
- Notes CRUD with localStorage persistence
- Search + Pinned filter
- Day/Night theme toggle
- 🍁 Falling leaves animation with reduced-motion support
- 🎵 AI‑generated background music created with Udio (https://www.udio.com/)

Live: https://jihadkhawaja.github.io/septviber/

Repo: https://github.com/jihadkhawaja/septviber

Timebox: The whole website vibe was coded with GitHub Copilot in VS Code within ~3 hours.

## Jam brief (TL;DR)

Build an interactive GUI app that feels like September, optionally using GitHub Copilot. Submit a video/GIF/screenshot, repo + live link, and write a few lines on how Copilot helped and what you learned.

Deadline: Sept 30, 11:59pm. Full details: https://www.codedex.io/community/monthly-challenge/29PdKh6HlO830ewYtEjD

## AI‑generated music credits

Two looping background tracks were generated with Udio and included in `public/music/`:

- `Falling Leaf Dreams.mp3`
- `Falling Leaves.mp3`

Thanks to Udio for making quick, thematic music generation possible. Learn more: https://www.udio.com/

## Local Dev

```pwsh
# Install deps
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173

## Build

```pwsh
npm run build
npm run preview
```

## Deploy to GitHub Pages

GitHub Pages serves your site at a repository subpath (e.g. `https://<user>.github.io/septviber/`). This project is configured accordingly:

- `vite.config.ts` sets `base: '/septviber/'`.
- Public assets (in `public/`) are referenced with `import.meta.env.BASE_URL` to avoid 404s.

Examples for asset URLs:

- Public asset (e.g. `public/images/pic.jpg`):
  - `const url = import.meta.env.BASE_URL + 'images/pic.jpg'`
- Bundled asset (place under `src/assets`):
  - `const url = new URL('../assets/pic.jpg', import.meta.url).href`

Deploy manually to the `gh-pages` branch:

```pwsh
npm run build
npm run deploy
```

Optional local preview with the Pages base:

```pwsh
npx vite preview --base=/septviber/ --port 5174
```
## How Copilot helped

- End‑to‑end scaffolding in a timebox (app shell, components, hooks)
- Suggesting prop typings, refactors, and accessibility hints
- Generating CSS keyframes, theme variables, and small UI flourishes
- Helped keep momentum to deliver the vibe in ~3 hours inside VS Code

## License

MIT

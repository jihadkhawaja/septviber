# SeptViber — Cozy September Notes (React + TS)

A cozy September‑vibe notes app with falling leaves, built for the Codédex September 2025 Vibe Coding Challenge.

- React + TypeScript + Vite
- Notes CRUD with localStorage persistence
- Search + Pinned filter
- Day/Night theme toggle
- 🍁 Falling leaves animation with reduced-motion support
- 🎵 AI‑generated background music created with Udio (https://www.udio.com/)

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

## Deploy (GitHub Pages)

This repo includes two options:

1) Manual deploy to gh-pages branch:

```pwsh
npm run deploy
```

2) GitHub Actions Pages deploy on push to main (recommended):
- Push to `main` and the workflow at `.github/workflows/deploy.yml` builds and publishes `dist/`.
- In your repo Settings > Pages, set Source to "GitHub Actions".

If your repo is `<user>/<repo>`, the site will be at `https://<user>.github.io/<repo>/`.

## How Copilot helped

- End‑to‑end scaffolding in a timebox (app shell, components, hooks)
- Suggesting prop typings, refactors, and accessibility hints
- Generating CSS keyframes, theme variables, and small UI flourishes
- Helped keep momentum to deliver the vibe in ~3 hours inside VS Code

## License

MIT

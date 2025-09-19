# SeptViber — Cozy September Notes (React + TS)

A cozy September-themed notes app with falling leaves, built for the Codédex "September 2025: Vibe Coding Challenge".

- React + TypeScript + Vite
- Notes CRUD with localStorage persistence
- Search + Pinned filter
- Day/Night theme toggle
- 🍁 Falling leaves animation with reduced-motion support

## Jam brief (TL;DR)

Build an interactive GUI app that feels like September, optionally using GitHub Copilot. Submit a video/GIF/screenshot, repo + live link, and write a few lines on how Copilot helped and what you learned.

Deadline: Sept 30, 11:59pm. Full details: https://www.codedex.io/community/monthly-challenge/29PdKh6HlO830ewYtEjD

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

- Scaffolding components quickly (Note card, editor, leaves animation)
- Suggesting prop typings and small refactors
- Generating CSS keyframes and theme variables

## License

MIT

# Repository Guidelines

## Project Structure & Module Organization
The project is a Vite-powered vanilla frontend with a minimal PWA setup:
- `index.html` — app shell and entry point.
- `src/` — JavaScript and styles (`src/main.js`, `src/style.css`).
- `public/` — static assets copied as-is (e.g., `public/manifest.webmanifest`, `public/icon.svg`, `public/sw.js`).
- `dist/` — build output (generated).

## Build, Test, and Development Commands
Use npm with Vite:
- `npm install` — install dependencies.
- `npm run dev` — start the local dev server.
- `npm run build` — build for production into `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run generate:ios-splash` — regenerate the full iOS splash screen set and touch icons (requires `rsvg-convert` and `magick`).

## Coding Style & Naming Conventions
Formatting is handled by Prettier (add it if missing in your environment).
- Use 2-space indentation in HTML/CSS/JS.
- Prefer `kebab-case` for filenames and `camelCase` for JS variables/functions.
- Keep functions small and state updates explicit.

## Testing Guidelines
No test framework is configured yet. If you add tests:
- Place them under `tests/` and mirror module names (e.g., `touch-tracker.test.js`).
- Document the runner and command here.
- Add tests for input handling, countdown timing, and selection logic.

## Commit & Pull Request Guidelines
No strict convention is enforced. Aim for short, imperative messages (e.g., `Add touch selection animation`).
PRs should include a brief description, test steps, and screenshots for UI changes.

## Agent-Specific Instructions
Keep `AGENTS.md` updated when commands, tooling, or structure change.

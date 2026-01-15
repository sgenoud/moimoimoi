# MoiMoiMoi

Vite-powered vanilla frontend with a minimal PWA setup.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run generate:ios-splash` — regenerate iOS splash screens and touch icons.

## iOS splash generation

The splash/icon generator relies on:

- `rsvg-convert` (librsvg)
- `magick` (ImageMagick)

Outputs land in `public/` and `public/splash/`.

#!/usr/bin/env sh
set -eu

# Generate high-res raster from SVG using librsvg.
rsvg-convert -w 1024 -h 1024 -b "#000000" public/icon.svg -o /tmp/icon-1024.png

# Apple touch icons (PNG).
magick /tmp/icon-1024.png -resize 180x180 public/apple-touch-icon.png
magick /tmp/icon-1024.png -resize 167x167 public/apple-touch-icon-167.png
magick /tmp/icon-1024.png -resize 152x152 public/apple-touch-icon-152.png
magick /tmp/icon-1024.png -resize 120x120 public/apple-touch-icon-120.png

# Splash logo used on iOS startup images.
magick /tmp/icon-1024.png -resize 512x512 /tmp/ios-splash-logo.png

# iOS splash screens (full set).
mkdir -p public/splash

gen() {
  size="$1"
  name="$2"
  magick /tmp/ios-splash-logo.png -background "#000000" -gravity center -extent "$size" "public/splash/$name"
}

# iPhone.
gen 1290x2796 ios-1290x2796.png
gen 2796x1290 ios-2796x1290.png
gen 1179x2556 ios-1179x2556.png
gen 2556x1179 ios-2556x1179.png
gen 1284x2778 ios-1284x2778.png
gen 2778x1284 ios-2778x1284.png
gen 1170x2532 ios-1170x2532.png
gen 2532x1170 ios-2532x1170.png
gen 1125x2436 ios-1125x2436.png
gen 2436x1125 ios-2436x1125.png
gen 1242x2688 ios-1242x2688.png
gen 2688x1242 ios-2688x1242.png
gen 828x1792 ios-828x1792.png
gen 1792x828 ios-1792x828.png
gen 1242x2208 ios-1242x2208.png
gen 2208x1242 ios-2208x1242.png
gen 750x1334 ios-750x1334.png
gen 1334x750 ios-1334x750.png
gen 640x1136 ios-640x1136.png
gen 1136x640 ios-1136x640.png

# iPad.
gen 2048x2732 ios-2048x2732.png
gen 2732x2048 ios-2732x2048.png
gen 1668x2388 ios-1668x2388.png
gen 2388x1668 ios-2388x1668.png
gen 1640x2360 ios-1640x2360.png
gen 2360x1640 ios-2360x1640.png
gen 1536x2048 ios-1536x2048.png
gen 2048x1536 ios-2048x1536.png

printf '%s\n' "Generated iOS splash + icon PNGs."

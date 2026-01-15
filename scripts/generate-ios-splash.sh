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

# iOS splash screens (portrait).
magick /tmp/ios-splash-logo.png -background "#000000" -gravity center -extent 2048x2732 public/splash/ios-splash.png
magick /tmp/ios-splash-logo.png -background "#000000" -gravity center -extent 1179x2556 public/splash/ios-iphone-15-pro.png
magick /tmp/ios-splash-logo.png -background "#000000" -gravity center -extent 1640x2360 public/splash/ios-ipad-air-11.png
magick /tmp/ios-splash-logo.png -background "#000000" -gravity center -extent 2048x2732 public/splash/ios-ipad-air-13.png

printf '%s\n' "Generated iOS splash + icon PNGs."

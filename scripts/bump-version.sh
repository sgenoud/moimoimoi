#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  printf '%s\n' "Usage: $0 <version>" >&2
  exit 1
fi

version="$1"

perl -pi -e "s/^const APP_VERSION = \".*\";/const APP_VERSION = \"$version\";/" src/main.js
perl -pi -e "s/^const CACHE_NAME = \"moimoimoi-runtime-v.*\";/const CACHE_NAME = \"moimoimoi-runtime-v$version\";/" public/sw.js

printf '%s\n' "Bumped APP_VERSION and CACHE_NAME to $version."

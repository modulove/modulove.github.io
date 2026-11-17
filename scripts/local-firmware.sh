#!/usr/bin/env bash
# Local preview with unreleased firmware.
#
# The live site serves firmware at /releases/<Name>.<board>[.reversed].hex: the deploy workflow
# copies the git-tracked releases/ folder (latest GitHub release assets) into public/releases/.
# `hugo server` does not serve releases/, so locally the flash buttons have nothing to load.
# This script copies .hex files into static/releases/ (git-ignored, never deployed), where
# `hugo server` serves them under the same URLs.
#
# Usage (Git Bash on Windows, or any bash):
#   scripts/local-firmware.sh                copy the released firmware from releases/
#   scripts/local-firmware.sh HEX_DIR        ... plus local builds from HEX_DIR on top
#   scripts/local-firmware.sh --clean        remove static/releases/ again
#
# HEX_DIR may contain:
#   <Name>.hex / <Name>.reversed.hex  (A-RYTH-MATIK PR/CI build outputs, e.g. ARYTHMATIK_DEBUG.hex)
#       -> <Name>.nano.hex + <Name>.nanoOldBootloader.hex (+ .reversed variants).
#       One build serves both buttons: the code is identical, only the upload speed differs.
#   <Name>.<board>[.reversed].hex  (already named like release assets, board = nano,
#       nanoOldBootloader or lgt8f328p) -> copied unchanged.
set -euo pipefail

cd "$(dirname "$0")/.."
DEST=static/releases

if [ "${1:-}" = "--clean" ]; then
  rm -rf "$DEST"
  echo "Removed $DEST"
  exit 0
fi

mkdir -p "$DEST"
cp releases/*.hex releases/*.uf2 "$DEST"/ 2>/dev/null || true
echo "Copied $(ls releases | wc -l | tr -d ' ') released files from releases/ to $DEST/"

if [ $# -ge 1 ]; then
  SRC=$1
  if [ ! -d "$SRC" ]; then
    echo "Not a folder: $SRC" >&2
    exit 1
  fi
  echo "Local builds from $SRC:"
  for f in "$SRC"/*.hex; do
    [ -e "$f" ] || continue
    base=$(basename "$f" .hex)
    case "$base" in
      *.nano | *.nanoOldBootloader | *.lgt8f328p | *.nano.reversed | *.nanoOldBootloader.reversed | *.lgt8f328p.reversed)
        cp "$f" "$DEST/$base.hex"
        echo "  $base.hex"
        ;;
      *.reversed)
        name=${base%.reversed}
        for board in nano nanoOldBootloader; do
          cp "$f" "$DEST/$name.$board.reversed.hex"
          echo "  $name.$board.reversed.hex  <-  $(basename "$f")"
        done
        ;;
      *)
        for board in nano nanoOldBootloader; do
          cp "$f" "$DEST/$base.$board.hex"
          echo "  $base.$board.hex  <-  $(basename "$f")"
        done
        ;;
    esac
  done
fi

echo
echo "Now run: hugo server   (then open http://localhost:1313/)"
echo "Undo with: scripts/local-firmware.sh --clean"

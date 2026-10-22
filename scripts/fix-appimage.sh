#!/usr/bin/env bash
set -euo pipefail

# Post-build script to fix AppImage by removing bundled Wayland/display libraries
# These libraries conflict with host Mesa drivers on modern Linux distros (Fedora, Arch, etc.)
# causing WebKitWebProcess to crash with EGL_BAD_PARAMETER

APPIMAGE="${1:?Usage: $0 <path-to-AppImage>}"
APPIMAGE_DIR=$(cd "$(dirname "$APPIMAGE")" && pwd)
APPIMAGE="${APPIMAGE_DIR}/$(basename "$APPIMAGE")"
APPIMAGE_BASE=$(basename "$APPIMAGE" .AppImage)

echo "Fixing AppImage: $APPIMAGE"

# Extract the AppImage to the same directory
chmod +x "$APPIMAGE"
cd "$APPIMAGE_DIR"
"$APPIMAGE" --appimage-extract > /dev/null 2>&1

# The AppImage runtime extracts to squashfs-root in the current directory.
APPDIR="${APPIMAGE_DIR}/squashfs-root"

if [ ! -d "$APPDIR" ]; then
  echo "ERROR: Could not find .AppDir after extraction"
  exit 1
fi

echo "Removing bundled Wayland/display libraries..."

# Libraries that must NOT be bundled - they should come from the host system
EXCLUDED_LIBS=(
  libwayland-client.so.0
  libwayland-cursor.so.0
  libwayland-egl.so.1
  libwayland-server.so.0
  libxkbcommon.so.0
  libxcb.so.1
  libxcb-render.so.0
  libxcb-shm.so.0
  libxcb-randr.so.0
  libXau.so.6
  libXdmcp.so.6
)

for lib in "${EXCLUDED_LIBS[@]}"; do
  FOUND=$(find "$APPDIR/usr/lib/" -name "$lib" 2>/dev/null || true)
  if [ -n "$FOUND" ]; then
    echo "  Removing: $lib"
    echo "$FOUND" | while read -r file; do
      rm -f "$file"
    done
  fi
done

# Clean up empty directories
find "$APPDIR/usr/lib/" -type d -empty -delete 2>/dev/null || true

# Repack the AppImage using the same pinned linuxdeploy version as Tauri.
TAURI_CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/tauri"
LINUXDEPLOY="${TAURI_CACHE_DIR}/linuxdeploy-07333c6-x86_64.AppImage"
if [ ! -f "$LINUXDEPLOY" ]; then
  mkdir -p "$TAURI_CACHE_DIR"
  echo "Downloading linuxdeploy to $LINUXDEPLOY"
  curl --fail --location --retry 3 --output "$LINUXDEPLOY" \
    https://github.com/tauri-apps/binary-releases/releases/download/linuxdeploy-07333c6/linuxdeploy-x86_64.AppImage
fi

chmod +x "$LINUXDEPLOY"
REPACKED_APPIMAGE="${APPIMAGE_DIR}/${APPIMAGE_BASE}.fixed.AppImage"
rm -f "$REPACKED_APPIMAGE"
OUTPUT="$REPACKED_APPIMAGE" "$LINUXDEPLOY" --appimage-extract-and-run --appdir "$APPDIR" --output appimage

if [ ! -f "$REPACKED_APPIMAGE" ]; then
  echo "ERROR: Could not find repacked AppImage"
  exit 1
fi

mv -f "$REPACKED_APPIMAGE" "$APPIMAGE"

# Clean up .AppDir
rm -rf "$APPDIR" "$APPIMAGE_DIR/squashfs-root"

echo "AppImage fixed successfully"

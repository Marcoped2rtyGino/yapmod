#!/usr/bin/env bash
set -euo pipefail

# Post-build script to fix AppImage by removing bundled Wayland/display libraries
# These libraries conflict with host Mesa drivers on modern Linux distros (Fedora, Arch, etc.)
# causing WebKitWebProcess to crash with EGL_BAD_PARAMETER

APPIMAGE="${1:?Usage: $0 <path-to-AppImage>}"
APPIMAGE_DIR=$(dirname "$APPIMAGE")
APPIMAGE_BASE=$(basename "$APPIMAGE" .AppImage)

echo "Fixing AppImage: $APPIMAGE"

# Extract the AppImage to the same directory
chmod +x "$APPIMAGE"
cd "$APPIMAGE_DIR"
"$APPIMAGE" --appimage-extract > /dev/null 2>&1

# The .AppDir is created in the same directory as the AppImage
APPDIR="${APPIMAGE_DIR}/${APPIMAGE_BASE}.AppDir"

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

# Repack the AppImage using linuxdeploy from Tauri's cache
LINUXDEPLOY="$HOME/.cache/tauri/linuxdeploy-x86_64.AppImage"
if [ ! -f "$LINUXDEPLOY" ]; then
  echo "ERROR: linuxdeploy not found at $LINUXDEPLOY"
  exit 1
fi

chmod +x "$LINUXDEPLOY"
"$LINUXDEPLOY" --appimage-extract-and-run --appdir "$APPDIR" --output appimage

# The repacked AppImage should be in the same directory
NEW_APPIMAGE="${APPIMAGE_DIR}/${APPIMAGE_BASE}*amd64.AppImage"
if ls $NEW_APPIMAGE 1> /dev/null 2>&1; then
  # Remove old AppImage and rename the new one
  rm -f "$APPIMAGE"
  mv $(ls $NEW_APPIMAGE | head -1) "$APPIMAGE"
else
  echo "ERROR: Could not find repacked AppImage"
  exit 1
fi

# Clean up .AppDir
rm -rf "$APPDIR"

echo "AppImage fixed successfully"

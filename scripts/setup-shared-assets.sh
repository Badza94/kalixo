#!/bin/bash
# Setup script to copy shared assets in Next.js apps
# Uses copies instead of symlinks for Vercel compatibility

APP_DIR="$1"
MODE="${2:-copy}" # Default to copy mode, can be "link" for local dev

if [ -z "$APP_DIR" ]; then
  echo "Usage: $0 <app-directory> [mode]"
  echo "Example: $0 apps/my-new-app copy"
  echo "Modes: copy (default, for production) | link (for local dev)"
  exit 1
fi

if [ ! -d "$APP_DIR" ]; then
  echo "Error: Directory $APP_DIR does not exist"
  exit 1
fi

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$PROJECT_ROOT/packages/public"
TARGET_DIR="$PROJECT_ROOT/$APP_DIR/public/shared"

# Create shared assets directory
mkdir -p "$TARGET_DIR"

# Remove existing files/symlinks
rm -rf "$TARGET_DIR"/*

if [ "$MODE" = "link" ]; then
  # Create symlinks (for local development)
  cd "$TARGET_DIR"
  RELATIVE_PATH="../../../packages/public"
  
  for file in $(ls $RELATIVE_PATH 2>/dev/null); do
    ln -sf "$RELATIVE_PATH/$file" "$file"
    echo "Linked: $file"
  done
  
  echo "✅ Shared assets linked for $APP_DIR (local dev mode)"
else
  # Copy files (for production/Vercel)
  if [ -d "$SOURCE_DIR" ]; then
    cp -R "$SOURCE_DIR"/* "$TARGET_DIR/" 2>/dev/null || true
    echo "Copied assets:"
    ls -la "$TARGET_DIR"
  fi
  
  echo "✅ Shared assets copied to $APP_DIR (production mode)"
fi

echo "Assets are available at /shared/* in your app"

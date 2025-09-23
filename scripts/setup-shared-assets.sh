#!/bin/bash
# Setup script to link shared assets in Next.js apps

APP_DIR="$1"

if [ -z "$APP_DIR" ]; then
  echo "Usage: $0 <app-directory>"
  echo "Example: $0 apps/my-new-app"
  exit 1
fi

if [ ! -d "$APP_DIR" ]; then
  echo "Error: Directory $APP_DIR does not exist"
  exit 1
fi

# Create shared assets directory
mkdir -p "$APP_DIR/public/shared"

# Link all assets from packages/public to the app's public/shared directory
cd "$APP_DIR/public/shared"

# Calculate relative path to packages/public
RELATIVE_PATH="../../../packages/public"

# Create symlinks for all files in packages/public
for file in $(ls $RELATIVE_PATH 2>/dev/null); do
  ln -sf "$RELATIVE_PATH/$file" "$file"
  echo "Linked: $file"
done

# Also create a symlink to the entire directory for automatic updates
ln -sf "$RELATIVE_PATH" "all-assets" 2>/dev/null || true

echo "✅ Shared assets setup complete for $APP_DIR"
echo "Assets are available at /shared/* in your app"

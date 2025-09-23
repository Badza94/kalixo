/**
 * Shared asset utilities for the monorepo
 * This provides consistent access to shared assets across all apps
 */

// Base path for shared assets (relative to the consuming app's public folder)
const SHARED_ASSETS_BASE = "/shared";

/**
 * Get the URL for a shared asset
 * @param assetPath - Path to the asset relative to packages/public/
 * @returns Full URL path to the asset
 */
export function getSharedAsset(assetPath: string): string {
  return `${SHARED_ASSETS_BASE}/${assetPath}`;
}

/**
 * Common shared assets
 */
export const SharedAssets = {
  placeholder: getSharedAsset("placeholder.svg"),
  phone: getSharedAsset("phone.png"),
} as const;

/**
 * Hero-specific assets
 */
export const HeroAssets = {
  defaultImage: SharedAssets.placeholder,
  phoneMockup: getSharedAsset("phone.png"),
} as const;

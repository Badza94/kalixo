/**
 * Color conversion utilities for converting between different color formats
 * Focuses on converting to OKLCH format for theme storage
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

/**
 * Convert RGB to linear RGB (remove gamma correction)
 */
function rgbToLinear(val: number): number {
  return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to XYZ
 */
function linearRgbToXyz(r: number, g: number, b: number) {
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
  return { x, y, z };
}

/**
 * Convert XYZ to OKLAB
 */
function xyzToOklab(x: number, y: number, z: number) {
  const l = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

/**
 * Convert OKLAB to OKLCH
 */
function oklabToOklch(L: number, a: number, b: number) {
  const C = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return { L, C, h };
}

/**
 * Convert hex color to OKLCH format
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "oklch(0 0 0)";

  // Convert to linear RGB
  const lr = rgbToLinear(rgb.r);
  const lg = rgbToLinear(rgb.g);
  const lb = rgbToLinear(rgb.b);

  // Convert to XYZ
  const xyz = linearRgbToXyz(lr, lg, lb);

  // Convert to OKLAB
  const oklab = xyzToOklab(xyz.x, xyz.y, xyz.z);

  // Convert to OKLCH
  const oklch = oklabToOklch(oklab.L, oklab.a, oklab.b);

  // Format as OKLCH string
  return `oklch(${oklch.L.toFixed(2)} ${oklch.C.toFixed(2)} ${oklch.h.toFixed(2)})`;
}

/**
 * Parse OKLCH string to get components
 */
export function parseOklch(
  oklchString: string
): { L: number; C: number; h: number } | null {
  const match = oklchString.match(
    /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/
  );
  if (!match) return null;

  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
}

/**
 * Convert OKLCH to hex (approximate, for color picker display)
 */
export function oklchToHex(oklchString: string): string {
  const oklch = parseOklch(oklchString);
  if (!oklch) return "#000000";

  // Convert OKLCH to OKLAB
  const h = (oklch.h * Math.PI) / 180;
  const a = oklch.C * Math.cos(h);
  const b = oklch.C * Math.sin(h);

  // Convert OKLAB to XYZ
  const l_ = oklch.L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = oklch.L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = oklch.L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const x = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const y = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const z = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Convert XYZ to linear RGB
  let r = +3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  let g = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
  let b_ = +0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b_ = b_ > 0.0031308 ? 1.055 * Math.pow(b_, 1 / 2.4) - 0.055 : 12.92 * b_;

  // Clamp and convert to 0-255 range
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b_ = Math.max(0, Math.min(1, b_));

  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
}

/**
 * Validate if a string is a valid OKLCH color
 */
export function isValidOklch(str: string): boolean {
  return /^oklch\(\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s*\)$/.test(str);
}

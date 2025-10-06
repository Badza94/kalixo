/**
 * Apply theme CSS variables to a document
 * Used for both canvas (iframe) and preview mode
 */

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

export function applyThemeToDocument(
  doc: Document,
  themeConfig: ThemeConfig | null
) {
  if (!themeConfig || !doc.documentElement) return;

  const root = doc.documentElement;

  // Apply light mode colors as CSS variables
  Object.entries(themeConfig.light).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply dark mode colors as CSS variables (with data-theme="dark" selector)
  const darkVars = Object.entries(themeConfig.dark)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  // Apply fonts
  Object.entries(themeConfig.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply radius
  root.style.setProperty("--radius", themeConfig.radius);

  // Apply shadows
  Object.entries(themeConfig.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply spacing
  Object.entries(themeConfig.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Inject dark mode styles if they don't exist
  const existingStyle = doc.getElementById("theme-dark-mode");
  if (!existingStyle && darkVars) {
    const style = doc.createElement("style");
    style.id = "theme-dark-mode";
    style.textContent = `
      [data-theme="dark"] {
        ${darkVars}
      }
      
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          ${darkVars}
        }
      }
    `;
    doc.head.appendChild(style);
  }
}

export function generateThemeStyleTag(themeConfig: ThemeConfig | null): string {
  if (!themeConfig) return "";

  const lightVars = Object.entries(themeConfig.light)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  const darkVars = Object.entries(themeConfig.dark)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  const fontVars = Object.entries(themeConfig.fonts)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  const shadowVars = Object.entries(themeConfig.shadows)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  const spacingVars = Object.entries(themeConfig.spacing)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  return `
    <style id="theme-variables">
      :root {
        ${lightVars}
        ${fontVars}
        --radius: ${themeConfig.radius};
        ${shadowVars}
        ${spacingVars}
      }
      
      [data-theme="dark"] {
        ${darkVars}
      }
      
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          ${darkVars}
        }
      }
    </style>
  `;
}

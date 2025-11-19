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

  // Don't set variables as inline styles - let the CSS style tag handle it
  // This allows automatic switching when [data-theme] changes

  // Inject or update theme styles for dynamic switching
  const darkVars = Object.entries(themeConfig.dark)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ");

  const lightVars = Object.entries(themeConfig.light)
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

  const existingStyle = doc.getElementById("theme-mode-switcher");
  const styleContent = `
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
    
    [data-theme="light"] {
      ${lightVars}
    }
    
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        ${darkVars}
      }
    }
  `;

  if (existingStyle) {
    // Update existing style
    existingStyle.textContent = styleContent;
  } else {
    // Create new style
    const style = doc.createElement("style");
    style.id = "theme-mode-switcher";
    style.textContent = styleContent;
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

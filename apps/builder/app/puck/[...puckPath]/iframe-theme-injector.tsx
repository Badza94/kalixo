"use client";

import { useEffect } from "react";
import { applyThemeToDocument } from "../../../lib/apply-theme";

interface IframeThemeInjectorProps {
  children: React.ReactNode;
  document?: Document;
  themeConfig: any;
}

export function IframeThemeInjector({
  children,
  document: iframeDocument,
  themeConfig,
}: IframeThemeInjectorProps) {
  // Apply theme whenever the iframe document or theme config changes
  useEffect(() => {
    if (iframeDocument && themeConfig) {
      applyThemeToDocument(iframeDocument, themeConfig);
    }
  }, [iframeDocument, themeConfig]);

  return <>{children}</>;
}

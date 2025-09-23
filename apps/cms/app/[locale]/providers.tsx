"use client";

import React, { type JSX } from "react";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { isUnprotectedRoute } from "@/hooks/is-unprotected-route";
import DashboardSidebar from "@/components/dashboard-sidebar";
import PageContainer from "@/components/page-container";
import DashboardHeader from "@/components/header";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();

  const isUnprotected = isUnprotectedRoute(pathname);
  return (
    <>
      <TooltipProvider delayDuration={100}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            {isUnprotected ? (
              <>{children}</>
            ) : (
              <SidebarProvider>
                <DashboardSidebar />
                <SidebarInset>
                  <DashboardHeader />
                  <PageContainer scrollable>{children}</PageContainer>
                </SidebarInset>
              </SidebarProvider>
            )}
          </ThemeProvider>
        </SessionProvider>
      </TooltipProvider>
    </>
  );
}

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

export default function Providers({
  session,
  children,
}: {
  // session: SessionProviderProps["session"];
  session: any;
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();

  const renderSidebar = isUnprotectedRoute(pathname);
  console.log("renderSidebar", renderSidebar);
  return (
    <>
      <TooltipProvider delayDuration={100}>
        {/* <SessionProvider session={session}> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {renderSidebar ? (
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
        {/* </SessionProvider> */}
      </TooltipProvider>
    </>
  );
}

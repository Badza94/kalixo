import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { useTheme } from "next-themes";
import Image from "next/image";
import { NavMain } from "./nav-main";
import { navItems } from "@/data/navItems";
import { useEffect, useState } from "react";

function DashboardSidebar() {
  const { state } = useSidebar();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("mounted1: ", mounted);
  if (!mounted) {
    return null; // or a placeholder
  }

  console.log("mounted2: ", mounted);

  return (
    <Sidebar collapsible="icon" suppressHydrationWarning>
      <SidebarHeader>
        {state === "expanded" ? (
          <Image
            src={theme === "dark" ? "/logo-big.svg" : "/logo-big-dark.svg"}
            alt="Logo"
            width={144}
            height={30}
            className="mx-auto w-[144px] h-[30px] my-2"
          />
        ) : (
          <Image
            src={theme === "dark" ? "/logo.svg" : "/logo-dark.svg"}
            alt="Logo"
            width={30}
            height={30}
            className="mx-auto w-[30px] h-[30px] my-2"
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarTrigger className="w-full" iconClassName="h-8 w-8 !size-5" />
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;

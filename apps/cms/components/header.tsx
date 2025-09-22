// import { User } from "next-auth";
import { Separator } from "@workspace/ui/components/separator";
import { NavUser } from "./nav-user-admin";
// import { useSession } from "next-auth/react";
import NavUserNotifications from "./nav-user-notifications";
import NavUserCart from "./nav-user-cart";
import NavUserFavorite from "./nav-user-favorite";
import { ButtonThemeSwitch } from "./button-theme-switch";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export default function DashboardHeader() {
  const session: any = undefined;
  // const { data: session } = useSession();

  return (
    <>
      <div className="bg-sidebar flex h-16 shrink-0 items-end justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="md:hidden px-4">
          <SidebarTrigger iconClassName="h-8 w-8 !size-5" />
        </div>

        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex items-center gap-4 px-4">
          <ButtonThemeSwitch />
          <NavUserFavorite />
          <NavUserCart />
          <NavUserNotifications />
          <NavUser user={session?.user as any} />
        </div>
      </div>
      <Separator
        orientation="horizontal"
        className="h-[1px] bg-sidebar-border"
      />
    </>
  );
}

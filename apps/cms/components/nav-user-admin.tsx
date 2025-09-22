"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import {
  Activity,
  Bell,
  ChevronsUpDown,
  FileCheck,
  LogOut,
  Settings,
  UserIcon,
} from "@workspace/ui/lucide-react";
// import { User } from "next-auth";
// import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSelect from "./language-select";

export function NavUser({ user }: { user: any }) {
  const t = useTranslations("UserNav");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="relative">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user?.image as string}
                  alt={user?.name as string}
                />
                <AvatarFallback className="rounded-full">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={user?.image as string}
                    alt={user?.name as string}
                  />
                  <AvatarFallback className="rounded-full">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                {t("viewProfile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {t("notifications")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity />
                {t("accountActivity")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                {t("securitySettings")}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <FileCheck />
                {t("verification")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup className="py-1.5 px-2">
              <LanguageSelect />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              // onClick={() =>
              //   signOut({
              //     callbackUrl: "/login",
              //   })
              // }
              className="text-destructive hover:text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2 text-destructive" />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

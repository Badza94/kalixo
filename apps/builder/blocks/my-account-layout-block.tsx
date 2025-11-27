"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import {
  User,
  Settings,
  History,
  Wallet,
  LogOut,
  Menu,
} from "@workspace/ui/lucide-react";
import { ProfileSection } from "@/components/my-account/profile-section";
import { PreferencesSection } from "@/components/my-account/preferences-section";
import { OrdersSection } from "@/components/my-account/orders-section";
import { WalletSection } from "@/components/my-account/wallet-section";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export interface MyAccountLayoutBlockProps {
  defaultSection?: "info" | "preferences" | "orders" | "wallet";
}

export function MyAccountLayoutBlock({
  defaultSection = "info",
}: MyAccountLayoutBlockProps) {
  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering Sheet after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "info", label: "Information", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "orders", label: "Order History", icon: History },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  const NavContent = () => (
    <div className="flex flex-col py-6 h-full">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal details.
        </p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium",
              activeSection === item.id && "bg-secondary"
            )}
            onClick={() => {
              setActiveSection(item.id);
              setIsMobileMenuOpen(false);
            }}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="gap-3 justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Fixed at top on mobile only */}
      <header className="flex sticky top-0 z-50 justify-between items-center p-4 border-b backdrop-blur bg-background/95 lg:hidden">
        <h1 className="text-lg font-semibold">My Account</h1>
        {mounted ? (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <NavContent />
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        )}
      </header>

      {/* Main Layout Container */}
      <div className="flex mx-auto max-w-7xl">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:border-r lg:bg-card/50 lg:backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <ScrollArea className="h-[calc(100vh-65px)] lg:h-screen">
            <div className="p-6 lg:p-12">
              <div className="mx-auto space-y-8 max-w-3xl duration-500 animate-in fade-in slide-in-from-bottom-4">
                {activeSection === "info" && <ProfileSection />}
                {activeSection === "preferences" && <PreferencesSection />}
                {activeSection === "orders" && <OrdersSection />}
                {activeSection === "wallet" && <WalletSection />}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

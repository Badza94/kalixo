"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Search,
  User,
  Heart,
} from "@workspace/ui/lucide-react";
import { SharedAssets } from "@workspace/ui/assets";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import {
  SearchAction,
  WishlistAction,
  AccountAction,
  CartAction,
} from "../components/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { SearchDialog } from "../components/search-dialog";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationBlockProps {
  type: "header" | "sidebar" | "mega-menu" | "search-first" | "mobile";
  logo: string;
  items: NavigationItem[];
  showSearch: boolean;
  showCart: boolean;
  showWishlist: boolean;
  showAccount: boolean;
  position?: "fixed" | "relative" | "sticky";
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl";
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  textColor?: {
    colorKey: string;
    customColor?: string;
  };
}

export function NavigationBlock({
  type,
  logo,
  items,
  showSearch,
  showCart,
  showWishlist,
  showAccount,
  position = "sticky",
  fontSize = "sm",
  backgroundColor,
  textColor,
}: NavigationBlockProps) {
  console.log("type: ", type);
  const { themeConfig } = useThemeConfig();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // Check if glass effect is requested
  const isGlass = backgroundColor?.colorKey === "glass";

  // Resolve colors
  const resolvedBackgroundColor =
    backgroundColor && !isGlass
      ? resolveColor(
          backgroundColor.colorKey,
          backgroundColor.customColor,
          themeConfig || undefined,
          "light"
        )
      : undefined;

  const resolvedTextColor = textColor
    ? resolveColor(
        textColor.colorKey,
        textColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isImageUrl = (str: string): boolean => {
    if (!str || typeof str !== "string") return false;

    // Check if it's a data URL
    if (str.startsWith("data:image")) return true;

    // Check if it's an absolute URL (http/https)
    if (str.startsWith("http://") || str.startsWith("https://")) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    }

    // Check if it looks like a path (starts with /)
    if (str.startsWith("/")) return true;

    return false;
  };

  const renderLogo = () => {
    // Always render an image - use placeholder if logo is not a valid image URL
    const imageSrc = logo && isImageUrl(logo) ? logo : SharedAssets.placeholder;

    return (
      <div className="relative h-8 w-[120px] flex items-center">
        <Image
          src={imageSrc}
          alt="Logo"
          fill
          className="object-contain object-left"
          sizes="120px"
        />
      </div>
    );
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    if (item.children && item.children.length > 0) {
      if (isMobile) {
        return (
          <Collapsible
            key={item.id}
            open={expandedItems.has(item.id)}
            onOpenChange={() => toggleExpanded(item.id)}
          >
            <CollapsibleTrigger
              className="flex justify-between items-center p-3 w-full text-left rounded-md transition-colors hover:bg-accent"
              style={navItemStyle}
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  expandedItems.has(item.id) ? "rotate-90" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-4 space-y-1">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={child.href}
                  className="block p-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
                  style={navItemStyle}
                >
                  {child.label}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      } else if (type === "mega-menu") {
        return (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuTrigger
              className={`flex gap-1 items-center font-medium ${sizeClass}`}
              style={navItemStyle}
            >
              {item.label}
              <ChevronDown className="w-4 h-4" />
            </NavigationMenuTrigger>
            <NavigationMenuContent
              className={`${isGlass ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : resolvedBackgroundColor ? "[&]:!bg-transparent group-data-[viewport=false]/navigation-menu:!bg-transparent" : ""}`}
              style={{
                ...(resolvedBackgroundColor &&
                  !isGlass && {
                    backgroundColor: resolvedBackgroundColor,
                  }),
                ...(resolvedTextColor && { color: resolvedTextColor }),
              }}
            >
              <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                {item.children.map((child) => (
                  <div key={child.id} className="space-y-3">
                    <h4 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                      {child.label}
                    </h4>
                    <div className="space-y-2">
                      {child.children?.map((grandChild) => (
                        <NavigationMenuLink
                          key={grandChild.id}
                          className={`block p-2 rounded-md transition-colors ${sizeClass} hover:bg-accent`}
                          style={navItemStyle}
                        >
                          {grandChild.label}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      } else {
        const isOpen = openDropdowns.has(item.id);

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => {
              setOpenDropdowns(new Set([...openDropdowns, item.id]));
            }}
            onMouseLeave={() => {
              const newOpen = new Set(openDropdowns);
              newOpen.delete(item.id);
              setOpenDropdowns(newOpen);
            }}
          >
            <DropdownMenu
              modal={false}
              open={isOpen}
              onOpenChange={(open) => {
                if (open) {
                  setOpenDropdowns(new Set([...openDropdowns, item.id]));
                } else {
                  const newOpen = new Set(openDropdowns);
                  newOpen.delete(item.id);
                  setOpenDropdowns(newOpen);
                }
              }}
            >
              <DropdownMenuTrigger
                className={`flex gap-1 items-center font-medium border-none transition-colors ${sizeClass} hover:text-muted-foreground`}
                style={navItemStyle}
              >
                {item.label}
                <ChevronDown className="w-4 h-4 transition-transform" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={
                  isGlass
                    ? "backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60"
                    : ""
                }
                style={{
                  ...(resolvedBackgroundColor &&
                    !isGlass && {
                      backgroundColor: resolvedBackgroundColor,
                      borderColor: resolvedBackgroundColor,
                    }),
                  ...(resolvedTextColor && { color: resolvedTextColor }),
                }}
                onMouseEnter={() => {
                  setOpenDropdowns(new Set([...openDropdowns, item.id]));
                }}
                onMouseLeave={() => {
                  const newOpen = new Set(openDropdowns);
                  newOpen.delete(item.id);
                  setOpenDropdowns(newOpen);
                }}
              >
                {item.children.map((child) => (
                  <DropdownMenuItem key={child.id} style={navItemStyle}>
                    <a href={child.href}>{child.label}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    } else {
      if (isMobile) {
        return (
          <a
            key={item.id}
            href={item.href}
            className={`block p-3 font-medium rounded-md transition-colors ${sizeClass} hover:bg-accent`}
            style={navItemStyle}
          >
            {item.label}
          </a>
        );
      } else if (type === "mega-menu") {
        return (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              className={`px-4 py-2 font-medium transition-colors ${sizeClass} hover:text-muted-foreground`}
              href={item.href}
              style={navItemStyle}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      } else {
        return (
          <a
            key={item.id}
            href={item.href}
            className={`font-medium transition-colors ${sizeClass} hover:text-muted-foreground`}
            style={navItemStyle}
          >
            {item.label}
          </a>
        );
      }
    }
  };

  const renderActions = () => (
    <div className="flex items-center space-x-4">
      {showSearch && (
        <SearchAction
          onClick={() => setIsSearchDialogOpen(true)}
          textColor={resolvedTextColor}
          backgroundColor={resolvedBackgroundColor}
        />
      )}

      {showWishlist && (
        <WishlistAction
          textColor={resolvedTextColor}
          backgroundColor={resolvedBackgroundColor}
        />
      )}

      {showAccount && (
        <AccountAction
          textColor={resolvedTextColor}
          backgroundColor={resolvedBackgroundColor}
        />
      )}

      {showCart && (
        <CartAction
          textColor={resolvedTextColor}
          backgroundColor={resolvedBackgroundColor}
        />
      )}
    </div>
  );

  const positionClass =
    position === "fixed"
      ? "fixed"
      : position === "sticky"
        ? "sticky"
        : "relative";

  // Build header style
  // If glass, don't apply inline backgroundColor (classes handle it)
  const headerStyle: React.CSSProperties = {
    ...(resolvedBackgroundColor &&
      !isGlass && {
        backgroundColor: resolvedBackgroundColor,
      }),
    ...(resolvedTextColor && { color: resolvedTextColor }),
  };

  // Glass effect classes
  const glassClasses = isGlass
    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    : "";

  // Build navigation item style
  const navItemStyle: React.CSSProperties = {
    ...(resolvedTextColor && { color: resolvedTextColor }),
  };

  const sizeClass =
    fontSize === "xs"
      ? "text-xs"
      : fontSize === "sm"
        ? "text-sm"
        : fontSize === "md"
          ? "text-base"
          : fontSize === "lg"
            ? "text-lg"
            : "text-xl";

  if (type === "sidebar") {
    return (
      <>
        <header
          className={`top-0 z-50 w-full border-b ${positionClass} ${glassClasses} border-border`}
          style={headerStyle}
        >
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <div className="flex flex-col h-full">
                      <div className="p-6 border-b border-border">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-medium">Menu</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {showSearch && (
                        <div className="p-6 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search products..."
                              className="pl-10"
                            />
                          </div>
                        </div>
                      )}

                      <nav className="flex-1 p-6 space-y-2">
                        {items.map((item) => renderNavigationItem(item, true))}
                      </nav>

                      <div className="p-6 space-y-4 border-t border-border">
                        <div className="flex items-center space-x-4">
                          {showAccount && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                            >
                              <User className="mr-2 w-4 h-4" />
                              Account
                            </Button>
                          )}
                          {showWishlist && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                            >
                              <Heart className="mr-2 w-4 h-4" />
                              Wishlist
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {renderLogo()}
              </div>

              {renderActions()}
            </div>
          </div>
        </header>
        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
        />
      </>
    );
  }

  if (type === "mobile") {
    return (
      <>
        <header
          className={`top-0 z-50 w-full border-b ${positionClass} ${glassClasses} border-border`}
          style={headerStyle}
        >
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                {renderLogo()}
              </div>

              {renderActions()}
            </div>
          </div>

          {mobileOpen && (
            <div
              className="fixed inset-0 z-50"
              style={{
                ...(resolvedBackgroundColor && {
                  backgroundColor: resolvedBackgroundColor,
                }),
              }}
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                  {items.map((item) => renderNavigationItem(item, true))}
                </nav>
              </div>
            </div>
          )}
        </header>
        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
        />
      </>
    );
  }

  if (type === "mega-menu") {
    return (
      <>
        <header
          className={`top-0 z-50 w-full border-b ${positionClass} ${glassClasses} border-border`}
          style={headerStyle}
        >
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">{renderLogo()}</div>

              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  {items.map((item) => renderNavigationItem(item))}
                </NavigationMenuList>
              </NavigationMenu>

              {renderActions()}
            </div>
          </div>
        </header>
        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
        />
      </>
    );
  }

  // Default header navigation
  return (
    <>
      <header
        className={`top-0 z-50 w-full border-b ${isGlass ? glassClasses : resolvedBackgroundColor ? "" : "backdrop-blur supports-[backdrop-filter]:bg-background/60"} ${positionClass} border-border`}
        style={{
          ...(resolvedBackgroundColor &&
            !isGlass && {
              backgroundColor: resolvedBackgroundColor,
              borderColor: resolvedBackgroundColor,
            }),
          ...(resolvedTextColor && { color: resolvedTextColor }),
        }}
      >
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">{renderLogo()}</div>

            <nav className="hidden items-center space-x-8 md:flex">
              {items.map((item) => renderNavigationItem(item))}
            </nav>

            {renderActions()}
          </div>
        </div>
      </header>
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
      />
    </>
  );
}

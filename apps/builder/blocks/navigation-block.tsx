"use client";

import { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronRight,
} from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface NavigationBlockProps {
  type: "header" | "sidebar" | "mega-menu" | "search-first" | "mobile";
  logo: string;
  items: NavigationItem[];
  showSearch: boolean;
  showCart: boolean;
  showWishlist: boolean;
  showAccount: boolean;
  cartCount: number;
}

export function NavigationBlock({
  type,
  logo,
  items,
  showSearch,
  showCart,
  showWishlist,
  showAccount,
  cartCount,
}: NavigationBlockProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
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
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-accent rounded-md transition-colors">
              <span className="font-medium">{item.label}</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  expandedItems.has(item.id) ? "rotate-90" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2 ml-4">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={child.href}
                  className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            <NavigationMenuTrigger className="text-sm font-medium">
              {item.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                {item.children.map((child, index) => (
                  <div key={child.id} className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      {child.label}
                    </h4>
                    <div className="space-y-2">
                      {child.children?.map((grandChild) => (
                        <NavigationMenuLink
                          key={grandChild.id}
                          className="block p-2 text-sm hover:bg-accent rounded-md transition-colors"
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
        return (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger className="text-sm font-medium hover:text-muted-foreground transition-colors">
              {item.label}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {item.children.map((child) => (
                <DropdownMenuItem key={child.id}>
                  <a href={child.href}>{child.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    } else {
      if (isMobile) {
        return (
          <a
            key={item.id}
            href={item.href}
            className="block p-3 font-medium hover:bg-accent rounded-md transition-colors"
          >
            {item.label}
          </a>
        );
      } else if (type === "mega-menu") {
        return (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              className="text-sm font-medium px-4 py-2 hover:text-muted-foreground transition-colors"
              href={item.href}
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
            className="text-sm font-medium hover:text-muted-foreground transition-colors"
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
        <>
          {searchOpen ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search products..."
                className="w-64"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {showWishlist && (
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      )}

      {showAccount && (
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      )}

      {showCart && (
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );

  if (type === "sidebar") {
    return (
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Menu</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {showSearch && (
                      <div className="p-6 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

                    <div className="p-6 border-t border-border space-y-4">
                      <div className="flex items-center space-x-4">
                        {showAccount && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Account
                          </Button>
                        )}
                        {showWishlist && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Wishlist
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-medium tracking-tight">{logo}</h1>
            </div>

            {renderActions()}
          </div>
        </div>
      </header>
    );
  }

  if (type === "mobile") {
    return (
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-medium tracking-tight">{logo}</h1>
            </div>

            {renderActions()}
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="h-4 w-4" />
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
    );
  }

  if (type === "mega-menu") {
    return (
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-medium tracking-tight">{logo}</h1>
            </div>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {items.map((item) => renderNavigationItem(item))}
              </NavigationMenuList>
            </NavigationMenu>

            {renderActions()}
          </div>
        </div>
      </header>
    );
  }

  // Default header navigation
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-medium tracking-tight">{logo}</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {items.map((item) => renderNavigationItem(item))}
          </nav>

          {renderActions()}
        </div>
      </div>
    </header>
  );
}

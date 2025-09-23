"use client";

import { useState } from "react";
import { Search, ShoppingBag, User, Heart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";

export function MegaMenuNavigation() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-medium tracking-tight">STORE</h1>
          </div>

          {/* Mega Menu Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Categories
                      </h4>
                      <div className="space-y-2">
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          New Arrivals
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Clothing
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Accessories
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Footwear
                        </NavigationMenuLink>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Featured
                      </h4>
                      <div className="space-y-2">
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Best Sellers
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Sale Items
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Limited Edition
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Gift Cards
                        </NavigationMenuLink>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Trending
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          Discover the latest trends and seasonal favorites.
                        </p>
                        <Button size="sm" className="mt-3">
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  Collections
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Seasonal
                      </h4>
                      <div className="space-y-2">
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Spring Collection
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Summer Essentials
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Fall Favorites
                        </NavigationMenuLink>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Special
                      </h4>
                      <div className="space-y-2">
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Designer Collab
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Sustainable Line
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
                          Exclusive Drops
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="text-sm font-medium px-4 py-2 hover:text-muted-foreground transition-colors">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="text-sm font-medium px-4 py-2 hover:text-muted-foreground transition-colors">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
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

            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

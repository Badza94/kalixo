"use client";

import { useState } from "react";
import {
  X,
  Menu,
  Search,
  ShoppingBag,
  User,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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

export function SidebarNavigation() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Menu</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="p-6 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6 space-y-2">
                      <Collapsible open={shopOpen} onOpenChange={setShopOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-accent rounded-md transition-colors">
                          <span className="font-medium">Shop</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${shopOpen ? "rotate-90" : ""}`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 mt-2 ml-4">
                          <a
                            href="#"
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            New Arrivals
                          </a>
                          <a
                            href="#"
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Clothing
                          </a>
                          <a
                            href="#"
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Accessories
                          </a>
                          <a
                            href="#"
                            className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Sale
                          </a>
                        </CollapsibleContent>
                      </Collapsible>

                      <a
                        href="#"
                        className="block p-3 font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        Collections
                      </a>
                      <a
                        href="#"
                        className="block p-3 font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        About
                      </a>
                      <a
                        href="#"
                        className="block p-3 font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        Contact
                      </a>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-border space-y-4">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Account
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-medium tracking-tight">STORE</h1>
            </div>

            <div className="flex items-center space-x-4">
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
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  Heart,
  Home,
  Grid3X3,
  Info,
  Mail,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden border-b border-border bg-background sticky top-0 z-50">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full p-0">
                <div className="flex flex-col h-full bg-background">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-medium">STORE</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="p-4 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-1">
                      <a
                        href="#"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Home className="h-5 w-5" />
                        <span className="font-medium">Home</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Grid3X3 className="h-5 w-5" />
                        <span className="font-medium">Shop</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">Collections</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Info className="h-5 w-5" />
                        <span className="font-medium">About</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="font-medium">Contact</span>
                      </a>
                    </div>
                  </nav>

                  {/* Mobile Footer Actions */}
                  <div className="p-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="justify-start bg-transparent"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start bg-transparent"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-medium tracking-tight">STORE</h1>

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header (hidden on mobile) */}
      <header className="hidden md:block border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight">STORE</h1>

            <nav className="flex items-center space-x-8">
              <a
                href="#"
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Shop
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
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
    </>
  );
}

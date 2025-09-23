"use client";

import { useState } from "react";
import { Search, ShoppingBag, User, Heart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export function HeaderNavigation() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-medium tracking-tight">STORE</h1>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Shop
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>New Arrivals</DropdownMenuItem>
                <DropdownMenuItem>Clothing</DropdownMenuItem>
                <DropdownMenuItem>Accessories</DropdownMenuItem>
                <DropdownMenuItem>Sale</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

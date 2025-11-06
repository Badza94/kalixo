"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "@workspace/ui/lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useCartStore, CartItem } from "../lib/store/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const getItemTotal = (item: CartItem): string => {
    const currencyCode = item.currencyCode || "USD";
    const currencySymbol =
      currencyCode === "GBP"
        ? "£"
        : currencyCode === "USD"
          ? "$"
          : currencyCode === "EUR"
            ? "€"
            : currencyCode;
    const total = (item.cartPrice * item.quantity) / 100;
    return `${currencySymbol}${total.toFixed(2)}`;
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full ml-auto data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-md flex flex-col">
        <DrawerHeader className="flex-shrink-0 border-b border-border">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-lg font-semibold">
              Shopping Cart
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-56px)]">
          {cart.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex gap-4 items-start">
                    {/* Product Image */}
                    <div className="overflow-hidden relative flex-shrink-0 w-20 h-20 rounded bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-full h-full text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.platform ||
                          item.category ||
                          item.brand ||
                          "Digital"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {getItemTotal(item)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 w-8 h-8"
                        aria-label="Remove from cart"
                        onClick={() => {
                          removeFromCart(item.id.toString());
                          window.dispatchEvent(new CustomEvent("cartUpdated"));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {/* Quantity Controls */}
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => {
                            updateQuantity(
                              item.id.toString(),
                              item.quantity - 1
                            );
                            window.dispatchEvent(
                              new CustomEvent("cartUpdated")
                            );
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => {
                            updateQuantity(
                              item.id.toString(),
                              item.quantity + 1
                            );
                            window.dispatchEvent(
                              new CustomEvent("cartUpdated")
                            );
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

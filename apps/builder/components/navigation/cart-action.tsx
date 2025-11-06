"use client";

import { useState } from "react";
import { ShoppingBag } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CartDrawer } from "../cart-drawer";
import { useCartStore } from "../../lib/store/cart";

interface CartActionProps {
  textColor?: string;
  backgroundColor?: string;
}

export function CartAction({ textColor, backgroundColor }: CartActionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const cartQuantity = getTotalItems();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsDrawerOpen(true)}
        style={{
          color: textColor,
          backgroundColor: backgroundColor,
        }}
      >
        <ShoppingBag className="w-4 h-4" />
        {cartQuantity > 0 && (
          <span className="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 text-xs rounded-full bg-primary text-primary-foreground">
            {cartQuantity}
          </span>
        )}
      </Button>
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  cartPrice: number;
  price?: number | string;
  quantity: number;
  image?: string;
  countryCode?: string;
  brand?: string;
  currencyCode?: string;
  denominationType?: string;
  category?: string;
  platform?: string;
  type?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity" | "cartPrice">,
    cartPrice: number,
    quantity: number
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePrice: (id: string, cartPrice: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  replaceCart: (newCart: CartItem[]) => void;
}

export const useCartStore = create<
  CartStore,
  [["zustand/persist", { cart: CartItem[] }]]
>(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item, cartPrice, quantity) => {
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);

          if (existingItem) {
            // Update the existing item's cartPrice and quantity
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, cartPrice, quantity } : i
              ),
            };
          }

          // Add the new item
          return {
            cart: [...state.cart, { ...item, cartPrice, quantity }],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== Number(id)),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === Number(id)
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      updatePrice: (id, cartPrice) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === Number(id)
              ? { ...item, cartPrice: Math.max(0, cartPrice) }
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + (item.cartPrice * item.quantity) / 100,
          0
        );
      },

      replaceCart: (newCart) => {
        set({ cart: newCart });
      },
    }),
    {
      name: "cart-storage", // Key for localStorage
      partialize: (state) => ({ cart: state.cart }), // Only persist the cart
    }
  )
);

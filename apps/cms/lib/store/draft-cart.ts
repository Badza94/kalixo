import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cart";

// Define a new type for a draft cart with an ID and items
export interface DraftCart {
  id: string;
  createdAt: string;
  items: CartItem[];
  quantity: number;
  cartPrice: number;
  user: any;
}

interface DraftCartStore {
  draftCarts: DraftCart[];
  addNewDraftCart: (items: CartItem[], user: any) => void;
  updateDraftCart: (id: string, items: CartItem[]) => void;
  removeDraftCart: (id: string) => void;
  clearAllDraftCarts: () => void;
  getDraftCartItems: (id: string) => CartItem[];
  getDraftCartTotalItems: (id: string) => number;
  getDraftCartTotalPrice: (id: string) => number;
}

export const useDraftCartStore = create<DraftCartStore>()(
  persist(
    (set, get) => ({
      draftCarts: [],

      // Add a new draft cart with a unique ID
      addNewDraftCart: (items, user) => {
        set((state) => {
          // Create a unique ID for the new draft cart
          const id = `D${Date.now()}`;

          if (user) {
            // Create a new draft cart object
            const newDraftCart: DraftCart = {
              id,
              createdAt: new Date().toISOString(),
              items: [...items],
              quantity: items.reduce((total, item) => total + item.quantity, 0),
              cartPrice: items.reduce(
                (total, item) => total + item.cartPrice * item.quantity,
                0
              ),
              // get the user from the session or context
              user,
            };

            // Add the new draft cart to the list of draft carts
            return {
              draftCarts: [...state.draftCarts, newDraftCart],
            };
          }

          // If no user is found, return the current state without changes
          return state;
        });
      },

      // Update an existing draft cart
      updateDraftCart: (id, items) => {
        set((state) => ({
          draftCarts: state.draftCarts.map((cart) =>
            cart.id === id ? { ...cart, items } : cart
          ),
        }));
      },

      // Remove a draft cart by ID
      removeDraftCart: (id) => {
        set((state) => ({
          draftCarts: state.draftCarts.filter((cart) => cart.id !== id),
        }));
      },

      // Clear all draft carts
      clearAllDraftCarts: () => {
        set({ draftCarts: [] });
      },

      // Get items from a specific draft cart
      getDraftCartItems: (id) => {
        const cart = get().draftCarts.find((cart) => cart.id === id);
        return cart ? cart.items : [];
      },

      // Get total number of items in a specific draft cart
      getDraftCartTotalItems: (id) => {
        const cart = get().draftCarts.find((cart) => cart.id === id);
        if (!cart) return 0;

        return cart.items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of a specific draft cart
      getDraftCartTotalPrice: (id) => {
        const cart = get().draftCarts.find((cart) => cart.id === id);
        if (!cart) return 0;

        return cart.items.reduce(
          (total, item) => total + item.cartPrice * item.quantity,
          0
        );
      },
    }),
    {
      name: "draft-cart-storage", // unique name for the storage
    }
  )
);

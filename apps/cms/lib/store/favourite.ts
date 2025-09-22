import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavouritesStore {
  favourites: string[];
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  clearFavourites: () => void;
}

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set, get) => ({
      favourites: [],

      addFavourite: (id) => {
        const alreadyFavourite = get().favourites.some((favId) => favId === id);
        if (!alreadyFavourite) {
          set((state) => ({
            favourites: [...state.favourites, id],
          }));
        }
      },

      removeFavourite: (id) => {
        set((state) => ({
          favourites: state.favourites.filter((favId) => favId !== id),
        }));
      },

      isFavourite: (id) => {
        return get().favourites.some((favId) => favId === id);
      },

      clearFavourites: () => set({ favourites: [] }),
    }),
    {
      name: "favourites-storage", // Key for localStorage
      partialize: (state) => ({ favourites: state.favourites }), // Only persist favourites
    }
  )
);

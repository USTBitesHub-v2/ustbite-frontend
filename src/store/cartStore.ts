import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/types";

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  add: (item: MenuItem, restaurantName: string) => void;
  remove: (menuItemId: string) => void;
  decrement: (menuItemId: string) => void;
  clear: () => void;
  setFromServer: (items: CartItem[]) => void;
  itemCount: () => number;
  subtotal: () => number;
  qtyOf: (menuItemId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      add: (item, restaurantName) => {
        const { items, restaurantId } = get();
        // If switching restaurants, reset cart
        if (restaurantId && restaurantId !== item.restaurantId) {
          set({
            items: [{ menuItem: item, restaurantName, qty: 1 }],
            restaurantId: item.restaurantId,
            restaurantName,
          });
          return;
        }
        const existing = items.find((i) => i.menuItem.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.menuItem.id === item.id ? { ...i, qty: i.qty + 1 } : i,
            ),
          });
        } else {
          set({
            items: [...items, { menuItem: item, restaurantName, qty: 1 }],
            restaurantId: item.restaurantId,
            restaurantName,
          });
        }
      },

      decrement: (menuItemId) => {
        const items = get().items
          .map((i) =>
            i.menuItem.id === menuItemId ? { ...i, qty: i.qty - 1 } : i,
          )
          .filter((i) => i.qty > 0);
        set({
          items,
          restaurantId: items.length ? get().restaurantId : null,
          restaurantName: items.length ? get().restaurantName : null,
        });
      },

      remove: (menuItemId) => {
        const items = get().items.filter((i) => i.menuItem.id !== menuItemId);
        set({
          items,
          restaurantId: items.length ? get().restaurantId : null,
          restaurantName: items.length ? get().restaurantName : null,
        });
      },

      clear: () => set({ items: [], restaurantId: null, restaurantName: null }),

      setFromServer: (items) => set({
        items,
        restaurantId: items[0]?.menuItem.restaurantId ?? null,
        restaurantName: items[0]?.restaurantName ?? null,
      }),

      itemCount: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.menuItem.price, 0),
      qtyOf: (id) => get().items.find((i) => i.menuItem.id === id)?.qty ?? 0,
    }),
    { name: "ustbite-cart" },
  ),
);

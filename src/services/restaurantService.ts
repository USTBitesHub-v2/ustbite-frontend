import { apiClient } from "./apiClient";
import type { Restaurant, MenuItem, FoodCategory, ApiResponse } from "@/types";

// ─── Backend → Frontend type transformers ────────────────────────────────────

// Backend category names (from menu_categories table) → FoodCategory enum
const CATEGORY_MAP: Record<string, FoodCategory> = {
  Breakfast: "Breakfast",
  Lunch:     "Mains",
  Mains:     "Mains",
  Starters:  "Mains",
  Snacks:    "Snacks",
  Beverages: "Beverages",
  Desserts:  "Desserts",
  Breads:    "Mains",
};

function toRestaurant(raw: Record<string, unknown>): Restaurant {
  const mins = (raw.estimated_delivery_minutes as number) ?? 25;
  return {
    id:           raw.id as string,
    name:         raw.name as string,
    cuisine:      (raw.cuisine_type as string) ?? "Other",
    cuisineTags:  [(raw.cuisine_type as string)].filter(Boolean),
    rating:       parseFloat(String(raw.rating ?? 0)),
    deliveryTime: `${mins}–${mins + 5} mins`,
    deliveryMin:  mins,
    minOrder:     parseFloat(String(raw.min_order_amount ?? 0)),
    coverImage:   (raw.image_url as string) ?? "",
    isOpen:       (raw.is_open as boolean) ?? false,
    floor:        raw.floor_number as string | undefined,
    description:  raw.description as string | undefined,
  };
}

function toMenuItem(raw: Record<string, unknown>): MenuItem {
  const catName = raw.category_name as string | undefined;
  return {
    id:           raw.id as string,
    restaurantId: raw.restaurant_id as string,
    name:         raw.name as string,
    description:  (raw.description as string) ?? "",
    price:        parseFloat(String(raw.price ?? 0)),
    image:        (raw.image_url as string) ?? "",
    veg:          (raw.is_vegetarian as boolean) ?? true,
    category:     CATEGORY_MAP[catName ?? ""] ?? "Mains",
    popular:      false,
  };
}

// ─── Service calls ────────────────────────────────────────────────────────────

export const restaurantService = {
  list: async (): Promise<Restaurant[]> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>[]>>("/restaurants");
    return res.data.data.map(toRestaurant);
  },

  getById: async (id: string): Promise<Restaurant> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/restaurants/${id}`);
    return toRestaurant(res.data.data);
  },

  getMenu: async (id: string): Promise<MenuItem[]> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>[]>>(`/restaurants/${id}/menu`);
    return res.data.data.map(toMenuItem);
  },
};

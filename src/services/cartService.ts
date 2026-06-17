import { apiClient } from "./apiClient";
import type { CartItem, ApiResponse } from "@/types";

export const cartService = {
  get: async (): Promise<CartItem[]> => {
    const res = await apiClient.get<ApiResponse<CartItem[]>>("/cart");
    return res.data.data;
  },

  sync: async (items: CartItem[]): Promise<{ ok: true }> => {
    const res = await apiClient.put<ApiResponse<{ ok: true }>>("/cart", { items });
    return res.data.data;
  },

  clear: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },
};

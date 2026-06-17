import { apiClient } from "./apiClient";
import type { User, ApiResponse } from "@/types";

export const userService = {
  me: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>("/users/me");
    return res.data.data;
  },

  update: async (patch: Partial<User>): Promise<User> => {
    const res = await apiClient.put<ApiResponse<User>>("/users/me", patch);
    return res.data.data;
  },
};

import { apiClient } from "./apiClient";
import type { User } from "@/types";

// Map backend snake_case → frontend camelCase User type
function toUser(raw: Record<string, unknown>): User {
  return {
    id:          raw.id as string,
    fullName:    (raw.name as string) ?? "",
    email:       raw.email as string,
    employeeId:  (raw.employee_id as string) ?? "",
    department:  (raw.department as string) ?? "",
    floor:       (raw.floor_number as string) ?? "",
    phone:       raw.phone as string | undefined,
    role:        (raw.role as User["role"]) ?? "employee",
  };
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  employee_id: string;
  name: string;
  password: string;
  phone?: string;
  department?: string;
  floor_number?: string;
}

interface AuthResponse {
  data: { token: string; user: Record<string, unknown> };
  message: string;
  status: string;
}

function setAuthCookie(token: string) {
  // Store JWT in a cookie — read by apiClient interceptor
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
}

function clearAuthCookie() {
  document.cookie = "auth_token=; path=/; max-age=0";
}

export const authService = {
  login: async (credentials: AuthCredentials): Promise<User> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    const { token, user } = res.data.data;
    setAuthCookie(token);
    return toUser(user);
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const res = await apiClient.post<AuthResponse>("/auth/register", payload);
    const { token, user } = res.data.data;
    setAuthCookie(token);
    return toUser(user);
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout").catch(() => {}); // best-effort
    clearAuthCookie();
  },

  isAuthenticated: (): boolean => {
    return document.cookie.includes("auth_token=");
  },
};

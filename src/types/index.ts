// USTBite — shared TypeScript types
export type Cuisine =
  | "South Indian"
  | "North Indian"
  | "Café"
  | "Bakery"
  | "Beverages"
  | "All";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  cuisineTags: string[];
  rating: number;
  deliveryTime: string;        // "15-20 mins"
  deliveryMin: number;         // sortable lower bound
  minOrder: number;            // ₹
  coverImage: string;
  isOpen: boolean;
  floor?: string;
  description?: string;
}

export type FoodCategory =
  | "Breakfast"
  | "Mains"
  | "Snacks"
  | "Beverages"
  | "Desserts";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  veg: boolean;
  category: FoodCategory;
  popular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  restaurantName: string;
  qty: number;
}

export type OrderStatus =
  | "PENDING"
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "PAYMENT_FAILED";

export interface OrderItemSummary {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;            // ISO
  estimatedDelivery: string;   // ISO
  floor: string;
  wing: string;
  paymentMethod: "UPI" | "Card" | "Cash on Delivery";
  specialInstructions?: string;
  agentName?: string;
  agentCurrentFloor?: string;
}

export interface SavedFloor {
  id: string;
  label: string;       // e.g. "My Desk"
  floor: string;       // e.g. "5"
  wing: string;        // e.g. "A"
}

export type UserRole = "employee" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  floor: string;
  wing?: string;
  phone?: string;
  role?: UserRole;
  savedFloors?: SavedFloor[];
}

export interface AuthCredentials {
  email: string;
  employee_id: string;  // USTBite uses employee ID, not password
}

export interface RegisterPayload {
  name: string;          // maps to User.name in backend
  employee_id: string;
  email: string;
  department?: string;
  floor_number?: string;
  phone?: string;
}

// Generic wrapper matching backend StandardResponse format
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export interface PaymentInfo {
  paymentId: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
}

export interface PlaceOrderPayload {
  restaurantId: string;
  restaurantName: string;         // used as restaurant_name_snapshot in backend
  items: { menuItemId: string; qty: number; price: number; name: string }[];
  floor: string;
  wing: string;
  paymentMethod: Order["paymentMethod"];
  specialInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

import { apiClient } from "./apiClient";
import type { Order, PlaceOrderPayload, ApiResponse, PaymentInfo } from "@/types";

// ─── Frontend → Backend payload transformer ───────────────────────────────────

// Frontend: "UPI" | "Card" | "Cash on Delivery"
// Backend enum: "UPI" | "CARD" | "CASH_ON_DELIVERY"
const METHOD_MAP: Record<string, string> = {
  "UPI":              "UPI",
  "Card":             "CARD",
  "Cash on Delivery": "CASH_ON_DELIVERY",
};

function toBackendOrder(payload: PlaceOrderPayload): Record<string, unknown> {
  return {
    restaurant_id:           payload.restaurantId,
    restaurant_name_snapshot: payload.restaurantName,
    total_amount:            payload.total,
    delivery_floor:          payload.floor,
    delivery_wing:           payload.wing,
    special_instructions:    payload.specialInstructions ?? null,
    payment_method:          METHOD_MAP[payload.paymentMethod] ?? "UPI",
    items: payload.items.map((item) => ({
      menu_item_id:         item.menuItemId,
      item_name_snapshot:   item.name,
      item_price_snapshot:  item.price,
      quantity:             item.qty,
      subtotal:             parseFloat((item.price * item.qty).toFixed(2)),
    })),
  };
}

// ─── Backend → Frontend response transformer ─────────────────────────────────

function toOrder(raw: Record<string, unknown>): Order {
  const createdAt = (raw.created_at as string | null) ?? undefined;
  // Add ~20 min for estimated delivery when no update has occurred
  let estimatedDelivery: string | undefined;
  if (raw.updated_at) {
    estimatedDelivery = raw.updated_at as string;
  } else if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() + 20);
      estimatedDelivery = d.toISOString();
    }
  }
  return {
    id:                  raw.id as string,
    restaurantId:        raw.restaurant_id as string,
    restaurantName:      raw.restaurant_name_snapshot as string,
    items:               ((raw.items ?? []) as Record<string, unknown>[]).map((i) => ({
      name:  i.item_name_snapshot as string,
      qty:   i.quantity as number,
      price: parseFloat(String(i.item_price_snapshot ?? 0)),
    })),
    subtotal:            parseFloat(String(raw.total_amount ?? 0)),
    deliveryFee:         0,
    total:               parseFloat(String(raw.total_amount ?? 0)),
    status:              raw.status as Order["status"],
    placedAt:            createdAt ?? "",
    estimatedDelivery:   estimatedDelivery ?? "",
    floor:               (raw.delivery_floor as string) ?? "",
    wing:                (raw.delivery_wing as string) ?? "",
    paymentMethod:       "UPI",
    specialInstructions: raw.special_instructions as string | undefined,
  };
}

// ─── Service calls ────────────────────────────────────────────────────────────

export interface PlaceOrderResult {
  order: Order;
  paymentInfo: PaymentInfo | null;
}

export const orderService = {
  place: async (payload: PlaceOrderPayload): Promise<PlaceOrderResult> => {
    const res = await apiClient.post<ApiResponse<Record<string, unknown>>>(
      "/orders",
      toBackendOrder(payload)
    );
    const raw = res.data.data;
    const pi = raw.payment_info as Record<string, unknown> | undefined;
    const paymentInfo: PaymentInfo | null = pi?.razorpay_order_id
      ? {
          paymentId:       pi.payment_id as string,
          razorpayOrderId: pi.razorpay_order_id as string,
          razorpayKeyId:   pi.razorpay_key_id as string,
        }
      : null;
    return { order: toOrder(raw), paymentInfo };
  },

  getById: async (id: string): Promise<Order> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/orders/${id}`);
    return toOrder(res.data.data);
  },

  track: async (id: string): Promise<Order | undefined> => {
    try {
      const res = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/orders/${id}/track`);
      return toOrder(res.data.data);
    } catch {
      return undefined;
    }
  },

  myOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>[]>>("/orders/me");
    return res.data.data.map(toOrder);
  },
};

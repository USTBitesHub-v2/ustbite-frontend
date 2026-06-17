import { apiClient } from "./apiClient";
import type { ApiResponse } from "@/types";

export interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const paymentService = {
  verify: async (payload: VerifyPayload): Promise<void> => {
    await apiClient.post<ApiResponse<unknown>>("/payments/verify", payload);
  },
};

// ─── Razorpay checkout helper ──────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(opts: {
  razorpayKeyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  userName?: string;
  userEmail?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss: () => void;
}): Promise<void> {
  await loadRazorpayScript();
  const rz = new window.Razorpay({
    key: opts.razorpayKeyId,
    amount: opts.amountPaise,
    currency: "INR",
    name: "USTBite",
    description: "Campus cafeteria order",
    order_id: opts.razorpayOrderId,
    handler: opts.onSuccess,
    prefill: { name: opts.userName, email: opts.userEmail },
    theme: { color: "#F59E0B" },
    modal: { ondismiss: opts.onDismiss },
  });
  rz.open();
}

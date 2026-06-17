import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Button } from "@/components/ui/ust/Button";
import { Badge } from "@/components/ui/ust/Badge";
import { Field, TextField, TextArea } from "@/components/ui/ust/Input";
import { EmptyState } from "@/components/ui/ust/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { cartService } from "@/services/cartService";
import { openRazorpayCheckout, paymentService } from "@/services/paymentService";
import { formatINR } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Order } from "@/types";

type PayMethod = Order["paymentMethod"];

export default function CartPage() {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, subtotal, add, decrement, remove, clear, setFromServer } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [hydrated, setHydrated] = useState(false);

  const syncCartToServer = () => {
    cartService.sync(useCartStore.getState().items).catch(() => {});
  };
  const [floor, setFloor] = useState(user?.floor ?? "");
  const [wing, setWing] = useState(user?.wing ?? "A");
  const [instructions, setInstructions] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("UPI");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      toast.error("Please sign in to view your cart");
      navigate("/login");
      return;
    }
    let active = true;
    cartService
      .get()
      .then((serverItems) => {
        if (active && serverItems.length > 0) setFromServer(serverItems);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hydrated, user, navigate, setFromServer]);

  if (!hydrated) return null;

  const sub = subtotal();
  const fee = 0;
  const total = sub + fee;

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState
            icon={<ShoppingBag className="size-10" />}
            title="Your cart is empty"
            description="Browse cafeteria restaurants and add some delicious food."
            ctaLabel="Browse Restaurants"
            ctaTo="/restaurants"
          />
        </div>
      </PageWrapper>
    );
  }

  const placeOrder = async () => {
    if (!floor) { toast.error("Please enter your floor number"); return; }
    setPlacing(true);
    try {
      const { order, paymentInfo } = await orderService.place({
        restaurantId: restaurantId!,
        restaurantName: restaurantName ?? "",
        items: items.map((i) => ({ menuItemId: i.menuItem.id, qty: i.qty, price: i.menuItem.price, name: i.menuItem.name })),
        floor, wing, paymentMethod: payMethod, specialInstructions: instructions,
        subtotal: sub, deliveryFee: fee, total,
      });

      // Cash on Delivery — no payment popup needed
      if (payMethod === "Cash on Delivery" || !paymentInfo?.razorpayOrderId) {
        clear();
        toast.success("Order placed successfully!");
        navigate(`/orders/${order.id}`);
        return;
      }

      // UPI / Card — open Razorpay checkout
      setPlacing(false); // release the button while popup is open
      await openRazorpayCheckout({
        razorpayKeyId:   paymentInfo.razorpayKeyId,
        razorpayOrderId: paymentInfo.razorpayOrderId,
        amountPaise:     Math.round(total * 100),
        userName:        user.fullName,
        userEmail:       user.email,
        onSuccess: async (response) => {
          try {
            await paymentService.verify({
              razorpay_order_id:  response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            clear();
            toast.success("Payment successful! Order confirmed.");
          } catch {
            toast.error("Payment received but verification failed. Contact support.");
          } finally {
            navigate(`/orders/${order.id}`);
          }
        },
        onDismiss: () => {
          toast.error("Payment cancelled. Your order is saved — you can retry from order history.");
          navigate(`/orders/${order.id}`);
        },
      });
    } catch {
      toast.error("Could not place order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Checkout</h1>
        <p className="mt-1 text-text-secondary">Review your order from <span className="font-semibold text-foreground">{restaurantName}</span></p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Items */}
          <div className="space-y-3">
            {items.map(({ menuItem, qty }) => (
              <Card key={menuItem.id} className="p-4 flex items-center gap-4">
                <div className="size-16 rounded-md overflow-hidden bg-surface-soft shrink-0">
                  <img src={menuItem.image} alt={menuItem.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{menuItem.name}</p>
                  <p className="text-sm text-text-secondary">{formatINR(menuItem.price)} each</p>
                </div>
                <div className="flex items-center gap-1 bg-surface-soft rounded-md h-9">
                  <button onClick={() => { decrement(menuItem.id); syncCartToServer(); }} className="px-2 hover:bg-border-soft rounded-l-md h-full" aria-label="Decrease"><Minus className="size-4" /></button>
                  <span className="text-sm font-bold w-7 text-center">{qty}</span>
                  <button onClick={() => { add(menuItem, restaurantName ?? ""); syncCartToServer(); }} className="px-2 hover:bg-border-soft rounded-r-md h-full" aria-label="Increase"><Plus className="size-4" /></button>
                </div>
                <p className="font-semibold text-foreground w-20 text-right">{formatINR(menuItem.price * qty)}</p>
                <button onClick={() => { remove(menuItem.id); syncCartToServer(); }} className="text-text-secondary hover:text-accent-red" aria-label="Remove"><Trash2 className="size-4" /></button>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <h2 className="font-semibold text-foreground">Delivery details</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Floor" htmlFor="floor"><TextField id="floor" required value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="5" /></Field>
                <Field label="Wing" htmlFor="wing"><TextField id="wing" value={wing} onChange={(e) => setWing(e.target.value)} placeholder="A" /></Field>
              </div>
              <Field label="Special instructions" htmlFor="ins">
                <TextArea id="ins" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Less spicy, no onions, etc." />
              </Field>
            </Card>

            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-foreground">Payment method</h2>
              <div className="grid grid-cols-3 gap-2">
                {(["UPI", "Card", "Cash on Delivery"] as PayMethod[]).map((m) => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    className={cn(
                      "h-11 rounded-md border text-xs font-semibold transition-colors px-2",
                      payMethod === m ? "border-brand-amber bg-brand-amber-soft text-brand-navy" : "border-border-soft text-text-secondary hover:border-brand-amber",
                    )}>{m}</button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-foreground mb-3">Order total</h2>
              <Row label="Subtotal" value={formatINR(sub)} />
              <Row label="Delivery fee" value={<Badge variant="success">FREE on campus</Badge>} />
              <div className="border-t border-border-soft mt-3 pt-3 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">{formatINR(total)}</span>
              </div>
              <Button variant="amber" className="w-full mt-5" loading={placing} onClick={placeOrder}>
                {placing ? "Placing order..." : `Place Order • ${formatINR(total)}`}
              </Button>
              <Link to={`/restaurants/${restaurantId}`} className="block text-center mt-3 text-sm text-text-secondary hover:text-foreground">
                Add more items
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm py-1">
    <span className="text-text-secondary">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, MapPin, User as UserIcon, ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { Badge } from "@/components/ui/ust/Badge";
import { OrderTimeline } from "@/components/features/OrderTimeline";
import { orderService } from "@/services/orderService";
import { formatINR, formatDateTime } from "@/utils/formatters";
import type { Order } from "@/types";

const VIBES: { emoji: string; line: (dish: string) => string }[] = [
  { emoji: "❤️", line: (dish) => `Your ${dish} is making a warm little journey to find you.` },
  { emoji: "❤️", line: (_dish) => `Something absolutely delicious is headed your way — hang tight!` },
  { emoji: "❤️", line: (dish) => `Great food is worth every second of the wait. ${dish} incoming!` },
  { emoji: "❤️", line: (_dish) => `Our kitchen poured love into this one. It's almost with you!` },
];

function VibeCard({ order }: { order: Order }) {
  const [idx, setIdx] = useState(0);
  const dish = order.items[0]?.name ?? "your order";

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % VIBES.length), 6000);
    return () => clearInterval(t);
  }, []);

  if (order.status === "DELIVERED") {
    return (
      <Card className="p-6 mt-4 bg-green-50 border-green-200 text-center">
        <p className="font-bold text-green-800 text-lg">Your order has arrived!</p>
        <p className="text-green-700 text-sm mt-1">Enjoy your meal. Come back soon!</p>
      </Card>
    );
  }

  if (order.status === "CANCELLED") {
    return (
      <Card className="p-6 mt-4 bg-red-50 border-red-200 text-center">
        <p className="font-bold text-red-800 text-lg">This order was cancelled.</p>
        <p className="text-red-700 text-sm mt-1">Browse restaurants to place a new one.</p>
      </Card>
    );
  }

  const { emoji, line } = VIBES[idx];
  return (
    <Card className="p-6 mt-4 bg-brand-amber-soft border-brand-amber/30 text-center overflow-hidden relative">
      <div key={idx} className="animate-in fade-in duration-700">
        <p className="text-5xl mb-3">{emoji}</p>
        <p className="font-semibold text-brand-navy text-base leading-relaxed max-w-md mx-auto">
          {line(dish)}
        </p>
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {VIBES.map((_, i) => (
          <span key={i} className={`inline-block h-1.5 rounded-full transition-all duration-500 ${i === idx ? "w-5 bg-brand-amber" : "w-1.5 bg-brand-amber/30"}`} />
        ))}
      </div>
    </Card>
  );
}

export default function OrderTrackingPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Order — USTBite`;
    let active = true;
    const refresh = () => orderService.track(id).then((o) => { if (active) { setOrder(o); setLoading(false); } }).catch((err) => { toast.error(err?.response?.data?.message || err.message || "Failed to track order"); setLoading(false); });
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => { active = false; clearInterval(interval); };
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Order not found</h1>
          <Link to="/orders" className="mt-4 inline-block text-accent-red font-semibold hover:underline">View all orders</Link>
        </div>
      </PageWrapper>
    );
  }

  const shortId = order.id.slice(0, 8).toUpperCase();
  const isActive = !["DELIVERED", "CANCELLED", "PAYMENT_FAILED"].includes(order.status);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-foreground mb-4">
          <ArrowLeft className="size-4" /> All orders
        </Link>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Order #{shortId}</h1>
            <p className="mt-1 text-text-secondary">{order.restaurantName} • Placed {formatDateTime(order.placedAt)}</p>
          </div>
          <Badge variant={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" ? "danger" : "amber"}>
            {order.status.replace(/_/g, " ")}
          </Badge>
        </div>

        {isActive && (
          <Card className="p-5 mt-6 bg-brand-amber-soft border-brand-amber/30">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-brand-amber shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-navy/70 font-semibold">Estimated delivery</p>
                <p className="text-lg font-bold text-brand-navy">{formatDateTime(order.estimatedDelivery)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Cute rotating vibe card replaces "Delivery progress" */}
        <VibeCard order={order} />

        {/* Show the step tracker only after confirmation so it's meaningful */}
        {(order.status !== "PENDING" && order.status !== "PLACED") && (
          <Card className="p-6 mt-4">
            <h2 className="font-semibold text-foreground mb-6">Delivery progress</h2>
            <OrderTimeline current={order.status} />
          </Card>
        )}

        {order.agentName && isActive && (
          <Card className="p-5 mt-4 flex items-center gap-4">
            <div className="size-12 rounded-full bg-brand-amber-soft text-brand-amber flex items-center justify-center"><UserIcon className="size-5" /></div>
            <div className="flex-1">
              <p className="text-sm text-text-secondary">Your delivery agent</p>
              <p className="font-semibold text-foreground">{order.agentName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Currently on</p>
              <p className="font-semibold text-foreground inline-flex items-center gap-1"><MapPin className="size-4" />Floor {order.agentCurrentFloor}</p>
            </div>
          </Card>
        )}

        <Card className="p-5 mt-4">
          <h2 className="font-semibold text-foreground mb-4">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between"><span>{it.qty} × {it.name}</span><span className="font-medium">{formatINR(it.price * it.qty)}</span></li>
            ))}
          </ul>
          <div className="border-t border-border-soft mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Delivery</span><span>{order.deliveryFee === 0 ? "FREE" : formatINR(order.deliveryFee)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
          </div>
          <p className="mt-4 text-xs text-text-secondary">Delivering to Floor {order.floor}{order.wing ? `, Wing ${order.wing}` : ""} • Paid via {order.paymentMethod}</p>
        </Card>
      </div>
    </PageWrapper>
  );
}

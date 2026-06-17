import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Badge } from "@/components/ui/ust/Badge";
import { Button } from "@/components/ui/ust/Button";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { EmptyState } from "@/components/ui/ust/EmptyState";
import { orderService } from "@/services/orderService";
import { formatINR, formatRelativeTime } from "@/utils/formatters";
import type { Order } from "@/types";

const PAGE_SIZE = 6;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "My Orders — USTBite";
    orderService.myOrders().then((o) => { setOrders(o); setLoading(false); }).catch((err) => { toast.error(err?.response?.data?.message || err.message || 'Failed to load orders'); setLoading(false); });
  }, []);

  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">My Orders</h1>
        <p className="mt-1 text-text-secondary">Your USTBite order history</p>

        <div className="mt-6 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<Receipt className="size-10" />}
              title="No orders yet"
              description="Place your first order from a campus cafeteria."
              ctaLabel="Browse Restaurants"
              ctaTo="/restaurants"
            />
          ) : (
            <>
              {paginated.map((o) => (
                <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{o.restaurantName}</h3>
                      <Badge variant={o.status === "DELIVERED" ? "success" : o.status === "CANCELLED" ? "danger" : "amber"}>
                        {o.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-1">
                      {o.items.map((i) => `${i.qty}× ${i.name}`).join(" • ")}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">{o.id} • {formatRelativeTime(o.placedAt)}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-2 sm:w-40">
                    <p className="text-lg font-bold text-foreground">{formatINR(o.total)}</p>
                    <div className="flex gap-2">
                      <Button asChild variant="subtle" size="sm"><Link to={`/orders/${o.id}`}>View</Link></Button>
                      <Button asChild variant="amber" size="sm"><Link to={`/restaurants/${o.restaurantId}`}>Reorder</Link></Button>
                    </div>
                  </div>
                </Card>
              ))}
              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button variant="subtle" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <span className="text-sm text-text-secondary">Page {page} of {pageCount}</span>
                  <Button variant="subtle" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TextField } from "@/components/ui/ust/Input";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { Card } from "@/components/ui/ust/Card";
import { EmptyState } from "@/components/ui/ust/EmptyState";
import { RestaurantCard } from "@/components/features/RestaurantCard";
import { restaurantService } from "@/services/restaurantService";
import { CUISINE_FILTERS } from "@/utils/constants";
import type { Restaurant } from "@/types";
import { cn } from "@/lib/utils";

type SortKey = "rating" | "delivery" | "minOrder";

export default function RestaurantListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQ);
  const [cuisine, setCuisine] = useState<typeof CUISINE_FILTERS[number]>("All");
  const [sort, setSort] = useState<SortKey>("rating");

  useEffect(() => {
    document.title = "Cafeteria restaurants — USTBite";
    restaurantService.list().then((r) => { setRestaurants(r); setLoading(false); }).catch((err) => { toast.error(err?.response?.data?.message || err.message || 'Failed to load data'); setLoading(false); });
  }, []);

  useEffect(() => {
    if (query) setSearchParams({ q: query }); else setSearchParams({});
  }, [query, setSearchParams]);

  const filtered = useMemo(() => {
    const list = restaurants.filter((r) => {
      const matchQ = query.trim() === "" || r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase());
      const matchC = cuisine === "All" || r.cuisineTags.includes(cuisine as string);
      return matchQ && matchC;
    });
    return [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "delivery") return a.deliveryMin - b.deliveryMin;
      return a.minOrder - b.minOrder;
    });
  }, [restaurants, query, cuisine, sort]);

  return (
    <PageWrapper>
      <section className="bg-surface-soft border-b border-border-soft py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">All Restaurants</h1>
          <p className="mt-2 text-text-secondary">Browse every cafeteria on UST campus.</p>

          <div className="mt-6 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-secondary pointer-events-none" />
            <TextField
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..." className="pl-10 h-12 bg-white"
              aria-label="Search restaurants"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
              {CUISINE_FILTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCuisine(c)}
                  className={cn(
                    "shrink-0 h-9 px-4 rounded-md text-sm font-medium transition-colors border",
                    cuisine === c
                      ? "bg-brand-amber border-brand-amber text-brand-navy"
                      : "bg-white border-border-soft text-text-secondary hover:border-brand-amber hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="sort" className="text-text-secondary">Sort by</label>
              <select
                id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-md border border-border-soft bg-white px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber"
              >
                <option value="rating">Rating</option>
                <option value="delivery">Delivery time</option>
                <option value="minOrder">Min order (price)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No restaurants match your search"
              description="Try a different cuisine filter or clear your search."
              ctaLabel="Clear filters" onCta={() => { setQuery(""); setCuisine("All"); }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

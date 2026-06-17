import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { Badge } from "@/components/ui/ust/Badge";
import { MenuItemCard } from "@/components/features/MenuItemCard";
import { CartPanel } from "@/components/features/CartPanel";
import { restaurantService } from "@/services/restaurantService";
import type { Restaurant, MenuItem, FoodCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: FoodCategory[] = ["Breakfast", "Mains", "Snacks", "Beverages", "Desserts"];

export default function RestaurantDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<FoodCategory>("Breakfast");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setLoading(true);
    Promise.all([restaurantService.getById(id), restaurantService.getMenu(id)])
      .then(([r, m]) => {
        setRestaurant(r);
        setMenu(m);
        if (r) document.title = `${r.name} — USTBite`;
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err.message || "Failed to load restaurant details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const grouped = useMemo(() => {
    const map = new Map<FoodCategory, MenuItem[]>();
    menu.forEach((m) => {
      const list = map.get(m.category) ?? [];
      list.push(m);
      map.set(m.category, list);
    });
    return map;
  }, [menu]);

  const presentCategories = CATEGORIES.filter((c) => grouped.has(c));

  const scrollTo = (cat: FoodCategory) => {
    setActiveCategory(cat);
    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton className="h-56 sm:h-72 w-full rounded-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!restaurant) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto py-24 px-4 text-center">
          <h1 className="font-display text-2xl font-bold">Restaurant not found</h1>
          <Link to="/restaurants" className="mt-4 inline-block text-accent-red font-semibold hover:underline">Back to restaurants</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative h-56 sm:h-72 lg:h-80 bg-surface-soft overflow-hidden">
        <img src={restaurant.coverImage} alt={restaurant.name} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-white">
          <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3">
            <ArrowLeft className="size-4" /> Back
          </Link>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">{restaurant.name}</h1>
              <p className="mt-1 text-sm text-white/85">{restaurant.cuisine}</p>
            </div>
            {restaurant.isOpen ? (
              <Badge variant="amber">Open Now</Badge>
            ) : (
              <Badge variant="danger">Closed</Badge>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-white/85 flex-wrap">
            <span className="inline-flex items-center gap-1"><Star className="size-4 fill-brand-amber text-brand-amber" />{restaurant.rating}</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-4" />{restaurant.deliveryTime}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{restaurant.floor}</span>
            <span>Min order ₹{restaurant.minOrder} • Free delivery on campus</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-8">
        {/* Sticky category sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Menu categories">
            {presentCategories.map((c) => (
              <button
                key={c}
                onClick={() => scrollTo(c)}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeCategory === c
                    ? "bg-brand-amber-soft text-brand-navy border-l-[3px] border-l-brand-amber"
                    : "text-text-secondary hover:text-foreground hover:bg-surface-soft",
                )}
              >
                {c}
              </button>
            ))}
          </nav>
        </aside>

        {/* Menu */}
        <div>
          {/* Mobile category pills */}
          <div className="lg:hidden -mx-4 px-4 pb-3 mb-3 flex gap-2 overflow-x-auto hide-scrollbar border-b border-border-soft">
            {presentCategories.map((c) => (
              <button key={c} onClick={() => scrollTo(c)}
                className={cn(
                  "shrink-0 h-9 px-3 rounded-md text-xs font-semibold border",
                  activeCategory === c ? "bg-brand-amber border-brand-amber text-brand-navy" : "bg-white border-border-soft text-text-secondary",
                )}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-10">
            {presentCategories.map((c) => (
              <section
                key={c}
                ref={(el: HTMLDivElement | null) => { sectionRefs.current[c] = el; }}
                aria-labelledby={`cat-${c}`}
              >
                <h2 id={`cat-${c}`} className="font-display text-xl font-bold text-foreground mb-4">{c}</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {grouped.get(c)!.map((item) => (
                    <MenuItemCard key={item.id} item={item} restaurantName={restaurant.name} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Cart sidebar */}
        <aside className="hidden lg:block">
          <CartPanel />
        </aside>
      </div>

      {/* Mobile cart bottom-sheet trigger */}
      <MobileCartBar />
    </PageWrapper>
  );
}

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/ust/Button";
import { formatINR } from "@/utils/formatters";

const MobileCartBar = () => {
  const count = useCartStore((s) => s.itemCount());
  const subtotal = useCartStore((s) => s.subtotal());
  if (count === 0) return null;
  return (
    <div className="lg:hidden sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-border-soft shadow-card-hover">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{count} item{count > 1 ? "s" : ""} in cart</p>
          <p className="text-sm font-semibold text-foreground">{formatINR(subtotal)}</p>
        </div>
        <Button asChild variant="amber"><Link to="/cart">View Cart</Link></Button>
      </div>
    </div>
  );
};

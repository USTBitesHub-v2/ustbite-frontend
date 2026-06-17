import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, Zap, Utensils, MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/ust/Button";
import { Card } from "@/components/ui/ust/Card";
import { Badge } from "@/components/ui/ust/Badge";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { Avatar } from "@/components/ui/ust/Avatar";
import { TextField } from "@/components/ui/ust/Input";
import { RestaurantCard } from "@/components/features/RestaurantCard";
import { FoodCarousel } from "@/components/features/FoodCarousel";
import { restaurantService } from "@/services/restaurantService";
import { POPULAR_TODAY, MOCK_RESTAURANTS } from "@/utils/mockData";
import { formatINR } from "@/utils/formatters";
import type { Restaurant } from "@/types";

export default function LandingPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "USTBite — Order from the cafeteria, delivered to your floor";
    restaurantService.list().then((r) => {
      setRestaurants(r);
      setLoading(false);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to load restaurants");
      setLoading(false);
    });
  }, []);

  const popularItems = POPULAR_TODAY.map((item) => {
    const r = MOCK_RESTAURANTS.find((x) => x.id === item.restaurantId)!;
    return { item, restaurantName: r.name, restaurantId: r.id };
  });

  return (
    <PageWrapper>
      <Hero search={search} setSearch={setSearch} />

      <WhySection />

      <FeaturedRestaurantsSection restaurants={restaurants} loading={loading} />

      <PopularSection items={popularItems} />

      <TestimonialsSection />
    </PageWrapper>
  );
}

/* ───────────────────────────  HERO  ─────────────────────────── */

const Hero = ({ search, setSearch }: { search: string; setSearch: (v: string) => void }) => {
  // Top dishes for the carousel
  const heroItems = POPULAR_TODAY.map((item) => {
    const r = MOCK_RESTAURANTS.find((x) => x.id === item.restaurantId)!;
    return { item, restaurantName: r.name, restaurantId: r.id };
  });

  return (
    <section className="relative bg-gradient-to-b from-surface-soft to-background pt-10 sm:pt-14 pb-16 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="live" className="text-xs">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Cafeteria Open Now
          </Badge>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
            Order from your favourite{" "}
            <span className="text-accent-red">UST cafeteria</span>,
            <br className="hidden sm:block" /> delivered to your floor
          </h1>

          <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Skip the cafeteria queue — fresh food from 8 campus restaurants straight to your desk.
          </p>

          {/* Search */}
          <form
            className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-2"
            onSubmit={(e) => { e.preventDefault(); /* search is wired on the listing page */ }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-secondary pointer-events-none" />
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or dishes..."
                className="pl-10 h-12 shadow-card"
                aria-label="Search restaurants or dishes"
              />
            </div>
            <Button asChild variant="amber" size="lg" className="sm:w-auto w-full">
              <Link to={`/restaurants${search ? `?q=${encodeURIComponent(search)}` : ""}`}>
                Browse Restaurants
              </Link>
            </Button>
          </form>

          {/* Stat chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline">8 Restaurants</Badge>
            <Badge variant="outline">Avg. 15 min delivery</Badge>
            <Badge variant="outline">Free delivery on campus</Badge>
          </div>
        </div>

        {/* Food carousel */}
        <div className="mt-14 sm:mt-16">
          <FoodCarousel items={heroItems} />
        </div>
      </div>
    </section>
  );
};

/* ───────────────────────────  WHY  ─────────────────────────── */

const FEATURES = [
  { icon: Building2, title: "Campus Only", body: "Exclusively for UST employees across all floors." },
  { icon: Zap, title: "Fast Delivery", body: "Average delivery time under 20 minutes." },
  { icon: Utensils, title: "8 Cafeterias", body: "Every cafeteria on campus, one platform." },
  { icon: MapPin, title: "Live Tracking", body: "Track your order floor by floor in real time." },
];

const WhySection = () => (
  <section className="py-16 sm:py-20 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-amber font-semibold">Why USTBite</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">
          Built for the way UST works
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <Card key={title} interactive className="p-6">
            <div className="size-11 rounded-md bg-brand-amber-soft flex items-center justify-center text-brand-amber">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────  FEATURED RESTAURANTS  ───────────────────── */

const FeaturedRestaurantsSection = ({
  restaurants,
  loading,
}: {
  restaurants: Restaurant[];
  loading: boolean;
}) => (
  <section className="py-16 sm:py-20 bg-surface-soft">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-amber font-semibold">On Campus</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">
            Cafeteria Restaurants
          </h2>
        </div>
        <Button asChild variant="outline" size="md">
          <Link to="/restaurants">See All <ArrowRight className="size-4" /></Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <RestaurantSkeleton key={i} />)
          : restaurants.slice(0, 4).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
      </div>
    </div>
  </section>
);

const RestaurantSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3 mt-3" />
    </div>
  </Card>
);

/* ─────────────────────  POPULAR TODAY  ───────────────────── */

const PopularSection = ({
  items,
}: {
  items: { item: import("@/types").MenuItem; restaurantName: string; restaurantId: string }[];
}) => {
  const scrollRef = useState<HTMLDivElement | null>(null);
  const [el, setEl] = scrollRef;

  const scroll = (dir: "left" | "right") => {
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-amber font-semibold">Trending Now</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">
              Popular on Campus Today
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="size-10 rounded-md border border-border-soft bg-white hover:border-brand-amber hover:text-brand-amber transition-colors flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="size-10 rounded-md border border-border-soft bg-white hover:border-brand-amber hover:text-brand-amber transition-colors flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={setEl}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth snap-x"
        >
          {items.map(({ item, restaurantName, restaurantId }) => (
            <Link
              key={item.id}
              to={`/restaurants/${restaurantId}`}
              className="snap-start shrink-0 w-64 sm:w-72 group"
            >
              <Card interactive className="overflow-hidden h-full">
                <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-brand-amber font-semibold uppercase tracking-wider">{restaurantName}</p>
                  <h3 className="mt-1 font-semibold text-foreground line-clamp-1">{item.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">{formatINR(item.price)}</span>
                    <span className="text-xs text-text-secondary">{item.category}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────  TESTIMONIALS  ───────────────────── */

const TESTIMONIALS = [
  {
    quote: "USTBite has completely changed how our floor handles lunch breaks. No more queues, no more waiting — just great food at our desks.",
    name: "Krishna Sudheendra",
    title: "CEO, UST",
  },
  {
    quote: "As someone who manages hundreds of employees, seeing a tool that genuinely improves their daily experience at work makes me proud. USTBite is that tool.",
    name: "Colleen Doherty",
    title: "Chief People Officer, UST",
  },
  {
    quote: "The operational efficiency we've gained since rolling out USTBite across floors has been remarkable. Smart, seamless, and built for us.",
    name: "Alexander Varghese",
    title: "Chief Operating Officer, UST",
  },
];

const TestimonialsSection = () => (
  <section className="py-16 sm:py-20 bg-surface-soft">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-amber font-semibold">Loved by leaders</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">
          What Our Users Say
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} className="p-6 border-l-[3px] border-l-brand-amber flex flex-col">
            <p className="text-sm text-foreground leading-relaxed flex-1">
              <span className="text-brand-amber font-display text-2xl leading-none">“</span>
              {t.quote}
              <span className="text-brand-amber font-display text-2xl leading-none">”</span>
            </p>
            <div className="mt-5 pt-5 border-t border-border-soft flex items-center gap-3">
              <Avatar name={t.name} />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

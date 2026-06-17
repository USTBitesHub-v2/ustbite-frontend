import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { formatINR } from "@/utils/formatters";

/**
 * FoodCarousel — landing-page hero carousel.
 * Inspired by the photographer portfolio's HoverExpand_001 (kept on this site)
 * but reworked for dish cards: price chip, restaurant byline, amber accents.
 */

type Breakpoint = "mobile" | "smallTablet" | "largeTablet" | "desktop";

const useBreakpoint = (): Breakpoint => {
  const get = (): Breakpoint => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 900) return "smallTablet";
    if (w < 1280) return "largeTablet";
    return "desktop";
  };
  const [bp, setBp] = useState<Breakpoint>(get);
  useEffect(() => {
    const onResize = () => setBp(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return bp;
};

interface FoodCarouselProps {
  items: { item: MenuItem; restaurantName: string; restaurantId: string }[];
  className?: string;
  initialActive?: number;
}

export const FoodCarousel = ({ items, className, initialActive = 1 }: FoodCarouselProps) => {
  const [active, setActive] = useState<number>(initialActive);
  const breakpoint = useBreakpoint();

  // Auto-advance on tablet & desktop, paused on hover
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (breakpoint === "mobile" || paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % Math.min(items.length, configFor(breakpoint).numVisible));
    }, 3500);
    return () => clearInterval(id);
  }, [breakpoint, paused, items.length]);

  const config = configFor(breakpoint);

  if (config.layout === "list") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex flex-col gap-3">
          {items.slice(0, 4).map(({ item, restaurantName, restaurantId }, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative w-full overflow-hidden rounded-md border border-border-card shadow-card"
              style={{ height: "14rem" }}
            >
              <Link to={`/restaurants/${restaurantId}`} className="block size-full">
                <img src={item.image} alt={item.name} className="size-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-base font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-white/80 truncate">{restaurantName}</p>
                    </div>
                    <span className="bg-brand-amber text-brand-navy font-bold text-sm px-2.5 py-1 rounded-md shrink-0">
                      {formatINR(item.price)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("relative w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={cn("w-full mx-auto", "maxWidth" in config ? config.maxWidth : "")}>
        <div className={cn("flex w-full items-center justify-center", config.gap)}>
          {items.slice(0, config.numVisible).map(({ item, restaurantName, restaurantId }, idx) => {
            const isActive = active === idx;
            const width =
              "expandedWidth" in config
                ? isActive ? config.expandedWidth : config.collapsedWidth
                : isActive ? `${config.expandedPercent}%` : `${config.collapsedPercent}%`;

            const initialWidth = "expandedWidth" in config ? config.collapsedWidth : `${config.collapsedPercent}%`;

            return (
              <motion.div
                key={item.id}
                className="relative cursor-pointer overflow-hidden rounded-2xl shadow-card group"
                initial={{ width: initialWidth, height: "18rem" }}
                animate={{ width, height: config.height }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onClick={() => setActive(idx)}
                onHoverStart={() => setActive(idx)}
              >
                <Link to={`/restaurants/${restaurantId}`} className="block size-full">
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/15 to-transparent" />

                  {/* Always visible: price chip on collapsed cards */}
                  {!isActive && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-brand-amber text-brand-navy font-bold text-xs px-2 py-1 rounded-md">
                        {formatINR(item.price)}
                      </span>
                    </div>
                  )}

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute inset-x-0 bottom-0 p-5 text-white"
                      >
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wider text-brand-amber font-semibold mb-1">
                              {restaurantName}
                            </p>
                            <h3 className="font-display text-xl md:text-2xl font-bold truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-white/80 line-clamp-1 mt-1 max-w-md">
                              {item.description}
                            </p>
                          </div>
                          <span className="bg-brand-amber text-brand-navy font-bold text-sm px-3 py-1.5 rounded-md shrink-0">
                            {formatINR(item.price)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

function configFor(bp: Breakpoint) {
  return {
    mobile: { layout: "list" as const, numVisible: 4, height: "16rem", gap: "gap-3" },
    smallTablet: { layout: "horizontal" as const, numVisible: 4, expandedPercent: 46, collapsedPercent: 18, height: "20rem", gap: "gap-2" },
    largeTablet: { layout: "horizontal" as const, numVisible: 5, expandedPercent: 40, collapsedPercent: 15, height: "22rem", gap: "gap-3" },
    desktop: { layout: "horizontal" as const, numVisible: 6, expandedWidth: "26rem", collapsedWidth: "8rem", height: "26rem", gap: "gap-3", maxWidth: "max-w-[1200px]" },
  }[bp];
}

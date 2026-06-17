import { Link } from "react-router-dom";
import { Star, Clock, IndianRupee } from "lucide-react";
import type { Restaurant } from "@/types";
import { Card } from "@/components/ui/ust/Card";
import { Badge } from "@/components/ui/ust/Badge";
import { formatINR } from "@/utils/formatters";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => (
  <Link to={`/restaurants/${restaurant.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber rounded-md">
    <Card interactive className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          {restaurant.isOpen ? (
            <Badge variant="live">
              <span className="size-1.5 rounded-full bg-success" />
              Open Now
            </Badge>
          ) : (
            <Badge variant="danger">Closed</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-semibold text-foreground">
          <Star className="size-3 fill-brand-amber text-brand-amber" />
          {restaurant.rating}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-base leading-tight">{restaurant.name}</h3>
        <p className="mt-1 text-xs text-text-secondary line-clamp-1">{restaurant.cuisine}</p>
        <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-between text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {restaurant.deliveryTime}
          </span>
          <span className="inline-flex items-center">
            <IndianRupee className="size-3" />
            {restaurant.minOrder} min
          </span>
        </div>
      </div>
    </Card>
  </Link>
);

import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/types";
import { Button } from "@/components/ui/ust/Button";
import { Card } from "@/components/ui/ust/Card";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/utils/formatters";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
  restaurantName: string;
}

export const MenuItemCard = ({ item, restaurantName }: MenuItemCardProps) => {
  const qty = useCartStore((s) => s.qtyOf(item.id));
  const add = useCartStore((s) => s.add);
  const decrement = useCartStore((s) => s.decrement);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      navigate("/login");
      return;
    }
    add(item, restaurantName);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <Card className="overflow-hidden flex gap-4 p-4 items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`size-3.5 border-2 flex items-center justify-center rounded-sm ${
              item.veg ? "border-success" : "border-accent-red"
            }`}
            aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
          >
            <span className={`size-1.5 rounded-full ${item.veg ? "bg-success" : "bg-accent-red"}`} />
          </span>
          <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
        </div>
        <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">{item.description}</p>
        <p className="mt-2 text-base font-semibold text-foreground">{formatINR(item.price)}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        <div className="size-20 sm:size-24 rounded-md overflow-hidden bg-surface-soft">
          <img src={item.image} alt={item.name} loading="lazy" className="size-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
        </div>
        {qty > 0 ? (
          <div className="flex items-center gap-1.5 bg-brand-amber rounded-md text-brand-navy px-1 h-9">
            <button onClick={() => decrement(item.id)} className="px-1.5 hover:bg-black/10 rounded h-full" aria-label="Decrease quantity">
              <Minus className="size-4" />
            </button>
            <span className="font-bold w-6 text-center text-sm">{qty}</span>
            <button onClick={handleAdd} className="px-1.5 hover:bg-black/10 rounded h-full" aria-label="Increase quantity">
              <Plus className="size-4" />
            </button>
          </div>
        ) : (
          <Button size="sm" variant="amber" onClick={handleAdd}>
            <Plus className="size-4" />Add
          </Button>
        )}
      </div>
    </Card>
  );
};

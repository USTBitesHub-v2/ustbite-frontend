import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cartService } from "@/services/cartService";
import { Button } from "@/components/ui/ust/Button";
import { Card } from "@/components/ui/ust/Card";
import { formatINR } from "@/utils/formatters";

interface CartPanelProps {
  variant?: "sidebar" | "sheet";
}

export const CartPanel = ({ variant = "sidebar" }: CartPanelProps) => {
  const { items, restaurantName, subtotal, itemCount, add, decrement, remove } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await cartService.sync(items);
    } catch {
    }
    navigate("/cart");
  };
  const total = subtotal();
  const count = itemCount();

  if (count === 0) {
    return (
      <Card className={variant === "sidebar" ? "p-6 sticky top-24" : "p-4"}>
        <div className="text-center py-6">
          <div className="mx-auto size-12 rounded-full bg-surface-soft flex items-center justify-center mb-3">
            <ShoppingBag className="size-5 text-text-secondary" />
          </div>
          <p className="font-semibold text-foreground">Your cart is empty</p>
          <p className="text-sm text-text-secondary mt-1">Add items to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={variant === "sidebar" ? "p-5 sticky top-24" : "p-4"}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-brand-amber font-semibold">Your Cart</p>
          <p className="text-sm font-semibold text-foreground line-clamp-1">{restaurantName}</p>
        </div>
        <span className="bg-surface-soft text-foreground text-xs font-semibold px-2 py-1 rounded-md">
          {count} item{count > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto -mx-1 px-1 hide-scrollbar">
        {items.map(({ menuItem, qty }) => (
          <div key={menuItem.id} className="flex items-center gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{menuItem.name}</p>
              <p className="text-xs text-text-secondary">{formatINR(menuItem.price)} × {qty}</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-soft rounded-md h-8">
              <button onClick={() => decrement(menuItem.id)} className="px-2 hover:bg-border-soft rounded-l-md h-full" aria-label="Decrease">
                <Minus className="size-3.5" />
              </button>
              <span className="text-xs font-bold w-5 text-center">{qty}</span>
              <button onClick={() => add(menuItem, restaurantName ?? "")} className="px-2 hover:bg-border-soft rounded-r-md h-full" aria-label="Increase">
                <Plus className="size-3.5" />
              </button>
            </div>
            <button onClick={() => remove(menuItem.id)} className="p-1 text-text-secondary hover:text-accent-red" aria-label="Remove">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border-soft">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-secondary">Subtotal</span>
          <span className="text-base font-bold text-foreground">{formatINR(total)}</span>
        </div>
        <Button variant="amber" className="w-full" onClick={handleCheckout}>
          Proceed to checkout
        </Button>
      </div>
    </Card>
  );
};

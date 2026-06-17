import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ShoppingCart, User as UserIcon, Sparkles, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/ust/Button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const NAV_LINKS = [
  { to: "/restaurants", label: "Restaurants" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/orders", label: "Track Order" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-soft">
      {/* Thin amber 3px top border per brand */}
      <div className="h-[3px] w-full bg-brand-amber" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "px-3.5 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-brand-navy bg-surface-soft"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-soft",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/assistant"
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                  isActive
                    ? "text-brand-amber bg-brand-amber-soft"
                    : "text-text-secondary hover:text-brand-amber hover:bg-brand-amber-soft",
                )
              }
            >
              <Sparkles className="size-3.5" />
              AI Order
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                    isActive
                      ? "text-brand-navy bg-surface-soft"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-soft",
                  )
                }
              >
                <LayoutDashboard className="size-3.5" />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-surface-soft transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-red text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile" aria-label="Profile">
                    <UserIcon className="size-4" />
                    <span>{user?.fullName.split(" ")[0]}</span>
                  </Link>
                </Button>
                <Button variant="subtle" size="sm" onClick={() => { logout(); navigate("/"); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
                <Button asChild variant="amber" size="sm"><Link to="/register">Sign Up</Link></Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:bg-surface-soft"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border-soft py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2.5 rounded-md text-sm font-medium",
                    isActive ? "bg-surface-soft text-foreground" : "text-text-secondary hover:bg-surface-soft hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-text-secondary hover:bg-surface-soft">
              Cart {itemCount > 0 && <span className="ml-1 text-accent-red font-semibold">({itemCount})</span>}
            </Link>
            <Link to="/assistant" onClick={() => setOpen(false)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-sm font-medium text-text-secondary hover:bg-brand-amber-soft hover:text-brand-amber">
              <Sparkles className="size-3.5" /> AI Order
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-sm font-medium text-text-secondary hover:bg-surface-soft hover:text-foreground">
                <LayoutDashboard className="size-3.5" /> Admin
              </Link>
            )}
            <div className="border-t border-border-soft pt-3 mt-2 flex gap-2 px-1">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="flex-1"><Link to="/profile" onClick={() => setOpen(false)}>Profile</Link></Button>
                  <Button variant="subtle" size="sm" className="flex-1" onClick={() => { logout(); setOpen(false); navigate("/"); }}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="flex-1"><Link to="/login" onClick={() => setOpen(false)}>Login</Link></Button>
                  <Button asChild variant="amber" size="sm" className="flex-1"><Link to="/register" onClick={() => setOpen(false)}>Sign Up</Link></Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

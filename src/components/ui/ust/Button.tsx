import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "amber" | "outline" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  // CTA: vibrant red per brand spec (also used as the primary action color)
  primary:
    "bg-accent-red text-white hover:bg-accent-red/90 active:bg-accent-red/95 shadow-card",
  // Amber for highlight CTAs (Browse Restaurants, Add to Cart)
  amber:
    "bg-brand-amber text-brand-navy hover:bg-brand-amber/90 active:bg-brand-amber/95 font-semibold shadow-card",
  outline:
    "border border-brand-amber text-brand-amber bg-transparent hover:bg-brand-amber/10",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-soft",
  subtle:
    "bg-surface-soft text-foreground hover:bg-border-soft",
  danger:
    "bg-accent-red text-white hover:bg-accent-red/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

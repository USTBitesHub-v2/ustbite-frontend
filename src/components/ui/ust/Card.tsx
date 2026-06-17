import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-md border border-border-card shadow-card",
        interactive &&
          "transition-all duration-200 hover:shadow-card-hover hover:border-brand-amber/40 cursor-pointer",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

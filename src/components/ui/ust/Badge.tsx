import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "amber" | "amberSoft" | "success" | "danger" | "neutral" | "outline" | "live";

const variants: Record<BadgeVariant, string> = {
  amber: "bg-brand-amber text-brand-navy",
  amberSoft: "bg-brand-amber-soft text-[hsl(38_92%_30%)]",
  success: "bg-success/15 text-[hsl(142_71%_28%)]",
  danger: "bg-accent-red/15 text-accent-red",
  neutral: "bg-surface-soft text-text-secondary",
  outline: "border border-brand-amber text-brand-amber bg-transparent",
  live: "bg-brand-amber-soft text-[hsl(38_92%_30%)] inline-flex items-center gap-1.5",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({ className, variant = "neutral", children, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-tight",
      variants[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

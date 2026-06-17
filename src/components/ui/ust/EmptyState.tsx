import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/ust/Button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon, title, description, ctaLabel, ctaTo, onCta, className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      "bg-surface-soft rounded-md border border-dashed border-border-soft",
      className,
    )}
  >
    {icon && <div className="mb-4 text-text-secondary">{icon}</div>}
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="mt-1.5 text-sm text-text-secondary max-w-sm">{description}</p>
    )}
    {ctaLabel && (ctaTo || onCta) && (
      <div className="mt-6">
        {ctaTo ? (
          <Button asChild variant="amber"><Link to={ctaTo}>{ctaLabel}</Link></Button>
        ) : (
          <Button variant="amber" onClick={onCta}>{ctaLabel}</Button>
        )}
      </div>
    )}
  </div>
);

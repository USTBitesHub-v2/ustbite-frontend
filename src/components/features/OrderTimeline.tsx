import { Check } from "lucide-react";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PLACED", label: "Order Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

interface OrderTimelineProps {
  current: OrderStatus;
}

const indexOf = (s: OrderStatus) =>
  STEPS.findIndex((step) => step.status === s);

export const OrderTimeline = ({ current }: OrderTimelineProps) => {
  const currentIdx = Math.max(0, indexOf(current));

  return (
    <>
      {/* Horizontal — desktop */}
      <div className="hidden md:flex items-start justify-between w-full">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIdx;
          const isActive = idx === currentIdx;
          return (
            <div key={step.status} className="flex-1 flex flex-col items-center text-center">
              <div className="flex items-center w-full">
                <div className={cn("flex-1 h-0.5", idx === 0 ? "invisible" : isComplete || isActive ? "bg-brand-amber" : "bg-border-soft")} />
                <div
                  className={cn(
                    "size-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border-2",
                    isComplete && "bg-success border-success text-white",
                    isActive && "bg-brand-amber border-brand-amber text-brand-navy",
                    !isComplete && !isActive && "bg-white border-border-soft text-text-secondary",
                  )}
                >
                  {isComplete ? <Check className="size-4" /> : idx + 1}
                </div>
                <div className={cn("flex-1 h-0.5", idx === STEPS.length - 1 ? "invisible" : isComplete ? "bg-brand-amber" : "bg-border-soft")} />
              </div>
              <p className={cn("mt-2 text-xs font-medium", isActive ? "text-foreground" : "text-text-secondary")}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Vertical — mobile */}
      <div className="md:hidden flex flex-col">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIdx;
          const isActive = idx === currentIdx;
          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 shrink-0",
                    isComplete && "bg-success border-success text-white",
                    isActive && "bg-brand-amber border-brand-amber text-brand-navy",
                    !isComplete && !isActive && "bg-white border-border-soft text-text-secondary",
                  )}
                >
                  {isComplete ? <Check className="size-3.5" /> : idx + 1}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn("w-0.5 flex-1 my-1", isComplete ? "bg-brand-amber" : "bg-border-soft")} />
                )}
              </div>
              <div className="pb-6">
                <p className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-text-secondary")}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

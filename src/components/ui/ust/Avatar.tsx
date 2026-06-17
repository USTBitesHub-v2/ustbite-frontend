import { initials } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-lg",
};

export const Avatar = ({ name, size = "md", className }: AvatarProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "rounded-full bg-brand-amber text-white font-semibold flex items-center justify-center",
      sizes[size],
      className,
    )}
  >
    {initials(name)}
  </div>
);

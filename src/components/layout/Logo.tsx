import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  className?: string;
}

const textSize = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };
const squareSize = { sm: "size-7", md: "size-8", lg: "size-10" };

export const Logo = ({ size = "md", variant = "dark", className }: LogoProps) => (
  <Link to="/" className={cn("inline-flex items-center gap-2 group", className)} aria-label="USTBite home">
    <span
      className={cn(
        "rounded-md bg-brand-amber text-brand-navy flex items-center justify-center font-bold",
        squareSize[size],
      )}
      aria-hidden="true"
    >
      U
    </span>
    <span
      className={cn(
        "font-display font-bold tracking-tight",
        textSize[size],
        variant === "light" ? "text-white" : "text-foreground",
      )}
    >
      USTBite
    </span>
  </Link>
);

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export default function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-brand-cream-2 overflow-hidden",
        variant === "elevated" && "shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

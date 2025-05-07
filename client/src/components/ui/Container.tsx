import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: "default" | "sm" | "lg" | "xl";
}

export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-6xl",
    lg: "max-w-7xl",
    xl: "container",
  };

  return (
    <Component
      className={cn(
        "mx-auto px-4 sm:px-6 md:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Container;

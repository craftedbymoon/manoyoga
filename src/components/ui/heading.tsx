import * as React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const sizeClasses = {
  xs: "text-sm font-semibold tracking-wide uppercase text-accent",
  sm: "text-lg font-medium md:text-xl",
  base: "text-xl font-semibold md:text-2xl",
  lg: "text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl",
  xl: "text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl",
  "2xl": "text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl",
  "3xl": "text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl",
  "4xl": "text-6xl font-extrabold tracking-tight md:text-7xl lg:text-8xl",
};

export function Heading({
  level = 2,
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as React.ElementType;
  
  const defaultSizeMap: Record<number, keyof typeof sizeClasses> = {
    1: "xl",
    2: "lg",
    3: "base",
    4: "sm",
    5: "xs",
    6: "xs",
  };
  
  const headingSize = size || defaultSizeMap[level] || "lg";

  return (
    <Component
      className={cn(
        "font-sans text-foreground tracking-tight scroll-m-20",
        sizeClasses[headingSize],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

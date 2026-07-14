import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Section({
  as: Component = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn("py-12 md:py-20 lg:py-24 overflow-hidden", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

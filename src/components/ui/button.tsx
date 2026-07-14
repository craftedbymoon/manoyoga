"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "default" | "lg" | "icon";

type CustomButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>;

interface ButtonProps extends CustomButtonProps, Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", whileHover, whileTap, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      outline: "border border-border bg-background hover:bg-accent/10 hover:text-accent-foreground",
      ghost: "hover:bg-accent/10 hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
    };

    const sizes = {
      sm: "h-9 px-3 rounded-md text-xs",
      default: "h-11 px-6 rounded-md",
      lg: "h-12 px-8 rounded-md text-base",
      icon: "h-10 w-10 rounded-full",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={whileHover ?? { scale: 1.02 }}
        whileTap={whileTap ?? { scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

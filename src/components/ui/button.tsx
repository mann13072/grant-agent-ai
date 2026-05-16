"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-[#00C896] text-[#0A0F1E] font-semibold hover:bg-[#00b386] active:bg-[#00a37a]",
      ghost: "bg-transparent text-white/80 hover:bg-white/10 active:bg-white/20",
      outline:
        "bg-transparent border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40",
      danger: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 text-sm rounded-xl",
      lg: "px-6 py-3 text-base rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

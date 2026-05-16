"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "violet" | "amber" | "error" | "muted";
  pulse?: boolean;
  className?: string;
}

export function Badge({ children, variant = "default", pulse, className }: BadgeProps) {
  const variants = {
    default: "bg-gray-500/20 text-gray-400",
    accent: "bg-emerald-500/20 text-emerald-400",
    violet: "bg-violet-500/20 text-violet-400",
    amber: "bg-amber-500/20 text-amber-400",
    error: "bg-red-500/20 text-red-400",
    muted: "bg-white/5 text-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

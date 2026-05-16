import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export const GRANT_TYPE_LABELS: Record<string, string> = {
  ZIM_INDIVIDUAL: "ZIM Individual",
  ZIM_COOPERATION: "ZIM Cooperation",
  EXIST_STARTUP: "EXIST Start-up Grant",
  EXIST_TRANSFER: "EXIST Transfer",
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; pulse?: boolean }
> = {
  DRAFT: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/20" },
  GENERATING: {
    label: "Generating",
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    pulse: true,
  },
  REVIEW: {
    label: "Review",
    color: "text-violet-400",
    bg: "bg-violet-500/20",
  },
  FINALIZED: {
    label: "Finalized",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  SUBMITTED: { label: "Submitted", color: "text-blue-400", bg: "bg-blue-500/20" },
};

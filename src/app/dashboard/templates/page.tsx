"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Library, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dummyTemplates } from "@/data/dummy-applications";
import { GRANT_TYPE_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const grantTypeBadgeVariant: Record<string, "default" | "accent" | "violet" | "amber"> = {
  ZIM_INDIVIDUAL: "accent",
  ZIM_COOPERATION: "violet",
  EXIST_STARTUP: "amber",
  EXIST_TRANSFER: "amber",
};

const sectorColors: Record<string, string> = {
  Automotive: "bg-blue-500/15 text-blue-400",
  "AI/ML": "bg-violet-500/15 text-violet-400",
  DeepTech: "bg-indigo-500/15 text-indigo-400",
  Robotics: "bg-cyan-500/15 text-cyan-400",
  BioTech: "bg-pink-500/15 text-pink-400",
  CleanTech: "bg-emerald-500/15 text-emerald-400",
};

export default function TemplatesPage() {
  const [query, setQuery] = useState("");

  const filtered = dummyTemplates.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.sector.toLowerCase().includes(q) ||
      t.grantType.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Template Library</h1>
        <p className="text-gray-400 text-sm mt-1">
          Pre-built, approved grant templates — use one as your starting point.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search templates by name, sector, or grant type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#141926] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C896]/50 transition-all duration-150"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500">
        {filtered.length} template{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((template) => {
          const grantVariant = grantTypeBadgeVariant[template.grantType] ?? "default";
          const sectorClass = sectorColors[template.sector] ?? "bg-gray-500/15 text-gray-400";

          return (
            <div
              key={template.id}
              className="glass-card p-5 flex flex-col group hover:border-[#00C896]/30 transition-all duration-200"
            >
              {/* Icon + Approved badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00C896]/10 flex items-center justify-center">
                  <Library className="w-5 h-5 text-[#00C896]" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{template.name}</h3>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-4 flex-1 leading-relaxed">{template.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={grantVariant}>
                  {GRANT_TYPE_LABELS[template.grantType] ?? template.grantType}
                </Badge>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", sectorClass)}>
                  {template.sector}
                </span>
              </div>

              {/* Grant amount */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500">Approx. grant</span>
                <span className="text-sm font-semibold text-[#00C896]">{template.approximateGrant}</span>
              </div>

              {/* CTA */}
              <Link href="/dashboard/applications/new">
                <Button variant="outline" size="sm" className="w-full justify-center gap-2">
                  Use as Starting Point
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Library className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">No templates match your search</p>
          <p className="text-gray-600 text-sm mt-1">Try a different keyword.</p>
        </div>
      )}
    </div>
  );
}

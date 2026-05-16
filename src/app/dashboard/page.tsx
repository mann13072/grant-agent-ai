"use client";

import Link from "next/link";
import { FileText, Clock, CheckCircle, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dummyApplications } from "@/data/dummy-applications";
import { formatCurrency, formatDate, GRANT_TYPE_LABELS, STATUS_CONFIG } from "@/lib/utils";

const statCards = [
  {
    label: "Total Applications",
    value: "3",
    icon: FileText,
    iconColor: "text-[#7C5CFC]",
    iconBg: "bg-[#7C5CFC]/10",
    trend: "+1 this month",
    trendUp: true,
  },
  {
    label: "In Progress",
    value: "1",
    icon: Clock,
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    trend: "1 in review",
    trendUp: true,
  },
  {
    label: "Finalized",
    value: "1",
    icon: CheckCircle,
    iconColor: "text-[#00C896]",
    iconBg: "bg-[#00C896]/10",
    trend: "Ready to submit",
    trendUp: true,
  },
  {
    label: "Total Grant Value",
    value: "€743K",
    icon: TrendingUp,
    iconColor: "text-[#00C896]",
    iconBg: "bg-[#00C896]/10",
    trend: "+€112K this month",
    trendUp: true,
  },
];

const statusVariantMap: Record<string, "default" | "amber" | "violet" | "accent"> = {
  DRAFT: "default",
  GENERATING: "amber",
  REVIEW: "violet",
  FINALIZED: "accent",
  SUBMITTED: "accent",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Dr. Müller — here&apos;s your grant pipeline at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, iconColor, iconBg, trend, trendUp }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  trendUp ? "text-[#00C896]" : "text-red-400"
                }`}
              >
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Main content: recent applications + quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="xl:col-span-2">
          <Card className="p-0 overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-0 mb-0 flex flex-row items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Link href="/dashboard/applications">
                <span className="text-xs text-[#00C896] hover:underline">View all →</span>
              </Link>
            </CardHeader>
            <div className="divide-y divide-white/5 mt-4">
              {dummyApplications.map((app) => {
                const statusCfg = STATUS_CONFIG[app.status];
                const variant = statusVariantMap[app.status] ?? "default";
                return (
                  <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
                    <div className="flex items-start gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-150 cursor-pointer">
                      {/* Left: title + badges */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate mb-1.5">{app.title}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="muted">{GRANT_TYPE_LABELS[app.grantType] ?? app.grantType}</Badge>
                          <Badge variant={variant} pulse={app.status === "GENERATING"}>
                            {statusCfg?.label ?? app.status}
                          </Badge>
                        </div>
                      </div>
                      {/* Right: amount + date */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#00C896]">
                          {formatCurrency(app.financials.grantAmount, true)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(app.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <Link href="/dashboard/applications/new?type=ZIM_INDIVIDUAL" className="block">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#00C896]/10 border border-white/10 hover:border-[#00C896]/30 text-left transition-all duration-150 group">
                  <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-[#00C896]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#00C896] transition-colors">
                      New ZIM Application
                    </p>
                    <p className="text-xs text-gray-500">ZIM Individual grant</p>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/applications/new?type=EXIST_TRANSFER" className="block">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#7C5CFC]/10 border border-white/10 hover:border-[#7C5CFC]/30 text-left transition-all duration-150 group">
                  <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-[#7C5CFC]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#7C5CFC] transition-colors">
                      New EXIST Application
                    </p>
                    <p className="text-xs text-gray-500">EXIST Transfer / Startup</p>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/financial" className="block">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#F59E0B]/10 border border-white/10 hover:border-[#F59E0B]/30 text-left transition-all duration-150 group">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#F59E0B] transition-colors">
                      Open Financial Calculator
                    </p>
                    <p className="text-xs text-gray-500">Estimate grant amounts</p>
                  </div>
                </button>
              </Link>
            </div>

            {/* Summary strip */}
            <div className="mt-6 p-3 rounded-xl bg-[#00C896]/5 border border-[#00C896]/20">
              <p className="text-xs text-gray-400">
                <span className="text-[#00C896] font-semibold">€743K</span> total non-dilutive funding across{" "}
                <span className="text-white font-medium">3</span> applications.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

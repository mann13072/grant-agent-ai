"use client";

import { dummyApplications } from "@/data/dummy-applications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, GRANT_TYPE_LABELS, STATUS_CONFIG } from "@/lib/utils";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = dummyApplications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["ALL", "DRAFT", "GENERATING", "REVIEW", "FINALIZED", "SUBMITTED"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-sm text-gray-400 mt-1">
            {dummyApplications.length} total applications
          </p>
        </div>
        <Link href="/dashboard/applications/new">
          <Button variant="primary">
            <Plus size={16} />
            New Application
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00C896]/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => {
            const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? "bg-[#00C896]/20 text-[#00C896] border border-[#00C896]/40"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                {s === "ALL" ? "All" : cfg?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Grant Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Grant Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((app) => {
              const statusCfg = STATUS_CONFIG[app.status];
              return (
                <tr
                  key={app.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{app.title}</p>
                      <p className="text-xs text-gray-500">{app.companyName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-300">
                      {GRANT_TYPE_LABELS[app.grantType]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}
                    >
                      {statusCfg.pulse && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                        </span>
                      )}
                      {statusCfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-mono text-white">
                      {formatCurrency(app.financials.grantAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">
                      {formatDate(app.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/applications/${app.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}

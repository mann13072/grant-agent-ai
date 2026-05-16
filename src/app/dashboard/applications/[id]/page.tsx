"use client";

import { use } from "react";
import { dummyApplications } from "@/data/dummy-applications";
import { dummyNarrative, dummyFinancialTableData } from "@/data/dummy-narrative";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, GRANT_TYPE_LABELS, STATUS_CONFIG } from "@/lib/utils";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const app = dummyApplications.find((a) => a.id === id) ?? dummyApplications[0];
  const statusCfg = STATUS_CONFIG[app.status];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{app.title}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {app.companyName} · {GRANT_TYPE_LABELS[app.grantType]} ·{" "}
            {formatDate(app.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={14} />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} />
            Export DOCX
          </Button>
          <Button variant="ghost" size="sm">
            <RefreshCw size={14} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Narrative */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[#00C896]" />
            <h2 className="text-lg font-bold text-white">Generated Narrative</h2>
            <span className="ml-auto text-xs text-gray-500">Behördendeutsch</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-german max-h-[600px] overflow-y-auto pr-2"
            style={{ fontFamily: "var(--font-noto-serif), Georgia, serif" }}
          >
            {dummyNarrative}
          </div>
        </div>

        {/* Right: Financials */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="text-base font-bold text-white mb-4">Financial Summary</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                {dummyFinancialTableData.map((row) => (
                  <tr key={row.label} className={row.highlight ? "bg-white/5" : ""}>
                    <td className="py-2 pr-2 text-gray-400 text-xs">{row.label}</td>
                    <td className="py-2 text-right font-mono text-white font-medium">
                      {row.isPercent
                        ? `${(row.value * 100).toFixed(0)}%`
                        : formatCurrency(row.value)}
                    </td>
                    <td className="py-2 pl-2 w-5">
                      {row.status === "ok" ? (
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Non-dilutive capital highlight */}
          <div className="glass-card p-5 border border-[#00C896]/20">
            <p className="text-xs text-gray-400 mb-1">Total Non-Dilutive Capital Acquired</p>
            <p className="text-3xl font-bold text-[#00C896] font-mono">
              {formatCurrency(app.financials.totalNonDilutive)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Traditional consultant would charge:{" "}
              <span className="text-red-400 line-through">
                {formatCurrency(app.financials.consultantSavings)}
              </span>
            </p>
            <p className="text-xs text-[#00C896] mt-0.5">
              You saved: {formatCurrency(app.financials.consultantSavings)}
            </p>
          </div>

          {/* Team */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-3">Team</h3>
            <div className="space-y-2">
              {app.personnel.map((p) => (
                <div key={p.name} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-white">{p.name}</span>
                    <span className="text-gray-500 ml-1">· {p.role}</span>
                  </div>
                  <span className="text-gray-400 font-mono">
                    {p.allocationPercent}% · {p.monthsOnProject}mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="primary" size="sm" className="w-full">
              <Download size={14} />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Download size={14} />
              DOCX
            </Button>
            <Button variant="outline" size="sm" className="w-full col-span-2">
              <Download size={14} />
              XML (easy-Online)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

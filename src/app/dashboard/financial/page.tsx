"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { calculateZIM, CONSTRAINTS } from "@/lib/engine/zim-calculator";
import type { PersonnelEntry } from "@/types";

type GrantType = "individual" | "cooperation" | "exist";
type CompanySize = "micro" | "small" | "medium";
type Location = "west" | "east";

const ROLES: PersonnelEntry["role"][] = [
  "Project Lead",
  "Senior Engineer",
  "Junior Engineer",
  "Researcher",
  "Admin",
  "Lab Technician",
];

const FUNDING_RATES: Record<GrantType, Record<CompanySize, number>> = {
  individual: { micro: 0.45, small: 0.45, medium: 0.35 },
  cooperation: { micro: 0.55, small: 0.55, medium: 0.45 },
  exist: { micro: 0, small: 0, medium: 0 },
};

function fmt(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}

interface Row extends PersonnelEntry {
  id: string;
}

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "Senior Engineer",
    annualGrossSalary: 65000,
    allocationPercent: 100,
    monthsOnProject: 12,
  };
}

function rowEligibleCost(row: Row): number {
  const capped = Math.min(row.annualGrossSalary, CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR);
  return capped * (row.allocationPercent / 100) * (row.monthsOnProject / 12);
}

type StatusIcon = "ok" | "warn" | "error";

function StatusIcon({ status }: { status: StatusIcon }) {
  if (status === "ok") return <CheckCircle2 size={14} className="text-accent shrink-0" />;
  if (status === "warn") return <AlertTriangle size={14} className="text-amber shrink-0" />;
  return <XCircle size={14} className="text-error shrink-0" />;
}

export default function FinancialPage() {
  const [grantType, setGrantType] = useState<GrantType>("individual");
  const [companySize, setCompanySize] = useState<CompanySize>("small");
  const [location, setLocation] = useState<Location>("west");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [materialPct, setMaterialPct] = useState(50);
  const [subcontracting, setSubcontracting] = useState(0);
  const [partnerPersonMonths, setPartnerPersonMonths] = useState(0);
  const [totalPersonMonths, setTotalPersonMonths] = useState(0);

  const isEast = location === "east";

  const personnel: PersonnelEntry[] = rows.map((r) => ({
    name: r.name || "Unnamed",
    role: r.role,
    annualGrossSalary: r.annualGrossSalary,
    allocationPercent: r.allocationPercent,
    monthsOnProject: r.monthsOnProject,
  }));

  const summary =
    grantType !== "exist"
      ? calculateZIM({
          companySize,
          isEastGermany: isEast,
          grantType: grantType as "individual" | "cooperation",
          personnel,
          materialCostsPercent: materialPct,
          subcontractingCosts: subcontracting,
          partnerPersonMonths: grantType === "cooperation" ? partnerPersonMonths : undefined,
          totalPersonMonths: grantType === "cooperation" ? totalPersonMonths : undefined,
        })
      : null;

  const baseRate =
    grantType !== "exist"
      ? FUNDING_RATES[grantType][companySize] + (isEast ? 0.1 : 0)
      : 0;

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: string, field: keyof Row, value: string | number) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  const violations: string[] = [];
  if (summary?.violations.subcontracting) violations.push("Subcontracting exceeds 25% of personnel costs");
  if (summary?.violations.cooperation) violations.push(summary.violations.cooperation);
  if (summary?.violations.overCap) violations.push("Total eligible costs exceed ZIM programme cap");
  summary?.violations.salaryWarnings.forEach((w) => violations.push(w));

  const summaryRows: Array<{
    label: string;
    value: string;
    status: StatusIcon;
    highlight?: boolean;
    bold?: boolean;
  }> = summary
    ? [
        { label: "Total Personnel", value: fmt(summary.totalPersonnel), status: "ok" },
        {
          label: `Overhead (${materialPct}%)`,
          value: fmt(summary.overhead),
          status: materialPct > 80 ? "warn" : "ok",
        },
        {
          label: "Subcontracting",
          value: fmt(summary.subcontracting),
          status: summary.violations.subcontracting ? "error" : "ok",
        },
        {
          label: "Total Eligible",
          value: fmt(summary.totalEligible),
          status: summary.violations.overCap ? "warn" : "ok",
        },
        {
          label: "Funding Rate",
          value: fmtPct(Math.min(baseRate, 0.55)),
          status: "ok",
        },
        {
          label: "Grant Amount",
          value: fmt(summary.grantAmount),
          status: "ok",
          highlight: true,
        },
        { label: "Own Contribution", value: fmt(summary.ownContribution), status: "ok" },
        {
          label: "Forschungszulage Bonus",
          value: fmt(summary.forschungszulage),
          status: "ok",
        },
        {
          label: "Total Non-Dilutive Capital",
          value: fmt(summary.totalNonDilutive),
          status: "ok",
          highlight: true,
          bold: true,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-soft-white">Financial Calculator</h1>
          <p className="text-muted text-sm mt-1">
            Configure your project parameters to compute ZIM-eligible costs and funding potential.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── LEFT PANEL ── */}
          <div className="flex-[3] space-y-5 min-w-0">

            {/* Grant Type */}
            <section className="glass-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">Grant Type</h2>
              <div className="grid grid-cols-3 gap-2">
                {(["individual", "cooperation", "exist"] as GrantType[]).map((g) => {
                  const labels: Record<GrantType, string> = {
                    individual: "ZIM Individual",
                    cooperation: "ZIM Cooperation",
                    exist: "EXIST",
                  };
                  const active = grantType === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setGrantType(g)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        active
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-white/3 border-white/10 text-muted hover:border-white/20 hover:text-soft-white"
                      }`}
                    >
                      {labels[g]}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Company Size */}
            <section className="glass-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">Company Size</h2>
              <div className="grid grid-cols-3 gap-2">
                {(["micro", "small", "medium"] as CompanySize[]).map((s) => {
                  const labels: Record<CompanySize, string> = {
                    micro: "Micro (<10)",
                    small: "Small (<50)",
                    medium: "Medium (<250)",
                  };
                  const active = companySize === s;
                  const rate =
                    grantType !== "exist"
                      ? FUNDING_RATES[grantType][s] + (isEast ? 0.1 : 0)
                      : 0;
                  return (
                    <button
                      key={s}
                      onClick={() => setCompanySize(s)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border flex flex-col items-center gap-0.5 ${
                        active
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-white/3 border-white/10 text-muted hover:border-white/20 hover:text-soft-white"
                      }`}
                    >
                      <span>{labels[s]}</span>
                      {grantType !== "exist" && (
                        <span className={`text-xs ${active ? "text-accent/70" : "text-muted/70"}`}>
                          {fmtPct(Math.min(rate, 0.55))} funding
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Location */}
            <section className="glass-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">Location</h2>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isEast}
                    onChange={(e) => setLocation(e.target.checked ? "east" : "west")}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-white/10 peer-checked:bg-accent/30 border border-white/20 peer-checked:border-accent/50 transition-all" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-muted peer-checked:bg-accent peer-checked:translate-x-5 transition-all" />
                </div>
                <div>
                  <span className="text-sm text-soft-white font-medium">East Germany bonus</span>
                  <span className="text-xs text-muted ml-2">+10% funding rate</span>
                </div>
              </label>
              {isEast && (
                <p className="text-xs text-accent bg-accent/5 border border-accent/20 rounded px-2.5 py-1.5">
                  East Germany bonus applied: +10% additional funding rate
                </p>
              )}
            </section>

            {/* Personnel Table */}
            <section className="glass-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">Team Members</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-muted font-medium pb-2 pr-2 min-w-[120px]">Name</th>
                      <th className="text-left text-muted font-medium pb-2 pr-2 min-w-[130px]">Role</th>
                      <th className="text-left text-muted font-medium pb-2 pr-2 min-w-[110px]">Annual Gross (€)</th>
                      <th className="text-left text-muted font-medium pb-2 pr-2 w-16">FTE %</th>
                      <th className="text-left text-muted font-medium pb-2 pr-2 w-16">Months</th>
                      <th className="text-right text-muted font-medium pb-2 min-w-[90px]">Eligible Cost</th>
                      <th className="pb-2 w-6" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rows.map((row) => {
                      const eligible = rowEligibleCost(row);
                      const capped = row.annualGrossSalary > CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR;
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group"
                        >
                          <td className="py-2 pr-2">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => updateRow(row.id, "name", e.target.value)}
                              placeholder="Name"
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white placeholder-muted focus:outline-none focus:border-accent/40 transition-colors"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <select
                              value={row.role}
                              onChange={(e) => updateRow(row.id, "role", e.target.value)}
                              className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40 transition-colors"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 pr-2">
                            <div className="relative">
                              <input
                                type="number"
                                value={row.annualGrossSalary}
                                min={0}
                                step={1000}
                                onChange={(e) => updateRow(row.id, "annualGrossSalary", Number(e.target.value))}
                                className={`w-full bg-white/5 border rounded px-2 py-1 text-soft-white focus:outline-none transition-colors ${
                                  capped ? "border-amber/40 focus:border-amber/60" : "border-white/10 focus:border-accent/40"
                                }`}
                              />
                              {capped && (
                                <span className="absolute -top-1 right-0 text-[9px] text-amber">capped</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              value={row.allocationPercent}
                              min={0}
                              max={100}
                              onChange={(e) => updateRow(row.id, "allocationPercent", Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40 transition-colors"
                            />
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              value={row.monthsOnProject}
                              min={1}
                              max={36}
                              onChange={(e) => updateRow(row.id, "monthsOnProject", Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40 transition-colors"
                            />
                          </td>
                          <td className="py-2 text-right">
                            <span className="font-mono-data text-accent text-xs">{fmt(eligible)}</span>
                          </td>
                          <td className="py-2 pl-1">
                            {rows.length > 1 && (
                              <button
                                onClick={() => removeRow(row.id)}
                                className="text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={addRow}
                className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-medium transition-colors mt-1"
              >
                <Plus size={14} />
                Add Team Member
              </button>
            </section>

            {/* Material Costs */}
            <section className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">
                  Overhead / Material Costs
                </h2>
                <span className="text-accent font-mono-data text-sm font-semibold">{materialPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={materialPct}
                onChange={(e) => setMaterialPct(Number(e.target.value))}
                className="w-full accent-accent h-1.5"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>0%</span>
                <span className={materialPct > 80 ? "text-amber" : "text-muted"}>
                  {materialPct > 100
                    ? "Exceeds max (100%)"
                    : materialPct > 80
                    ? "Approaching limit"
                    : "of personnel costs"}
                </span>
                <span>100%</span>
              </div>
            </section>

            {/* Subcontracting */}
            <section className="glass-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">Subcontracting</h2>
              <div className="flex items-center gap-2">
                <span className="text-muted text-sm">€</span>
                <input
                  type="number"
                  value={subcontracting}
                  min={0}
                  step={1000}
                  onChange={(e) => setSubcontracting(Number(e.target.value))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-soft-white text-sm focus:outline-none focus:border-accent/40 transition-colors"
                />
              </div>
              {summary && summary.violations.subcontracting && (
                <p className="text-xs text-error bg-error/5 border border-error/20 rounded px-2.5 py-1.5">
                  Exceeds 25% limit. Capped at {fmt(summary.subcontracting)}.
                </p>
              )}
            </section>

            {/* Cooperation partner inputs */}
            {grantType === "cooperation" && (
              <section className="glass-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider">
                  Cooperation Parameters
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted">Partner person-months</label>
                    <input
                      type="number"
                      value={partnerPersonMonths}
                      min={0}
                      onChange={(e) => setPartnerPersonMonths(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-soft-white text-sm focus:outline-none focus:border-accent/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted">Total person-months</label>
                    <input
                      type="number"
                      value={totalPersonMonths}
                      min={0}
                      onChange={(e) => setTotalPersonMonths(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-soft-white text-sm focus:outline-none focus:border-accent/40"
                    />
                  </div>
                </div>
                {summary?.violations.cooperation && (
                  <p className="text-xs text-error bg-error/5 border border-error/20 rounded px-2.5 py-1.5">
                    {summary.violations.cooperation}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-[2] min-w-[300px]">
            <div className="sticky top-6 space-y-4">
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-soft-white uppercase tracking-wider mb-4">
                  Financial Summary
                </h2>

                {summary ? (
                  <div className="space-y-1.5">
                    {summaryRows.map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between py-2 px-2.5 rounded-lg ${
                          row.highlight ? "bg-accent/5 border border-accent/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <StatusIcon status={row.status} />
                          <span
                            className={`text-xs truncate ${
                              row.bold ? "font-semibold text-soft-white" : "text-muted"
                            }`}
                          >
                            {row.label}
                          </span>
                        </div>
                        <span
                          className={`font-mono-data text-xs ml-2 shrink-0 ${
                            row.highlight ? "text-accent font-semibold" : "text-soft-white"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-xs text-center py-4">
                    EXIST financial model coming soon.
                  </p>
                )}
              </div>

              {/* Hero card */}
              {summary && (
                <div className="glass-card p-5 border border-accent/20 bg-accent/3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-accent" />
                    <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                      Total Non-Dilutive Capital Acquired
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-accent font-mono-data mt-2">
                    {fmt(summary.totalNonDilutive)}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-0.5">
                    <p className="text-xs text-muted">
                      Traditional consultant would charge:{" "}
                      <span className="text-soft-white">{fmt(summary.consultantSavings)}</span>
                      <span className="text-muted"> (12% of grant)</span>
                    </p>
                    <p className="text-xs text-accent font-medium">
                      You saved: {fmt(summary.consultantSavings)}
                    </p>
                  </div>
                </div>
              )}

              {/* Constraint violations */}
              {violations.length > 0 && (
                <div className="glass-card p-4 border border-error/20">
                  <h3 className="text-xs font-semibold text-error uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <XCircle size={13} />
                    Constraint Violations
                  </h3>
                  <ul className="space-y-1.5">
                    {violations.map((v, i) => (
                      <li key={i} className="text-xs text-error/80 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">•</span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

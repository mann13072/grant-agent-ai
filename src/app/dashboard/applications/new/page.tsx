"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Upload,
  FileText,
  File,
  X,
  Shield,
  Download,
  Edit3,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateZIM, CONSTRAINTS } from "@/lib/engine/zim-calculator";
import { GENERATION_STEPS } from "@/lib/llm/prompts/grant-narrative";
import { dummyNarrative, dummyFinancialTableData } from "@/data/dummy-narrative";
import type { PersonnelEntry } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────

type GrantTypeId = "zim_individual" | "zim_coop" | "exist_startup" | "exist_transfer";
type CompanySize = "micro" | "small" | "medium";

interface GrantCardDef {
  id: GrantTypeId;
  name: string;
  maxFunding: string;
  timeline: string;
  description: string;
}

interface PersonnelRow extends PersonnelEntry {
  id: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  // Step 1
  grantType: GrantTypeId | null;
  // Step 2
  companyName: string;
  companySize: CompanySize;
  state: string;
  projectTitle: string;
  sector: string;
  durationMonths: number;
  technicalSummary: string;
  // Step 3
  personnel: PersonnelRow[];
  materialCostsPct: number;
  subcontracting: number;
  // Step 4
  files: UploadedFile[];
}

// ── Constants ─────────────────────────────────────────────────────────────

const GRANT_CARDS: GrantCardDef[] = [
  {
    id: "zim_individual",
    name: "ZIM Individual",
    maxFunding: "up to €550K",
    timeline: "24 months",
    description: "Solo R&D project. Ideal for SMEs with in-house research capability.",
  },
  {
    id: "zim_coop",
    name: "ZIM Cooperation",
    maxFunding: "up to €450K/company",
    timeline: "36 months",
    description: "Joint R&D between companies or with research institutes.",
  },
  {
    id: "exist_startup",
    name: "EXIST Start-up Grant",
    maxFunding: "€30K materials + stipend",
    timeline: "12 months",
    description: "Pre-founding support for university spin-offs and start-up ideas.",
  },
  {
    id: "exist_transfer",
    name: "EXIST Transfer of Research",
    maxFunding: "up to €250K",
    timeline: "18 months",
    description: "Technology transfer from science to market with high TRL innovations.",
  },
];

const BUNDESLAENDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
];

const SECTORS = [
  "Artificial Intelligence & Machine Learning",
  "Biotechnology & Life Sciences",
  "Clean Energy & Renewables",
  "Digital Health & MedTech",
  "Industrial Automation & Robotics",
  "Materials Science & Nanotechnology",
  "Mobility & Transportation",
  "Software & SaaS",
  "Semiconductor & Hardware",
  "Sustainable Agriculture & FoodTech",
];

const ROLES: PersonnelEntry["role"][] = [
  "Project Lead",
  "Senior Engineer",
  "Junior Engineer",
  "Researcher",
  "Admin",
  "Lab Technician",
];

const STEP_LABELS = [
  "Grant Type",
  "Company & Project",
  "Team & Finances",
  "Upload Documents",
  "Generate & Review",
];

// ── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function emptyRow(): PersonnelRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "Senior Engineer",
    annualGrossSalary: 65000,
    allocationPercent: 100,
    monthsOnProject: 12,
  };
}

function rowEligibleCost(row: PersonnelRow): number {
  const capped = Math.min(row.annualGrossSalary, CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR);
  return capped * (row.allocationPercent / 100) * (row.monthsOnProject / 12);
}

const EAST_STATES = ["Berlin", "Brandenburg", "Mecklenburg-Vorpommern", "Sachsen", "Sachsen-Anhalt", "Thüringen"];

function isEastGermany(state: string) {
  return EAST_STATES.includes(state);
}

// ── Sub-components ────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted">Step {step} of 5</span>
        <span className="text-sm font-medium text-soft-white">{STEP_LABELS[step - 1]}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {STEP_LABELS.map((_, i) => {
          const s = i + 1;
          const done = s < step;
          const active = s === step;
          return (
            <div key={s} className="flex items-center gap-1.5 flex-1 last:flex-none">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  done
                    ? "bg-accent text-navy"
                    : active
                    ? "bg-accent/20 border-2 border-accent text-accent"
                    : "bg-white/5 border border-white/10 text-muted"
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : s}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full transition-all ${done ? "bg-accent" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 1: Grant Type ────────────────────────────────────────────────────

function Step1({
  selected,
  onSelect,
}: {
  selected: GrantTypeId | null;
  onSelect: (id: GrantTypeId) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Select Grant Type</h2>
        <p className="text-sm text-muted mt-1">
          Choose the German federal grant programme that fits your project.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GRANT_CARDS.map((card) => {
          const active = selected === card.id;
          return (
            <motion.button
              key={card.id}
              onClick={() => onSelect(card.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`text-left p-4 rounded-xl border transition-all ${
                active
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/3 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`font-semibold text-sm ${active ? "text-accent" : "text-soft-white"}`}>
                    {card.name}
                  </p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{card.description}</p>
                </div>
                {active && (
                  <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className={`text-xs font-semibold ${active ? "text-accent" : "text-soft-white"}`}>
                  {card.maxFunding}
                </span>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-muted">{card.timeline}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: Company & Project Info ────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const charLeft = 500 - data.technicalSummary.length;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Company & Project Info</h2>
        <p className="text-sm text-muted mt-1">Provide the core details for your application.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-soft-white">Company Name</label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="ThermoVolt GmbH"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-soft-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-soft-white">Company Size</label>
          <select
            value={data.companySize}
            onChange={(e) => onChange({ companySize: e.target.value as CompanySize })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-soft-white text-sm focus:outline-none focus:border-accent/60 transition-colors"
          >
            <option value="micro">Micro — fewer than 10 employees</option>
            <option value="small">Small — fewer than 50 employees</option>
            <option value="medium">Medium — fewer than 250 employees</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-soft-white">Federal State</label>
          <select
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-soft-white text-sm focus:outline-none focus:border-accent/60 transition-colors"
          >
            <option value="">— Select Bundesland —</option>
            {BUNDESLAENDER.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-soft-white">Technology Sector</label>
          <select
            value={data.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-white/10 text-soft-white text-sm focus:outline-none focus:border-accent/60 transition-colors"
          >
            <option value="">— Select Sector —</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 col-span-2">
          <label className="block text-sm font-medium text-soft-white">Project Title</label>
          <input
            type="text"
            value={data.projectTitle}
            onChange={(e) => onChange({ projectTitle: e.target.value })}
            placeholder="Adaptive Thermal Interface Material for High-Density Battery Systems"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-soft-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-soft-white">Duration (months)</label>
          <input
            type="number"
            value={data.durationMonths}
            min={6}
            max={36}
            onChange={(e) => onChange({ durationMonths: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-soft-white text-sm focus:outline-none focus:border-accent/60 transition-colors"
          />
          <p className="text-xs text-muted">6–36 months</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-soft-white">Brief Technical Summary</label>
          <span className={`text-xs ${charLeft < 50 ? "text-amber" : "text-muted"}`}>
            {charLeft} characters remaining
          </span>
        </div>
        <textarea
          value={data.technicalSummary}
          onChange={(e) =>
            onChange({ technicalSummary: e.target.value.slice(0, 500) })
          }
          rows={4}
          placeholder="Describe the core innovation, technical challenge, and your approach. Be specific about what makes this novel."
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-soft-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

// ── Step 3: Team & Financial Input ────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const rows = data.personnel;

  function addRow() {
    onChange({ personnel: [...rows, emptyRow()] });
  }

  function removeRow(id: string) {
    onChange({ personnel: rows.filter((r) => r.id !== id) });
  }

  function updateRow(id: string, field: keyof PersonnelRow, value: string | number) {
    onChange({
      personnel: rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    });
  }

  const grantTypeForCalc: "individual" | "cooperation" =
    data.grantType === "zim_coop" ? "cooperation" : "individual";

  const isZIM =
    data.grantType === "zim_individual" || data.grantType === "zim_coop";

  const summary = isZIM
    ? calculateZIM({
        companySize: data.companySize,
        isEastGermany: isEastGermany(data.state),
        grantType: grantTypeForCalc,
        personnel: rows.map((r) => ({
          name: r.name || "Unnamed",
          role: r.role,
          annualGrossSalary: r.annualGrossSalary,
          allocationPercent: r.allocationPercent,
          monthsOnProject: r.monthsOnProject,
        })),
        materialCostsPercent: data.materialCostsPct,
        subcontractingCosts: data.subcontracting,
      })
    : null;

  const violations: string[] = [];
  if (summary?.violations.subcontracting) violations.push("Subcontracting exceeds 25% limit");
  if (summary?.violations.overCap) violations.push("Eligible costs exceed programme cap");
  summary?.violations.salaryWarnings.forEach((w) => violations.push(w));

  return (
    <div className="flex gap-5">
      {/* Main inputs */}
      <div className="flex-1 space-y-5 min-w-0">
        <div>
          <h2 className="text-xl font-bold text-soft-white">Team & Financial Input</h2>
          <p className="text-sm text-muted mt-1">Define your project team and cost structure.</p>
        </div>

        {/* Personnel table */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-xs font-semibold text-soft-white uppercase tracking-wider">Team Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {["Name", "Role", "Gross/yr (€)", "FTE %", "Months", "Eligible"].map((h) => (
                    <th key={h} className="text-left text-muted font-medium pb-2 pr-2">{h}</th>
                  ))}
                  <th className="pb-2 w-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row) => {
                  const eligible = rowEligibleCost(row);
                  return (
                    <tr key={row.id} className="group">
                      <td className="py-1.5 pr-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(row.id, "name", e.target.value)}
                          placeholder="Name"
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white placeholder-muted focus:outline-none focus:border-accent/40"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          value={row.role}
                          onChange={(e) => updateRow(row.id, "role", e.target.value)}
                          className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40"
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          value={row.annualGrossSalary}
                          min={0}
                          step={1000}
                          onChange={(e) => updateRow(row.id, "annualGrossSalary", Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          value={row.allocationPercent}
                          min={0}
                          max={100}
                          onChange={(e) => updateRow(row.id, "allocationPercent", Number(e.target.value))}
                          className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          value={row.monthsOnProject}
                          min={1}
                          max={36}
                          onChange={(e) => updateRow(row.id, "monthsOnProject", Number(e.target.value))}
                          className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-soft-white focus:outline-none focus:border-accent/40"
                        />
                      </td>
                      <td className="py-1.5 pr-2 text-right">
                        <span className="font-mono-data text-accent">{fmt(eligible)}</span>
                      </td>
                      <td className="py-1.5 pl-1">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            <Plus size={13} />
            Add Team Member
          </button>
        </div>

        {/* Material costs */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-soft-white uppercase tracking-wider">
              Overhead / Material Costs
            </h3>
            <span className="text-accent font-mono-data text-sm font-semibold">{data.materialCostsPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={data.materialCostsPct}
            onChange={(e) => onChange({ materialCostsPct: Number(e.target.value) })}
            className="w-full accent-accent h-1.5"
          />
        </div>

        {/* Subcontracting */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-xs font-semibold text-soft-white uppercase tracking-wider">Subcontracting (€)</h3>
          <input
            type="number"
            value={data.subcontracting}
            min={0}
            step={1000}
            onChange={(e) => onChange({ subcontracting: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-soft-white text-sm focus:outline-none focus:border-accent/40"
          />
        </div>
      </div>

      {/* Live constraint sidebar */}
      <div className="w-52 shrink-0 space-y-3">
        <div className="glass-card p-4 sticky top-6">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Live Validation</h3>
          {summary ? (
            <div className="space-y-2.5">
              {[
                { label: "Personnel", value: fmt(summary.totalPersonnel), ok: true },
                {
                  label: "Overhead",
                  value: fmt(summary.overhead),
                  ok: data.materialCostsPct <= 100,
                },
                {
                  label: "Subcontracting",
                  value: fmt(summary.subcontracting),
                  ok: !summary.violations.subcontracting,
                },
                {
                  label: "Total Eligible",
                  value: fmt(summary.totalEligible),
                  ok: !summary.violations.overCap,
                },
                { label: "Grant Amount", value: fmt(summary.grantAmount), ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {item.ok ? (
                      <CheckCircle2 size={12} className="text-accent shrink-0" />
                    ) : (
                      <XCircle size={12} className="text-error shrink-0" />
                    )}
                    <span className="text-xs text-muted truncate">{item.label}</span>
                  </div>
                  <span className={`text-xs font-mono-data shrink-0 ${item.ok ? "text-soft-white" : "text-error"}`}>
                    {item.value}
                  </span>
                </div>
              ))}

              {violations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  {violations.map((v, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <AlertTriangle size={11} className="text-amber shrink-0 mt-0.5" />
                      <span className="text-xs text-amber/80 leading-tight">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted">Select a ZIM grant type to see live validation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Upload Documents ───────────────────────────────────────────────

function Step4({
  files,
  onChange,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFiles(fileList: FileList) {
    const newFiles: UploadedFile[] = Array.from(fileList)
      .filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        return ["pdf", "docx", "txt"].includes(ext ?? "");
      })
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: f.type,
      }));

    const combined = [...files, ...newFiles].slice(0, 10);
    onChange(combined);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
    },
    [files] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function FileIcon({ name }: { name: string }) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText size={14} className="text-error/80" />;
    if (ext === "docx") return <File size={14} className="text-violet/80" />;
    return <File size={14} className="text-muted" />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Upload Technical Documents</h2>
        <p className="text-sm text-muted mt-1">
          Attach technical specifications, prior art analysis, or feasibility studies.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-white/15 hover:border-white/25 bg-white/2"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="sr-only"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full transition-all ${isDragging ? "bg-accent/20" : "bg-white/5"}`}>
            <Upload size={22} className={isDragging ? "text-accent" : "text-muted"} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDragging ? "text-accent" : "text-soft-white"}`}>
              {isDragging ? "Drop files here" : "Drag & drop files, or click to browse"}
            </p>
            <p className="text-xs text-muted mt-1">PDF, DOCX, TXT — max 10 files</p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted">{files.length}/10 files uploaded</p>
          {files.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/8"
            >
              <FileIcon name={f.name} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-soft-white truncate">{f.name}</p>
                <p className="text-xs text-muted">{fmtFileSize(f.size)}</p>
              </div>
              <button
                onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                className="text-muted hover:text-error transition-colors"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center gap-2.5 bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
        <Shield size={16} className="text-accent shrink-0" />
        <p className="text-xs text-muted leading-relaxed">
          All files encrypted at rest.{" "}
          <span className="text-soft-white">Zero data retention.</span>{" "}
          BSI C5 compliant.
        </p>
      </div>
    </div>
  );
}

// ── Step 5: Generate & Review ─────────────────────────────────────────────

function Step5({ data }: { data: FormData }) {
  const [phase, setPhase] = useState<"idle" | "generating" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  function startGeneration() {
    setPhase("generating");
    setCurrentStep(0);
    setStepProgress(0);

    let step = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        progress = 0;
        step += 1;
        if (step >= GENERATION_STEPS.length) {
          clearInterval(progressInterval);
          setPhase("done");
          return;
        }
        setCurrentStep(step);
      }
      setStepProgress(progress);
    }, 120);
  }

  const isZIM = data.grantType === "zim_individual" || data.grantType === "zim_coop";
  const summary = isZIM
    ? calculateZIM({
        companySize: data.companySize,
        isEastGermany: isEastGermany(data.state),
        grantType: data.grantType === "zim_coop" ? "cooperation" : "individual",
        personnel: data.personnel.map((r) => ({
          name: r.name || "Unnamed",
          role: r.role,
          annualGrossSalary: r.annualGrossSalary,
          allocationPercent: r.allocationPercent,
          monthsOnProject: r.monthsOnProject,
        })),
        materialCostsPercent: data.materialCostsPct,
        subcontractingCosts: data.subcontracting,
      })
    : null;

  if (phase === "idle") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-soft-white">Generate & Review</h2>
          <p className="text-sm text-muted mt-1">
            Our AI engine will produce a complete, compliant German grant narrative.
          </p>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {GENERATION_STEPS.map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-3 bg-white/3 rounded-lg border border-white/8">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-muted shrink-0 mt-0.5">
                  {s.id}
                </div>
                <div>
                  <p className="text-xs font-medium text-soft-white">{s.label}</p>
                  <p className="text-xs text-muted mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={startGeneration}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent/90 text-navy font-bold text-sm transition-all mt-2"
          >
            Generate Application
          </button>
        </div>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-soft-white">Generating your application…</h2>
          <p className="text-sm text-muted mt-1">This takes about 12 seconds. Please wait.</p>
        </div>
        <div className="glass-card p-6 space-y-4">
          {GENERATION_STEPS.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={s.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs transition-all ${
                      done
                        ? "bg-accent text-navy"
                        : active
                        ? "bg-amber/20 border border-amber"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {done ? <CheckCircle2 size={13} /> : s.id}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium transition-colors ${
                        done ? "text-accent" : active ? "text-amber animate-pulse-glow" : "text-muted"
                      }`}
                    >
                      {s.label}
                    </p>
                    {active && <p className="text-xs text-muted mt-0.5">{s.description}</p>}
                  </div>
                </div>
                {active && (
                  <div className="ml-9 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stepProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // phase === "done"
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={20} className="text-accent" />
        <div>
          <h2 className="text-xl font-bold text-soft-white">Application Generated</h2>
          <p className="text-sm text-muted mt-0.5">Review your narrative and financial summary below.</p>
        </div>
      </div>

      {/* Split view */}
      <div className="flex gap-4 min-h-[400px]">
        {/* Narrative */}
        <div className="flex-[3] glass-card p-5 overflow-y-auto max-h-[500px]">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
            Grant Narrative — Behördendeutsch
          </h3>
          <div className="font-serif text-xs text-soft-white/90 leading-relaxed whitespace-pre-wrap">
            {dummyNarrative}
          </div>
        </div>

        {/* Financial summary */}
        <div className="flex-[2] glass-card p-5 space-y-2 overflow-y-auto max-h-[500px]">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
            Financial Summary
          </h3>
          {(summary
            ? [
                { label: "Total Personnel", value: fmt(summary.totalPersonnel), ok: true },
                { label: "Overhead", value: fmt(summary.overhead), ok: true },
                { label: "Subcontracting", value: fmt(summary.subcontracting), ok: !summary.violations.subcontracting },
                { label: "Total Eligible", value: fmt(summary.totalEligible), ok: !summary.violations.overCap },
                { label: "Funding Rate", value: `${(summary.baseRate * 100).toFixed(0)}%`, ok: true },
                { label: "Grant Amount", value: fmt(summary.grantAmount), ok: true, highlight: true },
                { label: "Own Contribution", value: fmt(summary.ownContribution), ok: true },
                { label: "Forschungszulage", value: fmt(summary.forschungszulage), ok: true },
                { label: "Total Non-Dilutive", value: fmt(summary.totalNonDilutive), ok: true, highlight: true, bold: true },
              ]
            : dummyFinancialTableData.map((row) => ({
                label: row.label,
                value: row.isPercent ? `${(row.value * 100).toFixed(0)}%` : fmt(row.value),
                ok: row.status === "ok",
                highlight: row.highlight,
                bold: row.bold,
              }))
          ).map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between py-1.5 px-2 rounded ${
                row.highlight ? "bg-accent/5 border border-accent/15" : ""
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-accent shrink-0" />
                <span className={`text-xs ${row.bold ? "font-semibold text-soft-white" : "text-muted"}`}>
                  {row.label}
                </span>
              </div>
              <span className={`text-xs font-mono-data ${row.highlight ? "text-accent font-semibold" : "text-soft-white"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: "Export PDF", icon: <Download size={14} />, color: "bg-violet/20 border-violet/30 text-violet hover:bg-violet/30" },
          { label: "Export DOCX", icon: <Download size={14} />, color: "bg-accent/10 border-accent/20 text-accent hover:bg-accent/20" },
          { label: "Export XML", icon: <Download size={14} />, color: "bg-amber/10 border-amber/20 text-amber hover:bg-amber/20" },
          { label: "Edit & Regenerate", icon: <Edit3 size={14} />, color: "bg-white/5 border-white/15 text-soft-white hover:bg-white/10" },
        ].map((btn) => (
          <button
            key={btn.label}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${btn.color}`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 bg-white/3 text-sm font-medium text-muted hover:text-soft-white hover:border-white/20 transition-all ml-auto"
        >
          <LayoutDashboard size={14} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────

const DEFAULT_FORM: FormData = {
  grantType: null,
  companyName: "",
  companySize: "small",
  state: "",
  projectTitle: "",
  sector: "",
  durationMonths: 24,
  technicalSummary: "",
  personnel: [emptyRow()],
  materialCostsPct: 50,
  subcontracting: 0,
  files: [],
};

export default function NewApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);

  function patch(update: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...update }));
  }

  function canProceed(): boolean {
    if (step === 1) return form.grantType !== null;
    if (step === 2)
      return (
        form.companyName.trim().length > 0 &&
        form.state.length > 0 &&
        form.projectTitle.trim().length > 0 &&
        form.sector.length > 0 &&
        form.technicalSummary.trim().length > 10
      );
    return true;
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/applications"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-soft-white transition-colors mb-3"
          >
            <ChevronLeft size={15} />
            Back to Applications
          </Link>
          <h1 className="text-2xl font-bold text-soft-white">New Grant Application</h1>
        </div>

        <ProgressBar step={step} />

        {/* Step content */}
        <div className="glass-card p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <Step1
                  selected={form.grantType}
                  onSelect={(id) => patch({ grantType: id })}
                />
              )}
              {step === 2 && <Step2 data={form} onChange={patch} />}
              {step === 3 && <Step3 data={form} onChange={patch} />}
              {step === 4 && (
                <Step4
                  files={form.files}
                  onChange={(files) => patch({ files })}
                />
              )}
              {step === 5 && <Step5 data={form} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-muted hover:text-soft-white hover:border-white/20 transition-all"
              >
                <ChevronLeft size={15} />
                Back
              </button>
            )}
          </div>
          <div>
            {step < 5 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-accent hover:bg-accent/90 text-navy font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

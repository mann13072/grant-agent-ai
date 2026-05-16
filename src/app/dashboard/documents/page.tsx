"use client";

import { useState } from "react";
import { FileText, FileCode, File, ShieldCheck, Download, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dummyApplications } from "@/data/dummy-applications";
import { formatDate, GRANT_TYPE_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

type DocFileType = "PDF" | "DOCX" | "XML";
type SortOrder = "newest" | "oldest";

interface DocumentCard {
  id: string;
  filename: string;
  fileType: DocFileType;
  applicationTitle: string;
  grantType: string;
  version: string;
  date: string;
  size: string;
}

const dummyDocuments: DocumentCard[] = [
  {
    id: "doc_001",
    filename: "ThermoFlow_II_Narrative.pdf",
    fileType: "PDF",
    applicationTitle: dummyApplications[0].title,
    grantType: dummyApplications[0].grantType,
    version: "v2.1",
    date: "2026-04-01T10:00:00Z",
    size: "1.4 MB",
  },
  {
    id: "doc_002",
    filename: "ThermoFlow_II_Full_Application.docx",
    fileType: "DOCX",
    applicationTitle: dummyApplications[0].title,
    grantType: dummyApplications[0].grantType,
    version: "v2.0",
    date: "2026-03-28T14:00:00Z",
    size: "892 KB",
  },
  {
    id: "doc_003",
    filename: "CNC_Prophet_v2_Narrative.pdf",
    fileType: "PDF",
    applicationTitle: dummyApplications[1].title,
    grantType: dummyApplications[1].grantType,
    version: "v1.0",
    date: "2026-04-05T09:30:00Z",
    size: "1.1 MB",
  },
  {
    id: "doc_004",
    filename: "CNC_Prophet_v2_EasyOnline.xml",
    fileType: "XML",
    applicationTitle: dummyApplications[1].title,
    grantType: dummyApplications[1].grantType,
    version: "v1.0",
    date: "2026-04-05T10:00:00Z",
    size: "48 KB",
  },
  {
    id: "doc_005",
    filename: "PharmaScan_AI_Full_Application.docx",
    fileType: "DOCX",
    applicationTitle: dummyApplications[2].title,
    grantType: dummyApplications[2].grantType,
    version: "v3.2",
    date: "2026-03-10T16:00:00Z",
    size: "1.0 MB",
  },
  {
    id: "doc_006",
    filename: "PharmaScan_AI_EasyOnline.xml",
    fileType: "XML",
    applicationTitle: dummyApplications[2].title,
    grantType: dummyApplications[2].grantType,
    version: "v3.2",
    date: "2026-03-10T17:00:00Z",
    size: "52 KB",
  },
];

const fileTypeConfig: Record<DocFileType, { icon: typeof FileText; iconColor: string; iconBg: string; badgeClass: string }> = {
  PDF: {
    icon: FileText,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    badgeClass: "bg-red-500/15 text-red-400",
  },
  DOCX: {
    icon: File,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    badgeClass: "bg-blue-500/15 text-blue-400",
  },
  XML: {
    icon: FileCode,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badgeClass: "bg-emerald-500/15 text-emerald-400",
  },
};

export default function DocumentsPage() {
  const [typeFilter, setTypeFilter] = useState<"All" | DocFileType>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filtered = dummyDocuments
    .filter((d) => typeFilter === "All" || d.fileType === typeFilter)
    .sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <p className="text-gray-400 text-sm mt-1">All generated grant documents, securely stored.</p>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00C896]/5 border border-[#00C896]/20 w-fit">
        <ShieldCheck className="w-4 h-4 text-[#00C896] flex-shrink-0" />
        <span className="text-xs text-gray-300">
          All documents encrypted. <span className="text-white font-medium">EU-sovereign storage.</span>
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141926] border border-white/10">
          {(["All", "PDF", "DOCX", "XML"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                typeFilter === type
                  ? "bg-[#00C896] text-[#0A0F1E]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="appearance-none bg-[#141926] border border-white/10 rounded-xl px-3 py-2 pr-8 text-sm text-gray-300 focus:outline-none focus:border-[#00C896]/50 cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <span className="text-xs text-gray-500 ml-auto">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const cfg = fileTypeConfig[doc.fileType];
          const Icon = cfg.icon;
          return (
            <div
              key={doc.id}
              className="glass-card p-5 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", cfg.iconBg)}>
                  <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-[#00C896] transition-colors">
                    {doc.filename}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{doc.applicationTitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", cfg.badgeClass)}>
                  {doc.fileType}
                </span>
                <Badge variant="muted">{GRANT_TYPE_LABELS[doc.grantType] ?? doc.grantType}</Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-medium">{doc.version}</span>
                  <span>{formatDate(doc.date)}</span>
                </div>
                <span>{doc.size}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00C896] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">No documents found</p>
          <p className="text-gray-600 text-sm mt-1">Try changing the filter.</p>
        </div>
      )}
    </div>
  );
}

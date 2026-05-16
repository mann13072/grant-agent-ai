"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Calculator,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Applications", href: "/dashboard/applications" },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents" },
  { icon: Calculator, label: "Financial", href: "/dashboard/financial" },
  { icon: Library, label: "Templates", href: "/dashboard/templates" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0F1E]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#141926] border-r border-white/10 flex flex-col transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-5 border-b border-white/10 min-h-[72px]">
          <div className="flex-shrink-0">
            <Image src="/symbol.png" alt="Grant-Agent AI logo" width={1258} height={842} style={{ height: '36px', width: 'auto' }} />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-sm leading-tight whitespace-nowrap overflow-hidden">
              Grant-Agent AI
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map(({ icon: Icon, label, href }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all duration-150",
                      active
                        ? "border-l-2 border-[#00C896] bg-[#00C896]/10 text-[#00C896] pl-[9px]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="flex-shrink-0 w-5 h-5" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User avatar */}
        {!collapsed && (
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#00C896] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">LM</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">Dr. Lena Müller</p>
                <span className="inline-flex items-center rounded-full bg-[#00C896]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#00C896]">
                  PRO
                </span>
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="px-3 py-4 border-t border-white/10 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#00C896] flex items-center justify-center">
              <span className="text-white text-xs font-bold">LM</span>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="px-3 pb-4 flex justify-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-150"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          collapsed ? "ml-16" : "ml-60"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 bg-[#141926] border-b border-white/10 min-h-[64px]">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search applications, documents…"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C896]/50 focus:bg-white/8 transition-all duration-150"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00C896]" />
            </button>
            <Link href="/dashboard/applications/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                New Application
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

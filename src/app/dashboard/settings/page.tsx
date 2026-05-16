"use client";

import { useState } from "react";
import {
  User,
  CreditCard,
  Users,
  Shield,
  Save,
  Mail,
  Building2,
  Globe,
  CheckCircle,
  Download,
  LogOut,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tab = "profile" | "billing" | "team" | "security";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
];

const sessions = [
  { device: "Chrome · macOS Sonoma", location: "Berlin, DE", lastActive: "Now", current: true },
  { device: "Firefox · Windows 11", location: "Hamburg, DE", lastActive: "2 days ago", current: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState("Dr. Lena Müller");
  const [email, setEmail] = useState("lena.mueller@thermovolt.de");
  const [company, setCompany] = useState("ThermoVolt GmbH");
  const [language, setLanguage] = useState("de");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security state
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  // Team state
  const [inviteEmail, setInviteEmail] = useState("");

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account, billing, and security preferences.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141926] border border-white/10 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === id
                ? "bg-[#00C896] text-[#0A0F1E]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal and company details.</CardDescription>
          </CardHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  <User className="inline w-3.5 h-3.5 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C896]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  <Mail className="inline w-3.5 h-3.5 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C896]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  <Building2 className="inline w-3.5 h-3.5 mr-1" />
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C896]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  <Globe className="inline w-3.5 h-3.5 mr-1" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C896]/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={handleSaveProfile}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              {profileSaved && (
                <span className="flex items-center gap-1.5 text-sm text-[#00C896]">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Billing tab */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          {/* Current plan card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>You are on the PRO plan.</CardDescription>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#00C896]/20 px-3 py-1 text-sm font-bold text-[#00C896]">
                  PRO
                </span>
              </div>
            </CardHeader>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">€199</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              {["Up to 10 applications/month", "All grant types (ZIM, EXIST)", "Document vault (5 GB)", "Email support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-[#00C896] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="md">
              <CreditCard className="w-4 h-4" />
              Manage Billing
            </Button>
          </Card>

          {/* Usage meter */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>Applications generated in the current billing cycle.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Applications</span>
                <span className="text-white font-semibold">2 / 10</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00C896] rounded-full transition-all duration-500"
                  style={{ width: "20%" }}
                />
              </div>
              <p className="text-xs text-gray-500">8 applications remaining this month.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Team tab */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Add colleagues to collaborate on grant applications.</CardDescription>
            </CardHeader>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="colleague@company.de"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C896]/50 transition-all"
              />
              <Button variant="primary" size="md" disabled>
                Invite
              </Button>
            </div>

            {/* Enterprise notice */}
            <div className="mt-5 p-4 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#7C5CFC]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Enterprise Only</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Team collaboration is available on the Enterprise plan. Upgrade to invite unlimited members and manage roles.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-[#7C5CFC]/10">
                    Upgrade to Enterprise
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          {/* 2FA toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00C896]/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#00C896]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Authenticator App</p>
                  <p className="text-xs text-gray-500">
                    {twoFAEnabled ? "2FA is active on this account." : "2FA is disabled."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none",
                  twoFAEnabled ? "bg-[#00C896]" : "bg-white/10"
                )}
                aria-checked={twoFAEnabled}
                role="switch"
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                    twoFAEnabled ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </Card>

          {/* Active sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.device}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{session.device}</p>
                      {session.current && (
                        <span className="text-[10px] font-semibold bg-[#00C896]/20 text-[#00C896] px-1.5 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                  {!session.current && (
                    <button className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* GDPR */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Your data rights under GDPR (Art. 20).</CardDescription>
            </CardHeader>
            <Button variant="outline" size="md">
              <Download className="w-4 h-4" />
              Export My Data (GDPR)
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Eye, EyeOff, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // UI only — no auth logic
    setTimeout(() => setIsLoading(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="glass-card p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 pb-2">
          <div className="flex items-center justify-center">
            <Image src="/symbol.png" alt="Grant-Agent AI logo" width={1258} height={842} style={{ height: '56px', width: 'auto' }} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-soft-white tracking-tight">Grant-Agent AI</h1>
            <p className="text-sm text-muted mt-0.5">Sign in to your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-soft-white">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.de"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-soft-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-soft-white">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white/5 border border-white/10 text-soft-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-soft-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-navy font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <Zap size={15} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:text-accent/80 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Shield size={12} className="text-accent/70 shrink-0" />
        <span>Made in Berlin. EU-sovereign. BSI C5 compliant.</span>
      </div>
    </motion.div>
  );
}

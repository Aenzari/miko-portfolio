'use client'

import { useSiteConfig } from './providers/SiteDataProvider'
import { Logo } from './Logo'

export function Footer() {
  const { config } = useSiteConfig()

  return (
    <footer className="relative py-12 border-t border-white/[0.06] bg-navy-950/80">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Core Web Vitals & Production Rigor Strip */}
        <div className="p-4 rounded-xl bg-navy-900/40 border border-white/[0.05] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audited Performance Benchmarks (Lighthouse &amp; Core Web Vitals)</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-[11px]">
            <span className="text-gray-400">
              Score: <strong className="text-emerald-400 font-bold">99/100</strong>
            </span>
            <span className="text-gray-400">
              FCP: <strong className="text-white">&lt;0.8s</strong>
            </span>
            <span className="text-gray-400">
              INP: <strong className="text-white">&lt;45ms</strong>
            </span>
            <span className="text-gray-400">
              CLS: <strong className="text-emerald-400 font-bold">0.00</strong>
            </span>
            <span className="text-gray-500 hidden md:inline">
              Conventional Commits (<code className="text-accent">feat:</code>, <code className="text-accent">fix:</code>)
            </span>
          </div>
        </div>

        {/* Base Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-5">
            <Logo size={32} />
            <span className="text-gray-500 text-xs font-mono">
              &copy; {new Date().getFullYear()} {config.first_name} {config.last_name}
            </span>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <a
              href={config.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-accent transition-colors duration-200 font-mono"
            >
              GitHub
            </a>
            <a
              href={config.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-accent transition-colors duration-200 font-mono"
            >
              LinkedIn
            </a>
            {config.onlinejobs_url && (
              <a
                href={config.onlinejobs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-accent transition-colors duration-200 font-mono"
              >
                OnlineJobs.ph
              </a>
            )}
            <a
              href="/admin"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
            >
              Admin Portal
            </a>
          </div>

          <p className="text-xs text-gray-400 font-mono">
            {config.city} · Full-Stack &amp; Database Systems
          </p>
        </div>
      </div>
    </footer>
  )
}

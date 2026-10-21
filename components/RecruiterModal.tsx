"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSiteConfig } from "./providers/SiteDataProvider";

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecruiterModal({ isOpen, onClose }: RecruiterModalProps) {
  const { config } = useSiteConfig();
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const copyEmail = () => {
    navigator.clipboard.writeText(config.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-void/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col glass glow-border rounded-2xl bg-navy-950/95 border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-navy-900/60 shrink-0">
            <div className="flex items-center gap-3">
              {config.avatar_url ? (
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-navy-950 border border-accent/40 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.avatar_url}
                    alt={config.first_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              )}
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                  Recruiter Fast-Track
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  Executive Dossier (30-Second Summary)
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-gray-400 uppercase">
                  Target Roles
                </div>
                <div className="text-xs font-semibold text-accent mt-1 leading-tight">
                  Junior Full-Stack / Web Engineer
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-gray-400 uppercase">
                  Candidate
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {config.first_name} ({config.nickname})
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-gray-400 uppercase">
                  Location
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {config.city}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-gray-400 uppercase">
                  Availability
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Immediate / Remote
                </div>
              </div>
            </div>

            {/* Core Competency Highlights */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Why Hire {config.first_name}?
              </h4>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-white/[0.04] space-y-2.5 text-xs text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span>
                    <strong>Database Systems Specialization:</strong> Academic
                    major in Database Systems (MSU-IIT). Real experience
                    modeling ACID serializable transactions (Postgres), Graph
                    traversals (Neo4j), and in-memory caches (Redis).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span>
                    <strong>High-Performance Frontend:</strong> Next.js 14 (App
                    Router), TypeScript, Tailwind CSS, Three.js / React Three
                    Fiber procedural 3D engines, and Lenis smooth scrolling.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span>
                    <strong>Proven Systems Ownership:</strong> Architected
                    localized marketplaces (Baylo), epidemiological command
                    vector dashboards (EpiGraph), and real-time sports scoring
                    engines (Golazo).
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Profiles & Portals */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Verified Candidate Profiles
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <a
                  href={config.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-accent text-white transition-colors"
                >
                  GitHub Profile &rarr;
                </a>
                <a
                  href={config.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-accent text-white transition-colors"
                >
                  LinkedIn &rarr;
                </a>
                {config.onlinejobs_url && (
                  <a
                    href={config.onlinejobs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-accent text-white transition-colors"
                  >
                    OnlineJobs.ph &rarr;
                  </a>
                )}
              </div>
            </div>

            {/* Direct Action Hub */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyEmail}
                className="flex-1 py-3 px-4 rounded-xl glass hover:bg-white/[0.08] text-white text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all"
              >
                {copiedEmail ? (
                  <>
                    <svg
                      className="w-4 h-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied: {config.email}</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy Direct Email</span>
                  </>
                )}
              </button>

              <a
                href={config.resume_url}
                download="Quinit_Developer_Resume.pdf"
                className="flex-1 py-3 px-4 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

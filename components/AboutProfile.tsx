"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteConfig } from "./providers/SiteDataProvider";
import { TiltCard } from "./TiltCard";
import { ResumeModal } from "./ResumeModal";

export function AboutProfile() {
  const { config } = useSiteConfig();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(config.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <section
      id="profile"
      className="relative py-32 border-t border-white/[0.08] overflow-hidden bg-[#05080F]"
    >
      {/* Aerospace Subtle Telemetry Grid & Dust Background */}
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Coordinate & Mission Stage Header Ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              STAGE 01 // ARCHITECT DOSSIER
            </span>
            <span className="text-gray-600 font-mono text-xs">|</span>
            <span className="font-mono text-xs text-gray-400">
              MISSION COMMAND
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {config.coordinates || "8.2280° N, 124.2452° E · ILIGAN CITY"}
              </span>
            </span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="text-accent hidden md:inline">
              CALLSIGN: {config.brand_name || "//MAYK"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ========================================================= */}
          {/* LEFT: LARGE CINEMATIC PORTRAIT FRAME WITH HUD TELEMETRY */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <TiltCard className="rounded-3xl">
              <div className="relative p-3.5 sm:p-4 rounded-3xl glass glow-border border border-white/10 bg-gradient-to-b from-white/[0.05] via-[#080E1B]/80 to-[#04070D] shadow-2xl overflow-hidden group">
                {/* Aerospace Corner HUD Reticles */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/70 pointer-events-none z-20" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/70 pointer-events-none z-20" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/70 pointer-events-none z-20" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/70 pointer-events-none z-20" />

                {/* Portrait Image Container */}
                <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-navy-950 flex items-center justify-center border border-white/[0.08]">
                  {config.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={config.avatar_url}
                      alt={`${config.first_name} ${config.last_name}`}
                      className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    /* Holographic Geometric Wireframe Fallback */
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full border border-accent/30 animate-spin"
                          style={{ animationDuration: "12s" }}
                        />
                        <div
                          className="absolute inset-2 rounded-full border border-dashed border-cyan-400/30 animate-spin"
                          style={{
                            animationDuration: "8s",
                            animationDirection: "reverse",
                          }}
                        />
                        <span className="font-display font-bold text-4xl text-gradient-accent">
                          MQ
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-accent font-bold tracking-widest uppercase">
                          HOLOGRAPHIC AVATAR MATRIX
                        </div>
                        <p className="text-[11px] font-mono text-gray-500">
                          Configure photo via Admin Command Center
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Subtle Scanline Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                  {/* Floating Telemetry Badges over photo */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-[10px] font-mono text-gray-200 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SYS.VERIFIED // LEAD ARCHITECT</span>
                  </div>

                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-accent">
                    {config.nickname || "MAYK"}
                  </div>
                </div>

                {/* Base Metadata Bar */}
                <div className="pt-3.5 px-2 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>MSU-IIT · DATABASE MAJOR</span>
                  </span>
                  <span className="text-gray-500">PHILIPPINES [GMT+8]</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT: NARRATIVE DOSSIER & OMNICHANNEL CONNECTIVITY HUB */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Header / Identity Callout */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/25 text-accent text-xs font-mono font-medium">
                <span>IDENTITY SPECIFICATION</span>
                <span>//</span>
                <span>FULL-STACK WEB &amp; DATA SYSTEMS</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {config.first_name}{" "}
                <span className="text-gradient-accent">{config.last_name}</span>
              </h2>

              <p className="text-lg font-display text-gray-300 font-medium">
                {config.title}
              </p>
              <p className="text-xs sm:text-sm font-mono text-cyan-400">
                {config.specialization}
              </p>
            </div>

            {/* In-Depth Bio & Philosophy */}
            <div className="space-y-4 text-sm sm:text-base text-gray-300 font-light leading-relaxed border-l-2 border-accent/40 pl-5">
              <p>
                {config.bio ||
                  "4th-year BS Information Technology student majoring in Database Systems at Mindanao State University – Iligan Institute of Technology (MSU-IIT). I engineer high-performance web applications that bridge mission-critical database architectures with fluid, 60 FPS user interfaces."}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">
                Disciplines: ACID Transaction Ledgers · Graph Traversal Queries
                (Cypher) · Distributed In-Memory Pub/Sub · Zero-Drift Solvency ·
                Modern Component Architecture (Next.js 14 / TypeScript).
              </p>
            </div>

            {/* ========================================================= */}
            {/* OMNICHANNEL CONNECTIVITY & SOCIALS MATRIX */}
            {/* ========================================================= */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h3 className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
                  <span>COMMUNICATION CHANNELS &amp; REPOSITORIES</span>
                  <span className="text-gray-600">// VERIFIED TELEMETRY</span>
                </h3>
                {copiedEmail && (
                  <span className="text-xs font-mono text-emerald-400 font-bold animate-pulse">
                    ✓ Email Copied to Clipboard
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {/* GitHub */}
                <a
                  href={config.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl glass hover:border-accent/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:text-accent transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-accent transition-colors">
                        GitHub
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        Repositories &amp; Source
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
                    &rarr;
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href={config.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl glass hover:border-accent/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:text-accent transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-accent transition-colors">
                        LinkedIn
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        Professional Network
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
                    &rarr;
                  </span>
                </a>

                {/* OnlineJobs.ph */}
                <a
                  href={config.onlinejobs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl glass hover:border-accent/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-accent font-mono font-bold text-xs">
                      OJ
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-accent transition-colors">
                        OnlineJobs.ph
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        Verified Jobseeker Profile
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
                    &rarr;
                  </span>
                </a>

                {/* Email Direct & Copy */}
                <div className="p-4 rounded-xl glass border border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-accent">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white">
                        Direct Email
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        {config.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyEmail}
                      className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-accent text-[11px] font-mono text-gray-300 hover:text-white transition-colors"
                      title="Copy email to clipboard"
                    >
                      Copy
                    </button>
                    <a
                      href={`mailto:${config.email}`}
                      className="px-2.5 py-1 rounded bg-accent text-[11px] font-mono text-white hover:bg-accent-dark transition-colors"
                    >
                      Mail
                    </a>
                  </div>
                </div>
              </div>

              {/* Resume Download & Quick-View Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-accent/15 via-accent/5 to-transparent border border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/25 shrink-0">
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">
                      Curriculum Vitae / Engineering Resume
                    </h4>
                    <p className="text-[11px] font-mono text-gray-400">
                      Standardized PDF for ATS &amp; Technical Recruiters
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setResumeModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Quick-View</span>
                  </button>
                  <a
                    href={config.resume_url || "/resume.pdf"}
                    download="Michael_Angelou_Quinit_Developer_Resume.pdf"
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-accent hover:text-white text-navy-950 text-xs font-mono font-bold transition-all duration-300 text-center shadow-md flex items-center gap-1.5"
                  >
                    <span>Download PDF</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Quick-Viewer Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </section>
  );
}

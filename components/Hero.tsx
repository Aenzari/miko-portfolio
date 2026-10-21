"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { RecruiterModal } from "./RecruiterModal";
import { ResumeModal } from "./ResumeModal";
import { useSiteConfig } from "./providers/SiteDataProvider";
import { TiltCard } from "./TiltCard";

const DataEngineScene = dynamic(
  () => import("./three/DataEngineScene").then((mod) => mod.DataEngineScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="text-[11px] font-mono text-gray-500 tracking-wider">
          INITIALIZING 3D ENGINE...
        </span>
      </div>
    ),
  },
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const SKILL_PILLS = [
  "Full-Stack Web Engineering",
  "PostgreSQL / pgvector",
  "Neo4j (Cypher Graphs)",
  "Redis Pub/Sub",
  "Next.js 14 / TypeScript",
  "Reactive WebGL (R3F)",
];

export function Hero() {
  const { config } = useSiteConfig();
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[96vh] flex items-center overflow-hidden pt-28 pb-16">
        {/* Architectural Background Grid & Ambient Highlights */}
        <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Profile Identity Bar & Status Pill */}
              <motion.div
                variants={item}
                className="flex items-center justify-center lg:justify-start gap-3.5 flex-wrap"
              >
                {/* Micro Avatar / Monogram */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-white/10 shadow-sm">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-navy-900 border border-accent/40 flex items-center justify-center shrink-0">
                    {config.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.avatar_url}
                        alt={config.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-accent">
                        MQ
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-xs text-gray-200">
                    {config.nickname || config.first_name}
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs text-gray-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {config.status_pill}
                </span>

                <button
                  onClick={() => setRecruiterModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-accent/15 hover:bg-accent text-accent hover:text-white border border-accent/30 text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>30s Recruiter Dossier</span>
                </button>
              </motion.div>

              {/* Candidate Name */}
              <motion.div variants={item}>
                <h1 className="font-display font-bold tracking-tight">
                  <span className="block text-4xl sm:text-6xl xl:text-7xl text-white">
                    {config.first_name}
                  </span>
                  <span className="block text-4xl sm:text-6xl xl:text-7xl text-gradient-accent mt-1">
                    {config.last_name}
                  </span>
                </h1>
              </motion.div>

              {/* Title & Specialization */}
              <motion.div variants={item} className="space-y-1.5">
                <p className="text-xl sm:text-2xl font-display font-semibold text-white">
                  {config.title}
                </p>
                <p className="text-xs sm:text-sm text-cyan font-mono tracking-wide">
                  {config.specialization}
                </p>
              </motion.div>

              {/* Hook Statement */}
              <motion.p
                variants={item}
                className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-light"
              >
                {config.hook}
              </motion.p>

              {/* Dynamic Engineering Badges */}
              <motion.div
                variants={item}
                className="flex flex-wrap gap-2 justify-center lg:justify-start"
              >
                {SKILL_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-gray-300"
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>

              {/* Call-to-Actions */}
              <motion.div
                variants={item}
                className="flex flex-wrap gap-3.5 justify-center lg:justify-start items-center pt-2"
              >
                <a
                  href="#profile"
                  className="px-6 py-3.5 bg-accent hover:bg-accent-dark text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 flex items-center gap-2"
                >
                  <span>About Architect</span>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
                <a
                  href="#projects"
                  className="px-6 py-3.5 glass hover:bg-white/[0.08] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  Inspect Systems
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3.5 glass hover:bg-white/[0.08] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
                >
                  Direct Inquiry
                </a>
                <button
                  type="button"
                  onClick={() => setResumeModalOpen(true)}
                  className="px-5 py-3.5 border border-white/10 hover:border-accent/40 rounded-xl text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 text-accent group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Quick-View CV</span>
                </button>
                <a
                  href={config.resume_url || "/resume.pdf"}
                  download="Quinit_Developer_Resume.pdf"
                  className="px-4 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-all flex items-center gap-1.5"
                  title="Direct Download PDF"
                >
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Data Engine & Architect Portrait Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 h-[340px] sm:h-[440px] lg:h-[520px] relative order-1 lg:order-2 flex flex-col items-center justify-center"
            >
              <div className="w-full h-full">
                <DataEngineScene />
              </div>

              {/* Floating Architect Portrait Card (if photo exists or default badge) */}
              {config.avatar_url && (
                <div className="absolute top-2 right-2 sm:right-6 pointer-events-auto">
                  <TiltCard className="rounded-2xl">
                    <div className="p-2 sm:p-2.5 rounded-2xl glass glow-border border border-white/10 flex items-center gap-3 backdrop-blur-2xl shadow-2xl">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-navy-950 border border-accent/40 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={config.avatar_url}
                          alt="Michael Angelou Quinit"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-navy-950" />
                      </div>
                      <div className="pr-2 text-left hidden sm:block">
                        <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider">
                          ENGINEER VERIFIED
                        </div>
                        <div className="text-xs font-display font-bold text-white">
                          {config.nickname || config.first_name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          {config.city}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              )}

              {/* 3D Engine Legend Badge */}
              <div className="absolute bottom-2 px-3.5 py-1.5 rounded-full glass border border-white/10 text-[11px] font-mono text-gray-400 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Full-Stack Architecture Core · Drag to Rotate</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recruiter Fast-Track Modal */}
      <RecruiterModal
        isOpen={recruiterModalOpen}
        onClose={() => setRecruiterModalOpen(false)}
      />

      {/* Resume Quick-Viewer Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </>
  );
}

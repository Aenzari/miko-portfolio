'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { CaseStudy } from '@/lib/case-studies-data'

interface CaseStudyModalProps {
  study: CaseStudy | null
  onClose: () => void
}

export function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (study) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [study, onClose])

  if (!study) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8">
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
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass glow-border rounded-2xl bg-navy-950/95 border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-navy-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
                Case Study
              </span>
              <span className="text-gray-400 font-mono text-xs hidden sm:inline">
                {study.timeline} · {study.role}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            {/* Title & Subtitle */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                {study.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
                {study.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {study.stack.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs font-mono text-gray-300 border border-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Engineering Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {study.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
                >
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    {m.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-accent my-1">
                    {m.value}
                  </div>
                  <div className="text-xs text-gray-400 font-light">
                    {m.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* 1. The Problem & Bottlenecks */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                01. The Problem &amp; Engineering Bottlenecks
              </h3>
              <div className="p-5 rounded-xl bg-navy-900/60 border border-white/[0.04] space-y-3">
                <h4 className="text-base font-semibold text-white font-display">
                  {study.problem.heading}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {study.problem.description}
                </p>
                <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                  {study.problem.bottlenecks.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <span className="text-red-400 shrink-0 font-mono">✕</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Architecture & Decisions */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-cyan uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                02. Architecture &amp; Technical Solutions
              </h3>
              <div className="p-5 rounded-xl bg-navy-900/60 border border-white/[0.04] space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-white font-display">
                    {study.architecture.heading}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-light mt-1">
                    {study.architecture.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {study.architecture.decisions.map((dec, i) => (
                    <div key={i} className="p-4 rounded-lg bg-navy-950 border border-white/[0.06] space-y-2">
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span className="text-accent font-mono text-xs">§{i + 1}</span>
                        {dec.title}
                      </div>
                      <p className="text-xs text-gray-300 font-light leading-relaxed">
                        {dec.rationale}
                      </p>
                      {dec.codePreview && (
                        <pre className="p-3 rounded bg-void border border-white/[0.06] text-[11px] font-mono text-gray-200 overflow-x-auto leading-relaxed">
                          <code>{dec.codePreview}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Outcomes & Takeaway */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                03. Measurable Outcomes &amp; Takeaway
              </h3>
              <div className="p-5 rounded-xl bg-navy-900/60 border border-white/[0.04] space-y-4">
                <h4 className="text-base font-semibold text-white font-display">
                  {study.outcomes.heading}
                </h4>
                <div className="space-y-2">
                  {study.outcomes.impactPoints.map((impact, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{impact}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/[0.05] text-xs text-accent-light italic">
                  &ldquo;{study.outcomes.takeaway}&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.08] bg-navy-900/60 flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              Michael Angelou C. Quinit · Production Case Study
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-accent hover:bg-accent-dark text-white text-xs font-mono font-medium rounded-lg transition-colors ml-auto"
            >
              Back to Overview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

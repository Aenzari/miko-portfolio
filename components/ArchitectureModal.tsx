'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { ProjectWithArchitecture } from '@/lib/projects-data'

interface ArchitectureModalProps {
  project: ProjectWithArchitecture | null
  onClose: () => void
}

export function ArchitectureModal({ project, onClose }: ArchitectureModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (project) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project || !project.architecture) return null
  const arch = project.architecture

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col glass glow-border rounded-2xl bg-navy-950/95 border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-navy-900/60">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                  Database Architecture Blueprint
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  {project.name}
                </h3>
              </div>
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Meta Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Engine &amp; Technology
                </div>
                <div className="text-sm font-semibold text-accent font-display">
                  {arch.database}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  {arch.paradigm}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Performance Goal / Metric
                </div>
                <div className="text-sm font-semibold text-white font-mono">
                  {arch.traversalComplexity || arch.concurrencyModel || 'ACID Compliant Execution'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Engineered system constraint
                </div>
              </div>
            </div>

            {/* Architectural Trade-off */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Why This Storage Paradigm? (Engineering Decision)
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed p-4 rounded-xl bg-navy-900/60 border border-white/[0.04]">
                {arch.tradeoffReasoning}
              </p>
            </div>

            {/* Schema / Query Blueprint */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  Production Query / Schema Definition
                </h4>
                <span className="text-[10px] font-mono text-gray-500">PL/pgSQL / Cypher / Redis</span>
              </div>
              <pre className="p-4 rounded-xl bg-void border border-white/[0.08] text-xs font-mono text-gray-200 overflow-x-auto leading-relaxed">
                <code>{arch.schemaSnippet}</code>
              </pre>
            </div>

            {/* Key Deliverables & Benchmarks */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                Engineering Benchmarks
              </h4>
              <ul className="space-y-2">
                {arch.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-white/[0.08] bg-navy-900/60 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              Michael Angelou C. Quinit · Database Systems Major
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white font-mono rounded-lg transition-colors ml-auto"
            >
              Close Inspector
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

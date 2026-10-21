'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useSiteConfig } from './providers/SiteDataProvider'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { config } = useSiteConfig()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl glass glow-border bg-[#05080F]/95 border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header Bar with Telemetry */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-navy-950/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                    DOCUMENT INSPECTOR // QUICK-VIEW
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-sm sm:text-base font-display font-bold text-white">
                  Curriculum Vitae — {config.first_name} {config.last_name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={config.resume_url || '/resume.pdf'}
                download="Michael_Angelou_Quinit_Resume.pdf"
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md shadow-accent/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download PDF</span>
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="flex-1 w-full h-full bg-[#0a0f1d] relative flex flex-col">
            <iframe
              src={`${config.resume_url || '/resume.pdf'}#toolbar=0&navpanes=0`}
              title="Resume Preview"
              className="w-full h-full border-none"
            />

            {/* Fallback overlay in case browser disables iframe PDF preview */}
            <noscript>
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-mono text-gray-400">
                JavaScript required to preview PDF. Click &quot;Download PDF&quot; above to read the document.
              </div>
            </noscript>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

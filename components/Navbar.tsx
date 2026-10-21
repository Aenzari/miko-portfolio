'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Logo } from './Logo'
import { RecruiterModal } from './RecruiterModal'

const navLinks = [
  { href: '#profile', label: 'Dossier' },
  { href: '#stack', label: 'Arsenal' },
  { href: '#projects', label: 'Systems' },
  { href: '#standards', label: 'Engineering' },
  { href: '#contact', label: 'Inquiries' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [recruiterOpen, setRecruiterOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass py-3.5' : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Recruiter Fast-Track Dossier CTA */}
            <button
              onClick={() => setRecruiterOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/25 text-xs font-mono transition-all duration-300 flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>For Recruiters</span>
            </button>

            <a
              href="#contact"
              className="px-5 py-2 rounded-xl bg-white hover:bg-accent hover:text-white text-navy-950 text-xs font-mono font-bold transition-all duration-300 shadow-md"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-white"
            aria-label="Toggle navigation menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-white block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -16 } : { opacity: 1, x: 0 }}
              className="w-6 h-[2px] bg-white block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-white block"
            />
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-subtle overflow-hidden border-t border-white/[0.08]"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-mono uppercase text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                <button
                  onClick={() => {
                    setMobileOpen(false)
                    setRecruiterOpen(true)
                  }}
                  className="py-3 px-4 rounded-xl bg-accent/15 text-accent text-left font-mono text-xs border border-accent/25 flex items-center justify-between"
                >
                  <span>30s Recruiter Dossier</span>
                  <span>&rarr;</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 py-3 px-5 bg-white text-navy-950 text-center font-mono font-bold text-xs rounded-xl"
                >
                  Get In Touch
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Recruiter Fast-Track Dossier Modal */}
      <RecruiterModal
        isOpen={recruiterOpen}
        onClose={() => setRecruiterOpen(false)}
      />
    </>
  )
}

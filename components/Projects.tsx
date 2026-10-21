'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { PROJECTS_WITH_ARCH, ProjectWithArchitecture } from '@/lib/projects-data'
import { STAR_CASE_STUDIES, CaseStudy } from '@/lib/case-studies-data'
import { ArchitectureModal } from './ArchitectureModal'
import { CaseStudyModal } from './CaseStudyModal'
import { TiltCard } from './TiltCard'

const DOMAIN_TABS = [
  { id: 'all', label: 'All Systems' },
  { id: 'fullstack', label: 'Full-Stack Platforms' },
  { id: 'database', label: 'Database-Intensive' },
  { id: 'realtime', label: 'Real-Time & WebGL' },
]

function ProjectCard({
  project,
  index,
  onInspectArchitecture,
  onOpenCaseStudy,
}: {
  project: ProjectWithArchitecture
  index: number
  onInspectArchitecture?: (p: ProjectWithArchitecture) => void
  onOpenCaseStudy?: (study: CaseStudy) => void
}) {
  const caseStudyKey = project.name.toLowerCase().includes('epigraph')
    ? 'epigraph'
    : project.name.toLowerCase().includes('baylo')
    ? 'baylo'
    : project.name.toLowerCase().includes('golazo')
    ? 'golazo'
    : null

  const hasCaseStudy = Boolean(caseStudyKey && STAR_CASE_STUDIES[caseStudyKey])

  return (
    <TiltCard
      className={`group rounded-2xl h-full flex flex-col justify-between transition-all duration-300 ${
        project.featured ? 'md:col-span-2 glass glow-border' : 'glass hover:border-white/20'
      }`}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
        <div>
          {/* Top row */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              {hasCaseStudy && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Case Study
                </span>
              )}
              {project.architecture && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/25 text-cyan text-[11px] font-mono">
                  DB Blueprint
                </span>
              )}
            </div>
            <span className="text-gray-500 font-mono text-xs sm:text-sm">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Project Name */}
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-accent transition-all duration-300 mb-2">
            {project.name}
          </h3>

          {/* Tagline */}
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 font-light">
            {project.tagline}
          </p>

          {/* Architecture Callout */}
          {project.architecture && (
            <div className="mb-4 p-3.5 rounded-xl bg-navy-950/70 border border-white/[0.05] text-xs">
              <div className="font-mono text-accent text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                {project.architecture.database}
              </div>
              <p className="text-gray-400 text-[12px] line-clamp-2">
                {project.architecture.tradeoffReasoning}
              </p>
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-white/[0.03] text-gray-400 text-xs font-mono border border-white/[0.05]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent flex items-center gap-1 transition-colors"
              >
                Live Demo &rarr;
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasCaseStudy && onOpenCaseStudy && (
              <button
                onClick={() => onOpenCaseStudy(STAR_CASE_STUDIES[caseStudyKey!])}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white transition-colors border border-emerald-500/30 font-bold"
              >
                Deep Dive
              </button>
            )}

            {project.architecture && onInspectArchitecture && (
              <button
                onClick={() => onInspectArchitecture(project)}
                className="px-3.5 py-1.5 rounded-lg bg-accent/15 hover:bg-accent hover:text-white text-accent transition-colors font-bold"
              >
                Inspect Schema
              </button>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

export function Projects() {
  const [selectedArchProject, setSelectedArchProject] = useState<ProjectWithArchitecture | null>(null)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null)
  const [displayedProjects, setDisplayedProjects] = useState<ProjectWithArchitecture[]>(PROJECTS_WITH_ARCH)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Dynamic CMS synchronization with local fallback
  useEffect(() => {
    async function fetchDynamicProjects() {
      try {
        const res = await fetch('/api/public/projects')
        if (res.ok) {
          const data = await res.json()
          if (data.projects && data.projects.length > 0) {
            const mapped: ProjectWithArchitecture[] = data.projects.map((p: any) => {
              const matchedStatic = PROJECTS_WITH_ARCH.find(
                (sp) => sp.name.toLowerCase() === p.name.toLowerCase()
              )
              return {
                name: p.name,
                category: p.category,
                tagline: p.tagline,
                stack: p.stack,
                demoUrl: p.demo_url,
                repoUrl: p.repo_url,
                featured: p.featured,
                dbHeavy: p.db_heavy,
                architecture: matchedStatic?.architecture,
              }
            })
            setDisplayedProjects(mapped)
          }
        }
      } catch {
        // graceful static fallback
      }
    }
    fetchDynamicProjects()
  }, [])

  // Filter projects by domain
  const filteredProjects = displayedProjects.filter((p) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'fullstack') {
      return ['Marketplace', 'Enterprise', 'Social', 'E-Commerce'].includes(p.category)
    }
    if (activeFilter === 'database') {
      return p.dbHeavy || ['Data Visualization', 'Marketplace', 'Real-Time', 'Community'].includes(p.category)
    }
    if (activeFilter === 'realtime') {
      return ['Real-Time', 'EdTech / WebGL', 'Productivity'].includes(p.category)
    }
    return true
  })

  return (
    <section id="projects" className="relative py-28 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            STAGE 03 // ORBITAL FLIGHT LOGS &amp; ENGINEERED SYSTEMS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2">
            Engineered <span className="text-gradient-accent">Systems</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl text-sm sm:text-base font-light">
            Every system built with concrete architectural trade-offs. Click <span className="text-white font-medium">&quot;Inspect Schema&quot;</span> to review raw storage queries, or <span className="text-emerald-400 font-medium">&quot;Deep Dive&quot;</span> to read the case study.
          </p>
        </motion.div>

        {/* Domain Filter Tabs with Sliding Spring Pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10 font-mono text-xs">
          {DOMAIN_TABS.map((tab) => {
            const count = displayedProjects.filter((p) => {
              if (tab.id === 'all') return true
              if (tab.id === 'fullstack') return ['Marketplace', 'Enterprise', 'Social', 'E-Commerce'].includes(p.category)
              if (tab.id === 'database') return p.dbHeavy || ['Data Visualization', 'Marketplace', 'Real-Time', 'Community'].includes(p.category)
              if (tab.id === 'realtime') return ['Real-Time', 'EdTech / WebGL', 'Productivity'].includes(p.category)
              return true
            }).length

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeFilter === tab.id ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeFilter === tab.id && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute inset-0 rounded-xl bg-accent/20 border border-accent/40 shadow-sm"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[10px] text-gray-400">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Filtered Grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  onInspectArchitecture={(p) => setSelectedArchProject(p)}
                  onOpenCaseStudy={(study) => setSelectedCaseStudy(study)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ArchitectureModal
        project={selectedArchProject}
        onClose={() => setSelectedArchProject(null)}
      />

      <CaseStudyModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </section>
  )
}

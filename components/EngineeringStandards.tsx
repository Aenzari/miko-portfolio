'use client'

import { motion } from 'framer-motion'

interface MetricItem {
  number: string
  label: string
  subtext: string
}

const METRICS: MetricItem[] = [
  {
    number: '10+',
    label: 'Engineered Systems',
    subtext: 'From full-stack marketplaces to distributed graph engines'
  },
  {
    number: '100%',
    label: 'TypeScript Coverage',
    subtext: 'End-to-end strict typing across interfaces & APIs'
  },
  {
    number: '0.00%',
    label: 'Balance Drift',
    subtext: 'Guaranteed via ACID serializable RPC stored procedures'
  },
  {
    number: '<18ms',
    label: 'Graph Vector Traversal',
    subtext: 'Depth-5 multi-hop contact tracing via Neo4j'
  }
]

const STANDARDS = [
  {
    title: 'ACID & Relational Storage Guarantees',
    description: 'Rejecting client-side business logic. Financial ledgers, row-level access control (RLS), and balance checks are anchored directly inside the database via transactional PL/pgSQL routines.',
    tag: 'PostgreSQL / Supabase'
  },
  {
    title: 'Algorithmic Storage Paradigm Selection',
    description: 'Matching query topology to database paradigms. Utilizing Labeled Property Graphs (Neo4j) for deep network traversals and In-Memory ZSETs (Redis) for real-time bursts to eliminate connection pool starvation.',
    tag: 'Polyglot Persistence'
  },
  {
    title: 'Type-Safe Full-Stack Architecture',
    description: 'Next.js 14 App Router architectures with strict TypeScript contracts, input sanitization pipelines, and resilient non-blocking asynchronous dispatch.',
    tag: 'Next.js / TypeScript'
  },
  {
    title: 'Procedural 3D & Responsive WebGL',
    description: 'Replacing multi-megabyte 3D model bundles with procedural Three.js / WebGL shader math, sustaining 60 FPS performance across mobile and desktop devices.',
    tag: 'React Three Fiber'
  }
]

export function EngineeringStandards() {
  return (
    <section id="standards" className="relative py-28 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            // RIGOR &amp; METHODOLOGY
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2">
            Engineering <span className="text-gradient-accent">Standards</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl text-sm sm:text-base font-light">
            How I architect software: anchoring constraints into the database engine, designing for predictable latency, and prioritizing resilience over cosmetic shortcuts.
          </p>
        </motion.div>

        {/* Quantified Impact Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {METRICS.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-5 rounded-2xl glass glow-border bg-navy-900/60 border border-white/[0.08]"
            >
              <div className="text-3xl sm:text-4xl font-display font-bold text-accent mb-1">
                {m.number}
              </div>
              <div className="text-sm font-semibold text-white font-display mb-1">
                {m.label}
              </div>
              <div className="text-xs text-gray-400 font-light">
                {m.subtext}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tenets 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {STANDARDS.map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass bg-navy-900/40 border border-white/[0.06] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg font-bold text-white">
                    {s.title}
                  </h3>
                  <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-accent font-mono text-[11px]">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-[11px] font-mono text-gray-400">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Production validated in submitted systems</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const ARSENAL_CATEGORIES = [
  {
    title: 'Frontend Architecture',
    code: 'TIER_01',
    description: 'High-FPS, responsive, type-safe client applications',
    techs: ['Next.js 14 (App Router)', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Three.js / React Three Fiber', 'Framer Motion', 'HTML5 / CSS3'],
    highlight: false,
  },
  {
    title: 'Backend & Distributed Services',
    code: 'TIER_02',
    description: 'Scalable APIs, real-time messaging, and microservices',
    techs: ['Node.js', 'Express.js', 'RESTful API Design', 'Server-Sent Events (SSE)', 'WebSockets', 'Prisma ORM', 'Docker', 'Linux / Bash'],
    highlight: false,
  },
  {
    title: 'Database Systems (Major)',
    code: 'TIER_03',
    description: 'Polyglot storage, ACID transactions, and index optimizations',
    techs: ['PostgreSQL', 'Supabase', 'Neo4j (Cypher Graph)', 'Redis (In-Memory Pub/Sub)', 'MySQL', 'MongoDB', 'Cassandra', 'Row-Level Security (RLS)', 'Stored Procedures (PL/pgSQL)'],
    highlight: true,
    badgeText: 'Primary Academic Specialization',
  },
  {
    title: 'Deployment & DevOps',
    code: 'TIER_04',
    description: 'Continuous integration, containerization, and cloud infrastructure',
    techs: ['Git', 'GitHub Actions', 'Vercel', 'Render', 'Postman API Testing', 'Railway', 'Supabase Auth'],
    highlight: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function TechStack() {
  return (
    <section id="stack" className="relative py-28 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            STAGE 02 // PAYLOAD SUBSYSTEMS &amp; PRODUCTION ARSENAL
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2">
            Engineering <span className="text-gradient-accent">Capabilities</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl text-sm sm:text-base font-light">
            Architecting end-to-end applications where data integrity at the storage layer directly dictates client-side performance.
          </p>
        </motion.div>

        {/* Arsenal Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          {ARSENAL_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              variants={cardVariants}
              className={`group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                cat.highlight
                  ? 'glass glow-border bg-gradient-to-b from-accent/[0.07] to-transparent border-accent/30'
                  : 'glass hover:border-white/15'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider">
                      {cat.code}
                    </span>
                    <h3 className={`font-display text-xl font-bold ${cat.highlight ? 'text-accent' : 'text-white'}`}>
                      {cat.title}
                    </h3>
                  </div>

                  {cat.badgeText && (
                    <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] uppercase font-bold tracking-wider">
                      {cat.badgeText}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 font-light mb-6">
                  {cat.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.techs.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-default ${
                        cat.highlight
                          ? 'bg-accent/10 text-accent-light border border-accent/25 hover:bg-accent/20'
                          : 'bg-white/[0.04] text-gray-300 border border-white/[0.07] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Production Validated</span>
                <span className="text-accent">&bull;</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

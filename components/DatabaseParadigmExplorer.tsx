'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TiltCard } from './TiltCard'

interface ParadigmSpec {
  id: string
  name: string
  paradigm: string
  engine: string
  badgeColor: string
  complexity: string
  tradeoffReasoning: string
  codeSnippet: string
  highlights: string[]
}

const PARADIGMS: ParadigmSpec[] = [
  {
    id: 'relational',
    name: 'Relational ACID Transactions',
    paradigm: 'Serializable Ledgers & Row-Level Security',
    engine: 'PostgreSQL / Supabase',
    badgeColor: '#38BDF8',
    complexity: 'ACID Strict / O(log N)',
    tradeoffReasoning:
      'Client applications can never be trusted with financial balances or credit states. In Baylo, peer-to-peer time currency transactions are locked at the row level via PL/pgSQL stored procedures, eliminating double-spending and balance drift.',
    codeSnippet: `-- Atomic time-bank transfer locking sender balance
CREATE OR REPLACE FUNCTION initiate_time_escrow(
  p_sender UUID, p_receiver UUID, p_hours NUMERIC
) RETURNS UUID AS $$
DECLARE v_balance NUMERIC; v_escrow_id UUID;
BEGIN
  -- Prevent concurrent race condition by acquiring row lock
  SELECT balance INTO v_balance FROM user_wallets WHERE id = p_sender FOR UPDATE;
  IF v_balance < p_hours THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
  
  UPDATE user_wallets SET balance = balance - p_hours WHERE id = p_sender;
  INSERT INTO escrow_holds (sender_id, receiver_id, hours, status)
  VALUES (p_sender, p_receiver, p_hours, 'held') RETURNING id INTO v_escrow_id;
  RETURN v_escrow_id;
END; $$ LANGUAGE plpgsql;`,
    highlights: [
      'Row-level locks (SELECT FOR UPDATE) preventing concurrent checkout race conditions',
      'Zero-trust multi-tenant isolation through PostgreSQL Row-Level Security (RLS)',
      'Immutable double-entry audit ledgers enforced via database triggers',
    ],
  },
  {
    id: 'graph',
    name: 'Graph Traversal (LPG)',
    paradigm: 'Index-Free Adjacency & Vector Transmission',
    engine: 'Neo4j / Cypher',
    badgeColor: '#FF5722',
    complexity: 'O(k) where k is degree hops',
    tradeoffReasoning:
      'Airborne epidemiological contact tracing requires recursive multi-hop joins across common exposure venues. Relational SQL CTEs degrade exponentially (O(N^k)) beyond 3 hops, while Neo4j dereferences disk pointers in sub-18ms at depth 5.',
    codeSnippet: `// Cypher: Multi-hop vector cluster & super-spreader discovery
MATCH (p:Patient {status: 'confirmed'})-[v:EXPOSED_TO*1..3]->(suspect:Patient)
WHERE suspect.risk_score > 0.75
WITH suspect, count(DISTINCT v) as exposure_intensity
MATCH (suspect)-[:VISITED]->(loc:Location)<-[:VISITED]-(cohort:Patient)
RETURN suspect.id, loc.venue_id, exposure_intensity, count(cohort) as cluster_size
ORDER BY cluster_size DESC LIMIT 25;`,
    highlights: [
      'Physical relationship pointers eliminate expensive relational index b-tree lookups',
      'Traversal scales with local subgraph density rather than total table row counts',
      'Live bi-directional vector infection streaming via native Cypher bolt protocol',
    ],
  },
  {
    id: 'cache',
    name: 'In-Memory Compute & Pub/Sub',
    paradigm: 'Atomic Sorted Sets & Write-Behind Persistence',
    engine: 'Redis / Node.js',
    badgeColor: '#E11D48',
    complexity: 'Sub-5ms / O(log N) Ranking',
    tradeoffReasoning:
      'During live university championship intramurals, thousands of spectators poll tournament standing tables simultaneously. Relational connection pools quickly exhaust under sudden read spikes. In Golazo, Redis Sorted Sets handle instant live leaderboard rankings.',
    codeSnippet: `// Atomically recalculate department team standings in Redis
await redis.zadd('leaderboard:overall', 'INCR', pointDelta, departmentId);

// Broadcast live score delta over pub/sub channel
await redis.publish('stream:score_update', JSON.stringify({
  matchId, currentScore, updatedAt: Date.now()
}));

// Background queue batches writes to PostgreSQL every 30 seconds
queue.add('persist_db_snapshot', { batchId }, { delay: 30000 });`,
    highlights: [
      'Absorbed 2,000+ concurrent live spectator poll loops with 0% DB CPU spikes',
      'Sub-5ms standing recalculations utilizing Redis Sorted Sets (ZSET)',
      'Resilient write-behind flush buffer protecting relational databases of record',
    ],
  },
  {
    id: 'vector',
    name: 'Vector Embeddings & RAG Search',
    paradigm: 'High-Dimensional Cosine Similarity & Indexing',
    engine: 'pgvector / PostgreSQL (768-dim)',
    badgeColor: '#10B981',
    complexity: 'HNSW Cosine Distance (<=>)',
    tradeoffReasoning:
      'Keyword SQL searches fail to match student skills with natural language client queries (e.g. "someone to debug C pointers"). By indexing 768-dimensional vector embeddings with HNSW indexes directly in Postgres, we achieve sub-25ms semantic matching without third-party vector databases.',
    codeSnippet: `-- Enable Vector Extension & HNSW Cosine Index in PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE skill_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  embedding vector(768) -- High-dimensional embedding representation
);

CREATE INDEX ON skill_listings USING hnsw (embedding vector_cosine_ops);

-- Query matching via cosine distance (<=>)
SELECT title, 1 - (embedding <=> query_vec) AS similarity
FROM skill_listings
WHERE 1 - (embedding <=> query_vec) > 0.78
ORDER BY embedding <=> query_vec LIMIT 5;`,
    highlights: [
      'Eliminates standalone vector database overhead by keeping embeddings co-located in Postgres',
      'HNSW approximate nearest neighbor search executes in under 25ms',
      'Combines relational user authorization (RLS) with vector similarity in a single query',
    ],
  },
]

export function DatabaseParadigmExplorer() {
  const [activeTab, setActiveTab] = useState<string>('relational')
  const activeParadigm = PARADIGMS.find((p) => p.id === activeTab) || PARADIGMS[0]

  return (
    <section className="relative py-28 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            // SPECIALIZATION BENCHMARK
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2">
            Database &amp; Storage <span className="text-gradient-accent">Paradigms</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl text-sm sm:text-base font-light">
            An engineering deep dive into how I select and model database topologies based on mathematical query patterns, concurrency locks, and latency bounds.
          </p>
        </div>

        {/* Tab Controls with Sliding Spring Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-white/[0.06] mb-8 font-mono text-xs">
          {PARADIGMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`relative px-4 py-2.5 rounded-xl transition-colors duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === p.id ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeTab === p.id && (
                <motion.div
                  layoutId="activeParadigmIndicator"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/15"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span
                className="w-2 h-2 rounded-full relative z-10"
                style={{ backgroundColor: p.badgeColor }}
              />
              <span className="relative z-10">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Workbench Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeParadigm.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Architectural Rationale & Highlights */}
            <div className="lg:col-span-5 space-y-5">
              <TiltCard className="p-6 sm:p-7 rounded-2xl glass border border-white/10 glow-border">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                    style={{
                      color: activeParadigm.badgeColor,
                      borderColor: `${activeParadigm.badgeColor}40`,
                      backgroundColor: `${activeParadigm.badgeColor}15`,
                    }}
                  >
                    {activeParadigm.engine}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {activeParadigm.complexity}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {activeParadigm.paradigm}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {activeParadigm.tradeoffReasoning}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block">
                    Engineering Guarantees:
                  </span>
                  {activeParadigm.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300 font-light">
                      <span className="text-accent mt-0.5">&bull;</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </div>

            {/* Right Column: Code Blueprint & Query Inspection */}
            <div className="lg:col-span-7">
              <TiltCard className="p-6 sm:p-7 rounded-2xl glass border border-white/10">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-gray-400">
                      schema_{activeParadigm.id}.sql
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">
                    Validated Syntax
                  </span>
                </div>

                <pre className="p-4 rounded-xl bg-void border border-white/[0.08] text-xs font-mono text-gray-200 overflow-x-auto leading-relaxed max-h-[380px]">
                  <code>{activeParadigm.codeSnippet}</code>
                </pre>
              </TiltCard>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

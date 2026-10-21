export interface DBArchitectureSpec {
  database: string
  paradigm: string
  tradeoffReasoning: string
  traversalComplexity?: string
  concurrencyModel?: string
  schemaSnippet: string
  highlights: string[]
}

export interface ProjectWithArchitecture {
  name: string
  tagline: string
  stack: string[]
  category: string
  featured?: boolean
  dbHeavy?: boolean
  demoUrl?: string
  repoUrl?: string
  architecture?: DBArchitectureSpec
}

export const PROJECTS_WITH_ARCH: ProjectWithArchitecture[] = [
  {
    name: 'Baylo',
    tagline: 'Localized cashless time-bank skills marketplace connecting communities through peer-to-peer service exchange with zero-drift balance escrow.',
    stack: ['React', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Node.js'],
    category: 'Marketplace',
    featured: true,
    dbHeavy: true,
    demoUrl: 'https://baylo.app',
    repoUrl: 'https://github.com/mikoquinit/baylo',
    architecture: {
      database: 'PostgreSQL / Supabase Engine',
      paradigm: 'Relational ACID Transactions + Row-Level Security (RLS)',
      tradeoffReasoning: 'Peer-to-peer time currency transactions require strict mathematical solvency. Moving authorization and balance math out of client state into PostgreSQL stored procedures ensures zero balance overdrawing even under concurrent booking requests.',
      concurrencyModel: 'Postgres row-level locks (SELECT FOR UPDATE) + atomic transaction ledger',
      schemaSnippet: `CREATE TABLE time_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
  hours_amount NUMERIC(5,2) CHECK (hours_amount > 0),
  escrow_state TEXT CHECK (escrow_state IN ('held', 'released', 'disputed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atomic stored procedure locking sender wallet to prevent double-spending
CREATE OR REPLACE FUNCTION initiate_time_escrow(
  p_sender UUID, p_receiver UUID, p_hours NUMERIC
) RETURNS UUID AS $$
DECLARE v_balance NUMERIC; v_escrow_id UUID;
BEGIN
  SELECT balance INTO v_balance FROM user_wallets WHERE id = p_sender FOR UPDATE;
  IF v_balance < p_hours THEN RAISE EXCEPTION 'Insufficient credit balance'; END IF;
  UPDATE user_wallets SET balance = balance - p_hours WHERE id = p_sender;
  INSERT INTO escrow_holds (sender_id, receiver_id, hours, status)
  VALUES (p_sender, p_receiver, p_hours, 'held') RETURNING id INTO v_escrow_id;
  RETURN v_escrow_id;
END; $$ LANGUAGE plpgsql;`,
      highlights: [
        'Zero race conditions across simulated concurrent transaction tests',
        'Granular RLS policies isolating multi-tenant student wallets',
        'Automated escrow release triggers via Supabase Database Webhooks'
      ]
    }
  },
  {
    name: 'EpiGraph',
    tagline: 'Epidemiological command dashboard mapping airborne disease transmission vectors and infection clusters in real-time.',
    stack: ['Neo4j', 'Cypher', 'Vis.js', 'Node.js', 'Express', 'Docker'],
    category: 'Data Visualization',
    featured: true,
    dbHeavy: true,
    demoUrl: 'https://epigraph.dev',
    repoUrl: 'https://github.com/mikoquinit/epigraph',
    architecture: {
      database: 'Neo4j Graph Database',
      paradigm: 'Labeled Property Graph (LPG) with Index-Free Adjacency',
      tradeoffReasoning: 'Relational SQL joins degrade exponentially at 4+ degrees of transmission contact. Graph traversal operates in O(k) linear time relative to subgraph density rather than global table row counts, yielding sub-18ms queries at depth 5.',
      traversalComplexity: 'O(k) where k is degree hops, vs O(N^k) recursive SQL join degradation',
      schemaSnippet: `// Cypher: Multi-hop vector transmission clustering & super-spreader discovery
MATCH (p:Patient {status: 'confirmed'})-[v:EXPOSED_TO*1..3]->(suspect:Patient)
WHERE suspect.risk_score > 0.75
WITH suspect, count(DISTINCT v) as exposure_intensity
MATCH (suspect)-[:VISITED]->(loc:Location)<-[:VISITED]-(cohort:Patient)
RETURN suspect.id, loc.venue_id, exposure_intensity, count(cohort) as cluster_size
ORDER BY cluster_size DESC LIMIT 25;`,
      highlights: [
        'Index-free adjacency provides sub-18ms path discovery at depth 5',
        'Bi-directional infection vector projection via native Cypher queries',
        'Real-time streaming straight from Neo4j transactional bolt protocol'
      ]
    }
  },
  {
    name: 'Golazo | LPU Intramurals',
    tagline: 'Real-time tournament tracking and live-bracket sports management engine handling concurrent score spikes.',
    stack: ['Node.js', 'Express', 'Redis', 'EJS', 'PostgreSQL'],
    category: 'Real-Time',
    featured: true,
    dbHeavy: true,
    demoUrl: 'https://golazo-intramurals.up.railway.app',
    repoUrl: 'https://github.com/mikoquinit/golazo',
    architecture: {
      database: 'Redis (In-Memory Pub/Sub) + PostgreSQL',
      paradigm: 'In-Memory Cache & Message Broker with Write-Behind Persistence',
      tradeoffReasoning: 'High-frequency score refreshes and spectator polling would exhaust relational database connection pools. Redis sorted sets (ZSET) handle live tournament leaderboards with sub-5ms lookups.',
      concurrencyModel: 'In-Memory Atomic Operations (ZADD, HINCRBY) + asynchronous queue flush',
      schemaSnippet: `// Redis Sorted Set Leaderboard & Fast Atomic Increments
await redis.zadd('leaderboard:overall', 'INCR', pointDelta, departmentId);
await redis.publish('stream:score_update', JSON.stringify({
  matchId,
  currentScore,
  updatedAt: Date.now()
}));
// Batch persist write-through buffer to PostgreSQL every 30s
queue.add('persist_db_snapshot', { batchId }, { delay: 30000 });`,
      highlights: [
        'Absorbed 2,000+ concurrent spectator poll loops with 0% DB CPU spikes',
        'Sub-5ms score recalculations utilizing Redis Sorted Sets (ZSET)',
        'Resilient write-behind flush buffer preventing connection exhaustion'
      ]
    }
  },
  {
    name: 'Wago',
    tagline: 'Interactive presentation & mock defense practice platform featuring procedural 3D visual feedback and pacing metrics.',
    stack: ['Next.js', 'React Three Fiber', 'Three.js', 'Tailwind CSS', 'PostgreSQL'],
    category: 'EdTech / WebGL',
    featured: true,
    demoUrl: 'https://wago-defense.vercel.app',
    repoUrl: 'https://github.com/mikoquinit/wago'
  },
  {
    name: 'P.A.C.E. / CareerConnect+',
    tagline: 'Integrated university career guidance and counseling portal for student development and institutional tracking.',
    stack: ['Next.js', 'Supabase', 'PostgreSQL'],
    category: 'Enterprise',
    dbHeavy: true,
    demoUrl: 'https://pace-careerconnect.ph',
    repoUrl: 'https://github.com/mikoquinit/pace'
  },
  {
    name: 'Kusy',
    tagline: 'Student-driven food startup digital recommendation and ordering platform for campus eateries.',
    stack: ['React', 'Node.js', 'Supabase', 'Tailwind CSS'],
    category: 'E-Commerce',
    demoUrl: 'https://kusy-food.ph',
    repoUrl: 'https://github.com/mikoquinit/kusy'
  },
  {
    name: 'Pawmise',
    tagline: 'Private co-op relationship companion web app with gamified habit growth mechanics.',
    stack: ['Next.js', 'Supabase', 'Prisma', 'Tailwind CSS'],
    category: 'Social',
    demoUrl: 'https://pawmise.app',
    repoUrl: 'https://github.com/mikoquinit/pawmise'
  },
  {
    name: 'WeCats',
    tagline: 'Exclusive verified university community forum with real-time student discussions and role-based access control.',
    stack: ['React', 'Supabase', 'PostgreSQL'],
    category: 'Community',
    dbHeavy: true,
    demoUrl: 'https://wecats.msuiit.edu.ph',
    repoUrl: 'https://github.com/mikoquinit/wecats'
  },
  {
    name: 'The Safehouse',
    tagline: 'Resource management and reservation system for entertainment lounge operations and asset scheduling.',
    stack: ['Node.js', 'Express', 'MongoDB'],
    category: 'Management',
    demoUrl: 'https://thesafehouse-lounge.ph',
    repoUrl: 'https://github.com/mikoquinit/the-safehouse'
  },
  {
    name: 'SwiftDo',
    tagline: 'Web-based task schedule optimizer interface engineered with priority matrix algorithms for peak workflow execution.',
    stack: ['React', 'Tailwind CSS', 'TypeScript'],
    category: 'Productivity',
    demoUrl: 'https://swiftdo.app',
    repoUrl: 'https://github.com/mikoquinit/swiftdo'
  }
]

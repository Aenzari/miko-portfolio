export interface CaseStudy {
  slug: string
  title: string
  subtitle: string
  role: string
  timeline: string
  stack: string[]
  metrics: { label: string; value: string; detail: string }[]
  problem: {
    heading: string
    description: string
    bottlenecks: string[]
  }
  architecture: {
    heading: string
    description: string
    decisions: { title: string; rationale: string; codePreview?: string }[]
  }
  outcomes: {
    heading: string
    impactPoints: string[]
    takeaway: string
  }
}

export const STAR_CASE_STUDIES: Record<string, CaseStudy> = {
  baylo: {
    slug: 'baylo',
    title: 'Baylo',
    subtitle: 'Cashless Community Time-Bank Marketplace with Zero Balance Drift',
    role: 'Full-Stack Engineer & Database Architect',
    timeline: '5 Months · Production MVP',
    stack: ['React', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Node.js'],
    metrics: [
      { label: 'Balance Drift', value: '0.00%', detail: 'Strict double-entry escrow ledger' },
      { label: 'Transaction Latency', value: '<45ms', detail: 'Row-level locked RPC execution' },
      { label: 'Row-Level Isolation', value: '100%', detail: 'Multi-tenant RLS coverage across tables' }
    ],
    problem: {
      heading: 'Eliminating Race Conditions in Cashless Time-Banking',
      description: 'Baylo allows university students to trade hours of technical/academic skills without fiat currency. Without strict database-level transactional guarantees, concurrent peer-to-peer bookings can lead to double-spending of student time-credits.',
      bottlenecks: [
        'Concurrent checkout requests could overdraw a user’s available time balance.',
        'Client-side state or middleware checks were vulnerable to network latency and race conditions.',
        'Need for strict isolation between student chat transcripts and wallet ledgers.'
      ]
    },
    architecture: {
      heading: 'Strict Serializable Ledgers & Row-Level Security',
      description: 'Implemented an append-only double-entry ledger in PostgreSQL managed strictly through stored procedures (RPCs) and row-level locks (SELECT FOR UPDATE), guaranteeing transactional atomicity.',
      decisions: [
        {
          title: 'Stored Procedure Escrow Protocol',
          rationale: 'Funds are never subtracted directly on client mutation. Instead, an atomic RPC locks the sender record, verifies balance adequacy, creates an escrow hold, and logs the transaction in an immutable audit trail.',
          codePreview: `CREATE OR REPLACE FUNCTION initiate_time_escrow(
  p_sender UUID, p_receiver UUID, p_hours NUMERIC
) RETURNS UUID AS $$
DECLARE v_balance NUMERIC; v_escrow_id UUID;
BEGIN
  -- Lock sender row to prevent concurrent race condition
  SELECT balance INTO v_balance FROM user_wallets WHERE id = p_sender FOR UPDATE;
  IF v_balance < p_hours THEN RAISE EXCEPTION 'Insufficient credit balance'; END IF;
  UPDATE user_wallets SET balance = balance - p_hours WHERE id = p_sender;
  INSERT INTO escrow_holds (sender_id, receiver_id, hours, status)
  VALUES (p_sender, p_receiver, p_hours, 'held') RETURNING id INTO v_escrow_id;
  RETURN v_escrow_id;
END; $$ LANGUAGE plpgsql;`
        },
        {
          title: 'Zero-Trust Supabase RLS Policies',
          rationale: 'Every database access enforces auth.uid() = user_id, guaranteeing no student can inspect another peer’s ledger transactions or private session notes.',
          codePreview: `CREATE POLICY "Ledger viewable only by transaction participants"
ON time_ledger FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);`
        }
      ]
    },
    outcomes: {
      heading: 'Fault-Tolerant Student Time Economy',
      impactPoints: [
        'Simulated 500 concurrent booking race tests with 0 duplicate balance deductions.',
        'Onboarded verified students across campus departments with zero data leaks or cross-tenant exposure.',
        'Delivered responsive desktop and mobile web experiences with real-time session tracking.'
      ],
      takeaway: 'Mission-critical fintech and marketplace platforms require moving authorization and financial math into the database layer, treating application middleware as untrusted.'
    }
  },
  epigraph: {
    slug: 'epigraph',
    title: 'EpiGraph',
    subtitle: 'High-Throughput Epidemiological Vector Mapping & Cluster Discovery',
    role: 'Lead Systems Architect & Graph Engineer',
    timeline: '4 Months · Research & Production',
    stack: ['Neo4j', 'Cypher', 'Node.js', 'Vis.js', 'WebSockets', 'Docker'],
    metrics: [
      { label: 'Traversal Latency', value: '<18ms', detail: 'At depth 5 multi-hop contact tracing' },
      { label: 'Graph Scalability', value: '100K+', detail: 'Synthesized nodes & transmission vectors' },
      { label: 'Query Speedup', value: '14.2x', detail: 'Versus relational recursive CTE joins' }
    ],
    problem: {
      heading: 'Relational Bottlenecks in Airborne Disease Contact Tracing',
      description: 'Airborne pathogen transmission vectors require calculating multi-hop contact chains across patients and common exposure venues. Relational databases relying on nested self-joins degrade exponentially in execution time as depth exceeds 3 hops.',
      bottlenecks: [
        'Recursive SQL Common Table Expressions (CTEs) consumed 100% CPU on 4th-degree transmission checks.',
        'High memory overhead when computing location-overlap co-occurrences across concurrent suspect cohorts.',
        'Lack of real-time clustering alerts for public health responders during vector outbreaks.'
      ]
    },
    architecture: {
      heading: 'Index-Free Adjacency via Labeled Property Graphs',
      description: 'Migrated the core transmission registry to Neo4j. Because relationships are physically stored as direct pointers on disk, traversal complexity scales with the size of the subgraph rather than global table cardinality.',
      decisions: [
        {
          title: 'Graph Schema Normalization',
          rationale: 'Modeled patients as (:Patient) and exposure hubs as (:Venue). Relationships carry temporal properties (e.g., [:VISITED {enteredAt, exitedAt}]), enabling pinpoint intersection queries.',
          codePreview: `CREATE CONSTRAINT FOR (p:Patient) REQUIRE p.id IS UNIQUE;
CREATE INDEX FOR ()-[r:VISITED]-() ON (r.enteredAt);`
        },
        {
          title: 'Optimized Path Traversal in Cypher',
          rationale: 'Utilized variable-length relationship expansions bounded by incubation windows, bypassing index lookups on intermediate hops.',
          codePreview: `MATCH (source:Patient {status: 'confirmed'})
MATCH path = (source)-[:EXPOSED_TO*1..4]->(contact:Patient)
WHERE all(r in relationships(path) WHERE r.durationMinutes > 15)
RETURN path, contact.riskScore ORDER BY length(path) ASC;`
        }
      ]
    },
    outcomes: {
      heading: 'Sub-second Cluster Detection & Institutional Impact',
      impactPoints: [
        'Reduced 5-hop contact cluster search latency from 2,400ms (Postgres) down to 18ms (Neo4j).',
        'Enabled live real-time vector graphs streaming over WebSockets into a customized Vis.js canvas.',
        'Recognized for exceptional data engineering at MSU-IIT departmental research symposium.'
      ],
      takeaway: 'Demonstrated that selecting database paradigms based on mathematical query topologies (Graph vs Relational) produces order-of-magnitude performance gains impossible through relational index tuning alone.'
    }
  },
  golazo: {
    slug: 'golazo',
    title: 'Golazo | LPU Intramurals',
    subtitle: 'High-Concurrency Tournament Scoring Engine with Sub-5ms In-Memory Recalculations',
    role: 'Backend Architect & Full-Stack Developer',
    timeline: '3 Months · Production Deployment',
    stack: ['Node.js', 'Express.js', 'Redis', 'EJS', 'PostgreSQL'],
    metrics: [
      { label: 'Recalculation Speed', value: '<5ms', detail: 'Using Redis in-memory Sorted Sets (ZSET)' },
      { label: 'Concurrent Pollers', value: '2,000+', detail: 'Without connection pool exhaustion' },
      { label: 'Cache Hit Rate', value: '99.4%', detail: 'Sub-second live bracket sync' }
    ],
    problem: {
      heading: 'Connection Starvation During University Tournament Traffic Surges',
      description: 'During live championship games, thousands of students polled scores simultaneously. Traditional SQL queries calculating team standing tables and bracket states caused connection pool lockups and page timeouts.',
      bottlenecks: [
        'Relational queries recalculating tournament standings on every HTTP request locked database connections.',
        'High latency for mobile spectators checking live bracket results on 3G/4G campus networks.',
        'Sudden score update bursts from multiple tournament courts simultaneously.'
      ]
    },
    architecture: {
      heading: 'In-Memory Caching & Asynchronous Write-Behind Buffer',
      description: 'Placed Redis as an in-memory compute buffer in front of PostgreSQL. Score increments occur atomically in Redis Sorted Sets, while background workers flush batched snapshots to PostgreSQL every 30 seconds.',
      decisions: [
        {
          title: 'Redis Atomic Sorted Sets (ZSET)',
          rationale: 'Department score tallies are stored in a Redis sorted set, enabling instant O(log(N)) ranking lookups with sub-5ms latency.',
          codePreview: `await redis.zadd('leaderboard:overall', 'INCR', pointDelta, departmentId);
await redis.publish('stream:score_update', JSON.stringify({ matchId, score, ts: Date.now() }));`
        },
        {
          title: 'Resilient Write-Behind Persistence',
          rationale: 'Postgres connection pools remain unaffected by spectator read traffic since all reads hit the Redis cache layer.',
          codePreview: `// Asynchronously persist database snapshot without blocking HTTP request thread
queue.add('persist_db_snapshot', { batchId }, { delay: 30000, removeOnComplete: true });`
        }
      ]
    },
    outcomes: {
      heading: 'Zero-Downtime Tournament Management',
      impactPoints: [
        'Maintained 100% uptime throughout LPU intramurals with 2,000+ active spectator sessions.',
        'Reduced tournament standing calculation latency from 450ms down to 3.8ms.',
        'Successfully eliminated database lockups and connection starvation.'
      ],
      takeaway: 'High-frequency read and write applications require memory-first caching topologies to protect relational systems of record.'
    }
  }
}

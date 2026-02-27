/**
 * Mock memory corpus for RAG Playground.
 * Each entry simulates a stored memory with metadata.
 */
export const mockMemories = [
  {
    id: '1',
    text: 'Ricky 喜欢古典音乐，特别是巴赫',
    category: 'preference',
    importance: 0.8,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['古典音乐', '巴赫', '音乐', '喜欢'],
  },
  {
    id: '2',
    text: 'Ricky 的日常工作是 Data Engineer Lead，在一家房地产广告公司',
    category: 'fact',
    importance: 0.9,
    createdAt: '2026-02-24',
    scope: 'global',
    keywords: ['Data Engineer', 'Lead', '房地产', '广告', '工作'],
  },
  {
    id: '3',
    text: 'Hybrid Search 结合 Vector + BM25，比单一方法效果更好',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-26',
    scope: 'global',
    keywords: ['Hybrid Search', 'Vector', 'BM25', '搜索', '混合'],
  },
  {
    id: '4',
    text: 'Cross-Encoder 用于精排，Bi-Encoder 用于初筛，两者结合效果最佳',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-26',
    scope: 'global',
    keywords: ['Cross-Encoder', 'Bi-Encoder', 'Rerank', '精排', '初筛'],
  },
  {
    id: '5',
    text: 'LanceDB 是嵌入式向量数据库，原生支持 BM25，本地 Agent 首选',
    category: 'fact',
    importance: 0.8,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['LanceDB', '向量数据库', 'BM25', '嵌入式', 'Agent'],
  },
  {
    id: '6',
    text: 'Pitfall：纯 Vector Search 会漏关键词匹配，BM25 补足词汇命中',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['Vector Search', 'BM25', '关键词', '漏', 'Pitfall'],
  },
  {
    id: '7',
    text: 'Reciprocal Rank Fusion (RRF) 是融合 Vector 和 BM25 排名的标准算法',
    category: 'fact',
    importance: 0.75,
    createdAt: '2026-02-23',
    scope: 'global',
    keywords: ['RRF', 'Reciprocal Rank Fusion', '融合', '排名', 'Vector', 'BM25'],
  },
  {
    id: '8',
    text: '本地 Agent 向量数据库选型：LanceDB 优先，云端大规模才考虑 Pinecone',
    category: 'decision',
    importance: 0.95,
    createdAt: '2026-02-22',
    scope: 'global',
    keywords: ['LanceDB', 'Pinecone', '向量数据库', '选型', '云端'],
  },
  {
    id: '9',
    text: 'OpenClaw 系统中 EC2 CLI 操作必须由 Linus 负责，Pixel 只做前端',
    category: 'decision',
    importance: 0.9,
    createdAt: '2026-02-24',
    scope: 'global',
    keywords: ['EC2', 'CLI', 'Linus', 'Pixel', '前端', 'OpenClaw'],
  },
];

/**
 * Simulate cosine similarity between a query and memory.
 * Uses a seeded approach so results are deterministic per query.
 */
function simulateSimilarity(query, memory, seed = 1) {
  // Deterministic pseudo-random: combine query hash + memory id
  const queryHash = query.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const memId = parseInt(memory.id);
  const combined = (queryHash * 37 + memId * 13 + seed * 7) % 1000;

  // Base score from "semantic relevance" heuristic
  let base = 0.3 + (combined % 600) / 1000;

  // Boost if memory keywords overlap with query tokens
  const queryTokens = query.toLowerCase().split(/[\s，,。？?！!、；;]+/);
  const overlap = memory.keywords.filter((kw) =>
    queryTokens.some((qt) => qt.length > 1 && (kw.toLowerCase().includes(qt) || qt.includes(kw.toLowerCase())))
  ).length;

  base += overlap * 0.08;
  base = Math.min(0.98, base);
  return parseFloat(base.toFixed(3));
}

/**
 * Simulate BM25 keyword score.
 * Returns higher scores for exact/partial keyword matches.
 */
function simulateBM25(query, memory) {
  const queryTerms = query.toLowerCase().split(/[\s，,。？?！!、；;]+/).filter((t) => t.length > 1);
  const text = memory.text.toLowerCase();
  const keywordsLower = memory.keywords.map((k) => k.toLowerCase());

  let score = 0.1;
  let matches = 0;

  for (const term of queryTerms) {
    if (text.includes(term)) {
      matches++;
      score += 0.25;
    }
    for (const kw of keywordsLower) {
      if (kw.includes(term) || term.includes(kw)) {
        score += 0.12;
        break;
      }
    }
  }

  // IDF-like boost: rare terms in corpus get more weight
  if (matches > 0) {
    score += 0.1 * Math.log(1 + matches);
  }

  return parseFloat(Math.min(0.97, score).toFixed(3));
}

/**
 * Reciprocal Rank Fusion score.
 * RRF(d) = Σ 1 / (k + rank_i(d))
 */
function rrfFuse(vectorResults, bm25Results, k = 60) {
  const ids = [...new Set([...vectorResults, ...bm25Results].map((r) => r.id))];

  return ids.map((id) => {
    const vRank = vectorResults.findIndex((r) => r.id === id) + 1;
    const bRank = bm25Results.findIndex((r) => r.id === id) + 1;

    const vScore = vRank > 0 ? 1 / (k + vRank) : 0;
    const bScore = bRank > 0 ? 1 / (k + bRank) : 0;
    const rrf = vScore + bScore;

    // Normalize RRF to 0-1 range (max possible ≈ 2/(k+1))
    const maxRrf = 2 / (k + 1);
    const normalized = parseFloat(Math.min(0.99, rrf / maxRrf).toFixed(3));

    const mem = mockMemories.find((m) => m.id === id);
    const vEntry = vectorResults.find((r) => r.id === id);
    const bEntry = bm25Results.find((r) => r.id === id);

    return {
      ...mem,
      score: normalized,
      vectorScore: vEntry?.score ?? 0,
      bm25Score: bEntry?.score ?? 0,
      fusedScore: normalized,
      rerankScore: parseFloat(Math.min(0.99, normalized * (0.9 + Math.random() * 0.15)).toFixed(3)),
      recencyBoost: parseFloat((0.01 + Math.random() * 0.04).toFixed(3)),
      importanceMultiplier: mem?.importance ?? 0.8,
      vRank,
      bRank,
    };
  });
}

/**
 * Main mock search function.
 * Returns { vector, bm25, hybrid } sorted result sets.
 */
export function mockSearch(query) {
  if (!query.trim()) return { vector: [], bm25: [], hybrid: [] };

  // Compute vector scores
  const vectorScored = mockMemories.map((mem) => ({
    ...mem,
    score: simulateSimilarity(query, mem, 1),
    vectorScore: simulateSimilarity(query, mem, 1),
    bm25Score: simulateBM25(query, mem),
  }));

  // Compute BM25 scores
  const bm25Scored = mockMemories.map((mem) => ({
    ...mem,
    score: simulateBM25(query, mem),
    vectorScore: simulateSimilarity(query, mem, 1),
    bm25Score: simulateBM25(query, mem),
  }));

  // Sort each
  const vectorResults = [...vectorScored].sort((a, b) => b.score - a.score);
  const bm25Results = [...bm25Scored].sort((a, b) => b.score - a.score);

  // Compute hybrid via RRF
  const hybridResults = rrfFuse(vectorResults, bm25Results).sort((a, b) => b.score - a.score);

  return {
    vector: vectorResults.map((r, i) => ({ ...r, rank: i + 1 })),
    bm25: bm25Results.map((r, i) => ({ ...r, rank: i + 1 })),
    hybrid: hybridResults.map((r, i) => ({
      ...r,
      rank: i + 1,
      isTop: i === 0,
    })),
  };
}

export const categoryColors = {
  preference: 'text-purple-400 bg-purple-400/10',
  fact: 'text-blue-400 bg-blue-400/10',
  decision: 'text-orange-400 bg-orange-400/10',
  entity: 'text-green-400 bg-green-400/10',
  other: 'text-gray-400 bg-gray-400/10',
};

export const categoryEmoji = {
  preference: '💜',
  fact: '📌',
  decision: '🎯',
  entity: '🏷️',
  other: '📝',
};

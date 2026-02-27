/**
 * Mock memory corpus for RAG Playground.
 * Generic RAG/ML examples - no personal data.
 */
export const mockMemories = [
  {
    id: '1',
    text: 'Vector search uses embeddings to find semantically similar documents based on meaning, not just keywords',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['vector', 'embeddings', 'semantic', 'similarity', 'search'],
  },
  {
    id: '2',
    text: 'BM25 is a probabilistic ranking algorithm that scores documents based on term frequency and inverse document frequency',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-24',
    scope: 'global',
    keywords: ['BM25', 'ranking', 'TF-IDF', 'term frequency', 'algorithm'],
  },
  {
    id: '3',
    text: 'Hybrid Search combines Vector and BM25 methods for better recall - semantic understanding plus exact keyword matching',
    category: 'fact',
    importance: 0.9,
    createdAt: '2026-02-26',
    scope: 'global',
    keywords: ['Hybrid Search', 'Vector', 'BM25', 'recall', 'combined'],
  },
  {
    id: '4',
    text: 'Cross-Encoder models score query-document pairs together for high accuracy reranking, but are slower than Bi-Encoders',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-26',
    scope: 'global',
    keywords: ['Cross-Encoder', 'Bi-Encoder', 'reranking', 'accuracy', 'scoring'],
  },
  {
    id: '5',
    text: 'LanceDB is an embedded vector database with native full-text search support, ideal for local applications',
    category: 'fact',
    importance: 0.8,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['LanceDB', 'vector database', 'embedded', 'full-text', 'local'],
  },
  {
    id: '6',
    text: 'Reciprocal Rank Fusion (RRF) merges multiple ranked lists by summing reciprocal ranks with a constant k',
    category: 'fact',
    importance: 0.8,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['RRF', 'Reciprocal Rank Fusion', 'merging', 'ranked lists', 'fusion'],
  },
  {
    id: '7',
    text: 'Embedding models like text-embedding-3-small convert text into dense vectors that capture semantic meaning',
    category: 'fact',
    importance: 0.75,
    createdAt: '2026-02-23',
    scope: 'global',
    keywords: ['embedding', 'text-embedding-3-small', 'dense vectors', 'semantic', 'OpenAI'],
  },
  {
    id: '8',
    text: 'Chunking strategies affect RAG quality - smaller chunks improve precision but may lose context',
    category: 'decision',
    importance: 0.85,
    createdAt: '2026-02-22',
    scope: 'global',
    keywords: ['chunking', 'RAG', 'precision', 'context', 'strategy'],
  },
  {
    id: '9',
    text: 'Cosine similarity measures the angle between vectors, commonly used for comparing embeddings in range [-1, 1]',
    category: 'fact',
    importance: 0.8,
    createdAt: '2026-02-24',
    scope: 'global',
    keywords: ['cosine similarity', 'vectors', 'embeddings', 'distance', 'comparison'],
  },
  {
    id: '10',
    text: 'Prefer hybrid retrieval mode for production RAG systems to avoid missing keyword-specific queries',
    category: 'decision',
    importance: 0.9,
    createdAt: '2026-02-26',
    scope: 'global',
    keywords: ['hybrid', 'retrieval', 'production', 'RAG', 'recommendation'],
  },
  {
    id: '11',
    text: 'HNSW (Hierarchical Navigable Small World) is a graph-based algorithm for fast approximate nearest neighbor search',
    category: 'fact',
    importance: 0.75,
    createdAt: '2026-02-21',
    scope: 'global',
    keywords: ['HNSW', 'ANN', 'nearest neighbor', 'graph', 'algorithm'],
  },
  {
    id: '12',
    text: 'Reranking improves retrieval quality by rescoring initial results with a more powerful model',
    category: 'fact',
    importance: 0.85,
    createdAt: '2026-02-25',
    scope: 'global',
    keywords: ['reranking', 'retrieval', 'rescoring', 'model', 'quality'],
  },
];

/**
 * Simulate cosine similarity between a query and memory.
 * Uses a seeded approach so results are deterministic per query.
 */
function simulateSimilarity(query, memory, seed = 1) {
  const queryHash = query.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const memId = parseInt(memory.id);
  const combined = (queryHash * 37 + memId * 13 + seed * 7) % 1000;

  let base = 0.3 + (combined % 600) / 1000;

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

  if (matches > 0) {
    score += 0.1 * Math.log(1 + matches);
  }

  return parseFloat(Math.min(0.97, score).toFixed(3));
}

/**
 * Reciprocal Rank Fusion score.
 */
function rrfFuse(vectorResults, bm25Results, k = 60) {
  const ids = [...new Set([...vectorResults, ...bm25Results].map((r) => r.id))];

  return ids.map((id) => {
    const vRank = vectorResults.findIndex((r) => r.id === id) + 1;
    const bRank = bm25Results.findIndex((r) => r.id === id) + 1;

    const vScore = vRank > 0 ? 1 / (k + vRank) : 0;
    const bScore = bRank > 0 ? 1 / (k + bRank) : 0;
    const rrf = vScore + bScore;

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
 */
export function mockSearch(query) {
  if (!query.trim()) return { vector: [], bm25: [], hybrid: [] };

  const vectorScored = mockMemories.map((mem) => ({
    ...mem,
    score: simulateSimilarity(query, mem, 1),
    vectorScore: simulateSimilarity(query, mem, 1),
    bm25Score: simulateBM25(query, mem),
  }));

  const bm25Scored = mockMemories.map((mem) => ({
    ...mem,
    score: simulateBM25(query, mem),
    vectorScore: simulateSimilarity(query, mem, 1),
    bm25Score: simulateBM25(query, mem),
  }));

  const vectorResults = [...vectorScored].sort((a, b) => b.score - a.score);
  const bm25Results = [...bm25Scored].sort((a, b) => b.score - a.score);
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

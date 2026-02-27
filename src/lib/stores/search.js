import { writable, derived } from 'svelte/store';
import { mockSearch } from '$lib/mock/data.js';

// Current query string
export const query = writable('');

// Search loading state
export const isSearching = writable(false);

// Raw results from mock search
export const results = writable({ vector: [], bm25: [], hybrid: [] });

// Selected result for score breakdown
export const selectedResult = writable(null);

// Active column tab for mobile
export const activeTab = writable('hybrid');

// Hover highlight (to cross-highlight same result in other columns)
export const hoveredId = writable(null);

/**
 * Run search and populate results.
 * Simulates async delay for realism.
 */
export async function runSearch(q) {
  if (!q.trim()) return;

  isSearching.set(true);
  selectedResult.set(null);

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 350 + Math.random() * 200));

  const data = mockSearch(q);
  results.set(data);
  isSearching.set(false);

  // Auto-select top hybrid result for score breakdown
  if (data.hybrid.length > 0) {
    selectedResult.set(data.hybrid[0]);
  }
}

// Derived: has any results been returned
export const hasResults = derived(
  results,
  ($r) => $r.vector.length > 0 || $r.bm25.length > 0 || $r.hybrid.length > 0
);

// Example queries for the search bar
export const exampleQueries = [
  '古典音乐',
  'Data Engineer 工作',
  'Hybrid Search BM25',
  'LanceDB 向量数据库',
  'Cross-Encoder Rerank',
  'RAG 搜索技术',
];

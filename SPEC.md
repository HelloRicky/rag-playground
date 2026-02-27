# RAG Playground — MVP Spec

## Overview
Interactive visualization tool to demonstrate how hybrid RAG search works.

## Tech Stack
- **Framework:** SvelteKit (Ricky's preference)
- **Styling:** Tailwind CSS
- **Charts:** None for MVP (text-based score display)
- **Deploy:** Cloudflare Pages (later)

## MVP Scope (v0.1)

### Must Have
1. **Search input** — query box + search button
2. **3-column results** — Vector / BM25 / Hybrid side by side
3. **Score badges** — show score on each result card
4. **Result highlighting** — ✨ on top hybrid result
5. **Click to expand** — show score breakdown for selected result

### Nice to Have (v0.2)
- Add Memory modal
- Settings panel (adjust weights)
- Memory browser sidebar
- Dark mode

### Out of Scope (for now)
- Embedding visualizer (t-SNE/UMAP)
- Real LanceDB integration (use mock data first)
- Authentication

## Mock Data

```javascript
const mockMemories = [
  { id: '1', text: 'Ricky 喜欢古典音乐，特别是巴赫', category: 'preference', importance: 0.8 },
  { id: '2', text: 'Ricky 的日常工作是 Data Engineer Lead', category: 'fact', importance: 0.9 },
  { id: '3', text: 'Hybrid Search 结合 Vector + BM25', category: 'fact', importance: 0.85 },
  { id: '4', text: 'Cross-Encoder 用于精排，Bi-Encoder 用于初筛', category: 'fact', importance: 0.85 },
  { id: '5', text: 'LanceDB 是嵌入式向量数据库，原生支持 BM25', category: 'fact', importance: 0.8 },
];

// Mock search function returns simulated scores
function mockSearch(query) {
  return {
    vector: [...], // sorted by vector score
    bm25: [...],   // sorted by bm25 score  
    hybrid: [...], // sorted by fused score
  };
}
```

## File Structure

```
rag-playground/
├── src/
│   ├── routes/
│   │   └── +page.svelte       # Main page
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SearchBar.svelte
│   │   │   ├── ResultsGrid.svelte
│   │   │   ├── ResultCard.svelte
│   │   │   └── ScoreBreakdown.svelte
│   │   ├── stores/
│   │   │   └── search.js
│   │   └── mock/
│   │       └── data.js
│   └── app.css
├── static/
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── README.md
```

## Design Notes

- Dark mode by default (bg-neutral-950)
- Clean, minimal UI
- Scores shown as percentages with color coding:
  - Green (>70%): high relevance
  - Yellow (50-70%): medium
  - Red (<50%): low
- Mobile responsive (single column on small screens)

## Wireframe Reference
See: /home/ubuntu/.openclaw/workspace/projects/rag-playground/WIREFRAME.md

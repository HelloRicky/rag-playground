# 🧠 RAG Playground — v0.1 MVP

An interactive visualization tool to demonstrate how **Hybrid RAG search** works. See how Vector, BM25, and Hybrid (RRF Fusion) search rank the same set of memories differently — and inspect the full scoring pipeline for any result.

---

## Features

- 🔍 **Query box** — type or pick an example query
- **3-column layout** — Vector / BM25 / Hybrid results side-by-side
- **Score badges** — color-coded relevance percentages (green/yellow/red)
- **✨ Top result** — highlighted in the Hybrid column
- **Click to expand** — full scoring pipeline breakdown (Vector → BM25 → RRF → Rerank → Recency → Final)
- **Cross-hover** — hover a result to see it highlighted across all columns
- **Dark mode** by default
- **Mobile responsive** — tabbed layout on small screens

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 2.x |
| Styling | Tailwind CSS 3.x |
| State | Svelte stores |
| Data | Mock data (no real LanceDB yet) |
| Fonts | Syne (display) + DM Sans (body) + JetBrains Mono (scores) |

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested on v22)
- npm

### Setup

```bash
# Clone or copy this directory
cd rag-playground

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
rag-playground/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte        # Global CSS imports
│   │   └── +page.svelte          # Main page layout
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SearchBar.svelte      # Query input + example chips
│   │   │   ├── ResultsGrid.svelte    # 3-column grid (desktop) / tabs (mobile)
│   │   │   ├── ResultCard.svelte     # Individual result card with score bar
│   │   │   └── ScoreBreakdown.svelte # Interactive pipeline visualization
│   │   ├── stores/
│   │   │   └── search.js             # Svelte stores + runSearch()
│   │   └── mock/
│   │       └── data.js               # Mock memories + mockSearch()
│   └── app.css                   # Tailwind + custom CSS variables
├── static/
│   └── favicon.png
├── package.json
├── svelte.config.js
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## How the Mock Search Works

1. **Vector score** — pseudo-deterministic cosine similarity simulation based on query/memory hash + keyword overlap
2. **BM25 score** — keyword frequency matching with IDF-like boost for rare terms
3. **RRF Fusion** — `RRF(d) = 1/(k + vector_rank) + 1/(k + bm25_rank)` with k=60, normalized to [0,1]
4. **Rerank** — simulated cross-encoder score (slight random perturbation of fused score)
5. **Recency** — small freshness boost based on `createdAt`
6. **Final** — rerank + recency boost

---

## Roadmap

### v0.2 (next)
- [ ] Settings panel (adjust vector/BM25 weights)
- [ ] Add Memory modal
- [ ] Real LanceDB integration
- [ ] Memory browser sidebar

### v0.3
- [ ] Embedding visualizer (t-SNE/UMAP)
- [ ] Cloudflare Pages deployment

---

## Mock Data

The app ships with 9 example memories covering:
- RAG/search technology concepts
- Personal preferences
- Architecture decisions
- Team roles

Edit `src/lib/mock/data.js` → `mockMemories` to customize the corpus.

<script>
  import SearchBar from '$lib/components/SearchBar.svelte';
  import ResultsGrid from '$lib/components/ResultsGrid.svelte';
  import ScoreBreakdown from '$lib/components/ScoreBreakdown.svelte';
  import { results, hasResults, query, isSearching } from '$lib/stores/search.js';
</script>

<svelte:head>
  <title>RAG Playground</title>
</svelte:head>

<div class="min-h-screen bg-[var(--bg-primary)] flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-40 border-b border-surface-600 bg-[var(--bg-primary)]/90 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 shrink-0">
        <div class="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <span class="text-brand-400 text-sm font-mono font-bold">R</span>
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-display font-bold text-[var(--text-primary)] tracking-tight">RAG</span>
          <span class="font-display text-[var(--text-muted)] font-light">Playground</span>
        </div>
        <span class="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded
                     border border-brand-500/30 bg-brand-500/10 text-brand-400">
          v0.1 MVP
        </span>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Status indicators -->
      <div class="hidden sm:flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow"></span>
          Mock data
        </span>
        <span class="text-[var(--text-muted)]/40">|</span>
        <span>9 memories</span>
        <span class="text-[var(--text-muted)]/40">|</span>
        <span>LanceDB v0.2</span>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
    <!-- Search bar section -->
    <section>
      <SearchBar />
    </section>

    <!-- Results section -->
    {#if $hasResults || $isSearching}
      <section class="animate-fade-in">
        <!-- Section header -->
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display font-semibold text-sm text-[var(--text-secondary)] flex items-center gap-2">
            Results
            {#if $hasResults && !$isSearching}
              <span class="font-mono text-xs text-[var(--text-muted)]">
                for "<span class="text-brand-400">{$query}</span>"
              </span>
            {/if}
          </h2>
          {#if $hasResults && !$isSearching}
            <span class="text-xs font-mono text-[var(--text-muted)]">
              {$results.hybrid.length} results · 3 methods compared
            </span>
          {/if}
        </div>

        <ResultsGrid results={$results} />
      </section>

      <!-- Score breakdown -->
      <section>
        <ScoreBreakdown />
      </section>
    {:else}
      <!-- Empty state -->
      <div class="flex-1 flex flex-col items-center justify-center text-center py-20 animate-fade-in">
        <!-- Visual -->
        <div class="relative mb-8">
          <div class="w-24 h-24 rounded-2xl border border-surface-600 bg-surface-800
                      flex items-center justify-center text-4xl">
            🧠
          </div>
          <!-- Orbiting dots -->
          <div class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40
                      flex items-center justify-center text-[8px] font-mono text-blue-400">v</div>
          <div class="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40
                      flex items-center justify-center text-[8px] font-mono text-orange-400">bm</div>
          <div class="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40
                      flex items-center justify-center text-[8px] font-mono text-brand-400">⊕</div>
        </div>

        <h1 class="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
          Visualize Hybrid RAG Search
        </h1>
        <p class="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-6">
          Enter a query to see how <span class="text-blue-400 font-mono">Vector</span>,{' '}
          <span class="text-orange-400 font-mono">BM25</span>, and{' '}
          <span class="text-brand-400 font-mono">Hybrid</span> search rank your memories differently.
        </p>

        <!-- Feature chips -->
        <div class="flex flex-wrap justify-center gap-2">
          {#each [
            { icon: '⟨v⟩', label: 'Cosine Similarity', color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' },
            { icon: 'BM25', label: 'Keyword Ranking', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
            { icon: '⊕', label: 'RRF Fusion', color: 'text-brand-400 border-brand-500/30 bg-brand-500/5' },
            { icon: '🔀', label: 'Cross-Encoder Rerank', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
          ] as feat}
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs {feat.color}">
              <span>{feat.icon}</span>
              <span>{feat.label}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </main>

  <!-- Footer -->
  <footer class="border-t border-surface-600 py-3 px-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
      <span>RAG Playground · v0.1 MVP · Mock data</span>
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
        No real LanceDB — v0.2 coming
      </span>
    </div>
  </footer>
</div>

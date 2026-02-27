<script>
  import ResultCard from './ResultCard.svelte';
  import { activeTab, isSearching } from '$lib/stores/search.js';

  export let results = { vector: [], bm25: [], hybrid: [] };

  const columns = [
    {
      id: 'vector',
      label: 'Vector Search',
      icon: '⟨v⟩',
      description: 'Cosine similarity — semantic meaning',
      accentClass: 'border-blue-500/40 text-blue-400',
      headerBg: 'bg-blue-500/5',
    },
    {
      id: 'bm25',
      label: 'BM25',
      icon: 'BM25',
      description: 'Keyword frequency — exact term matching',
      accentClass: 'border-orange-500/40 text-orange-400',
      headerBg: 'bg-orange-500/5',
    },
    {
      id: 'hybrid',
      label: 'Hybrid Fused',
      icon: '⊕',
      description: 'RRF fusion — best of both worlds',
      accentClass: 'border-brand-500/40 text-brand-400',
      headerBg: 'bg-brand-500/5',
    },
  ];

  const tabs = columns.map((c) => ({ id: c.id, label: c.label }));
</script>

<!-- Desktop: 3-column grid -->
<div class="hidden md:grid md:grid-cols-3 gap-4">
  {#each columns as col}
    <div class="rounded-xl border border-surface-600 overflow-hidden flex flex-col">
      <!-- Column header -->
      <div class="px-4 py-3 border-b border-surface-600 {col.headerBg}">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-semibold px-1.5 py-0.5 rounded border {col.accentClass}">
            {col.icon}
          </span>
          <span class="font-display font-semibold text-sm text-[var(--text-primary)]">{col.label}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{col.description}</p>
      </div>

      <!-- Results list -->
      <div class="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin max-h-[600px]">
        {#if $isSearching}
          <!-- Loading skeleton -->
          {#each [1, 2, 3, 4, 5] as _}
            <div class="rounded-lg border border-surface-600 bg-surface-800 p-3 animate-pulse">
              <div class="h-3 bg-surface-600 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-surface-600 rounded w-full mb-1"></div>
              <div class="h-4 bg-surface-600 rounded w-3/4 mb-3"></div>
              <div class="h-1.5 bg-surface-600 rounded w-full"></div>
            </div>
          {/each}
        {:else if results[col.id]?.length === 0}
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <span class="text-3xl mb-3 opacity-40">
              {col.id === 'vector' ? '⟨v⟩' : col.id === 'bm25' ? '🔤' : '⊕'}
            </span>
            <p class="text-sm text-[var(--text-muted)]">Run a search to see results</p>
          </div>
        {:else}
          {#each results[col.id] as result (result.id + '-' + col.id)}
            <ResultCard {result} mode={col.id} />
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>

<!-- Mobile: tabbed view -->
<div class="md:hidden">
  <!-- Tab bar -->
  <div class="flex rounded-xl border border-surface-600 overflow-hidden mb-4">
    {#each columns as col}
      <button
        on:click={() => activeTab.set(col.id)}
        class="flex-1 py-2.5 text-xs font-mono font-medium transition-colors
               {$activeTab === col.id
                 ? 'bg-brand-500/20 text-brand-300 border-b-2 border-brand-500'
                 : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b-2 border-transparent'}"
      >
        {col.label}
      </button>
    {/each}
  </div>

  <!-- Active tab content -->
  {#each columns as col}
    {#if $activeTab === col.id}
      <div class="rounded-xl border border-surface-600 overflow-hidden">
        <div class="px-4 py-3 border-b border-surface-600 {col.headerBg}">
          <p class="text-xs text-[var(--text-muted)] font-mono">{col.description}</p>
        </div>
        <div class="p-3 space-y-2">
          {#if $isSearching}
            {#each [1, 2, 3] as _}
              <div class="rounded-lg border border-surface-600 bg-surface-800 p-3 animate-pulse">
                <div class="h-3 bg-surface-600 rounded w-1/3 mb-2"></div>
                <div class="h-4 bg-surface-600 rounded w-full mb-1"></div>
                <div class="h-4 bg-surface-600 rounded w-3/4 mb-3"></div>
                <div class="h-1.5 bg-surface-600 rounded w-full"></div>
              </div>
            {/each}
          {:else if results[col.id]?.length === 0}
            <div class="flex flex-col items-center py-10 text-center">
              <p class="text-sm text-[var(--text-muted)]">Run a search to see results</p>
            </div>
          {:else}
            {#each results[col.id] as result (result.id + '-' + col.id)}
              <ResultCard {result} mode={col.id} />
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>

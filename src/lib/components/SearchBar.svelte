<script>
  import { query, runSearch, isSearching, exampleQueries } from '$lib/stores/search.js';

  let inputEl;

  function handleSubmit(e) {
    e.preventDefault();
    if ($query.trim()) {
      runSearch($query);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleSubmit(e);
  }

  function useExample(q) {
    $query = q;
    runSearch(q);
    inputEl?.focus();
  }
</script>

<div class="w-full">
  <!-- Search input -->
  <form on:submit={handleSubmit} class="relative group">
    <div
      class="relative flex items-center rounded-xl border border-surface-600 bg-surface-800
             transition-all duration-200 focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
    >
      <!-- Icon -->
      <div class="pl-4 pr-3 text-[var(--text-muted)] group-focus-within:text-brand-400 transition-colors">
        {#if $isSearching}
          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        {:else}
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        {/if}
      </div>

      <!-- Input -->
      <input
        bind:this={inputEl}
        bind:value={$query}
        on:keydown={handleKeydown}
        type="text"
        placeholder="Enter your query… (e.g. 向量搜索、RAG、BM25)"
        class="flex-1 bg-transparent py-3.5 pr-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
               text-sm outline-none font-mono"
        disabled={$isSearching}
      />

      <!-- Search button -->
      <button
        type="submit"
        disabled={$isSearching || !$query.trim()}
        class="mr-1.5 rounded-lg px-4 py-2 text-sm font-medium font-display
               bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all duration-150 whitespace-nowrap"
      >
        {$isSearching ? 'Searching…' : 'Search'}
      </button>
    </div>
  </form>

  <!-- Example chips -->
  <div class="mt-3 flex flex-wrap gap-2 items-center">
    <span class="text-xs text-[var(--text-muted)] font-mono">try:</span>
    {#each exampleQueries as eq}
      <button
        on:click={() => useExample(eq)}
        class="text-xs px-2.5 py-1 rounded-md border border-surface-600 text-[var(--text-secondary)]
               hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5
               transition-all duration-150 font-mono"
      >
        {eq}
      </button>
    {/each}
  </div>
</div>

<script>
  import { selectedResult } from '$lib/stores/search.js';
  import { categoryColors, categoryEmoji } from '$lib/mock/data.js';
  import { fade, slide } from 'svelte/transition';

  $: r = $selectedResult;

  // Build pipeline stages dynamically from selected result
  $: stages = r
    ? [
        {
          label: 'Vector',
          value: r.vectorScore ?? r.score,
          color: 'bg-blue-400',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-400/30',
          bgColor: 'bg-blue-400/8',
          description: `Cosine similarity = ${(r.vectorScore ?? r.score).toFixed(3)}`,
          detail: 'Bi-encoder embeds query and memory into the same vector space, then measures cosine distance.',
          icon: '⟨v⟩',
          arrow: '→',
        },
        {
          label: 'BM25',
          value: r.bm25Score ?? 0,
          color: 'bg-orange-400',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-400/30',
          bgColor: 'bg-orange-400/8',
          description: `BM25 keyword score = ${(r.bm25Score ?? 0).toFixed(3)}`,
          detail: 'TF-IDF based ranking. Higher scores for rare terms appearing frequently in this memory.',
          icon: 'BM25',
          arrow: '→',
        },
        {
          label: 'RRF Fusion',
          value: r.fusedScore ?? r.score,
          color: 'bg-brand-400',
          textColor: 'text-brand-400',
          borderColor: 'border-brand-400/30',
          bgColor: 'bg-brand-400/8',
          description: `RRF fused = ${(r.fusedScore ?? r.score).toFixed(3)}`,
          detail: `RRF(d) = 1/(${60} + vector_rank) + 1/(${60} + bm25_rank). Vector rank: #${r.vRank ?? '?'}, BM25 rank: #${r.bRank ?? '?'}.`,
          icon: '⊕',
          arrow: '→',
        },
        {
          label: 'Rerank',
          value: r.rerankScore ?? r.score,
          color: 'bg-purple-400',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-400/30',
          bgColor: 'bg-purple-400/8',
          description: `Cross-encoder rerank = ${(r.rerankScore ?? r.score).toFixed(3)}`,
          detail: 'Cross-encoder jointly encodes query + memory for precise relevance estimation. More accurate but slower.',
          icon: '🔀',
          arrow: '→',
        },
        {
          label: 'Recency',
          value: r.recencyBoost ?? 0.02,
          color: 'bg-cyan-400',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-400/30',
          bgColor: 'bg-cyan-400/8',
          description: `Recency boost +${(r.recencyBoost ?? 0.02).toFixed(3)}`,
          detail: `Memory is from ${r.createdAt ?? 'N/A'}. Half-life decay over 14 days gives a small freshness boost.`,
          icon: '⏱',
          arrow: '=',
        },
      ]
    : [];

  $: finalScore = r
    ? Math.min(0.99, (r.rerankScore ?? r.score) + (r.recencyBoost ?? 0.02))
    : 0;

  let activeStage = null;

  function toggleStage(i) {
    activeStage = activeStage === i ? null : i;
  }
</script>

{#if r}
  <div class="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden" transition:slide={{ duration: 300 }}>
    <!-- Header -->
    <div class="px-4 py-3 border-b border-surface-600 bg-surface-700/30 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-[var(--text-muted)] text-sm font-mono">▼</span>
        <span class="font-display font-semibold text-sm text-[var(--text-primary)]">Score Breakdown</span>
        <span class="text-xs text-[var(--text-muted)] font-mono">click a result to inspect</span>
      </div>
      <button
        on:click={() => selectedResult.set(null)}
        class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>

    <div class="p-4">
      <!-- Selected memory card -->
      <div class="rounded-lg border border-surface-600 bg-surface-700/50 p-3 mb-5">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xs px-1.5 py-0.5 rounded font-mono {categoryColors[r.category] ?? 'text-gray-400 bg-gray-400/10'}">
            {categoryEmoji[r.category] ?? '📝'} {r.category}
          </span>
          <span class="text-xs text-[var(--text-muted)] font-mono ml-auto">importance: {r.importance}</span>
        </div>
        <p class="text-sm text-[var(--text-primary)] leading-relaxed">{r.text}</p>
      </div>

      <!-- Pipeline visual -->
      <div class="mb-4">
        <p class="text-xs text-[var(--text-muted)] font-mono mb-3">Scoring pipeline:</p>

        <!-- Stage flow — horizontal scroll on mobile -->
        <div class="overflow-x-auto pb-2">
          <div class="flex items-center gap-1.5 min-w-max">
            {#each stages as stage, i}
              <!-- Stage pill -->
              <button
                on:click={() => toggleStage(i)}
                class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border transition-all duration-150
                       {activeStage === i
                         ? stage.borderColor + ' ' + stage.bgColor
                         : 'border-surface-600 bg-surface-700/50 hover:border-[var(--border-hover)]'}"
              >
                <span class="font-mono text-[10px] {activeStage === i ? stage.textColor : 'text-[var(--text-muted)]'}">
                  {stage.icon}
                </span>
                <span class="font-mono text-xs font-semibold {activeStage === i ? stage.textColor : 'text-[var(--text-secondary)]'}">
                  {stage.label === 'Recency' ? '+' : ''}{Math.round(stage.value * 100)}%
                </span>
                <span class="text-[10px] {activeStage === i ? stage.textColor : 'text-[var(--text-muted)]'} opacity-70">
                  {stage.label}
                </span>
              </button>

              <!-- Arrow -->
              {#if i < stages.length - 1}
                <span class="text-[var(--text-muted)] font-mono text-xs shrink-0">{stage.arrow}</span>
              {/if}
            {/each}

            <!-- Final score -->
            <span class="text-[var(--text-muted)] font-mono text-xs shrink-0">=</span>
            <div class="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border border-green-500/40 bg-green-500/8">
              <span class="font-mono text-[10px] text-green-400">★</span>
              <span class="font-mono text-sm font-bold text-green-400">{Math.round(finalScore * 100)}%</span>
              <span class="text-[10px] text-green-400 opacity-70">Final</span>
            </div>
          </div>
        </div>

        <!-- Score progress bars -->
        <div class="mt-4 space-y-2">
          {#each stages as stage}
            <div class="flex items-center gap-3">
              <span class="font-mono text-[10px] text-[var(--text-muted)] w-16 text-right shrink-0">{stage.label}</span>
              <div class="flex-1 h-1.5 rounded-full bg-surface-600 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 {stage.color}"
                  style="width: {Math.min(100, Math.abs(stage.value) * 100)}%"
                ></div>
              </div>
              <span class="font-mono text-xs {stage.textColor} w-10 text-right shrink-0">
                {stage.value > 0 && stage.label === 'Recency' ? '+' : ''}{stage.value.toFixed(3)}
              </span>
            </div>
          {/each}
          <!-- Final -->
          <div class="flex items-center gap-3 pt-1 border-t border-surface-600">
            <span class="font-mono text-[10px] text-green-400 w-16 text-right shrink-0">Final</span>
            <div class="flex-1 h-2 rounded-full bg-surface-600 overflow-hidden">
              <div
                class="h-full rounded-full bg-green-400 transition-all duration-700"
                style="width: {Math.min(100, finalScore * 100)}%"
              ></div>
            </div>
            <span class="font-mono text-sm font-bold text-green-400 w-10 text-right shrink-0">
              {finalScore.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      <!-- Expanded stage detail -->
      {#if activeStage !== null}
        <div
          class="rounded-lg border p-3 {stages[activeStage].borderColor} {stages[activeStage].bgColor}"
          transition:slide={{ duration: 200 }}
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="font-mono text-xs {stages[activeStage].textColor} font-semibold">
              {stages[activeStage].icon} {stages[activeStage].label}
            </span>
            <span class="font-mono text-xs {stages[activeStage].textColor} ml-auto">
              {stages[activeStage].description}
            </span>
          </div>
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">{stages[activeStage].detail}</p>
        </div>
      {:else}
        <p class="text-xs text-[var(--text-muted)] font-mono text-center">
          👆 click a stage above to see how it's computed
        </p>
      {/if}
    </div>
  </div>
{:else}
  <div class="rounded-xl border border-dashed border-surface-600 p-8 text-center" transition:fade>
    <div class="text-3xl mb-3 opacity-30">▼</div>
    <p class="text-sm text-[var(--text-muted)] font-mono">Click any result card to inspect its score breakdown</p>
    <p class="text-xs text-[var(--text-muted)] mt-1 opacity-60">Vector → BM25 → RRF Fusion → Rerank → Recency → Final</p>
  </div>
{/if}

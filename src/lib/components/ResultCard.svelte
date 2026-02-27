<script>
  import { selectedResult, hoveredId } from '$lib/stores/search.js';
  import { categoryColors, categoryEmoji } from '$lib/mock/data.js';

  export let result;
  export let mode = 'vector'; // 'vector' | 'bm25' | 'hybrid'

  $: isSelected = $selectedResult?.id === result.id;
  $: isHovered = $hoveredId === result.id;

  function getScoreColor(score) {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getScoreBarColor(score) {
    if (score >= 0.7) return 'bg-green-400';
    if (score >= 0.5) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  function getScoreBg(score) {
    if (score >= 0.7) return 'bg-green-400/10 border-green-400/20';
    if (score >= 0.5) return 'bg-yellow-400/10 border-yellow-400/20';
    return 'bg-red-400/10 border-red-400/20';
  }

  function handleClick() {
    selectedResult.set(result);
  }

  function handleMouseEnter() {
    hoveredId.set(result.id);
  }

  function handleMouseLeave() {
    hoveredId.set(null);
  }

  $: displayScore = mode === 'bm25' ? result.bm25Score ?? result.score : result.score;
  $: scorePercent = Math.round(displayScore * 100);
</script>

<button
  on:click={handleClick}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  class="w-full text-left rounded-lg border p-3 transition-all duration-150 cursor-pointer
         {isSelected
           ? 'border-brand-500/60 bg-brand-500/8 shadow-[0_0_16px_rgba(99,102,241,0.12)]'
           : isHovered
             ? 'border-[var(--border-hover)] bg-surface-700/50'
             : 'border-surface-600 bg-surface-800 hover:border-[var(--border-hover)] hover:bg-surface-700/40'}
         animate-fade-in"
>
  <!-- Row 1: rank + category + top badge -->
  <div class="flex items-center gap-2 mb-2">
    <span class="font-mono text-xs text-[var(--text-muted)] w-4 shrink-0">#{result.rank}</span>

    <span class="text-xs px-1.5 py-0.5 rounded font-mono {categoryColors[result.category] ?? 'text-gray-400 bg-gray-400/10'}">
      {categoryEmoji[result.category] ?? '📝'} {result.category}
    </span>

    {#if result.isTop}
      <span class="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
        ✨ top
      </span>
    {/if}
  </div>

  <!-- Row 2: memory text -->
  <p class="text-sm text-[var(--text-primary)] leading-relaxed mb-2.5 line-clamp-2">
    {result.text}
  </p>

  <!-- Row 3: score bar + badge -->
  <div class="flex items-center gap-2">
    <!-- Score bar -->
    <div class="flex-1 h-1 rounded-full bg-surface-600 overflow-hidden">
      <div
        class="h-full rounded-full {getScoreBarColor(displayScore)} transition-all duration-500"
        style="width: {scorePercent}%"
      ></div>
    </div>

    <!-- Score badge -->
    <span class="font-mono text-xs px-1.5 py-0.5 rounded border {getScoreBg(displayScore)} {getScoreColor(displayScore)}">
      {scorePercent}%
    </span>
  </div>
</button>

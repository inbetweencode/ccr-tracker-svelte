<script>
  import { clickOutside } from '../../actions/clickoutside';
  import { setFocus } from '../../actions/focus';
  import { areAllSelected, hasOverlap } from "../../utils/logic";
  import { questionMark } from '../../utils/icons';
  import { getCoords } from '../../utils/misc';

  import Icon from 'svelte-awesome';
  import Chip from '../Dropdown/Chip.svelte';
  import BarChart from '../Dropdown/BarChart.svelte';
  import Suggestion from '../Dropdown/Suggestion.svelte';

  export let filter;
  export let label = '';
  export let shortCuts = [];
  export let fullRollup = [];
  export let rollup = [];
  export let info = null;
  export let tooltip = null;
  export let showReset = false;
  export let hideColorBoxes = false;
  export let showClickHint = false;


  let searchValue = '';
  let hoveredSuggestion = null;
  let showSuggestions = false;
  let chips = [];
  let infoElem;

  function handleInfo(show) {
    if (!info || !infoElem) return;
    if (show && !$tooltip) {
      const { x, y, width, height } = getCoords(infoElem);
      tooltip.set({
        info,
        x: x + width / 2,
        y: y + height
      });
      return;
    }
    tooltip.set(null);
  }

  function handleResetClick() {
    filter.selectAll();
  }

  function handleShowSuggestions() {
    hoveredSuggestion = 0;
    showSuggestions = true;
  }

  function handleFieldClickOutside() {
    showSuggestions = false;
    searchValue = '';
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) { // esc
      searchValue = '';
      showSuggestions = false;
    }

    if (showSuggestions) {
      if (hoveredSuggestion !== null) {
        if (e.keyCode === 13) { // enter
          const s = suggestions[hoveredSuggestion];
          handleSuggestionSelect(s.id, s.type);
        }
      }

      if (e.keyCode === 38) { // arrow up
        hoveredSuggestion = Math.max(hoveredSuggestion - 1, 0);
      } else if (e.keyCode === 40) { // arrow down
        hoveredSuggestion = Math.min(hoveredSuggestion + 1, suggestions.length - 1);
      }
    }
  }

  function handleSuggestionSelect(id, type) {
    if (type === 'shortcut') {
      const { items } = shortCuts.find(d => d.id === id) || {};
      filter.unselectAll();
      filter.select(items);
    } else {
      filter.click(id);
    }
    showSuggestions = false;
  }

  $: id = `dropdown_${label.toLowerCase()}`;

  $: {
    let prelimChips = $filter.filter(d => d.selected);
    if (prelimChips.length === $filter.length) {
      prelimChips = [];
    }
    chips = prelimChips;
  }

  $: suggestions = [...shortCuts.map(d => ({...d, type: 'shortcut'})), ...$filter].filter(d => {
    if (!searchValue) return true;
    const regexp = new RegExp(searchValue, 'gi');
    return regexp.test(d.name);
  });



</script>

<svelte:window on:keydown={handleKeydown} />

<div class="dropdown">
  <label
    class:active={showSuggestions}
    for={id}
  >
    <span
      class="title"
    >
      {label}
      {#if (info)}
        <button
          class="info"
          bind:this={infoElem}
          on:mouseenter={() => handleInfo(true)}
          on:mouseleave={() => handleInfo(false)}
        >
          <Icon data={questionMark} />
        </button>
      {/if}
    </span>
    {#if (showReset && chips.length)}
      <button
        on:click={handleResetClick}
      >
        <span>Reset</span>
        <span class="reset">+</span>
      </button>
    {/if}
  </label>
  <div
    class="field"
    on:click={() => showSuggestions = true}
    use:clickOutside={handleFieldClickOutside}
  >
    {#if (showClickHint && !chips.length)}
      <span class="click-hint">
        {showClickHint}
      </span>
    {/if}
    <ul class="chips">
      {#each chips as { id, name} (id)}
        <li>
          <Chip
            id={id}
            name={name}
            on:close={() => handleSuggestionSelect(id)}
          />
        </li>
      {/each}
    </ul>
  </div>
  <BarChart
    rollup={rollup}
    fullRollup={fullRollup}
    dummy={!rollup.length || !fullRollup.length}
  />
  {#if (showSuggestions)}
    <div class="suggestions">
      <input
        id={id}
        type="text"
        placeholder="Search..."
        autocomplete="off"
        spellcheck="off"
        bind:value={searchValue}
        on:focus={handleShowSuggestions}
        on:click|stopPropagation
        use:setFocus
      />
      <ul class="suggestions">
        {#each suggestions as { id, name, type }, i (id)}
          <Suggestion
            name={name}
            fullRollup={fullRollup.find(d => d.name === name)}
            rollup={rollup.find(d => d.name === name)}
            bold={type && type === 'shortcut'}
            isActive={hoveredSuggestion === i}
            isSelected={!areAllSelected($filter) && hasOverlap([id], $filter)}
            showColorBox={!hideColorBoxes}
            on:mouseenter={() => hoveredSuggestion = i}
            on:mouseleave={() => hoveredSuggestion = null}
            on:click={() => handleSuggestionSelect(id, type)}
          />
        {/each}
      </ul>
    </div>
  {/if}
</div>

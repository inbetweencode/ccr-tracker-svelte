<script>
  import { clickOutside } from '../../actions/clickoutside';
  import { setFocus } from '../../actions/focus';
  import { areAllSelected, hasOverlap } from "../../utils/logic";
  import arrowDown from 'svelte-awesome/icons/angle-down';
  import { getCoords } from '../../utils/misc';

  import Icon from 'svelte-awesome';
  import Chip from './Chip.svelte';
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
  export let context = false;


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

<div class="{'in-'+context} select">
  <label
    class:active={showSuggestions}
    for={id}
  >
    <span
      class="title"
    >
      {label}:
      {#if (info)}

      {/if}
    </span>
    {#if (showReset && chips.length)}
      <!--<button
        on:click={handleResetClick}
      >
        <span>Reset</span>
        <span class="reset">+</span>
      </button>-->
    {/if}
  </label>
  <div
    class="field"
    on:click={() => showSuggestions = true}
    use:clickOutside={handleFieldClickOutside}
  >
    <ul class="chips">
      {#if (!chips.length)}
        <li>
          <Chip
            id=0
            name="All"
            hasCloseButton={false}
          />
        </li>
      {/if}
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
    {#if (showClickHint)}
      <span class="click-hint"><Icon data={arrowDown} /></span>
    {/if}

  </div>
  <!--<BarChart
    rollup={rollup}
    fullRollup={fullRollup}
    dummy={!rollup.length || !fullRollup.length}
  />-->
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

<style>

  .select {
      /*box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);*/
      box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.13);
      position: relative;
      padding: 10px;
  }
  div.field {
      display: inline-block;
  }
  ul.chips {
      list-style: none;
      display: inline-block;
  }
  .click-hint {
      /*font-size: 1.55rem;*/
      /*padding: 0 0.2rem;*/
      line-height: 100%;
      /*transform: rotate(90deg);*/
      color: #6E717D;
      vertical-align: middle;
      display: inline-block;
      margin-bottom: -2px;
  }
  div.suggestions {
      position: absolute;
      width: calc(100% + 50px);
      background-color: #F7F7F7;
      /*max-height: 400px;*/
      /*overflow-y: scroll;*/
      /*overflow: auto;*/
      left: -25px;
  }
  ul.suggestions {
      max-height: 400px;
      list-style-type: none;
      overflow-y: auto;


  }
  input {
      width: 100%;
      height: var(--inputHeight);
      padding: 0 0.5rem;
      font-size: 1.1rem;
      background-color: var(--secWhite);
      border: none;
      outline: none;
  }

  .in-legend.select {
      background-color: var(--background);
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
  }

  .in-legend.select .title {
      color: #000;
  }
  ul.chips .chip-icon {
      margin-top: -1rem;
  }


</style>
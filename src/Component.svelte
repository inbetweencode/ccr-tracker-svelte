<script>
  import { onMount } from 'svelte';

  import styles from './utils/styles';
  import { css } from './actions/css';
  import { isVertical } from './stores/device';
  import { tooltip } from './stores/definitions';
  import { data, paragraphs } from './stores/data2';
  import { selectedDatum, selectedId, applySelected, selectSource } from './stores/selection';
  import { resetAllFilters, filterByCategory, applyParams } from './stores/filter';
  import { parseUrl } from './stores/share';

  import FilterBarTop from './components/FilterBar/FilterBarTop.svelte';
  import FilterBarBottom from './components/FilterBar/FilterBarBottom.svelte';
  
  import Map from './components/Map/Map.svelte';
  import Tooltip from './components/Tooltip.svelte';
  import Modal from './components/Modal/Modal.svelte';
  import Spotlight from './components/Spotlight/Spotlight.svelte'
  import Footer from './components/Footer.svelte';
  import Paragraph from './components/Paragraph.svelte';
  import Table from './components/Table/Table.svelte';

  let width = 0;
  let height = 0;
  let urlParams;
  let displayMode = false;

  function handleModalCategoryClick(e) {
    const { detail: { category, name} } = e;
    resetAllFilters();
    filterByCategory(category, name);
  }

  function sendDimensions(width, height) {
    const message = {
      height,
      width
    };

	  window.top.postMessage(message, "*");
  }

  onMount(() => {
    urlParams = new URLSearchParams(window.location.search.replace(/^\?params=/, ''));
  });

  $: isVertical.set(width < 600);
  $: if ($selectedDatum) tooltip.set(null);
  $: sendDimensions(width, height);

  $: if ($data.length) {
    applyParams(parseUrl(urlParams))
    applySelected(urlParams);
    if (urlParams !== null) {
      displayMode = urlParams.get('mode');
      console.log(displayMode);
    }
    urlParams = null;
  }
</script>

<div
  class="component-wrapper"
  bind:clientWidth={width}
  bind:clientHeight={height}
  use:css={styles}
>
  <!--<FilterBarTop />-->
  <!--<FilterBarBottom />-->

  {#if (displayMode === null || typeof displayMode === 'undefined')}
    <Map />
    <Footer
      text={$paragraphs.find(d => d.name === 'last_updated')?.text}
    />
    <!--<Spotlight />-->
  {/if}
    {#if $paragraphs[0]}
    <Paragraph
      heading={$paragraphs.find(d => d.name === 'below_map').heading}
      text={$paragraphs.find(d => d.name === 'below_map').text}
    />
    {/if}

    {#if ($selectedDatum)}
      <Modal
        datum={$selectedDatum}
        on:categoryclick={handleModalCategoryClick}
        on:close={() => $selectedId = null}
        source={$selectSource}
      />
    {/if}
  {#if ($tooltip)}
    <Tooltip
      tooltip={$tooltip}
      maxWidth={width}
    />
  {/if}
  <Table tableModal={(displayMode === null || typeof displayMode === 'undefined')} />
</div>

<style>
  div :global(*) {
    margin: 0;
    padding: 0;
    font-family: var(--font02);
    opacity: 1;
    box-sizing: border-box;
  }

  div :global(a) {
    color: var(--primBlue);
    text-decoration: underline;
  }

  div :global(a:hover) {
    text-decoration: none;
  }

  .component-wrapper {
    position: relative;
    width: 100%;
    font-size: 12px;
    overflow-x: hidden;
  }

  @media (min-width: 600px) {
    .component-wrapper {
      font-size: 15px;
    }
  }

  @media (min-width: 980px) {
    .component-wrapper {
      font-size: 16px;
    }
  }

  @media (min-width: 1260px) {
    .component-wrapper {
      font-size: 18px;
    }
  }
  
  @media (min-width: 1950px) {
    .component-wrapper {
      font-size: 20px;
    }
  }
</style>
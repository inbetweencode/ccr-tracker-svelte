<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { orderBy } from 'lodash-es';

  import { isVertical } from '../../stores/device';
  import { css } from '../../actions/css';
  import { extractHostname } from '../../utils/misc';

  import Share from '../Share/Share.svelte';

  export let datum;

  export let source;

  const dispatch = createEventDispatcher();

  let showOverlayCloseButton = false;
  let expanded = false;

  function handleExpand() {
    expanded = !expanded;
  }


  function close() {
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) { // esc
      close();
    }
  }

  function handleScroll() {
    showOverlayCloseButton = true;
  }

  function handleCategoryClick(category, name) {
    dispatch('categoryclick', { category, name });
    close();
  }

  $: categories = orderBy(Object.keys(datum.categories).map(key => {
    return {
      category: key,
      ...datum.categories[key]
    };
  }),
  'filterable', 'desc');
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="modal {expanded ? 'expanded' : ''} {source ? source : ''}"
  use:css={{statusColor: '#000'/*datum.categories.new_status.color*/}}
  transition:fade={{duration: 200}}
>
  <div
    class="modal-outer"
    on:click={close}
  >
  </div>
  <div
    class="modal-inner"
    on:scroll={handleScroll}
  >
    {#if ($isVertical && showOverlayCloseButton)}
      <button
        class="close-button overlay"
        on:click={close}
        transition:fade
      >
        <span>+</span>
      </button>
    {/if}
    <div
      class="header"
    >
      <div class="header-content">
        <h1>{datum.country === 'United States of America' ? 'United States' : datum.country}</h1>
        <div class="header-content-right">
          <button
            class="expand-button"
            on:click={handleExpand}
          >
            {expanded ? 'See less' : 'See more'}
          </button>
          <button
            class="close-button"
            on:click={close}
          >
            <span>+</span><!-- make pseudo element -->
          </button>
        </div>

      </div>
    </div>
    <div class="body">
      {#if expanded}
      <div class="categories-wrapper">
        <!--<h2>Properties<span class="small">(Click to filter)</span></h2>-->
        <div class="categories">
          {#each categories as cat (cat.title)}
            {#if !(cat.description === '' && cat.bool === 'null') &&
                 !(cat.description === '' && cat.bool === '')
            }
            <div
              class="category"
              class:highlight={cat.highlight}
              use:css={{chipColor: cat.color}}
            >
              <h3>{cat.title}</h3>
              <!--<span>{cat.description?cat.description:cat.bool}</span>-->
              <span>{cat.description||cat.bool}</span>
            </div>
            {/if}
          {/each}
        </div>
      </div>
      {/if}
      <main>
        <h2>Regulatory Status: <span>{@html datum.status}</span></h2>
        <p>{datum.description}</p>
        <h4>Timeline</h4>
        <div class="sources">
          <!--{#if (datum.sources.central_bank_name)}
            <a href={datum.sources.central_bank_url} target="_blank">{datum.sources.central_bank_name}</a>
          {/if}-->
          <p>{datum.timeline}</p>
          <!--{#if (datum.sources.media_urls.length)}
            <ul class="media-sources">
              {#each datum.sources.media_urls as url}
                <li><a href={url} target="_blank">{extractHostname(url)}</a></li>
              {/each}
            </ul>
          {/if}-->
        </div>
        {#if (datum.source_urls.length)}
        <h4>Sources</h4>
        <div class="sources">
          <!--{#if (datum.sources.central_bank_name)}
            <a href={datum.sources.central_bank_url} target="_blank">{datum.sources.central_bank_name}</a>
          {/if}-->
          <!--<p>{datum.timeline}</p>-->
            <ul class="media-sources">
              {#each datum.source_urls as url, i}
                <li><a href={url} target="_blank">{datum.source_titles[i]}</a><!-- [{extractHostname(url)}]--></li>
              {/each}
            </ul>
        </div>
        {/if}
        <h4>Share</h4>
        <div class="share-panel">
          <Share />
        </div>
      </main>
    </div>
  </div>
</div>

<style>
  .modal {
    position: absolute;
    left: 0;
    top: 2.5%;
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-family: var(--primFont);
  }

  .modal.expanded {
      position: fixed;
      top: 0;
      align-items: center;
  }

  .modal-outer {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0.7;
  }
  .modal.expanded .modal-outer {
    background-color: #000;
  }

  .modal-inner {
    position: relative;
    width: 90%;
    /* height: 100%; */
    height: 90%;
    /* padding-bottom: 150px;*/
    padding-bottom: 30px;
    background-color: var(--background);
    /*border: 1px solid var(--statusColor);*/
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
  }

  @media (min-width: 980px) {
    .modal-inner {
      width: 50%;
      max-width: 1600px;
      height: auto;
    }
    .modal.expanded .modal-inner {
          width: 90%;
          max-width: 1600px;
          height: 90%;
    }
  }

  .header {
    width: 100%;
    padding: 1.5rem 0 1.5rem 0;
    background-color: #B72951;
  }

  .expand-button {
      color: var(--background);
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      vertical-align: text-bottom;
      font-size: 1rem;
      height: 1.875rem;
  }

  .close-button {
    width: 1.875rem;
    height: 1.875rem;
    color: var(--background);
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .close-button.overlay {
    position: fixed;
    right: 40px;
    bottom: 150px;
    z-index: 20000;
  }

  .close-button:hover {
    color: var(--darkgray);
  }

  .close-button span {
    display: inline-block;
    font-size: 1.9rem;
    font-weight: bold;
    line-height: 1;
    transform: rotate(45deg);
  }

  .header-content {
    width: 100%;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
  }

  .header-content h2 {
    margin: 0.5rem 0 1rem 0;
    font-size: 1.5rem;
    color: var(--background);
  }

  .header-content h1 {
    font-size: 1.5rem;
    color: var(--background);
  }

  .header-content-right {
      vertical-align: middle;
  }

  p {
    color: var(--darkgray);
    font-size: 1.2rem;
    line-height: 1.3;
  }

  .header-content p {
    width: 100%;
    max-width: 1100px;
    color: var(--background);
  }

  @media (min-width: 980px) {
    .header-content p {
      width: 60%;
    }

    .header-content {
      padding: 0 3rem;
  }
  }

  .body {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 980px) {
    .body {
      flex-direction: row;
    }
  }

  .categories-wrapper {
    padding: 2rem 1rem;
      flex: 1;
  }

  .categories {
    flex: 1;
    /*display: flex;*/
    /*flex-direction: column;*/
    flex-wrap: wrap;
  }

  @media (min-width: 600px) {
    .categories {
      /*flex-direction: row;*/
    }
  }

  @media (min-width: 980px) {
    .categories-wrapper {
      order: 2;
      padding: 2rem 3rem;
    }

    .categories {
      flex-direction: column;
    }
  }

  .category {
    margin: 1.5rem 1.5rem 1.5rem 0;
      color: var(--darkgray);
  }

  .category.highlight {
      color: #B72951;
  }
  .category h3 {
    font-size: 1.5rem;
    font-weight: normal;
    white-space: nowrap;
  }

  .category span {
    display: block;
    margin: 0.5rem 0;
    /*color: var(--darkgray);*/
    font-size: 1.2rem;
    /*opacity: 0.8;*/
  }

  .chip {
    margin: 0.3rem 0;
    padding: 0.2rem 0.4rem;
    color: var(--secWhite);
    font-size: 1.2rem;
    background-color: var(--chipColor);
    border: none;
    outline: none;
    cursor: pointer;
  }

  .chip:hover {
    color: var(--darkgray);
  }

  main {
    width: 100%;
    max-width: 1100px;
    padding: 2rem 1rem;
      flex: 1;
  }

  @media (min-width: 980px) {
    main {
      order: 1;
      width: 200%;
      padding: 2rem 3rem;
    }
  }

  main h2, .categories-wrapper h2 {
    margin: 0.8rem 0;
    color: var(--darkgray);
    font-size: 1.7rem;
  }

  main h2 span {
    font-weight: normal;
  }

  .small {
    display: inline-block;
    margin: 0 0.4rem;
    font-size: 1rem;
  }

  main h4 {
    margin: 2rem 0 0.8rem 0;
    color: var(--darkgray);
    font-size: 1.2rem;
  }

  .sources ul.media-sources {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    list-style-type: none;
  }

  @media (min-width: 980px) {
    .sources ul.media-sources {
      /*flex-direction: row;*/
    }
  } 

  .sources ul.media-sources li {
    margin: 0 0.8rem 0.2rem 0;
  }

  .sources a {
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .sources p {
    margin: 0.4rem 0 0.35rem 0;
    font-size: 1.2rem;
    line-height: 1.3;
  }

  .share-panel {
    margin: 0.5rem 0 1rem 0;
  }
</style>
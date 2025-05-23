<script>
  import { onMount, onDestroy } from 'svelte';
  import { zoom as d3zoom, select, zoomIdentity } from 'd3';

  import { mapWidth, mapHeight, initialTransform, mapTransform, projectedData } from '../../stores/map';
  import { data, paragraphs } from '../../stores/data2';
  import { dataCountries, dataClusters } from '../../stores/datacountries';
  import { colorCategory } from '../../stores/colorcategory';
  import { hoveredIds, selectedDatum, selectedId, selectSource } from '../../stores/selection';
  import { hoveredClusterIds } from '../../stores/selectionclusters';
  import { statusFilter, filterByCategory, countryFilter, anyFilterActive, resetAllFilters } from '../../stores/filter';
  import { fullStatusRollup, statusRollup, totalCountries } from '../../stores/aggregation';
  import { isVertical } from '../../stores/device';
  import styles from '../../utils/styles';

  import Navigation from './Navigation.svelte';
  import ResetFilters from './ResetFilters.svelte';
  import Legend from './Legend.svelte';
  import Canvas from '../Canvas.svelte';
  import Country from './Country.svelte';
  import Centroid from './Centroid.svelte';
  import HoverTag from './HoverTag.svelte';
  import HoverTagCluster from './HoverClusterTag.svelte';
  import GestureNote from './GestureNote.svelte';

  const clusterZoom = 4;
  
  let isZoomed = false;
  let zoomable = false;

  const zoom = d3zoom()
    .filter((e) => {
      if (e.touches && e.touches.length <= 1) return false;
      if (!$isVertical && !zoomable) return false;
      return true;
    })
    .on('start', () => isZoomed = true)
    .on('zoom', (e) => {
      mapTransform.set(e.transform);
    })
    .on('end', () => isZoomed = false);

  let zoomCatcherElem, zoomCatcher;
  let showGestureNote = false;
  let numGestureNotes = 0;
  let tid;

  const startGestureNote = (ms = 2000) => {
    showGestureNote = true;
    numGestureNotes++;
    clearTimeout(tid);
    setTimeout(() => showGestureNote = false, ms);
  };

  function handleMapTouchend(e) {
    if (numGestureNotes < 2 && e.touches && e.touches.length <= 1) {
      startGestureNote();
      return;
    }
    showGestureNote = false;
  }
  
  function zoomReset({animation = true} = {}) {
    if (!zoomCatcher) return;
    if (animation) {
      zoomCatcher.transition().duration(400).call(zoom.transform, $initialTransform);
    } else {
      zoomCatcher.call(zoom.transform, $initialTransform);
    }
  }

  function zoomPlus() {
    if (!zoomCatcher) return;
    zoomCatcher.transition().duration(400).call(zoom.scaleBy, 2);
  }

  function zoomMinus() {
    if (!zoomCatcher) return;
    zoomCatcher.transition().duration(400).call(zoom.scaleBy, 0.5);
  }

  function handleCentroidMouseEnter(e, id) {
    if (e.touches) return;
    e.preventDefault();
    e.stopPropagation();
    hoveredIds.add(id);
  }

  function handleCentroidMouseLeave(e, id) {
    if (e.touches) return;
    e.preventDefault();
    e.stopPropagation();
    hoveredIds.remove(id);
  }

  function handleCentroidClick(e, id) {
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();
    e.stopPropagation();
    selectedId.set(id);
    selectSource.set('map');
  }

  function handleCentroidClusterMouseEnter(e, id) {
    if (e.touches) return;
    e.preventDefault();
    e.stopPropagation();
    hoveredClusterIds.add(id);
  }

  function handleCentroidClusterMouseLeave(e, id) {
    if (e.touches) return;
    e.preventDefault();
    e.stopPropagation();
    hoveredClusterIds.remove(id);
  }

  function handleHoverTagClick(e) {
    const { detail: { category, name } } = e;
    resetAllFilters();
    filterByCategory(category, name);
  }

  function handleClusterClick(centroid, scale, mt, it, width, height) {
    const scaleDiff = scale / mt.k;
    const dx = (mt.x - centroid[0]) * scaleDiff + width / 2;
    const dy = (mt.y - centroid[1]) * scaleDiff + height / 2;
    const transform = zoomIdentity.translate(dx, dy).scale(scale);
    zoomCatcher.transition().duration(400).call(zoom.transform, transform);
  }

  function handleKeyDown(e) {
    if (['Shift', 'Meta', 'Control'].includes(e.key)) zoomable = true;
  }

  function handleKeyUp(e) {
    if (['Shift', 'Meta', 'Control'].includes(e.key)) zoomable = false;
  }

  function handleScroll() {
    if (!zoomable && numGestureNotes < 1000) {
      startGestureNote();
    }
  }

  function handleMouseDown() {
    if (!zoomable && numGestureNotes < 10) {
      startGestureNote();
    }
  }
  
  onMount(() => {
    zoomCatcher = select(zoomCatcherElem);
    zoomCatcher.call(zoom);
    zoomReset({animation: false});
  });

  onDestroy(() => clearTimeout(tid));

  $: if ($data && !$isVertical && $mapWidth && $mapHeight) zoomReset({animation: $data.length});

  $: centroidRadius = Math.max(7, Math.min(14, 0.006 * Math.max($mapWidth, $mapHeight)));
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} on:mousewheel={handleScroll} />

<div
  class="map"
  bind:clientWidth={$mapWidth}
  bind:clientHeight={$mapHeight}
  on:touchend={handleMapTouchend}
  on:mousedown={handleMouseDown}
>
  {#if (showGestureNote)}
    <GestureNote
      mode={$isVertical ? 'mobile' : 'desktop'}
    />
  {/if}
  <Navigation
    on:reset={zoomReset}
    on:plus={zoomPlus}
    on:minus={zoomMinus}
  />
  {#if ($anyFilterActive)}
    <ResetFilters />
  {/if}
  <Legend
    statusFilter={statusFilter}
    countryFilter={countryFilter}
    fullStatusRollup={fullStatusRollup}
    statusRollup={statusRollup}
    totalCountries={160+$totalCountries}
  />
  <Canvas
    width={$mapWidth}
    height={$mapHeight}
    center={false}
    --position="absolute"
    --z-index="0"
  >
    <!--{typeof (console.log($projectedData)) === 'undefined' ? '' : ''}-->
    {#each $projectedData as country}
      <Country
        path={country.path}
        color={typeof $data.find(d => { return d.country === country.name}) !== 'undefined' ? '#B72951' : '#B72951'}
        strokeColor={ styles.countryEnabled}
        fallbackFillColor={styles.countryEnabled}
        fillOpacity={(country.id === $selectedId) ? 1 : 0.31}
        mode={'stroke' || country.status === 'country' ? 'area' : 'stroke'}
      />
    {/each}
  </Canvas>
  <svg
    width={$mapWidth}
    height={$mapHeight}
    viewBox="0 0 {$mapWidth} {$mapHeight}"
    bind:this={zoomCatcherElem}
  >

    {#each $dataCountries as country (country.orderId)}
        <Centroid
          dataCountry={country}
          radius={centroidRadius}
          color={country.status == 'Yes' ? '#0F0' : ( country.status == 'No' ? '#F00' : '#B72951') }
          opacity={country.show ? 1 : 1}
          isReactive={country.show ? 1 : 1}
          inverted={country.status === 'region'}
          offset={$mapTransform.k > $initialTransform.k * clusterZoom ? [0, 0] : country.offset}
          on:mouseenter={(e) => handleCentroidMouseEnter(e, country.id)}
          on:mouseleave={(e) => handleCentroidMouseLeave(e, country.id)}
          on:touchstart={(e) => handleCentroidClick(e, country.id)}
          on:click={(e) => handleCentroidClick(e, country.id)}
          hovered={($hoveredIds.includes(country.id))}
        />
    {/each}

    <!--{typeof (console.log($dataClusters)) === 'undefined' ? '' : ''}-->
    {#each $dataClusters as cluster (cluster.id)}
      {#if (($mapTransform.k < $initialTransform.k * clusterZoom)) } <!-- && cluster.countries.some(c => c.show) -->
        <Centroid
          dataCountry={cluster}
          radius={centroidRadius}
          color='#B72951'
          opacity={cluster.show ? 1 : 1}
          isReactive={cluster.show ? true : true}
          isCluster
          on:mouseenter={(e) => handleCentroidClusterMouseEnter(e, cluster.id)}
          on:mouseleave={(e) => handleCentroidClusterMouseLeave(e, cluster.id)}
          on:click={() => handleClusterClick(cluster.centroid, $initialTransform.k * (clusterZoom + 0.1), $mapTransform, $initialTransform, $mapWidth, $mapHeight)}
          hovered={($hoveredClusterIds.includes(cluster.id))}
        />
      {/if}
    {/each}

    
  </svg>
  <!--<svg
    class="top"
    width={$mapWidth}
    height={$mapHeight}
    viewBox="0 0 {$mapWidth} {$mapHeight}"
  >
    {#each $hoveredIds as hoveredId (hoveredId)}
      <HoverTag
        data={$dataCountries.find(d => d.id === hoveredId)}
        mapWidth={$mapWidth}
        mapHeight={$mapHeight}
        on:mouseenter={(e) => handleCentroidMouseEnter(e, hoveredId)}
        on:mouseleave={(e) => handleCentroidMouseLeave(e, hoveredId)}
        on:tagclick={handleHoverTagClick}
      />
    {/each}

    {#each $hoveredClusterIds as hoveredClusterId (hoveredClusterId)}
      <HoverTagCluster
        data={$dataClusters.find(d => d.id === hoveredClusterId)}
        mapWidth={$mapWidth}
        mapHeight={$mapHeight}
        on:mouseenter={(e) => handleCentroidClusterMouseEnter(e, hoveredClusterId)}
        on:mouseleave={(e) => handleCentroidClusterMouseLeave(e, hoveredClusterId)}
      />
    {/each}
  </svg>-->
</div>

<style>
  .map {
    position: relative;
    width: 100%;
    height: 180vw;
    overflow: hidden;
    border-top: 1px dashed var(--gray);
    background-color: #FFEDF2; /*B72951*/
  }
  
  @media (min-width: 600px) {
    .map {
      height: 50vw;
    }
  }

  svg {
    position: absolute;
    z-index: 10;
  }

  svg.top {
    z-index: 1000;
    pointer-events: none;
  }
</style>
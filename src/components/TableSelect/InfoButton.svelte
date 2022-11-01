<script>
  //import { clickOutside } from '../../actions/clickoutside';
  //import { setFocus } from '../../actions/focus';
  //import { areAllSelected, hasOverlap } from "../../utils/logic";
  //import { questionMark } from '../../utils/icons';
  import { information } from '../../utils/icons';
  import { getCoords } from '../../utils/misc';

  import Icon from 'svelte-awesome';

  //export let filter;
  //export let label = '';
  //export let shortCuts = [];
  //export let fullRollup = [];
  //export let rollup = [];
  export let info = null;
  export let tooltip = null;
  //export let showReset = false;
  //export let hideColorBoxes = false;
  //export let showClickHint = false;

  //let searchValue = '';
  //let hoveredSuggestion = null;
  //let showSuggestions = false;
  //let chips = [];
  let infoElem;

  function handleInfo(show) {
    //console.log(show, info, tooltip);
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


</script>



<button
  class="info"
  bind:this={infoElem}
  on:mouseenter={() => handleInfo(true)}
  on:mouseleave={() => handleInfo(false)}
><Icon data={information} />
</button>


<style>
button {
  border: 0;
  background-color: transparent;
}

button.info {
  color: #065697;
  opacity: .3;
  vertical-align: middle;
}
</style>
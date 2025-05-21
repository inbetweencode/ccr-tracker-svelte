<script>
  //import Share from './Share/Share.svelte';

  export let text;
</script>

<footer>
  <p class="sources">{text}</p>
  <!--<Share>Share this view</Share>-->
</footer>

<style>
  footer {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    padding: 0 1rem;
    /*border-bottom: 1px dashed var(--gray);*/
  }

  p.sources {
    margin: .5rem 1rem 0 0;
    color: var(--darkgray);
    font-family: var(--primFont);
    font-size: 0.8rem;
  }
</style>
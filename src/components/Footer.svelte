<script>
  import Share from './Share/Share.svelte';
</script>

<footer>
  <p class="sources"></p>
  <Share>Share this view</Share>
</footer>

<style>
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 1rem;
    /*border-bottom: 1px dashed var(--gray);*/
  }

  p.sources {
    margin: 0 1rem 0 0;
    color: var(--darkgray);
    font-family: var(--primFont);
    font-size: 0.8rem;
  }
</style>
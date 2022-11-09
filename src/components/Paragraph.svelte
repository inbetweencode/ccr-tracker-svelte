<script>

  export let heading;
  export let text;
</script>

<div class='paragraph'>
<h3>{heading}</h3>
<p>{text}</p>
</div>

<style>
  .paragraph {
      font-family: var(--primFont);
      margin: 15px 30px 90px;
  }
  h3 {
      margin-bottom: 30px;
      font-size: 2.25rem;
  }
  p {
      font-size: 1.25rem;
  }

</style>
<script>
  export let tab;
  export let tag;
</script>

{#if tag}
  <li class="nav-item">
    <a href="/" class="nav-link active" on:click={e => e.preventDefault()}>
      <i class="ion-pound" />
      {tag}
    </a>
  </li>
{/if}

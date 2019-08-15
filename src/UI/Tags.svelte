<script>
  import { viewModel } from "../constants";

  export let tags;
  export let fetchStatus;

  const {
    fetchStatus: [LOADING, NOK, OK]
  } = viewModel;
</script>

<div class="tag-list">
  {#if fetchStatus === LOADING}
    <div>Loading tags...</div>
  {:else if tags}
    {#each tags as tag (tag)}
      <a href="" class="tag-pill tag-default">{tag}</a>
    {/each}
  {/if}
</div>

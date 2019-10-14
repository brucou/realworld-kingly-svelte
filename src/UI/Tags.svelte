<script>
  import { viewModel } from "../constants";
  import { local } from "../shared/events";

  export let tags;
  export let fetchStatus;
  export let onClickTag;

  const {
    fetchStatus: [LOADING, NOK, OK]
  } = viewModel;
  const clickHandler = (tag, onClickTag) => local(() => onClickTag(tag));
</script>

<div class="tag-list">
  {#if fetchStatus === LOADING}
    <div>Loading tags...</div>
  {:else if fetchStatus === NOK}
    <div>Was unable to fetch tags for the global feed!</div>
  {:else if tags}
    {#each tags as tag (tag)}
      <a href="/" class="tag-pill tag-default" on:click={clickHandler(tag, onClickTag)}>{tag}</a>
    {/each}
  {/if}
</div>

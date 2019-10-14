<script>
  import { local } from "../shared/events";

  export let articlesCount;
  export let onClickPage;
  export let currentPage = 0;

  // We can leave that here instead of moving it to a helpers kind of file
  // Per Svelte docs:
  // "Svelte will hoist any functions that don't depend on local state out of the component definition
  function getPageList({ articlesCount, currentPage }) {
    const range = [];
    for (let i = 0; i < Math.ceil(articlesCount / 10); ++i) {
      range.push({ number: i, isCurrent: i === currentPage });
    }
    return range;
  }

  const onClick = page => local(() => onClickPage(page.number));

  $: pages = getPageList({ articlesCount, currentPage });
</script>

{#if articlesCount > 10}
  <nav>
    <ul class="pagination">
      {#each pages as page (String(page.number))}
        <li class={page.isCurrent ? 'page-item active' : 'page-item'} on:click={onClick(page)}>
          <a class="page-link" href="/">{page.number + 1}</a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

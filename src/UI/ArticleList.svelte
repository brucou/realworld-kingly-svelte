<script>
  import { viewModel } from "../constants";
  import ArticlePreview from "./ArticlePreview.svelte";
  import ListPagination from "./ListPagination.svelte";

  export let articles;
  export let articlesCount;
  export let currentPage = 0;
  export let fetchStatus;
  export let onClickPage;
  export let onClickFavorite;
  export let favoriteStatus;

  const {
    fetchStatus: [LOADING, NOK, OK]
  } = viewModel;

  $: favoritedSlug = favoriteStatus;
</script>

{#if fetchStatus === LOADING}
  <div class="article-preview">Loading...</div>
{:else if fetchStatus === NOK}
  <div class="article-preview">
    Was unable to fetch articles for the global feed!
  </div>
{:else if articles && articles.length === 0}
  <div class="article-preview">No articles are here... yet.</div>
{:else if articles}
  <div>
    {#each articles as article (article.slug)}
      <ArticlePreview
        {article}
        {onClickFavorite}
        isDisabled={article.slug === favoritedSlug} />
    {/each}
    <ListPagination {articlesCount} {currentPage} {onClickPage} />
  </div>
{/if}

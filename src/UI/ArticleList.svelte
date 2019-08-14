<script>
import {viewModel} from "../constants"
import ArticlePreview from "./ArticlePreview.svelte"
import ListPagination from "./ListPagination.svelte"

export let articles;
export let articlesCount;
export let currentPage;
export let fetchStatus;

const {fetchStatus: [LOADING, NOK, OK]} = viewModel;

</script>

{ #if fetchStatus === LOADING}
  <div class="article-preview">Loading...</div>
{ :else if  fetchStatus === NOK}
  <div class="article-preview">Was unable to fetch articles for the global feed!</div>
{ :else if articles.length === 0}
  <div class="article-preview">No articles are here... yet.</div>;
{ :else }
  <div>
  {#each articles as article (article.slug)}
       <ArticlePreview
         article={article}
       />
  {/each}
     <ListPagination
       articlesCount={articlesCount}
       currentPage={currentPage}
     />
  </div>
{ /if }

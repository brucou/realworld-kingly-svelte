<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import ArticleList from "./ArticleList.svelte";
  import Tags from "./Tags.svelte";
  import GlobalFeedTab from "./GlobalFeedTab.svelte";
  import { viewModel } from "../constants";
  import { events } from "../constants";

  // Props
  export let tags;
  export let articles;
  export let page;
  // Unused for now
  export let dispatch;

  const {
    tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED],
    fetchStatus: [LOADING, NOK, OK]
  } = viewModel;

  function computeFetchStatus(obj) {
    if (obj instanceof Error) {
      return NOK;
    } else if (typeof obj === "string") {
      return LOADING;
    } else if (typeof obj === "object") {
      return OK;
    } else {
      throw `computeFetchStatus: invalid parameter!`;
    }
  }
  // - It seems like Svelte does not currently allows destructuring in reactive statements!
  // - It seems you can't reuse a reactive assignment's left side on the right side, hence the dup typeof tags
  $: articleList =
    typeof articles === "object" ? articles && articles.articles : void 0;
  $: articlesCount =
    typeof articles === "object" ? articles && articles.articlesCount : 0;
  $: tagList = typeof tags === "object" ? tags && tags.tags : void 0;
  $: tagsFetchStatus = computeFetchStatus(tags);
  $: articlesFetchStatus = computeFetchStatus(articles);
  $: currentPage = page || 0;
</script>

<div>
  <Header />
  <div class="home-page" data-testId="home-page">
    <Banner />
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <GlobalFeedTab />
            </ul>
          </div>
          <ArticleList
            articles={articleList}
            {articlesCount}
            {currentPage}
            fetchStatus={articlesFetchStatus} />
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <Tags tags={tagList} fetchStatus={tagsFetchStatus} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

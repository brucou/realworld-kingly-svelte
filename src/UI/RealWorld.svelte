<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import ArticleList from "./ArticleList.svelte";
  import Tags from "./Tags.svelte";
  import GlobalFeedTab from "./GlobalFeedTab.svelte";

  // TODO: run the UI first then review the tests and the branch
  export let tags;
  export let articles;
  export let page;

  // NOTE: we have to guard against undefined values!
  // Because the SvelteFsm renders its slot content, at initialization time, that slot will be
  // with empty props...
  // That could be worked around by adding a `isInitialized` state variable but then that logic
  // is tricky to define in the general case, so we keep it simple
  // NOTE: it seems like Svelte does not currently allows destructuring in reactive statements!
  $: articleList = articles && articles.data;
  $: articlesCount = (articles && articles.count) || 0;
  $: tagList = tags && tags.data;
  $: tagsFetchStatus = tags && tags.fetchStatus;
  $: articlesFetchStatus = articles && articles.fetchStatus;
  $: currentPage = page;
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

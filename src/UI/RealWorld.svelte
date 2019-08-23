<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import ArticleList from "./ArticleList.svelte";
  import Tags from "./Tags.svelte";
  import GlobalFeedTab from "./GlobalFeedTab.svelte";
  import UserFeedTab from "./UserFeedTab.svelte";
  import TagFilterTab from "./TagFilterTab.svelte";
  import { viewModel } from "../constants";

  // Props
  export let tags;
  export let articles;
  export let page = 0;
  export let activeFeed;
  export let user;
  export let selectedTag;
  export let onClickTag = () => {};
  export let onClickUserFeedTab = () => {};
  export let onClickGlobalFeedTab = () => {};
  export let onClickPage;
  export let onClickFavorite;

   const {
    tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED],
    } = viewModel;

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
  $: currentPage = page || 0;
  $: isFilterTagFeed = activeFeed === TAG_FILTER_FEED;
  $: token = user && user.token;
</script>

<div>
  <Header {user} />
  <div class="home-page">
    {#if !user}
      <Banner />
    {/if}
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
            { #if token }
              <UserFeedTab tab={activeFeed} {user} onClickTab="{onClickUserFeedTab}"/>
            { /if}
              <GlobalFeedTab tab={activeFeed} onClickTab="{onClickGlobalFeedTab}" />
            { #if isFilterTagFeed }
              <TagFilterTab tab={activeFeed} tag={selectedTag} />
            { /if}
            </ul>
          </div>
          <ArticleList
            articles={articleList}
            {articlesCount}
            {currentPage}
            {onClickPage}
            {onClickFavorite}
            fetchStatus={articlesFetchStatus} />
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <Tags tags={tagList} fetchStatus={tagsFetchStatus} {onClickTag} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

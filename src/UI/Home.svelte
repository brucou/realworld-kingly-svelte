<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import ArticleList from "./ArticleList.svelte";
  import Tags from "./Tags.svelte";
  import GlobalFeedTab from "./GlobalFeedTab.svelte";
  import UserFeedTab from "./UserFeedTab.svelte";
  import TagFilterTab from "./TagFilterTab.svelte";
  import { events, viewModel } from "../constants";

  // Props
  // Common props
  export let dispatch;
  export let user;
  // Home route props
  export let tags;
  export let articles;
  export let page;
  export let activeFeed;
  export let selectedTag;
  export let favoriteStatus;

  const {
    ROUTE_CHANGED,
    TAGS_FETCHED_OK,
    TAGS_FETCHED_NOK,
    ARTICLES_FETCHED_OK,
    ARTICLES_FETCHED_NOK,
    AUTH_CHECKED,
    CLICKED_TAG,
    CLICKED_PAGE,
    CLICKED_USER_FEED,
    CLICKED_GLOBAL_FEED,
    TOGGLED_FAVORITE
  } = events;

  const onClickTag = tag => {
    dispatch({ [CLICKED_TAG]: tag });
  };
  const onClickUserFeedTab = e => {
    dispatch({ [CLICKED_USER_FEED]: void 0 });
  };
  const onClickGlobalFeedTab = e => {
    dispatch({ [CLICKED_GLOBAL_FEED]: void 0 });
  };
  const onClickPage = page => {
    dispatch({ [CLICKED_PAGE]: page });
  };
  const onClickFavorite = ({ slug, article }) => {
    dispatch({ [TOGGLED_FAVORITE]: { slug, isFavorited: article.favorited } });
  };

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

  $: articleList = typeof articles === "object" ? articles && articles.articles : void 0;
  $: articlesCount = typeof articles === "object" ? articles && articles.articlesCount : 0;
  $: tagList = typeof tags === "object" ? tags && tags.tags : void 0;
  $: tagsFetchStatus = tags && computeFetchStatus(tags);
  $: articlesFetchStatus = articles && computeFetchStatus(articles);
  $: currentPage = page || 0;
  $: isFilterTagFeed = activeFeed === TAG_FILTER_FEED;
  $: token = user && user.token;
  // This allows us to have something to show even when the only properties
  // The view could (should?) also check the validity of its parameters,
  // but here we make minimal checks and of course avoid throwing
  // `page` is set to 0 if not there.
  // A key mandatory prop here is activeFeed so we guard against that.
  $: hasActiveFeed = typeof activeFeed !== "undefined";
</script>

<div>
  <div class="home-page">
    {#if !user}
      <Banner />
    {/if}
    {#if hasActiveFeed}
      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                {#if token}
                  <UserFeedTab tab={activeFeed} {user} onClickTab={onClickUserFeedTab} />
                {/if}
                <GlobalFeedTab tab={activeFeed} onClickTab={onClickGlobalFeedTab} />
                {#if isFilterTagFeed}
                  <TagFilterTab tab={activeFeed} tag={selectedTag} />
                {/if}
              </ul>
            </div>
            <ArticleList
              articles={articleList}
              {articlesCount}
              {currentPage}
              {onClickPage}
              {onClickFavorite}
              fetchStatus={articlesFetchStatus}
              {favoriteStatus} />
          </div>
          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <Tags tags={tagList} fetchStatus={tagsFetchStatus} {onClickTag} />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

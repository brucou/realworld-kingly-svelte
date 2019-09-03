<script>
  import Banner from "./Banner.svelte";
  import Header from "./Header.svelte";
  import ArticleList from "./ArticleList.svelte";
  import Tags from "./Tags.svelte";
  import GlobalFeedTab from "./GlobalFeedTab.svelte";
  import UserFeedTab from "./UserFeedTab.svelte";
  import TagFilterTab from "./TagFilterTab.svelte";
  import { viewModel } from "../constants";
  import { events } from "../fsm";

  // Props
  export let dispatch;
  export let tags;
  export let articles;
  export let page;
  export let activeFeed;
  export let user;
  export let selectedTag;

  const [
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
  ] = events;

  const onClickTag = tag => {dispatch({[CLICKED_TAG]: tag})};
  const onClickUserFeedTab = e => {dispatch({[CLICKED_USER_FEED]: void 0})};
  const onClickGlobalFeedTab = e => {dispatch({[CLICKED_GLOBAL_FEED]: void 0})};
  const onClickPage = page => {dispatch({[CLICKED_PAGE]: page})};
  // TODO: compute the event handlers when the machine is implemented
  const onClickFavorite = slug => {dispatch({[TOGGLED_FAVORITE]: slug})};

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

  // Several notes related to Svelte
  // - We have to guard against undefined values!
  //   SvelteFsm renders its slot content and at initialization time, that slot will be
  //   with empty props...
  //   That can be worked around with an extra variable but we keep it simple
  // - It seems like Svelte does not currently allows destructuring in reactive statements!
  // - Also you can't reuse a left side on the right side, hence the dup typeof tags
  $: articleList =
    typeof articles === "object" ? articles && articles.articles : void 0;
  $: articlesCount =
    typeof articles === "object" ? articles && articles.articlesCount : 0;
  $: tagList = typeof tags === "object" ? tags && tags.tags : void 0;
  $: tagsFetchStatus = computeFetchStatus(tags);
  $: articlesFetchStatus = computeFetchStatus(articles);
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
              {#if token}
                <UserFeedTab
                  tab={activeFeed}
                  {user}
                  onClickTab={onClickUserFeedTab} />
              {/if}
              <GlobalFeedTab
                tab={activeFeed}
                onClickTab={onClickGlobalFeedTab} />
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

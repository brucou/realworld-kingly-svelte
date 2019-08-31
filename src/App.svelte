<script>
  import Fsm from "./SvelteFsm.svelte";
  import emitonoff from "emitonoff";
  import { COMMAND_RENDER, createStateMachine, fsmContracts } from "kingly";
  import sessionRepositoryFactory from "./sessionRepository";
  import apiGatewayFactory from "./apiGateway";
  import apiRouterFactory from "./apiRouter";
  import eventEmitterFactory from "./eventEmitter";
  import { commands, events, fsmFactory as f } from "./fsm";
  import { viewModel } from "./constants";

  let shouldRender = false;
  let page = 0;
  let tags;
  let articles;
  let activeFeed;
  let user;
  let selectedTag;
  let onClickTag;
  let onClickUserFeedTab;
  let onClickGlobalFeedTab;
  let onClickPage;
  let onClickFavorite;

  // This is to prevent some compiling errors from Svelte
  // Apparently directly using the import does not compile correctly
  let fsmFactory = f;

  // helpers
  function set(prop) {
    return x => (prop = x);
  }

  // view model constants
  const {
    fetchStatus: [LOADING, NOK, OK],
    tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED]
  } = viewModel;

  // Commands
  const [
    RENDER,
    FETCH_GLOBAL_FEED,
    FETCH_ARTICLES_GLOBAL_FEED,
    FETCH_ARTICLES_USER_FEED,
    FETCH_AUTHENTICATION,
    FETCH_USER_FEED,
    FETCH_FILTERED_FEED
  ] = commands;
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
    CLICKED_GLOBAL_FEED
  ] = events;
  const env = { debug: { console, checkContracts: fsmContracts } };

  // Event emitter
  const eventEmitter = eventEmitterFactory(emitonoff);
  const next = eventEmitter.next.bind(eventEmitter);

  // We set in place the API for storing authentication data
  const sessionRepository = sessionRepositoryFactory(
    window.localStorage,
    window.addEventListener
  );

  // We set in place the APIs for fetching domain objects
  const { fetchGlobalFeed, fetchTags } = apiGatewayFactory(
    fetch,
    sessionRepository
  );

  // We set in place route handling
  function hashChangeHandler({ newURL, oldURL, hash }) {
    next({ [ROUTE_CHANGED]: { newURL, oldURL, hash } });
  }
  const { subscribe: hashChangeSubscribe, getCurrentHash } = apiRouterFactory(
    window.location,
    window.addEventListener
  );
  hashChangeSubscribe(hashChangeHandler);

  // TODO: Svelte would probably not detect the assignment if we would use Object.assign? open question
  const DEFAULT_PAGE = 0;
  const updateProps = {
    page: set(page),
    tags: set(tags),
    articles: set(articles),
    activeFeed: set(activeFeed),
    user: set(user),
    selectedTag: set(selectedTag),
    onClickTag: set(onClickTag),
    onClickUserFeedTab: set(onClickUserFeedTab),
    onClickGlobalFeedTab: set(onClickGlobalFeedTab),
    onClickPage: set(onClickPage),
    onClickFavorite: set(onClickFavorite)
  };

  function render(props) {
    const propList = Object.keys(props);
    propList.forEach(prop => {
      if (!updateProps[prop])
        console.warn(`App > commandHandlers: Unknown prop ${prop}!`);
      else updateProps[prop](props[prop]);
    });
  }

  // Command and effect handlers
  const commandHandlers = {
    [RENDER]: (dispatch, params, effectHandlers) => {
      const { render, enableRender } = effectHandlers;
      enableRender();
      render(params);
    },
    [FETCH_GLOBAL_FEED]: (dispatch, params, effectHandlers) => {
      const { page } = params;
      const { fetchGlobalFeed, fetchTags } = effectHandlers;

      fetchGlobalFeed({ page })
        .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
        .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));

      fetchTags()
        .then(res => dispatch({ [TAGS_FETCHED_OK]: res }))
        .catch(err => dispatch({ [TAGS_FETCHED_NOK]: err }));
    }
    // TODO: add command missing handlers
    //   FETCH_ARTICLES_GLOBAL_FEED,
    //   FETCH_ARTICLES_USER_FEED,
    //   FETCH_AUTHENTICATION,
    //   FETCH_USER_FEED,
    //   FETCH_FILTERED_FEED
  };

  const effectHandlers = {
    render,
    enableRender: () => {
      shouldRender = true;
    },
    fetchTags,
    fetchGlobalFeed
  };

  // kick start the app with the routing event corresponding to the current route
  const initEvent = { [ROUTE_CHANGED]: { hash: getCurrentHash() } };
</script>

<Fsm
  {fsmFactory}
  {env}
  eventHandler={eventEmitter}
  {commandHandlers}
  {effectHandlers}
  {initEvent}>
  {#if shouldRender}
    <RealWorld {tags} {articles} {page} {activeFeed} {user} {selectedTag} />
  {/if}
</Fsm>

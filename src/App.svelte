<script>
  import Fsm from "./SvelteFsm.svelte";
  import RealWorld from "./UI/RealWorld.svelte";
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
  const { fetchGlobalFeed, fetchTags, fetchAuthentication } = apiGatewayFactory(
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
    page: x => page = x,
    tags: x => tags = x,
    articles: x => articles = x,
    activeFeed: x => activeFeed = x,
    user: x => user = x,
    selectedTag: x => selectedTag = x,
    onClickTag: x => onClickTag = x,
    onClickUserFeedTab: x => onClickUserFeedTab = x,
    onClickGlobalFeedTab: x => onClickGlobalFeedTab = x,
    onClickPage: x => onClickPage = x,
    onClickFavorite: x => onClickFavorite = x,
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
      render(params);
      setTimeout(() => enableRender(), 0);
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
    },
    [FETCH_AUTHENTICATION]: (dispatch, params, effectHandlers) => {
      const {fetchAuthentication} = effectHandlers;
      const user = fetchAuthentication();
      dispatch({[AUTH_CHECKED]: user})
    }
    // TODO: add command missing handlers
    //   FETCH_ARTICLES_GLOBAL_FEED,
    //   FETCH_ARTICLES_USER_FEED,
    //   FETCH_USER_FEED,
    //   FETCH_FILTERED_FEED
    // TODO: pass the event handlers in fsm.js... they are constant so pass them in the first loading everywhere?
    // TODO: or pass them in the APP here directly?
    // ! pass the dispatcher to the view, and have the view compute the handlers
    //   - this is easier to test with storybook
    //   - this couples the view to the machine (the events more precisely)
    //   - BUT THAT'S OK. That's coupling through interface or through parameters
    //     - just like the machine computes props which are the props of the machine!! so coupling too
    //     - easy to decouple with an adapter (machine props -> view props)
    //     - or view events -> machine events
    // - compute the handlers in the machine through the init event
    //   - put in in extended state and use it in actions
    //   - this complicates testing the machine (can't test the functions!!)
    //   - thus would have to resort to integration tests? not optimal!
    // - compute the handlers in the machine when needed
    //   - may trigger unnecessary update as the handlers may change while still being the same
    //   - but maybe not a big problem? and can also memoize
    //   - TOO COMPLICATED!!

  };

  const effectHandlers = {
    render,
    enableRender: () => {
      shouldRender = true;
    },
    fetchTags,
    fetchGlobalFeed,
    fetchAuthentication
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
    <RealWorld {tags} {articles} {page} {activeFeed} {user} {selectedTag} dispatch="{next}"/>
  {/if}
</Fsm>

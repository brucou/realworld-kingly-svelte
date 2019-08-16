<script>
  import emitonoff from "emitonoff";
  import { COMMAND_RENDER, createStateMachine, fsmContracts } from "kingly";
  import RealWorld from "./UI/RealWorld.svelte";
  import Fsm from "./SvelteFsm.svelte";
  import sessionRepositoryFactory from "./sessionRepository";
  import apiGatewayFactory from "./apiGateway";
  import apiRouterFactory from "./apiRouter";
  import eventEmitterFactory from "./eventEmitter";
  import { commands, events, fsmFactory as f } from "./fsm";
  import { viewModel } from "./constants";

  // props
  let page = 0;
  let tags;
  let articles;

  // This is to prevent some compiling errors from Svelte
  // Apparently directly using the import does not compile correctly
  let fsmFactory = f;

  //
  const {
    fetchStatus: [LOADING, NOK, OK]
  } = viewModel;

  // Commands
  const [RENDER, FETCH_GLOBAL_FEED] = commands;
  const [
    ROUTE_CHANGED,
    TAGS_FETCHED_OK,
    TAGS_FETCHED_NOK,
    ARTICLES_FETCHED_OK,
    ARTICLES_FETCHED_NOK
  ] = events;
  const env = { debug: { console, checkContracts: fsmContracts } };

  // Event emitter
  const eventEmitter = eventEmitterFactory(emitonoff);
  const next = eventEmitter.next.bind(eventEmitter);

  // Infrastructure layer
  //
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

 // Render handler: we update props one by one to allow for some preprocessing
  // Svelte would probably not detect the assignment
  // if we would use Object.assign? open question
  // TODO: the logic in tags and articles can be DRYed up
  const DEFAULT_PAGE = 0;
  const updateProps = {
    page: _page => (page = _page || DEFAULT_PAGE),
    tags: _tags => {
      if (_tags instanceof Error) {
        tags = { data: void 0, fetchStatus: NOK };
      } else if (typeof _tags === "string") {
        tags = { data: void 0, fetchStatus: LOADING };
      } else if (typeof _tags === "object") {
        tags = { data: _tags.tags, fetchStatus: OK };
      }
    },
    articles: _articles => {
      if (_articles instanceof Error) {
        articles = { data: void 0, fetchStatus: NOK, count: void 0 };
      } else if (typeof _articles === "string") {
        articles = { data: void 0, fetchStatus: LOADING, count: void 0 };
      } else if (typeof _articles === "object") {
        articles = {
          data: _articles.articles,
          fetchStatus: OK,
          count: _articles.articlesCount
        };
      }
    }
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
      const { render } = effectHandlers;
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
  };

  const effectHandlers = {
    render,
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
  <RealWorld {tags} {articles} {page} />
</Fsm>

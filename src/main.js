import App from "./App.svelte";
import emitonoff from "emitonoff";
import { fsmContracts } from "kingly";
import sessionRepositoryFactory from "./sessionRepository";
import apiGatewayFactory from "./apiGateway";
import apiRouterFactory from "./apiRouter";
import eventEmitterFactory from "./eventEmitter";
import { commands, fsmFactory } from "./fsm";
import { events } from "./constants";

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
const eventBus = eventEmitterFactory(emitonoff);
const next = eventBus.next.bind(eventBus);

// We set in place the API for storing authentication data
const sessionRepository = sessionRepositoryFactory(
  window.localStorage,
  window.addEventListener
);

// We set in place the APIs for executing domain methods
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

function render(props) {
  // This allows to toggle rendering when an actual render command has to be executed
  app.$set(Object.assign({}, props, { _shouldRender: true }));
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

const app = new App({
  target: document.body,
  props: {
    _shouldRender: false,
    _fsm: {
      fsmFactory,
      env,
      eventBus,
      commandHandlers,
      effectHandlers
    },
    tags: void 0,
    articles: void 0,
    page: void 0,
    activeFeed: void 0,
    user: void 0,
    selectedTag: void 0
  }
});

// kick start the app with the routing event corresponding to the current route
const initEvent = { [ROUTE_CHANGED]: { hash: getCurrentHash() } };
next(initEvent);

export default app;

import { createStateMachine, fsmContracts, ACTION_IDENTITY } from "kingly"
import { loadingStates, routes } from "./constants"

export const events = [
  "ROUTE_CHANGED",
  "TAGS_FETCHED_OK",
  "TAGS_FETCHED_NOK",
  "ARTICLES_FETCHED_OK",
  "ARTICLES_FETCHED_NOK"
];
const [ROUTE_CHANGED, TAGS_FETCHED_OK, TAGS_FETCHED_NOK, ARTICLES_FETCHED_OK, ARTICLES_FETCHED_NOK] = events

export const commands = [
  "RENDER",
  "FETCH_GLOBAL_FEED",
];
const [RENDER, FETCH_GLOBAL_FEED] = commands;

const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;
const { home } = routes;

const INIT = 'start';
const initialControlState = INIT;
const initialExtendedState = {
  currentPage: 0
};
const states = {
  [INIT]: "",
  'routing': "",
  'fetching-global-feed': ""
};
const transitions = [
  { from: INIT, to: 'routing', event: ROUTE_CHANGED, action: ACTION_IDENTITY },
  {
    from: 'routing', event:void 0, guards: [
      { predicate: isHomeRoute, to: 'fetching-global-feed', action: fetchGlobalFeedAndRenderLoading }
    ]
  },
  { from: 'fetching-global-feed', to: 'fetching-global-feed', event: TAGS_FETCHED_OK, action: renderGlobalFeedTags },
  {
    from: 'fetching-global-feed',
    to: 'fetching-global-feed',
    event: ARTICLES_FETCHED_OK,
    action: renderGlobalFeedArticles
  },
  {
    from: 'fetching-global-feed',
    to: 'fetching-global-feed',
    event: TAGS_FETCHED_NOK,
    action: renderGlobalFeedTagsFetchError
  },
  {
    from: 'fetching-global-feed',
    to: 'fetching-global-feed',
    event: ARTICLES_FETCHED_NOK,
    action: renderGlobalFeedArticlesFetchError
  },
];

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce((acc, x) => Object.assign(acc, x), extendedStateCopy);
}

// Guards
function isHomeRoute(extendedState, eventData, settings){
  return eventData.hash === home
}

// Action factories
function fetchGlobalFeedAndRenderLoading(extendedState, eventData, settings) {
  const {currentPage} = extendedState;
  return {
    updates: [],
    outputs: [
      { command: FETCH_GLOBAL_FEED, params: {page: currentPage} },
      {
        command: RENDER,
        params: { tags: TAGS_ARE_LOADING, articles: ARTICLES_ARE_LOADING }
      },
    ]
  }
}

function renderGlobalFeedTags(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      {
        command: RENDER,
        params: { tags: eventData },
      },
    ]
  }
}

function renderGlobalFeedArticles(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      {
        command: RENDER,
        params:  { articles: eventData } ,
      },
    ]
  }
}

function renderGlobalFeedTagsFetchError(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      { command: RENDER, params: { tags: new Error(eventData) } },
    ]
  }
}

function renderGlobalFeedArticlesFetchError(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      { command: RENDER, params: { articles: new Error(eventData) } },
    ]
  }
}

export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events,
  transitions,
  updateState
};

export const fsmFactory = settings => createStateMachine(fsmDef, settings)

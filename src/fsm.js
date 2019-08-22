import {
  NO_OUTPUT,
  INIT_EVENT,
  ACTION_IDENTITY,
  createStateMachine,
  fsmContracts
} from "kingly";
import { loadingStates, routes, viewModel } from "./constants";

export const events = [
  "ROUTE_CHANGED",
  "TAGS_FETCHED_OK",
  "TAGS_FETCHED_NOK",
  "ARTICLES_FETCHED_OK",
  "ARTICLES_FETCHED_NOK",
  "AUTH_CHECKED",
  "USER_FEED_FETCHED_OK",
  "USER_FEED_FETCHED_NOK",
  "TAG_FILTERED_FEED_FETCHED_OK",
  "TAG_FILTERED_FEED_FETCHED_NOK",
  "CLICKED_TAG"
];
const [
  ROUTE_CHANGED,
  TAGS_FETCHED_OK,
  TAGS_FETCHED_NOK,
  ARTICLES_FETCHED_OK,
  ARTICLES_FETCHED_NOK,
  AUTH_CHECKED,
  USER_FEED_FETCHED_OK,
  USER_FEED_FETCHED_NOK,
  TAG_FILTERED_FEED_FETCHED_OK,
  TAG_FILTERED_FEED_FETCHED_NOK,
  CLICKED_TAG
] = events;

export const commands = [
  "RENDER",
  "FETCH_GLOBAL_FEED",
  "FETCH_AUTHENTICATION",
  "FETCH_USER_FEED"
];
const [
  RENDER,
  FETCH_GLOBAL_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED
] = commands;

const { home } = routes;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;
const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED]
} = viewModel;

const INIT = "start";
const initialControlState = INIT;
const initialExtendedState = {
  /** @type {Number} */
  currentPage: 0,
  activeFeed: GLOBAL_FEED,
  /** @type {null | User} */
  user: null
};
const states = {
  [INIT]: "",
  routing: "",
  home: {
    "fetching-authentication": "",
    "fetching-global-feed": {
      "pending-global-feed": ""
    },
    "fetching-user-feed": {
      "pending-fetch-user-feed": "",
      "failed-fetch-user-feed": "",
      "fetched-user-feed": ""
    },
    "fetching-filtered-articles": {
      "pending-fetch-filtered-articles": "",
      "failed-fetch-filtered-articles": "",
      "fetched-filtered-articles": ""
    }
  }
};
const transitions = [
  { from: INIT, to: "routing", event: ROUTE_CHANGED, action: ACTION_IDENTITY },
  {
    from: "routing",
    event: void 0,
    guards: [{ predicate: isHomeRoute, to: "home", action: ACTION_IDENTITY }]
  },
  {
    from: "home",
    to: "fetching-authentication",
    event: INIT_EVENT,
    action: fetchAuthentication
  },
  {
    from: "fetching-authentication",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isNotAuthenticated,
        to: "fetching-global-feed",
        action: updateAuthAndResetPage
      },
      {
        predicate: isAuthenticated,
        to: "fetching-user-feed",
        action: updateAuthAndResetPage
      }
    ]
  },
  {
    from: "fetching-global-feed",
    to: "pending-global-feed",
    event: INIT_EVENT,
    action: fetchGlobalFeedAndRenderLoading
  },
  {
    from: "pending-global-feed",
    to: "pending-global-feed",
    event: TAGS_FETCHED_OK,
    action: renderGlobalFeedTags
  },
  {
    from: "pending-global-feed",
    to: "pending-global-feed",
    event: ARTICLES_FETCHED_OK,
    action: renderGlobalFeedArticles
  },
  {
    from: "pending-global-feed",
    to: "pending-global-feed",
    event: TAGS_FETCHED_NOK,
    action: renderGlobalFeedTagsFetchError
  },
  {
    from: "pending-global-feed",
    to: "pending-global-feed",
    event: ARTICLES_FETCHED_NOK,
    action: renderGlobalFeedArticlesFetchError
  },
  {
    from: "fetching-user-feed",
    to: "pending-user-feed",
    event: INIT_EVENT,
    action: fetchUserFeedAndRenderLoading
  },
  {
    from: "pending-user-feed",
    to: "fetched-user-feed",
    event: USER_FEED_FETCHED_OK,
    action: renderUserFeed
  },
  {
    from: "pending-user-feed",
    to: "failed-fetch-user-feed",
    event: USER_FEED_FETCHED_NOK,
    action: renderUserFeedFetchError
  },
  {
    from: "fetching-filtered-articles",
    to: "pending-fetch-filtered-articles",
    event: INIT_EVENT,
    action: fetchFilteredArticlesAndRenderLoading
  },
  {
    from: "pending-fetch-filtered-articles",
    to: "fetched-filtered-articles",
    event: TAG_FILTERED_FEED_FETCHED_OK,
    action: renderFilteredTagFeed
  },
  {
    from: "pending-fetch-filtered-articles",
    to: "failed-fetch-filtered-articles",
    event: TAG_FILTERED_FEED_FETCHED_NOK,
    action: renderFilterTagFeedFetchError
  },
  {
    from: "home",
    to: "fetching-filtered-articles",
    event: CLICKED_TAG,
    action: ACTION_IDENTITY
  }
];

// TODO: check official demo. Is the pagination reset when feed/page 2/feed ?
// TODO: best practice. Factorize thr latest possible. pagination is good example
// and then only factorize when great certainty that requirements will not change
// as is the case when it is intrinsic property of the specs
// TODO:  if it does not reset the page on reclicking the same feed, then i need activeFeed in the
// state machine, otherwise not

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce(
    (acc, x) => Object.assign(acc, x),
    extendedStateCopy
  );
}

// Guards
function isHomeRoute(extendedState, eventData, settings) {
  return eventData.hash === home;
}

function isAuthenticated(extendedState, eventData, settings) {
  const { user } = eventData;

  return Boolean(user);
}

function isNotAuthenticated(extendedState, eventData, settings) {
  const { user } = eventData;

  return !Boolean(user);
}

// Action factories
function fetchGlobalFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage, user } = extendedState;

  return {
    updates: [{ activeFeed: GLOBAL_FEED }],
    outputs: [
      { command: FETCH_GLOBAL_FEED, params: { page: currentPage } },
      {
        command: RENDER,
        params: {
          tags: TAGS_ARE_LOADING,
          articles: ARTICLES_ARE_LOADING,
          activeFeed: GLOBAL_FEED,
          user
        }
      }
    ]
  };
}

function renderGlobalFeedTags(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      {
        command: RENDER,
        params: { tags: eventData }
      }
    ]
  };
}

function renderGlobalFeedArticles(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      {
        command: RENDER,
        params: { articles: eventData }
      }
    ]
  };
}

function renderGlobalFeedTagsFetchError(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { tags: new Error(eventData) } }]
  };
}

function renderGlobalFeedArticlesFetchError(
  extendedState,
  eventData,
  settings
) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { articles: new Error(eventData) } }]
  };
}

function fetchAuthentication(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

function updateAuthAndResetPage(extendedState, eventData, settings) {
  const { user } = eventData;

  return {
    updates: [{ user }, { currentPage: 0 }],
    outputs: NO_OUTPUT
  };
}

function fetchUserFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage, user } = extendedState;
  const username = user && user.username;

  return {
    updates: [{ activeFeed: USER_FEED }],
    outputs: [
      { command: FETCH_USER_FEED, params: { page: currentPage, username } },
      {
        command: RENDER,
        params: { articles: ARTICLES_ARE_LOADING, activeFeed: USER_FEED, user }
      }
    ]
  };
}

// TODO
function renderUserFeed(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      {
        command: RENDER,
        params: {
          tags: TAGS_ARE_LOADING,
          articles: ARTICLES_ARE_LOADING,
          activeFeed: USER_FEED,
          user
        }
      }
    ]
  };
}

export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events,
  transitions,
  updateState
};

export const fsmFactory = settings => createStateMachine(fsmDef, settings);

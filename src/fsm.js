import { ACTION_IDENTITY, createStateMachine, DEEP, historyState, INIT_EVENT, NO_OUTPUT } from "kingly";
import {
  events, loadingStates, routes, viewModel, routeViewLens, homeUpdates, allRoutesUpdate, allRoutes
} from "./constants";
import { not } from "./shared/hof";

/** @type Array<HOME_ROUTE_EVENTS> */
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
  TOGGLED_FAVORITE,
  FAVORITE_OK,
  FAVORITE_NOK,
  UNFAVORITE_OK,
  UNFAVORITE_NOK,
] = events;

export const commands = [
  "RENDER",
  "FETCH_GLOBAL_FEED",
  "FETCH_ARTICLES_GLOBAL_FEED",
  "FETCH_ARTICLES_USER_FEED",
  "FETCH_AUTHENTICATION",
  "FETCH_USER_FEED",
  "FETCH_FILTERED_FEED",
  "FAVORITE_ARTICLE",
  "UNFAVORITE_ARTICLE",
  "REDIRECT"
];
const [
  RENDER,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  REDIRECT
] = commands;

const { home, signUp } = routes;
const homeRouteViewLens = routeViewLens(home);
const allRoutesViewLens = routeViewLens(routes[allRoutes]);
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;
const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED]
} = viewModel;

const INIT = "start";
const initialControlState = INIT;
const initialHomeRouteState = {
  currentPage: 0,
  user: null,
  filterTag: null,
  articles: null,
  tags: null,
  favoriteStatus: null
};

/**
 * @typedef {Object} ExtendedState
 * @property {Null | string} url the hash extracted from the browser's url
 * @property {Number} currentPage
 * @property {User} user
 * @property {Boolean} areTagsFetched true iff tags have successfully been fetched
 *                     posterior to the most recent navigation to the home route
 * @property {Null | Tag} filterTag
 * @property {FetchedArticles} articles
 * @property {FetchedTags} tags
 * @property {Null | Slug} favoriteStatus When an article is liked or unliked by the user, and
 *                         the corresponding command is pending response, `favoriteStatus` will
 *                         contain the slug corresponding to the liked/unlked article
 * */
const initialExtendedState = {
  [home]: initialHomeRouteState
};
// TODO: maybe I should when I enter the Home compound state, reset the extended state? YES
// Will be necessary when I will do the other routes

const states = {
  [INIT]: "",
  routing: "",
  home: {
    feeds: {
      "fetching-authentication": "",
      "fetching-global-feed": {
        "pending-global-feed": "",
        "pending-global-feed-articles": ""
      },
      "fetching-user-feed": {
        "pending-user-feed": "",
        "pending-user-feed-articles": ""
      },
      "fetching-filtered-articles": {
        "pending-filtered-articles": "",
        "fetched-filtered-articles": "",
        "failed-fetch-filtered-articles": ""
      }
    },
    "fetch-auth-for-favorite": ""
  }
};

/** @type {Array<Transition>} */
const transitions = [
  { from: INIT, event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "routing",
    event: void 0,
    guards: [{ predicate: isHomeRoute, to: "home", action: ACTION_IDENTITY }]
  },
  {
    from: "home",
    event: INIT_EVENT,
    to: "feeds",
    action: resetHomeRouteState
  },
  {
    from: "feeds",
    event: INIT_EVENT,
    to: "fetching-authentication",
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
        action: updateAuth
      }
    ]
  },
  {
    from: "fetching-global-feed",
    event: INIT_EVENT,
    guards: [
      {
        predicate: areTagsFetched,
        to: "pending-global-feed-articles",
        action: fetchGlobalFeedArticlesAndRenderLoading
      },
      {
        predicate: not(areTagsFetched),
        to: "pending-global-feed",
        action: fetchGlobalFeedAndRenderLoading
      }
    ]
  },
  {
    from: "pending-global-feed",
    event: TAGS_FETCHED_OK,
    to: "pending-global-feed",
    action: renderTags
  },
  {
    from: "pending-global-feed",
    event: TAGS_FETCHED_NOK,
    to: "pending-global-feed",
    action: renderTagsFetchError
  },
  {
    from: "fetching-global-feed",
    event: ARTICLES_FETCHED_OK,
    to: historyState(DEEP, "fetching-global-feed"),
    action: renderGlobalFeedArticles
  },
  {
    from: "fetching-global-feed",
    event: ARTICLES_FETCHED_NOK,
    to: historyState(DEEP, "fetching-global-feed"),
    action: renderGlobalFeedArticlesFetchError
  },
  {
    from: "fetching-global-feed",
    event: CLICKED_PAGE,
    to: "fetching-global-feed",
    action: updatePage
  },
  {
    from: "fetching-user-feed",
    event: INIT_EVENT,
    guards: [
      {
        predicate: areTagsFetched,
        to: "pending-user-feed-articles",
        action: fetchUserFeedArticlesAndRenderLoading
      },
      {
        predicate: not(areTagsFetched),
        to: "pending-user-feed",
        action: fetchUserFeedAndRenderLoading
      }
    ]
  },
  {
    from: "pending-user-feed",
    event: TAGS_FETCHED_OK,
    to: "pending-user-feed",
    action: renderTags
  },
  {
    from: "pending-user-feed",
    event: TAGS_FETCHED_NOK,
    to: "pending-user-feed",
    action: renderTagsFetchError
  },
  {
    from: "fetching-user-feed",
    event: ARTICLES_FETCHED_OK,
    to: historyState(DEEP, "fetching-user-feed"),
    action: renderUserFeedArticles
  },
  {
    from: "fetching-user-feed",
    event: ARTICLES_FETCHED_NOK,
    to: historyState(DEEP, "fetching-user-feed"),
    action: renderUserFeedArticlesFetchError
  },
  {
    from: "fetching-user-feed",
    event: CLICKED_PAGE,
    to: "fetching-authentication",
    action: updatePageAndFetchAuthentication
  },
  {
    from: "fetching-filtered-articles",
    event: INIT_EVENT,
    to: "pending-filtered-articles",
    action: fetchFilteredArticlesAndRenderLoading
  },
  {
    from: "pending-filtered-articles",
    event: ARTICLES_FETCHED_OK,
    to: "fetched-filtered-articles",
    action: renderFilteredArticles
  },
  {
    from: "pending-filtered-articles",
    event: ARTICLES_FETCHED_NOK,
    to: "failed-fetch-filtered-articles",
    action: renderFilteredArticlesFetchError
  },
  {
    from: "fetching-filtered-articles",
    event: CLICKED_PAGE,
    to: "fetching-filtered-articles",
    action: updatePage
  },
  {
    from: "feeds",
    event: CLICKED_TAG,
    to: "fetching-filtered-articles",
    action: resetPageAndSetTag
  },
  {
    from: "feeds",
    event: CLICKED_GLOBAL_FEED,
    to: "fetching-global-feed",
    action: resetPage
  },
  { from: "feeds", event: CLICKED_USER_FEED, to: "feeds", action: resetPage },
  { from: "home", event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "feeds", event: TOGGLED_FAVORITE, guards: [{
      predicate: areArticlesFetched, to: "fetch-auth-for-favorite", action: fetchAuthenticationAndUpdateFavoriteStatus
    }]
  },
  {
    from: "fetch-auth-for-favorite", event: AUTH_CHECKED, guards: [
      { predicate: isNotAuthenticated, to: "routing", action: redirectToSignup },
      { predicate: isAuthenticatedAndArticleLiked, to: historyState(DEEP, "feeds"), action: unlikeArticleAndRender },
      { predicate: isAuthenticatedAndArticleNotLiked, to: historyState(DEEP, "feeds"), action: likeArticleAndRender }
    ]
  },
  { from: "feeds", event: FAVORITE_OK, to: historyState(DEEP, "feeds"), action: updateFavoritedAndRender },
  { from: "feeds", event: FAVORITE_NOK, to: historyState(DEEP, "feeds"), action: renderFavoritedNOK },
  { from: "feeds", event: UNFAVORITE_OK, to: historyState(DEEP, "feeds"), action: renderUnfavoritedAndRender },
  { from: "feeds", event: UNFAVORITE_NOK, to: historyState(DEEP, "feeds"), action: renderUnfavoritedNOK },
];

/**
 * @typedef {Object} Update
 *
 * This function updates a state object, spliced per a property called `route`
 * The route update basically works like this: {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
 * All Object.assign caveats apply
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param {Object} extendedState
 * @param {Array.<[route, Array<Update>]>} extendedStateUpdates
 * @returns {Object}
 */
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);

  if (extendedStateUpdates.length === 0) return extendedStateCopy

  return extendedStateUpdates.reduce((acc, extendedStateUpdate) => {
    const [route, updates] = extendedStateUpdate;
    if (route === void 0 || updates === void 0) {
      console.warn(`updateState: incorrect extended state update argument! [route, updates] with either route or updates undefined!`, extendedStateUpdate);
      return extendedState
    }
    const routeState = Object.assign({}, acc[route]);
    acc[route] = updates.reduce((acc, update) => Object.assign(routeState, update), routeState)

    return acc
  }, extendedStateCopy)
}

// Guards
function isHomeRoute(extendedState, eventData, settings) {
  const {url} = allRoutesViewLens(extendedState);
  return url === home;
}

function isAuthenticated(extendedState, eventData, settings) {
  const user = eventData;

  return user != null;
}

function isNotAuthenticated(extendedState, eventData, settings) {
  const user = eventData;

  return user == null;
}

function areTagsFetched(extendedState, eventData, settings) {
  const { tags } = homeRouteViewLens(extendedState)

  return Boolean(tags);
}

function isAuthenticatedAndArticleLiked(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = homeRouteViewLens(extendedState)
  const { slug, isFavorited } = favoriteStatus;

  return user && isFavorited
}

function isAuthenticatedAndArticleNotLiked(extendedState, eventData, settings) {
  return !isAuthenticatedAndArticleLiked(extendedState, eventData, settings)
}

/** @type {FSM_Predicate} */
/**
 *
 * @param {ExtendedState} extendedState
 * @param {*} eventData
 * @param {*} settings
 * @returns {*|boolean}
 */
function areArticlesFetched(extendedState, eventData, settings) {
  const { articles } = homeRouteViewLens(extendedState)

  return articles && articles.articlesCount > 0
}

// Action factories
function updateURL(extendedState, eventData, settings) {
  const { hash } = eventData;

  return {
    updates: allRoutesUpdate([{ url: hash }]),
    outputs: []
  };
}

function redirectToSignup(extendedState, eventData, settings) {
  return {
    updates: allRoutesUpdate([{ url: signUp }]),
    outputs: [
      { command: REDIRECT, params: signUp }
    ]
  };
}

function fetchGlobalFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage, user } = homeRouteViewLens(extendedState)

  return {
    updates: [],
    outputs: [
      { command: FETCH_GLOBAL_FEED, params: { page: currentPage } },
      {
        command: RENDER,
        params: {
          tags: TAGS_ARE_LOADING,
          articles: ARTICLES_ARE_LOADING,
          activeFeed: GLOBAL_FEED,
          page: currentPage,
          user,
          selectedTag: null
        }
      }
    ]
  };
}

function fetchGlobalFeedArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, user, tags } = homeRouteViewLens(extendedState)

  return {
    updates: [],
    outputs: [
      { command: FETCH_ARTICLES_GLOBAL_FEED, params: { page: currentPage } },
      {
        command: RENDER,
        params: {
          articles: ARTICLES_ARE_LOADING,
          tags,
          activeFeed: GLOBAL_FEED,
          user,
          page: currentPage,
          selectedTag: null
        }
      }
    ]
  };
}

function renderTags(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ tags: eventData }]),
    outputs: [
      {
        command: RENDER,
        params: { tags: eventData, selectedTag: null }
      }
    ]
  };
}

function renderTagsFetchError(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ tags: eventData }]),
    outputs: [{ command: RENDER, params: { tags: eventData, selectedTag: null } }]
  };
}

function renderGlobalFeedArticles(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [
      {
        command: RENDER,
        params: { articles: eventData }
      }
    ]
  };
}

function renderGlobalFeedArticlesFetchError(
  extendedState,
  eventData,
  settings
) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [{ command: RENDER, params: { articles: eventData } }]
  };
}

function fetchAuthentication(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

function fetchAuthenticationAndUpdateFavoriteStatus(extendedState, eventData, settings) {
  const { slug, isFavorited } = eventData;
  return {
    updates: homeUpdates([{ favoriteStatus: { slug, isFavorited } }]),
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

function updateAuthAndResetPage(extendedState, eventData, settings) {
  const user = eventData;

  return {
    updates: homeUpdates([{ user }, { currentPage: 0 }]),
    outputs: NO_OUTPUT
  };
}

function updateAuth(extendedState, eventData, settings) {
  const user = eventData;

  return {
    updates: homeUpdates([{ user }]),
    outputs: NO_OUTPUT
  };
}

function fetchUserFeedArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, user, tags } = homeRouteViewLens(extendedState)
  const username = user && user.username;

  return {
    updates: [],
    outputs: [
      {
        command: FETCH_ARTICLES_USER_FEED,
        params: { page: currentPage, username }
      },
      {
        command: RENDER,
        params: {
          articles: ARTICLES_ARE_LOADING,
          tags,
          activeFeed: USER_FEED,
          user,
          page: currentPage,
          selectedTag: null
        }
      }
    ]
  };
}

function fetchUserFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage, user } = homeRouteViewLens(extendedState)

  return {
    updates: [],
    outputs: [
      { command: FETCH_USER_FEED, params: { page: currentPage } },
      {
        command: RENDER,
        params: {
          tags: TAGS_ARE_LOADING,
          articles: ARTICLES_ARE_LOADING,
          activeFeed: USER_FEED,
          user,
          page: currentPage,
          selectedTag: null
        }
      }
    ]
  };
}

function updatePageAndFetchAuthentication(extendedState, eventData, settings) {
  const currentPage = eventData;

  return {
    updates: homeUpdates([{ currentPage }]),
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

function updatePage(extendedState, eventData, settings) {
  const currentPage = eventData;

  return {
    updates: homeUpdates([{ currentPage }]),
    outputs: []
  };
}

function renderUserFeedArticles(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [
      {
        command: RENDER,
        params: { articles: eventData }
      }
    ]
  };
}

function renderUserFeedArticlesFetchError(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [
      {
        command: RENDER,
        params: { articles: eventData }
      }
    ]
  };
}

function fetchFilteredArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, filterTag, user, tags } = homeRouteViewLens(extendedState)

  return {
    updates: [],
    outputs: [
      {
        command: FETCH_FILTERED_FEED,
        params: { page: currentPage, tag: filterTag }
      },
      {
        command: RENDER,
        params: {
          articles: ARTICLES_ARE_LOADING,
          tags,
          activeFeed: TAG_FILTER_FEED,
          page: currentPage,
          user,
          selectedTag: filterTag
        }
      }
    ]
  };
}

function renderFilteredArticles(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [{ command: RENDER, params: { articles: eventData } }]
  };
}

function renderFilteredArticlesFetchError(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [
      {
        command: RENDER,
        params: { articles: eventData }
      }
    ]
  };
}

function resetPage(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ currentPage: 0 }]),
    outputs: []
  };
}

function resetPageAndSetTag(extendedState, eventData, settings) {
  const tag = eventData;
  return {
    updates: homeUpdates([{ currentPage: 0, filterTag: tag }]),
    outputs: []
  };
}

function unlikeArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = homeRouteViewLens(extendedState)
  const { slug, isFavorited } = favoriteStatus;

  return {
    updates: [],
    outputs: [
      { command: RENDER, params: { favoriteStatus: slug, user } },
      { command: UNFAVORITE_ARTICLE, params: { slug } }
    ]
  };
}

function likeArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = homeRouteViewLens(extendedState)
  const { slug, isFavorited } = favoriteStatus;

  return {
    updates: [],
    outputs: [
      { command: RENDER, params: { favoriteStatus: slug, user } },
      { command: FAVORITE_ARTICLE, params: { slug } }
    ]
  };
}

function updateFavoritedAndRender(extendedState, eventData, settings) {
  const { articles } = homeRouteViewLens(extendedState)
  const { article: updatedArticle } = eventData;
  const updatedArticleSlug = updatedArticle.slug;

  const updatedArticles = {
    articles: articles.articles.map(article => {
      return article.slug === updatedArticleSlug
        ? updatedArticle
        : article
    }),
    articlesCount: articles.articlesCount
  };

  return {
    updates: homeUpdates([{ articles: updatedArticles }]),
    outputs: [{ command: RENDER, params: { favoriteStatus: null, articles: updatedArticles } }]
  };
}

function renderFavoritedNOK(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { favoriteStatus: null } }]
  };
}

function renderUnfavoritedNOK(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { favoriteStatus: null } }]
  };
}

function renderUnfavoritedAndRender(extendedState, eventData, settings) {
  const { articles } = homeRouteViewLens(extendedState)
  const { article: updatedArticle } = eventData;
  const updatedArticleSlug = updatedArticle.slug;

  const updatedArticles = {
    articles: articles.articles.map(article => {
      return article.slug === updatedArticleSlug
        ? updatedArticle
        : article
    }),
    articlesCount: articles.articlesCount
  };

  return {
    updates: homeUpdates([{ articles: updatedArticles }]),
    outputs: [{ command: RENDER, params: { favoriteStatus: null, articles: updatedArticles } }]
  };
}

function resetHomeRouteState(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([initialHomeRouteState]),
    outputs: []
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

export const fsmFactory = settings => createStateMachine(fsmDef, settings);

// TODO: refactor
// - remove duplication after checking everything works
//   renderFilteredArticles = renderFilteredArticlesFetchError = renderUserFeedArticles etc.
// - write helper functions : only updates, only render. Problem is we loose the function name in the trace...

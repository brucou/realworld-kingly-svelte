import { ACTION_IDENTITY, DEEP, historyState, INIT_EVENT, NO_OUTPUT } from "kingly";
import {
  allRoutesViewLens, fetchAuthentication, isAuthenticated, isNotAuthenticated, redirectToSignUp, updateAuth, updateURL
} from "./common"
import { events, commands, homeUpdates, loadingStates, routes, routeViewLens, viewModel, allRoutes } from "../constants"
import { not } from "../shared/hof"

const { home, signUp } = routes;
export const homeRouteViewLens = routeViewLens(home);
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
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;
const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED]
} = viewModel;

// Machine definition for route

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
  // TODO: move user in common
export const initialHomeRouteState = {
  currentPage: 0,
  filterTag: null,
  articles: null,
  tags: null,
  favoriteStatus: null
};

export const homeStates = {
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
};

// Transitions

// NOTE DOC?: there is a dependency with `fsm.js` through the 'routing' state.
// Generally any transition from here to outside creates a dependency with outside
export const homeTransitions = [
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
      { predicate: isNotAuthenticated, to: "routing", action: redirectToSignUp },
      { predicate: isAuthenticatedAndArticleLiked, to: historyState(DEEP, "feeds"), action: unlikeArticleAndRender },
      { predicate: isAuthenticatedAndArticleNotLiked, to: historyState(DEEP, "feeds"), action: likeArticleAndRender }
    ]
  },
  { from: "feeds", event: FAVORITE_OK, to: historyState(DEEP, "feeds"), action: updateFavoritedAndRender },
  { from: "feeds", event: FAVORITE_NOK, to: historyState(DEEP, "feeds"), action: renderFavoritedNOK },
  { from: "feeds", event: UNFAVORITE_OK, to: historyState(DEEP, "feeds"), action: renderUnfavoritedAndRender },
  { from: "feeds", event: UNFAVORITE_NOK, to: historyState(DEEP, "feeds"), action: renderUnfavoritedNOK },
];

// Guards

export function isHomeRoute(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);
  return url === home;
}

export function areTagsFetched(extendedState, eventData, settings) {
  const { tags } = homeRouteViewLens(extendedState)

  return Boolean(tags);
}

export function isAuthenticatedAndArticleLiked(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = homeRouteViewLens(extendedState)
  const { slug, isFavorited } = favoriteStatus;

  return user && isFavorited
}

export function isAuthenticatedAndArticleNotLiked(extendedState, eventData, settings) {
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
export function areArticlesFetched(extendedState, eventData, settings) {
  const { articles } = homeRouteViewLens(extendedState)

  return articles && articles.articlesCount > 0
}

// Action factories

export function fetchGlobalFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage} = homeRouteViewLens(extendedState);
  const { user } = allRoutesViewLens(extendedState);

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

export function fetchGlobalFeedArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, tags } = homeRouteViewLens(extendedState)
  const { user } = allRoutesViewLens(extendedState);

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

export function renderTags(extendedState, eventData, settings) {
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

export function renderTagsFetchError(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ tags: eventData }]),
    outputs: [{ command: RENDER, params: { tags: eventData, selectedTag: null } }]
  };
}

export function renderGlobalFeedArticles(extendedState, eventData, settings) {
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

export function renderGlobalFeedArticlesFetchError(
  extendedState,
  eventData,
  settings
) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [{ command: RENDER, params: { articles: eventData } }]
  };
}

export function fetchAuthenticationAndUpdateFavoriteStatus(extendedState, eventData, settings) {
  const { slug, isFavorited } = eventData;
  return {
    updates: homeUpdates([{ favoriteStatus: { slug, isFavorited } }]),
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

export function updateAuthAndResetPage(extendedState, eventData, settings) {
  const user = eventData;

  return {
    updates: [[allRoutes, [{ user }]], [home, [{ currentPage: 0 }]]],
    outputs: NO_OUTPUT
  };
}

export function fetchUserFeedArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, tags } = homeRouteViewLens(extendedState)
  const { user } = allRoutesViewLens(extendedState);
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

export function fetchUserFeedAndRenderLoading(extendedState, eventData, settings) {
  const { currentPage } = homeRouteViewLens(extendedState)
  const { user } = allRoutesViewLens(extendedState);

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

export function updatePageAndFetchAuthentication(extendedState, eventData, settings) {
  const currentPage = eventData;

  return {
    updates: homeUpdates([{ currentPage }]),
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

export function updatePage(extendedState, eventData, settings) {
  const currentPage = eventData;

  return {
    updates: homeUpdates([{ currentPage }]),
    outputs: []
  };
}

export function renderUserFeedArticles(extendedState, eventData, settings) {
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

export function renderUserFeedArticlesFetchError(extendedState, eventData, settings) {
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

export function fetchFilteredArticlesAndRenderLoading(
  extendedState,
  eventData,
  settings
) {
  const { currentPage, filterTag, tags } = homeRouteViewLens(extendedState)
  const { user } = allRoutesViewLens(extendedState);

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

export function renderFilteredArticles(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ articles: eventData }]),
    outputs: [{ command: RENDER, params: { articles: eventData } }]
  };
}

export function renderFilteredArticlesFetchError(extendedState, eventData, settings) {
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

export function resetPage(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([{ currentPage: 0 }]),
    outputs: []
  };
}

export function resetPageAndSetTag(extendedState, eventData, settings) {
  const tag = eventData;
  return {
    updates: homeUpdates([{ currentPage: 0, filterTag: tag }]),
    outputs: []
  };
}

export function unlikeArticleAndRender(extendedState, eventData, settings) {
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

export function likeArticleAndRender(extendedState, eventData, settings) {
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

export function updateFavoritedAndRender(extendedState, eventData, settings) {
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

export function renderFavoritedNOK(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { favoriteStatus: null } }]
  };
}

export function renderUnfavoritedNOK(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: RENDER, params: { favoriteStatus: null } }]
  };
}

export function renderUnfavoritedAndRender(extendedState, eventData, settings) {
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

export function resetHomeRouteState(extendedState, eventData, settings) {
  return {
    updates: homeUpdates([initialHomeRouteState]),
    outputs: []
  }
}

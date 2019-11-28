import { ACTION_IDENTITY, INIT_EVENT, NO_OUTPUT } from "kingly";
import {
  commands, events, FAVORITE_PROFILE_PAGE, loadingStates, profileUpdates, routes, routeViewLens,
    USER_PROFILE_PAGE
} from "../constants"
import {
  allRoutesViewLens, alwaysTrue,
  fetchAuthentication, getFavoritedFromSlug, isAuthenticated, isNotAuthenticated, redirectToSignUp, updateAuth,
  updateURL
} from "./common"
import { and, not } from "../shared/hof"

const { profile, allRoutes } = routes;
const profileRouteViewLens = routeViewLens(profile);

const {
  ROUTE_CHANGED,
  ARTICLES_FETCHED_OK,
  ARTICLES_FETCHED_NOK,
  AUTH_CHECKED,
  CLICKED_PAGE,
  TOGGLED_FAVORITE,
  FAVORITE_OK,
  FAVORITE_NOK,
  UNFAVORITE_OK,
  UNFAVORITE_NOK,
  FETCHED_PROFILE,
  FETCH_PROFILE_NOK,
  TOGGLED_FOLLOW,
  TOGGLE_FOLLOW_OK,
  TOGGLE_FOLLOW_NOK,
} = events;
const {
  RENDER_PROFILE,
  FETCH_AUTHENTICATION,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FETCH_PROFILE,
  FETCH_AUTHOR_FEED,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE
} = commands;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;

// Machine definition for route

/**
 * @typedef {Object} ExtendedState
 * @property {Number} currentPage
 * @property {User} user
 * @property {FetchedArticles} articles
 * @property {USER_PROFILE_PAGE | FAVORITE_PROFILE_PAGE} profileTab
 * @property {Null | Slug} favoriteStatus When an article is liked or unliked by the user, and
 *                         the corresponding command is pending response, `favoriteStatus` will
 *                         contain the slug corresponding to the liked/unlked article
 * */
export const initialProfileRouteState = {
  currentPage: 0,
  articles: null,
  favoriteStatus: null,
  profileTab: null,
  profile: null,
  feedType: null,
};

export const profileStates = {
    "fetching-auth-for-profile": "",
  "user-profile-rendering": "",
  "fetch-auth-for-profile-favorite": "",
  "fetch-auth-for-profile-follow": ""
};

// Transitions
export const profileTransitions = [
  {
    from: "profile",
    event: INIT_EVENT,
    to: "fetching-auth-for-profile",
    action: fetchAuthenticationAndProfileUsername
  },
  {
    from: "fetching-auth-for-profile",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isUserProfileMyArticlesRoute,
        to: "user-profile-rendering",
        action: fetchMyArticlesAndProfileAndRender
      },
      {
        predicate: isUserProfileFavoritesRoute,
        to: "user-profile-rendering",
        action: fetchFavoriteArticlesAndProfileAndRender
      }
    ]
  },
  {
    from: "user-profile-rendering",
    event: ARTICLES_FETCHED_OK,
    to: "user-profile-rendering",
    action: renderFetchedArticles
  },
  {
    from: "user-profile-rendering",
    event: ARTICLES_FETCHED_NOK,
    to: "user-profile-rendering",
    action: renderFetchArticlesFailed
  },
  {
    from: "user-profile-rendering",
    event: FETCHED_PROFILE,
    to: "user-profile-rendering",
    action: renderFetchedProfile
  },
  {
    from: "user-profile-rendering",
    event: FETCH_PROFILE_NOK,
    to: "user-profile-rendering",
    action: renderFetchedProfileFailed
  },
  {
    from: "user-profile-rendering",
    event: TOGGLED_FOLLOW,
    to: "fetch-auth-for-profile-follow",
    action: fetchAuthentication,
  },
  {
    from: "fetch-auth-for-profile-follow",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isUserNotAuthenticated,
        to: "routing",
        action: redirectToSignUp
      },
      {
        predicate: isUserAuthenticatedAndFollowedProfile,
        to: "user-profile-rendering",
        action: unfollowProfileAndRender
      },
      {
        predicate: isUserAuthenticatedAndUnfollowedProfile,
        to: "user-profile-rendering",
        action: followProfileAndRender
      },
    ]
  },
  {
    from: "user-profile-rendering",
    event: TOGGLE_FOLLOW_OK,
    to: "user-profile-rendering",
    action: renderToggleFollowedProfile
  },
  {
    from: "user-profile-rendering",
    event: TOGGLE_FOLLOW_NOK,
    to: "user-profile-rendering",
    action: renderToggleFollowProfileFailed
  },
  {
    from: "user-profile-rendering",
    event: FAVORITE_OK,
    to: "user-profile-rendering",
    action: renderLiked
  },
  {
    from: "user-profile-rendering",
    event: FAVORITE_NOK,
    to: "user-profile-rendering",
    action: renderLikeFailed
  },
  {
    from: "user-profile-rendering",
    event: UNFAVORITE_OK,
    to: "user-profile-rendering",
    action: renderUnliked
  },
  {
    from: "user-profile-rendering",
    event: UNFAVORITE_NOK,
    to: "user-profile-rendering",
    action: renderUnlikeFailed
  },
  {
    from: "user-profile-rendering",
    event: TOGGLED_FAVORITE,
    to: "fetch-auth-for-profile-favorite",
    action: fetchAuthenticationAndUpdateFavoriteStatusForProfile
  },
  {
    from: "fetch-auth-for-profile-favorite",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isNotAuthenticated,
        to: "routing",
        action: redirectToSignUp
      },
      {
        predicate: and(isAuthenticated, isArticleLiked),
        to: "user-profile-rendering",
        action: unlikeAuthorArticleAndRender
      },
      {
        predicate: and(isAuthenticated, not(isArticleLiked)),
        to: "user-profile-rendering",
        action: likeAuthorArticleAndRender
      }
    ]
  },
  {
    from: "user-profile-rendering",
    event: CLICKED_PAGE,
    to: "fetching-auth-for-profile",
    action: fetchArticlesPage
  },
  { from: "profile", event: ROUTE_CHANGED, to: "routing", action: updateURL },
];

// Guards

// TODO: think about username having a /, how to get the username reliably?
// TEST: could be interested to test demo conduit API with username fedeme22/favorites
// And find the bug through testing? but testing with favorites in it is not going be found
// by auto-generation. DOC that somewhere
// Here I will assume that username do not have '/' in it

const profileFavoritesRouteRegexp = /\/@\w+\/favorites\/?$/;
const profileRouteRegexp = /^\/@\w+\/?$/;
const profileCaptureRegexp = /^\/@(\w+)\/?.*$/;

export function isUserProfileMyArticlesRoute(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);

  return Boolean(!url.match(profileFavoritesRouteRegexp) && url.match(profileRouteRegexp))
}

export function isUserProfileFavoritesRoute(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);

  return Boolean(url.match(profileFavoritesRouteRegexp))
}

export function isOwnProfile(extendedState, eventData, settings) {
  const { profile } = profileRouteViewLens(extendedState);
  const { user } = allRoutesViewLens(extendedState);

  return user && user.username === profile.username
}

export function isFollowed(extendedState, eventData, settings) {
  const { profile } = profileRouteViewLens(extendedState);
  const { following} = profile;

  return Boolean(following)
}

export function isUserAuthenticatedAndFollowedProfile(extendedState, eventData, settings) {
  const { user } = allRoutesViewLens(extendedState);
  const { profile: {following} } = profileRouteViewLens(extendedState);

  return Boolean(following && user)
}

export function isUserAuthenticatedAndUnfollowedProfile(extendedState, eventData, settings) {
  const { user } = allRoutesViewLens(extendedState);
  const { profile: {following} } = profileRouteViewLens(extendedState);

  return Boolean(!following && user)
}

export function isUserNotAuthenticated(extendedState, eventData, settings) {
  const { user } = allRoutesViewLens(extendedState);

  return !Boolean(user)
}

export function isArticleLiked(extendedState, eventData, settings) {
  const { favoriteStatus } = profileRouteViewLens(extendedState);
  const {isFavorited} = favoriteStatus;

  return isFavorited
}


// Action factories

export function fetchAuthenticationAndProfileUsername(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);
  const { profile } = profileRouteViewLens(extendedState);
  // NOTE: by machine construction, the url will match, i.e. `url.match` is not null
  const username = url.match(profileCaptureRegexp)[1];

  return {
    updates: profileUpdates([initialProfileRouteState, { profile: { username } }]),
    outputs: [].concat(
      fetchAuthentication(extendedState, eventData, settings).outputs,
      [{
          command: RENDER_PROFILE,
          params: {            user: null,            profileTab: null,            profile: profile,            articles: null,            page: 0,           favoriteStatus: null          }
      }]
    )
  }
}

function fetchArticlesAndProfileAndRender(feedType){
  return function fetchArticlesAndProfileAndRender(extendedState, eventData, settings) {
    const user = eventData;
    const { profile: {username}, currentPage } = profileRouteViewLens(extendedState);
    return {
      updates: [].concat(
        updateAuth(extendedState, eventData, settings).updates,
        [[routes.profile, [{feedType}]]]
      ),
      outputs: [
        { command: FETCH_PROFILE, params: username },
        { command: FETCH_AUTHOR_FEED, params: {username, page: currentPage, feedType: feedType} },
        {
          command: RENDER_PROFILE,
          params: {
            user,
            profileTab: feedType,
            // profile: null,
            articles: ARTICLES_ARE_LOADING,
            page: currentPage,
            // favoriteStatus: null
          }
        }
      ]
    };
  }
}

export function fetchMyArticlesAndProfileAndRender(extendedState, eventData, settings) {
  return fetchArticlesAndProfileAndRender(USER_PROFILE_PAGE)(extendedState, eventData, settings)
}

export function fetchFavoriteArticlesAndProfileAndRender(extendedState, eventData, settings) {
  return fetchArticlesAndProfileAndRender(FAVORITE_PROFILE_PAGE)(extendedState, eventData, settings)
}

// NOTE: could refactor renderFetchedArticles and renderFetchArticlesFailed
// They are the exact same function!!
export function renderFetchedArticles(extendedState, eventData, settings) {
  const {articles, articlesCount} = eventData;
  const { currentPage } = profileRouteViewLens(extendedState);

  return {
    updates: profileUpdates([{articles: {articles, articlesCount}}]),
    outputs: [
      {
        command: RENDER_PROFILE,
        params: {
          // user,
          // profileTab: feedType,
          // profile,
          articles: {articles, articlesCount},
          page: currentPage,
          // favoriteStatus: null
        }
      }
    ]
  };
}

export function renderFetchArticlesFailed(extendedState, eventData, settings) {
  const articlesFailed = eventData;
  const { profile, currentPage, feedType } = profileRouteViewLens(extendedState);
  const { user } = allRoutesViewLens(extendedState);

  return {
    updates: profileUpdates([{articles: articlesFailed}]),
    outputs: [      {        command: RENDER_PROFILE,        params: {          articles: articlesFailed,        }      }    ]  };
}

export function renderFetchedProfile(extendedState, eventData, settings) {
  const profile = eventData;

  return {
    updates: profileUpdates([{profile}]),
    outputs: [ { command: RENDER_PROFILE, params: {          profile,        }      }    ]
  };
}

export function renderFetchedProfileFailed(extendedState, eventData, settings) {
  return {
    updates: profileUpdates([{profile}]),
    outputs: [      {        command: RENDER_PROFILE,        params: {          profile: null,        }      }    ]
  };
}

export function followProfileAndRender(extendedState, eventData, settings) {
  const { profile } = profileRouteViewLens(extendedState);
  const pendingProfile = Object.assign({}, profile, {pending: true});

  return {
    updates: profileUpdates([{profile: pendingProfile}]),
    outputs: [
      {        command: FOLLOW_PROFILE,        params: profile.username},
      {              command: RENDER_PROFILE,        params: {          profile: pendingProfile,        }      }
    ]
  };
}

export function unfollowProfileAndRender(extendedState, eventData, settings) {
  const { profile } = profileRouteViewLens(extendedState);
  const pendingProfile = Object.assign({}, profile, {pending: true});

  return {
    updates: profileUpdates([{profile: pendingProfile}]),
    outputs: [
      {        command: UNFOLLOW_PROFILE,        params: profile.username},
      {              command: RENDER_PROFILE,        params: {          profile: pendingProfile,        }      }
    ]
  };
}

export function renderToggleFollowedProfile(extendedState, eventData, settings) {
  const profile  = eventData;

  return {
    updates: profileUpdates([{profile}]),
    outputs: [
      {  command: RENDER_PROFILE, params: { profile: profile, } }
    ]
  };
}

export function renderToggleFollowProfileFailed(extendedState, eventData, settings) {
  const { profile } = profileRouteViewLens(extendedState);
  // NOTE: this removes the pending property (could also have set it to undefined)
  const notPendingProfile = {
    "username": profile.username,
    "bio": profile.bio,
    "image": profile.image,
    "following": profile.following
  };

  return {
    updates: profileUpdates([{profile: notPendingProfile}]),
    outputs: [
      { command: RENDER_PROFILE, params: { profile: notPendingProfile, }  }
    ]
  };
}

export function fetchAuthenticationAndUpdateFavoriteStatusForProfile(extendedState, eventData, settings) {
  const { slug } = eventData;
  return {
    updates: profileUpdates([{ favoriteStatus: { slug, isFavorited: getFavoritedFromSlug(profileRouteViewLens(extendedState), eventData, settings) } }]),
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

// TODO: maybe refactor, same function!!
export function unlikeAuthorArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = profileRouteViewLens(extendedState);
  const { slug } = favoriteStatus;

  return {
    updates: updateAuth(extendedState, eventData, settings).updates,
    outputs: [
      { command: RENDER_PROFILE, params: { favoriteStatus: slug, user } },
      { command: UNFAVORITE_ARTICLE, params: { slug } }
    ]
  };
}

export function likeAuthorArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { favoriteStatus } = profileRouteViewLens(extendedState);
  const { slug } = favoriteStatus;

  return {
    updates: updateAuth(extendedState, eventData, settings).updates,
    outputs: [
      { command: RENDER_PROFILE, params: { favoriteStatus: slug, user } },
      { command: FAVORITE_ARTICLE, params: { slug } }
    ]
  };
}

// TODO: this is the same function as renderUnliked !!!
export function renderLiked(extendedState, eventData, settings) {
  const { articles } = profileRouteViewLens(extendedState);
  const { article: updatedArticle }  = eventData;
  const updatedArticleSlug = updatedArticle.slug;

  const updatedArticles = {
    articles: articles.articles.map(article => {
      return article.slug === updatedArticleSlug ? updatedArticle : article;
    }),
    articlesCount: articles.articlesCount
  };

  return {
    updates: profileUpdates([{ articles: updatedArticles }]),
    outputs: [
      { command: RENDER_PROFILE, params: { favoriteStatus: null, articles: updatedArticles } },
    ]
  };
}

export function renderLikeFailed(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [
      { command: RENDER_PROFILE, params: { favoriteStatus: null } },
    ]
  };
}

export function renderUnliked(extendedState, eventData, settings) {
  const { articles } = profileRouteViewLens(extendedState);
  const { article: updatedArticle }  = eventData;
  const updatedArticleSlug = updatedArticle.slug;

  const updatedArticles = {
    articles: articles.articles.map(article => {
      return article.slug === updatedArticleSlug ? updatedArticle : article;
    }),
    articlesCount: articles.articlesCount
  };

  return {
    updates: profileUpdates([{ articles: updatedArticles }]),
    outputs: [
      { command: RENDER_PROFILE, params: { favoriteStatus: null, articles: updatedArticles } },
    ]
  };
}

export function renderUnlikeFailed(extendedState, eventData, settings) {
  return renderLikeFailed(extendedState, eventData, settings)
}

export function fetchArticlesPage(extendedState, eventData, settings) {
  const page = eventData;

  return {
    updates: profileUpdates([{ currentPage: page}]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

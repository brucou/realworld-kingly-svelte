// TODO: DRY this with src/links.js!! so move that to links.js then change view to add the #
export const routes = {
  home: "/",
  signUp: "/register",
  allRoutes: "all routes",
  signIn: "/login",
  editor: "/editor",
  settings: "/settings",
  profile: "/@",
  article: "/article"
};

export function routeViewLens(route) {
  return function(extendedState) {
    return extendedState[route];
  };
}

export function routeUpdateLens(route) {
  return function(updates) {
    return [[route, updates]];
  };
}

export const homeUpdates = routeUpdateLens(routes.home);
export const signInUpdates = routeUpdateLens(routes.signIn);
export const signUpUpdates = routeUpdateLens(routes.signUp);
export const editorUpdates = routeUpdateLens(routes.editor);
export const settingsUpdates = routeUpdateLens(routes.settings);
export const profileUpdates = routeUpdateLens(routes.profile);
export const articleUpdates = routeUpdateLens(routes.article);

export function allRoutesUpdate(updates) {
  return [[routes.allRoutes, updates]];
}

export const loadingStates = ["TAGS_ARE_LOADING", "ARTICLES_ARE_LOADING"];

export const viewModel = {
  fetchStatus: ["LOADING", "NOK", "OK"],
  tabs: ["USER_FEED", "GLOBAL_FEED", "TAG_FILTER_FEED"]
};

export const USER_PROFILE_PAGE = "UserProfile";
export const FAVORITE_PROFILE_PAGE = "FavoriteProfile";

export const events = {
  ROUTE_CHANGED: "ROUTE_CHANGED",
  TAGS_FETCHED_OK: "TAGS_FETCHED_OK",
  TAGS_FETCHED_NOK: "TAGS_FETCHED_NOK",
  ARTICLES_FETCHED_OK: "ARTICLES_FETCHED_OK",
  ARTICLES_FETCHED_NOK: "ARTICLES_FETCHED_NOK",
  AUTH_CHECKED: "AUTH_CHECKED",
  CLICKED_TAG: "CLICKED_TAG",
  CLICKED_PAGE: "CLICKED_PAGE",
  CLICKED_USER_FEED: "CLICKED_USER_FEED",
  CLICKED_GLOBAL_FEED: "CLICKED_GLOBAL_FEED",
  TOGGLED_FAVORITE: "TOGGLED_FAVORITE",
  FAVORITE_OK: "FAVORITE_OK",
  FAVORITE_NOK: "FAVORITE_NOK",
  UNFAVORITE_OK: "UNFAVORITE_OK",
  UNFAVORITE_NOK: "UNFAVORITE_NOK",
  CLICKED_SIGN_UP: "CLICKED_SIGN_UP",
  FAILED_SIGN_UP: "FAILED_SIGN_UP",
  SUCCEEDED_SIGN_UP: "SUCCEEDED_SIGN_UP",
  CLICKED_SIGN_IN: "CLICKED_SIGN_IN",
  FAILED_SIGN_IN: "FAILED_SIGN_IN",
  SUCCEEDED_SIGN_IN: "SUCCEEDED_SIGN_IN",
  CLICKED_PUBLISH: "CLICKED_PUBLISH",
  ADDED_TAG: "ADDED_TAG",
  REMOVED_TAG: "REMOVED_TAG",
  EDITED_TAG: "EDITED_TAG",
  FAILED_PUBLISHING: "FAILED_PUBLISHING",
  SUCCEEDED_PUBLISHING: "SUCCEEDED_PUBLISHING",
  FAILED_FETCH_ARTICLE: "FAILED_FETCH_ARTICLE",
  FETCHED_ARTICLE: "FETCHED_ARTICLE",
  CLICKED_LOG_OUT: "CLICKED_LOG_OUT",
  CLICKED_UPDATE_SETTINGS: "CLICKED_UPDATE_SETTINGS",
  UPDATED_SETTINGS: "UPDATED_SETTINGS",
  FAILED_UPDATE_SETTINGS: "FAILED_UPDATE_SETTINGS",
  TOGGLED_FOLLOW: "TOGGLED_FOLLOW",
  FETCHED_PROFILE: "FETCHED_PROFILE",
  FETCH_PROFILE_NOK: "FETCH_PROFILE_NOK",
  TOGGLE_FOLLOW_OK: "TOGGLE_FOLLOW_OK",
  TOGGLE_FOLLOW_NOK: "TOGGLE_FOLLOW_NOK",
  CLICKED_DELETE_ARTICLE: "CLICKED_DELETE_ARTICLE",
  CLICKED_CREATE_COMMENT: "CLICKED_CREATE_COMMENT",
  CLICKED_DELETE_COMMENT: "CLICKED_DELETE_COMMENT",
  UPDATED_COMMENT: "UPDATED_COMMENT",
  FETCH_COMMENTS_OK: "FETCH_COMMENTS_OK",
  DELETE_COMMENTS_OK: "DELETE_COMMENTS_OK",
  POST_COMMENTS_OK: "POST_COMMENTS_OK",
  DELETE_ARTICLE_OK : "DELETE_ARTICLE_OK",
  API_REQUEST_FAILED: "API_REQUEST_FAILED"
};

export const renderCommands = {
  RENDER_HOME: "RENDER_HOME",
  RENDER_SIGN_UP: "RENDER_SIGN_UP",
  RENDER_SIGN_IN: "RENDER_SIGN_IN",
  RENDER_EDITOR: "RENDER_EDITOR",
  RENDER_SETTINGS: "RENDER_SETTINGS",
  RENDER_PROFILE: "RENDER_PROFILE",
  RENDER_ARTICLE: "RENDER_ARTICLE"
};
export const commands = {
  ...renderCommands,
  FETCH_GLOBAL_FEED: "FETCH_GLOBAL_FEED",
  FETCH_ARTICLES_GLOBAL_FEED: "FETCH_ARTICLES_GLOBAL_FEED",
  FETCH_ARTICLES_USER_FEED: "FETCH_ARTICLES_USER_FEED",
  FETCH_AUTHENTICATION: "FETCH_AUTHENTICATION",
  FETCH_USER_FEED: "FETCH_USER_FEED",
  FETCH_FILTERED_FEED: "FETCH_FILTERED_FEED",
  FAVORITE_ARTICLE: "FAVORITE_ARTICLE",
  UNFAVORITE_ARTICLE: "UNFAVORITE_ARTICLE",
  REDIRECT: "REDIRECT",
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
  PUBLISH_ARTICLE: "PUBLISH_ARTICLE",
  FETCH_ARTICLE: "FETCH_ARTICLE",
  UPDATE_ARTICLE: "UPDATE_ARTICLE",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  LOG_OUT: "LOG_OUT",
  // FOLLOW_USER: "FOLLOW_USER",
  // UNFOLLOW_USER: "UNFOLLOW_USER",
  FETCH_PROFILE: "FETCH_PROFILE",
  FETCH_AUTHOR_FEED: "FETCH_AUTHOR_FEED",
  FOLLOW_PROFILE: "FOLLOW_PROFILE",
  UNFOLLOW_PROFILE: "UNFOLLOW_PROFILE",
  FETCH_COMMENTS: "FETCH_COMMENTS",
  DELETE_COMMENT: "DELETE_COMMENT",
  POST_COMMENT:"POST_COMMENT",
  DELETE_ARTICLE: "DELETE_ARTICLE",
};

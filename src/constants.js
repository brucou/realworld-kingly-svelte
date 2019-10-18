function makeEnum(enums) {
  return enums.reduce((acc, _enum) => Object.assign(acc, { [_enum]: _enum }), {});
}

// TODO: DRY this with src/links.js!! so move that to links.js then change view to add the #
export const routes = {
  // Home route will be empty strings. Cf. apiRouter
  home: "/",
  signUp: "/register",
  allRoutes: "all routes",
  signIn: "/login",
  editor: "/editor",
  settings: "/settings"
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

export function allRoutesUpdate(updates) {
  return [[routes.allRoutes, updates]];
}

export const loadingStates = ["TAGS_ARE_LOADING", "ARTICLES_ARE_LOADING"];

export const viewModel = {
  fetchStatus: ["LOADING", "NOK", "OK"],
  tabs: ["USER_FEED", "GLOBAL_FEED", "TAG_FILTER_FEED"]
};
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
  CLICKED_LOG_OUT:"CLICKED_LOG_OUT",
  CLICKED_UPDATE_SETTINGS: "CLICKED_UPDATE_SETTINGS",
  REMOVED_USER_SESSION: "REMOVED_USER_SESSION",
  UPDATED_SETTINGS: "UPDATED_SETTINGS",
  FAILED_UPDATE_SETTINGS: "UPDATED_SETTINGS"
};

export const commands = {
  RENDER_HOME: "RENDER_HOME",
  RENDER_SIGN_UP: "RENDER_SIGN_UP",
  RENDER_SIGN_IN: "RENDER_SIGN_IN",
  RENDER_EDITOR: "RENDER_EDITOR",
  RENDER_SETTINGS: "RENDER_SETTINGS",
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
};

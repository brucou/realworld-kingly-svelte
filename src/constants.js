export const routes = {
  // Home route will be empty strings. Cf. apiRouter
  home: "",
  signUp: "TODO"
};

export const loadingStates = ["TAGS_ARE_LOADING", "ARTICLES_ARE_LOADING"];

export const viewModel = {
  fetchStatus: ["LOADING", "NOK", "OK"],
  tabs: ["USER_FEED", "GLOBAL_FEED", "TAG_FILTER_FEED"]
};
export const events = [
  "ROUTE_CHANGED",
  "TAGS_FETCHED_OK",
  "TAGS_FETCHED_NOK",
  "ARTICLES_FETCHED_OK",
  "ARTICLES_FETCHED_NOK",
  "AUTH_CHECKED",
  "CLICKED_TAG",
  "CLICKED_PAGE",
  "CLICKED_USER_FEED",
  "CLICKED_GLOBAL_FEED",
  "TOGGLED_FAVORITE",
  "FAVORITE_OK",
  "FAVORITE_NOK",
  "UNFAVORITE_OK",
  "UNFAVORITE_NOK",
];

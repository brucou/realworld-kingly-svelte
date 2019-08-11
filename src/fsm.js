export const events = [
  "ROUTE_CHANGED",
  "TAGS_FETCHED_OK",
  "TAGS_FETCHED_NOK",
  "ARTICLES_FETCHED_OK",
  "ARTICLES_FETCHED_NOK"
];

export const commands = [
  "RENDER",
  "FETCH_GLOBAL_FEED",
];

export const fsmFactory = (settings) => () => {return -1}

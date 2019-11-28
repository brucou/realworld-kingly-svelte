import { allRoutesUpdate, routes, routeViewLens, commands } from "../constants";
import { NO_OUTPUT } from "kingly";

const { home, signUp, allRoutes } = routes;
const {
  FETCH_AUTHENTICATION,
  REDIRECT
} = commands;

export const allRoutesViewLens = routeViewLens(allRoutes);

export const initialAllRoutesState = {
  user: null
};

// Guards

export function isAuthenticated(extendedState, eventData, settings) {
  const user = eventData;

  return user != null;
}

export function isNotAuthenticated(extendedState, eventData, settings) {
  const user = eventData;

  return user == null;
}

// Action factories

export function updateURL(extendedState, eventData, settings) {
  const { hash } = eventData;

  return {
    updates: allRoutesUpdate([{ url: hash }]),
    outputs: []
  };
}

export function redirectToSignUp(extendedState, eventData, settings) {
  return {
    updates: allRoutesUpdate([{ url: signUp }]),
    outputs: [{ command: REDIRECT, params: signUp }]
  };
}

export function redirectToHome(extendedState, eventData, settings) {
  return {
    updates: allRoutesUpdate([{ url: home }]),
    outputs: [{ command: REDIRECT, params: home }]
  };
}

export function fetchAuthentication(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{ command: FETCH_AUTHENTICATION, params: void 0 }]
  };
}

export function updateAuth(extendedState, eventData, settings) {
  const user = eventData;

  return {
    updates: allRoutesUpdate([{ user }]),
    outputs: NO_OUTPUT
  };
}

// NOTE: extended state here comes already focused on (e.g. with a lens previously applied)
export function getFavoritedFromSlug(extendedState, eventData, settings) {
  const { slug } = eventData;
  const { articles: {articles} } = extendedState;
  return articles.find(article => article.slug === slug).favorited
}

export function alwaysTrue(){
  return true
}

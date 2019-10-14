import { allRoutesUpdate, routes, routeViewLens, commands } from "../constants";
import { NO_OUTPUT } from "kingly";

const { home, signUp, allRoutes } = routes;
const {
  RENDER_HOME,
  RENDER_SIGN_UP,
  RENDER_SIGN_IN,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
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

export function updateUrlAndRedirectToHome(extendedState, eventData, settings) {
  return {
    updates: allRoutesUpdate([{ url: home }]),
    outputs: []
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

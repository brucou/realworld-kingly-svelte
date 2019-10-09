import { fetchAuthentication, isAuthenticated, isNotAuthenticated, redirectToHome } from "./common"
import { ACTION_IDENTITY, DEEP, historyState, INIT_EVENT } from "kingly"
import { allRoutesUpdate, commands, events, routes, routeViewLens } from "../constants"

const { home, signUp, allRoutes } = routes;
export const signUpRouteViewLens = routeViewLens(signUp);

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
  CLICKED_SIGNUP,
  FAILED_SIGN_UP,
  SUCCEEDED_SIGN_UP,
] = events;
const [
  RENDER_HOME,
  RENDER_SIGN_UP,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  REDIRECT,
  SIGN_UP
] = commands;

export const signUpStates = {
  "fetching-authentication-form-entry": "",
  "form-entry-sign-up": "",
  "fetching-authentication-sign-up": "",
  "signing-up": ""
};

export const initialSignUpRouteState = { email: "", password: "", username: "", errors: null };

export function signUpUpdates(updates) {
  return [[routes.signUp, updates]]
}

// TODO: try to see if I can use event data instead of state for the user and if yes remove it from extended state
// the user state source of truth is not in the machine, so don't duplicate!! this risks desynchronization

// Transitions

export const signUpTransitions = [
  {
    from: "signUp",
    event: INIT_EVENT,
    to: "fetching-authentication-form-entry",
    action: resetSignUpRouteStateAndFetchAuth
  },
  {
    from: "fetching-authentication-form-entry",
    event: AUTH_CHECKED,
    guards: [
      { predicate: isNotAuthenticated, to: "form-entry-sign-up", action: renderSignUpForm },
      { predicate: isAuthenticated, to: "routing", action: redirectToHome }
    ]
  },
  {
    from: "form-entry-sign-up",
    event: CLICKED_SIGNUP,
    to: "fetching-authentication-sign-up",
    action: fetchAuthenticationAndRenderInProgress
  },
  {
    from: "fetching-authentication-sign-up",
    event: AUTH_CHECKED,
    guards: [
      { predicate: isNotAuthenticated, to: "signing-up", action: signUserUp },
      { predicate: isAuthenticated, to: "routing", action: redirectToHome }
    ]
  },
  {
    from: "signing-up",
    event: FAILED_SIGN_UP,
    to: "fetching-authentication-form-entry",
    action: renderFormWithErrorsAndFetchAuth
  },
  {
    from: "signing-up",
    event: SUCCEEDED_SIGN_UP,
    to: "routing",
    action: redirectToHome
  },
];

// Guards

// Action factories
export function resetSignUpRouteStateAndFetchAuth(extendedState, eventData, settings) {
  return {
    updates: signUpUpdates([initialSignUpRouteState]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  }
}

export function renderSignUpForm(extendedState, eventData, settings) {
  const { errors } = signUpRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [{
      command: RENDER_SIGN_UP,
      params: { route: signUp, inProgress: false, errors }
    }]
  }
}

export function renderFormWithErrorsAndFetchAuth(extendedState, eventData, settings) {
  const errors = eventData;

  return {
    updates: signUpUpdates([{ errors }]),
    outputs: [
      { command: RENDER_SIGN_UP, params: { route: signUp, inProgress: false, errors } },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  }
}

export function fetchAuthenticationAndRenderInProgress(extendedState, eventData, settings) {
  const { email, password, username } = eventData;

  return {
    updates: signUpUpdates([{ email, password, username }]),
    outputs: [
      { command: RENDER_SIGN_UP, params: { route: signUp, inProgress: true, errors: null } },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  }
}

export function signUserUp(extendedState, eventData, settings) {
  const { email, password, username } = signUpRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [{
      command: SIGN_UP,
      params: { email, password, username }
    }]
  }
}

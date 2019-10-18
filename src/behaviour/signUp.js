import {
  fetchAuthentication,
  isAuthenticated,
  isNotAuthenticated,
  redirectToHome,
  updateURL
} from "./common";
import { ACTION_IDENTITY, DEEP, historyState, INIT_EVENT } from "kingly";
import { commands, events, routes, routeViewLens, signUpUpdates } from "../constants";

const { signUp } = routes;
export const signUpRouteViewLens = routeViewLens(signUp);

const { ROUTE_CHANGED, AUTH_CHECKED, CLICKED_SIGN_UP, FAILED_SIGN_UP, SUCCEEDED_SIGN_UP } = events;
const { RENDER_SIGN_UP, SIGN_UP } = commands;

export const signUpStates = {
  "fetching-authentication-form-entry": "",
  "form-entry-sign-up": "",
  "fetching-authentication-sign-up": "",
  "signing-up": ""
};

export const initialSignUpRouteState = { email: "", password: "", username: "", errors: null };

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
  { from: "signUp", event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "fetching-authentication-form-entry",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isNotAuthenticated,
        to: "form-entry-sign-up",
        action: renderSignUpForm
      },
      { predicate: isAuthenticated, to: "routing", action: redirectToHome }
    ]
  },
  {
    from: "form-entry-sign-up",
    event: CLICKED_SIGN_UP,
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
  }
];

// Guards

// Action factories
export function resetSignUpRouteStateAndFetchAuth(extendedState, eventData, settings) {
  return {
    updates: signUpUpdates([initialSignUpRouteState]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

export function renderSignUpForm(extendedState, eventData, settings) {
  const { errors } = signUpRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      {
        command: RENDER_SIGN_UP,
        params: { route: signUp, user: null, inProgress: false, errors }
      }
    ]
  };
}

export function renderFormWithErrorsAndFetchAuth(extendedState, eventData, settings) {
  const errors = eventData;

  return {
    updates: signUpUpdates([{ errors }]),
    outputs: [
      {
        command: RENDER_SIGN_UP,
        params: { route: signUp, inProgress: false, errors }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

export function fetchAuthenticationAndRenderInProgress(extendedState, eventData, settings) {
  const { email, password, username } = eventData;

  return {
    updates: signUpUpdates([{ email, password, username }]),
    outputs: [
      {
        command: RENDER_SIGN_UP,
        params: { route: signUp, inProgress: true, errors: null }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

export function signUserUp(extendedState, eventData, settings) {
  const { email, password, username } = signUpRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      {
        command: SIGN_UP,
        params: { email, password, username }
      }
    ]
  };
}

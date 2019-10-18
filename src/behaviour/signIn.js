import { INIT_EVENT } from "kingly";
import {
  fetchAuthentication,
  isAuthenticated,
  isNotAuthenticated,
  redirectToHome,
  updateURL
} from "./common";
import { commands, events, routes, routeViewLens, signInUpdates } from "../constants";

const { signIn } = routes;
export const signInRouteViewLens = routeViewLens(signIn);

const { ROUTE_CHANGED, AUTH_CHECKED, CLICKED_SIGN_IN, FAILED_SIGN_IN, SUCCEEDED_SIGN_IN } = events;
const { RENDER_SIGN_IN, SIGN_IN } = commands;

export const signInStates = {
  "fetching-authentication-sign-in-form-entry": "",
  "form-entry-sign-in": "",
  "fetching-authentication-sign-in": "",
  "signing-in": ""
};

export const initialSignInRouteState = {
  email: "",
  password: "",
  errors: null
};

// Transitions

export const signInTransitions = [
  {
    from: "signIn",
    event: INIT_EVENT,
    to: "fetching-authentication-sign-in-form-entry",
    action: resetSignInRouteStateAndFetchAuth
  },
  { from: "signIn", event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "fetching-authentication-sign-in-form-entry",
    event: AUTH_CHECKED,
    guards: [
      {
        predicate: isNotAuthenticated,
        to: "form-entry-sign-in",
        action: renderSignInForm
      },
      { predicate: isAuthenticated, to: "routing", action: redirectToHome }
    ]
  },
  {
    from: "form-entry-sign-in",
    event: CLICKED_SIGN_IN,
    to: "fetching-authentication-sign-in",
    action: fetchAuthenticationAndRenderInProgress
  },
  {
    from: "fetching-authentication-sign-in",
    event: AUTH_CHECKED,
    guards: [
      { predicate: isNotAuthenticated, to: "signing-in", action: signUserIn },
      { predicate: isAuthenticated, to: "routing", action: redirectToHome }
    ]
  },
  {
    from: "signing-in",
    event: FAILED_SIGN_IN,
    to: "fetching-authentication-sign-in-form-entry",
    action: renderFormWithErrorsAndFetchAuth
  },
  {
    from: "signing-in",
    event: SUCCEEDED_SIGN_IN,
    to: "routing",
    action: redirectToHome
  }
];

// Guards

// Action factories
export function resetSignInRouteStateAndFetchAuth(extendedState, eventData, settings) {
  return {
    updates: signInUpdates([initialSignInRouteState]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

export function renderSignInForm(extendedState, eventData, settings) {
  const { errors } = signInRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      {
        command: RENDER_SIGN_IN,
        params: { route: signIn, user: null, inProgress: false, errors }
      }
    ]
  };
}

export function renderFormWithErrorsAndFetchAuth(extendedState, eventData, settings) {
  const errors = eventData;

  return {
    updates: signInUpdates([{ errors }]),
    outputs: [
      {
        command: RENDER_SIGN_IN,
        params: { route: signIn, inProgress: false, errors }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

export function fetchAuthenticationAndRenderInProgress(extendedState, eventData, settings) {
  const { email, password } = eventData;

  return {
    updates: signInUpdates([{ email, password }]),
    outputs: [
      {
        command: RENDER_SIGN_IN,
        params: { route: signIn, inProgress: true, errors: null }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

export function signUserIn(extendedState, eventData, settings) {
  const { email, password } = signInRouteViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      {
        command: SIGN_IN,
        params: { email, password }
      }
    ]
  };
}

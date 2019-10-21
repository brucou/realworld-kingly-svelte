import { INIT_EVENT } from "kingly";
import { allRoutesViewLens, fetchAuthentication, isAuthenticated, redirectToHome, updateURL } from "./common";
import { allRoutesUpdate, commands, events, routes, routeViewLens, settingsUpdates } from "../constants";
import { getAuthenticatedFormPageTransitions } from "./abstracted";

const { home, settings } = routes;
export const settingsViewLens = routeViewLens(settings);

const {
  REDIRECT,
  UPDATE_SETTINGS,
  LOG_OUT,
  RENDER_SETTINGS,
} = commands;
const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  CLICKED_UPDATE_SETTINGS,
  UPDATED_SETTINGS,
  FAILED_UPDATE_SETTINGS,
  CLICKED_LOG_OUT
} = events;

export const settingsStates = {
  "fetching-authentication-settings-pre-form": "",
  "editing-settings": "",
  "fetching-authentication-settings-pre-submit": "",
  "updating-settings": ""
};

export const initialSettingsRouteState = {
  image: "",
  bio: "",
  password: "",
  email: "",
  username: "",
  errors: null
};

// Guards

// Transitions

export const settingsTransitions = [
  {
    from: "settings",
    event: INIT_EVENT,
    to: "fetching-authentication-settings-pre-form",
    action: resetSettingsRouteStateAndFetchAuth
  },
  { from: "settings", event: ROUTE_CHANGED, to: "routing", action: updateURL },
  { from: "editing-settings", event: CLICKED_LOG_OUT, to: "routing", action: logOutAndRedirectHome },
  getAuthenticatedFormPageTransitions({
    events: {
      AUTH_CHECKED,
      SUBMIT_TRIGGERED: CLICKED_UPDATE_SETTINGS,
      FAILED_SUBMISSION: FAILED_UPDATE_SETTINGS,
      SUCCEEDED_SUBMISSION: UPDATED_SETTINGS
    },
    states: {
      fetchingAuthenticationPreForm: "fetching-authentication-settings-pre-form",
      fetchingAuthenticationPreSubmit: "fetching-authentication-settings-pre-submit",
      enteringData: "editing-settings",
      fallback: "routing",
      submitting: "updating-settings",
      done: "routing"
    },
    isAuthenticatedGuard: isAuthenticated,
    actionFactories: {
      showInitializedForm: renderSettingsForm,
      showSubmittingForm: fetchAuthenticationAndRenderInProgressAndUpdateFormData,
      submit: updateSettings,
      fallback: redirectToHome,
      retry: renderSettingsFormWithErrorsAndFetchAuth,
      finalize: updateUrlAndRedirectToProfilePage
    }
  })
].flat();

// Guards

// Action factories
function logOutAndRedirectHome(extendedState, eventData, settings) {
  return {
    updates: allRoutesUpdate([{ url: home }]),
    outputs: [
      {command: LOG_OUT, params: void 0},
      {command: REDIRECT, params: home}
    ]
  };
}

function resetSettingsRouteStateAndFetchAuth(extendedState, eventData, settings) {
  return {
    updates: settingsUpdates([initialSettingsRouteState]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

function renderSettingsForm(extendedState, eventData, fsmSettings) {
  const user = eventData;

  return {
    updates: [],
    outputs: [
      {
        command: RENDER_SETTINGS,
        params: {
          // NOTE: if user does not change, then fields are uncontrolled
          // if the user changes, fields will be updated on the screen
          // which is the correct behaviour
          user,
          route: settings,
          inProgress: false,
          errors: null,
        }
      }
    ]
  };
}

function fetchAuthenticationAndRenderInProgressAndUpdateFormData(
  extendedState,
  eventData,
  settings
) {
  const { image, username, bio, email, password } = eventData;

  return {
    updates: settingsUpdates([{ image, username, bio, email, password }]),
    outputs: [
      {
        command: RENDER_SETTINGS,
        params: {
          inProgress: true,
          errors: null,
        }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

function updateSettings(extendedState, eventData, settings) {
  const { image, username, bio, email, password } = settingsViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      { command: UPDATE_SETTINGS, params: { image, username, bio, email, password } }
    ]
  };
}

function renderSettingsFormWithErrorsAndFetchAuth(extendedState, eventData, settings) {
  const errors = eventData;

  return {
    updates: settingsUpdates([{ errors }]),
    outputs: [
      { command: RENDER_SETTINGS, params: { inProgress: false, errors } },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

function updateUrlAndRedirectToProfilePage(extendedState, eventData, settings) {
  const user = eventData;
  const redirectTo = `/@${user.username}`;
  debugger

  return {
    updates: allRoutesUpdate([{ url: redirectTo }]),
    outputs: [{ command: REDIRECT, params: redirectTo }]
  };
}

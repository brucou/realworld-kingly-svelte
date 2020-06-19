import { ACTION_IDENTITY, createStateMachine } from "kingly";
import { events, routes } from "../constants";
import { allRoutesViewLens, initialAllRoutesState, updateURL } from "./common";
import { homeStates, homeTransitions, initialHomeRouteState } from "./home";
import { initialSignUpRouteState, signUpStates, signUpTransitions } from "./signUp";
import { signInStates, signInTransitions } from "./signIn";
import { editorStates, editorTransitions, initialEditorRouteState } from "./editor";
import { initialSettingsRouteState, settingsStates, settingsTransitions } from "./settings";
import { initialProfileRouteState, profileStates, profileTransitions } from "./profile";
import { articleStates, articleTransitions, initialArticleRouteState } from "./article"

/** @type Array<HOME_ROUTE_EVENTS> */
const { ROUTE_CHANGED } = events;

const { home, allRoutes, signUp, signIn, editor, settings, profile, article } = routes;

const INIT = "start";
const initialControlState = INIT;

const initialExtendedState = {
  [home]: initialHomeRouteState,
  [allRoutes]: initialAllRoutesState,
  [signUp]: initialSignUpRouteState,
  [editor]: initialEditorRouteState,
  [settings]: initialSettingsRouteState,
  [profile]: initialProfileRouteState,
  [article]: initialArticleRouteState,
};

const states = {
  [INIT]: "",
  routing: "",
  home: homeStates,
  signUp: signUpStates,
  signIn: signInStates,
  editor: editorStates,
  settings: settingsStates,
  profile: profileStates,
  article: articleStates,
};

// Guards
function isRoute(hash) {
  const regExpStr = `^${hash}(/.*|)$`;
  const regExp = new RegExp(regExpStr);
  return function(extendedState, eventData, settings) {
    // NOTE: regexp computation has to be inside the function
    // because regexps are mutable objects!! We need to create it new everytime.
    const { url } = allRoutesViewLens(extendedState);
    return Boolean(url.match(regExp));
  };
}

export const isHomeRoute = isRoute(home);
export const isSignUpRoute = isRoute(signUp);
export const isSignInRoute = isRoute(signIn);
export const isEditorRoute = isRoute(editor);
export const isSettingsRoute = isRoute(settings);
// NOTE: here we assume username can be any sequence of characters, but not an empty one
// That may be a bit weak, but we have no specifications for usernames so we keep it broad
export const isProfileRoute = isRoute("/@.+");
export const isArticleRoute = isRoute(`${article}/.+`);

/** @type {Array<Transition>} */
const transitions = [
  // TODO: replace by fetch auth and update URL
  { from: INIT, event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "routing",
    event: void 0,
    guards: [
      { predicate: isHomeRoute, to: "home", action: ACTION_IDENTITY },
      { predicate: isSignUpRoute, to: "signUp", action: ACTION_IDENTITY },
      { predicate: isSignInRoute, to: "signIn", action: ACTION_IDENTITY },
      { predicate: isEditorRoute, to: "editor", action: ACTION_IDENTITY },
      { predicate: isSettingsRoute, to: "settings", action: ACTION_IDENTITY },
      { predicate: isProfileRoute, to: "profile", action: ACTION_IDENTITY },
      { predicate: isArticleRoute, to: "article", action: ACTION_IDENTITY },
    ]
  },
  homeTransitions,
  signUpTransitions,
  signInTransitions,
  editorTransitions,
  settingsTransitions,
  profileTransitions,
  articleTransitions,
].flat();

/**
 * @typedef {Object} Update
 *
 * This function updates a state object, sliced per a property called `route`
 * The route update basically works like this: {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
 * All Object.assign caveats apply
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param {Object} extendedState
 * @param {Array.<[route, Array<Update>]>} extendedStateUpdates
 * @returns {Object}
 */
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);

  if (extendedStateUpdates.length === 0) return extendedStateCopy;

  return extendedStateUpdates.reduce((acc, extendedStateUpdate) => {
    const [route, updates] = extendedStateUpdate;
    if (route === void 0 || updates === void 0) {
      console.warn(
        `updateState: incorrect extended state update argument! [route, updates] with either route or updates undefined!`,
        extendedStateUpdate
      );
      return extendedState;
    }
    const routeState = Object.assign({}, acc[route]);
    acc[route] = updates.reduce((acc, update) => Object.assign(routeState, update), routeState);

    return acc;
  }, extendedStateCopy);
}

// Action factories

// Machine definition

const fsmEvents = Object.keys(events);
export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events: fsmEvents,
  transitions,
  updateState
};

export const fsmFactory = settings => createStateMachine(fsmDef, settings);

// TODO: refactor
// - remove duplication after checking everything works
//   renderFilteredArticles = renderFilteredArticlesFetchError = renderUserFeedArticles etc.
// - write helper functions : only updates, only render. Problem is we loose the function name in the trace...

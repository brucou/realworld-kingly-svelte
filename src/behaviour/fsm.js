import { ACTION_IDENTITY, createStateMachine } from "kingly";
import { events, routes } from "../constants";
import { allRoutesViewLens, initialAllRoutesState, updateURL } from "./common";
import { homeStates, homeTransitions, initialHomeRouteState } from "./home";
import { initialSignUpRouteState, signUpStates, signUpTransitions } from "./signUp";
import { cleanHash } from "../shared/helpers";
import { signInStates, signInTransitions } from "./signIn";
import { editorStates, editorTransitions, initialEditorRouteState } from "./editor";

/** @type Array<HOME_ROUTE_EVENTS> */
const { ROUTE_CHANGED } = events;

const { home, allRoutes, signUp, signIn, editor } = routes;

const INIT = "start";
const initialControlState = INIT;

const initialExtendedState = {
  [home]: initialHomeRouteState,
  [allRoutes]: initialAllRoutesState,
  [signUp]: initialSignUpRouteState,
  [editor]: initialEditorRouteState
};

const states = {
  [INIT]: "",
  routing: "",
  home: homeStates,
  signUp: signUpStates,
  signIn: signInStates,
  editor: editorStates
};

// Guards
function isRoute(hash) {
  const regExpStr = `^${hash}(/.*|)$`;
  return function(extendedState, eventData, settings) {
    const regExp = new RegExp(regExpStr, "g");
    const { url } = allRoutesViewLens(extendedState);
    return Boolean(regExp.exec(url));
  };
}

export const isHomeRoute = isRoute(home);
export const isSignUpRoute = isRoute(signUp);
export const isSignInRoute = isRoute(signIn);
export const isEditorRoute = isRoute(editor);

/** @type {Array<Transition>} */
const transitions = [
  { from: INIT, event: ROUTE_CHANGED, to: "routing", action: updateURL },
  {
    from: "routing",
    event: void 0,
    guards: [
      { predicate: isHomeRoute, to: "home", action: ACTION_IDENTITY },
      { predicate: isSignUpRoute, to: "signUp", action: ACTION_IDENTITY },
      { predicate: isSignInRoute, to: "signIn", action: ACTION_IDENTITY },
      { predicate: isEditorRoute, to: "editor", action: ACTION_IDENTITY }
    ]
  },
  homeTransitions,
  signUpTransitions,
  signInTransitions,
  editorTransitions
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

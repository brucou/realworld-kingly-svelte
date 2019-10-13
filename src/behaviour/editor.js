// TODO: implement modelization
// TODO: also update docs to add missing commands and events and explain a bit more

import { INIT_EVENT } from "kingly";
import {
  allRoutesViewLens,
  fetchAuthentication,
  isAuthenticated,
  isNotAuthenticated,
  redirectToHome,
  updateURL
} from "./common";
import { commands, events, routes, routeViewLens } from "../constants";
import { isEditorRoute } from "./fsm"
import { cleanHash } from "../shared/helpers"
import { getAuthenticatedFormPageTransitions } from "./abstracted"

const { editor } = routes;
export const editorViewLens = routeViewLens(editor);

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
  CLICKED_SIGN_IN,
  FAILED_SIGN_IN,
  SUCCEEDED_SIGN_IN,
  CLICKED_PUBLISH,
  ADDED_TAG,
  REMOVED_TAG,
  FAILED_PUBLISHING,
  SUCCEEDED_PUBLISHING,
  FAILED_FETCH_ARTICLE,
  FETCHED_ARTICLE,
] = events;
const [
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
  REDIRECT,
  SIGN_UP,
  SIGN_IN,
  PUBLISH_ARTICLE,
  FETCH_ARTICLE,
] = commands;

export const editorStates = {
  "fetching-article-editor": "",
  "fetching-authentication-editor-pre-form": "",
  "editing-new-article": "",
  "fetching-authentication-pre-publish": "",
  "publishing-article": ""
};

export const initialEditorRouteState = {
  title: "",
  description: "",
  body: "",
  tagList: null,
  errors: null
};

// Guards
const isEditorNewArticleRoute = isEditorRoute;
function isEditorEditArticleRoute(extendedState, eventData, settings){
  const { url } = allRoutesViewLens(extendedState);
  const splitUrl= url.split('/');

  return url.startsWith(cleanHash(editor)) && splitUrl.length===2 && splitUrl[1].length > 0
  // TODO editor/:slug, do it with a regexp
}

// Transitions

export const editorTransitions = [
  {
    from: "editor",
    event: INIT_EVENT,
    guards: [
      {
        predicate: isEditorNewArticleRoute,
        to: "fetching-authentication-editor-pre-form",
        action: resetEditorRouteStateAndFetchAuth
      },
      {
        predicate: isEditorEditArticleRoute,
        to: "fetching-article-editor",
        action: fetchArticle
      },
    ],
  },
  { from: "fetching-article-editor", event: FETCHED_ARTICLE, to: "fetching-authentication-editor-pre-form", action: resetEditorRouteStateAndFetchAuth },
  { from: "editing-new-article", event: ADDED_TAG, guards: [{predicate: isNewTag, to: "editing-new-article", action: addTagAndRender}] },
  { from: "editing-new-article", event: REMOVED_TAG, to: "editing-new-article", action: removeTagAndRenderTagList },
  getAuthenticatedFormPageTransitions({
    events: {
      AUTH_CHECKED,
      SUBMIT_TRIGGERED: CLICKED_PUBLISH,
      FAILED_SUBMISSION: FAILED_PUBLISHING,
      SUCCEEDED_SUBMISSION: SUCCEEDED_PUBLISHING
    },
    states: {
      fetchingAuthenticationPreForm: "fetching-authentication-editor-pre-form",
      fetchingAuthenticationPreSubmit: "fetching-authentication-editor-pre-publish",
      enteringData: "editing-new-article",
      fallback: "routing",
      submitting: "publishing-article",
      done: "routing"
    },
    isAuthenticatedGuard: isAuthenticated,
    actionFactories: {
      showInitializedForm: renderEditorForm,
      showSubmittingForm: fetchAuthenticationAndRenderInProgressAndUpdateFormData,
      submit: publishArticle,
      fallback: redirectToHome,
      retry: renderEditorFormWithErrorsAndFetchAuth,
      finalize: updateUrlAndRedirectToArticle
    },
  }),
];

// Guards
// isNewTag

// Action factories
// fetchArticle
// resetEditorRouteStateAndFetchAuth
// addTagAndRender
// removeTagAndRenderTagList
// renderEditorForm
// fetchAuthenticationAndRenderInProgressAndUpdateFormData
// publishArticle
// renderEditorFormWithErrorsAndFetchAuth
// updateUrlAndRedirectToArticle

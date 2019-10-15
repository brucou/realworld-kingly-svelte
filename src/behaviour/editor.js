// TODO: also update docs to add missing commands and events and explain a bit more

import { INIT_EVENT } from "kingly";
import {
  allRoutesViewLens,
  fetchAuthentication,
  isAuthenticated,
  redirectToHome,
} from "./common";
import {
  allRoutesUpdate,
  commands,
  editorUpdates,
  events,
  routes,
  routeViewLens,
} from "../constants";
import { getSlugFromHash, isNot } from "../shared/helpers";
import { getAuthenticatedFormPageTransitions } from "./abstracted";

const { editor } = routes;
export const editorViewLens = routeViewLens(editor);

const {
  AUTH_CHECKED,
  CLICKED_PUBLISH,
  ADDED_TAG,
  REMOVED_TAG,
  FAILED_PUBLISHING,
  SUCCEEDED_PUBLISHING,
  FAILED_FETCH_ARTICLE,
  FETCHED_ARTICLE
} = events;
const {
  REDIRECT,
  PUBLISH_ARTICLE,
  FETCH_ARTICLE,
  RENDER_EDITOR,
  UPDATE_ARTICLE
} = commands;

export const editorStates = {
  "fetching-article-editor": "",
  "fetching-authentication-editor-pre-form": "",
  "editing-new-article": "",
  "fetching-authentication-editor-pre-publish": "",
  "publishing-article": ""
};

export const initialEditorRouteState = {
  title: "",
  description: "",
  body: "",
  tagList: [],
  currentTag: "",
  errors: null
};

// Guards
function isEditorEditArticleRoute(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);
  const splitUrl = url.split("/");

  return url.startsWith(editor) && splitUrl.length === 3 && splitUrl[1].length > 0;
  // TODO editor/:slug, do it with a regexp
}

// Transitions

export const editorTransitions = [
  {
    from: "editor",
    event: INIT_EVENT,
    guards: [
      {
        predicate: isEditorEditArticleRoute,
        to: "fetching-article-editor",
        action: fetchArticle
      },
      {
        predicate: isNot(isEditorEditArticleRoute),
        to: "fetching-authentication-editor-pre-form",
        action: resetEditorRouteStateAndFetchAuth
      }
    ]
  },
  {
    from: "fetching-article-editor",
    event: FETCHED_ARTICLE,
    to: "fetching-authentication-editor-pre-form",
    action: updateEditorRouteStateAndFetchAuth
  },
  {
    from: "fetching-article-editor",
    event: FAILED_FETCH_ARTICLE,
    to: "routing",
    action: redirectToHome
  },
  {
    from: "editing-new-article",
    event: ADDED_TAG,
    guards: [{ predicate: isNewTag, to: "editing-new-article", action: addTagAndRender }]
  },
  {
    from: "editing-new-article",
    event: REMOVED_TAG,
    to: "editing-new-article",
    action: removeTagAndRenderTagList
  },
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
    }
  })
].flat();

// Guards
function isNewTag(extendedState, eventData, settings) {
  const tag = eventData;
  const { tagList } = editorViewLens(extendedState);

  return tagList.indexOf(tag) === -1;
}

// Action factories
function resetEditorRouteStateAndFetchAuth(extendedState, eventData, settings) {
  return {
    updates: editorUpdates([initialEditorRouteState]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

function updateEditorRouteStateAndFetchAuth(extendedState, eventData, settings) {
  const {title, description, body, tagList} = eventData;

  return {
    updates: editorUpdates([{title, description, body, tagList}]),
    outputs: fetchAuthentication(extendedState, eventData, settings).outputs
  };
}

function fetchArticle(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);

  return {
    updates: [],
    outputs: [{
      command: FETCH_ARTICLE,
      params: getSlugFromHash(url)
    }]
  };
}

function addTagAndRender(extendedState, eventData, settings) {
  const tag = eventData;
  const { tagList } = editorViewLens(extendedState);
  const newTagList = tagList.concat(tag);

  // The form field `currentTag` is controlled, the other fields are not
  // We do not pass uncontrolled fields data in the render command
  // so as not to trigger rerendering of those fields with desynchronized values
  // VDom-based UI libraries will see the same *props* for those fields,
  // and thus skip rendering. Surgical-DOM UI libraries will not merge new props
  // with past props and thus only act on the props passed in the render
  // In both cases, we are good, the behaviour is independent from the UI library
  return {
    updates: editorUpdates([{ tagList: newTagList }]),
    outputs: [
      {
      command: RENDER_EDITOR,
      params: {
        tagList: newTagList,
        currentTag: ""
      }
    }
    ]
  };
}

function removeTagAndRenderTagList(extendedState, eventData, settings) {
  const { tag, index } = eventData;
  const { tagList } = editorViewLens(extendedState);
  const newTagList = tagList.slice(0, index).concat(tagList.slice(index + 1));

  return {
    updates: editorUpdates([{ tagList: newTagList }]),
    outputs: [{
      command: RENDER_EDITOR,
      params: {
        tagList: newTagList
      }
    }]
  };
}

function renderEditorForm(extendedState, eventData, settings) {
  const { tagList, title, body, currentTag, description, errors } = editorViewLens(extendedState);

  return {
    updates: [],
    outputs: [
      {
      command: RENDER_EDITOR,
      params: { tagList, title, body, currentTag, description, errors, inProgress: false, route:editor }
    }
    ]
  };
}

function fetchAuthenticationAndRenderInProgressAndUpdateFormData(
  extendedState,
  eventData,
  settings
) {
  const { title, description, body, tagList } = eventData;

  return {
    updates: editorUpdates([{ title, description, body, tagList }]),
    outputs: [
      {
        command: RENDER_EDITOR,
        params: {
          inProgress: true, errors: null,
          title, description, body, tagList
        }
      },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

function publishArticle(extendedState, eventData, settings) {
  const { url } = allRoutesViewLens(extendedState);
  const slug = getSlugFromHash(url);
  const { tagList, title, body, description } = editorViewLens(extendedState);

  const commandStruct = isEditorEditArticleRoute(extendedState)
    ? { command: UPDATE_ARTICLE, params: { title, description, body, tagList, slug } }
    : { command: PUBLISH_ARTICLE, params: { title, description, body, tagList } };

  return {
    updates: [],
    outputs: [commandStruct]
  };
}

function renderEditorFormWithErrorsAndFetchAuth(extendedState, eventData, settings) {
  const errors = eventData;

  return {
    updates: editorUpdates([{errors}]),
    outputs: [
      { command: RENDER_EDITOR, params: { inProgress: false, errors } },
      fetchAuthentication(extendedState, eventData, settings).outputs
    ].flat()
  };
}

function updateUrlAndRedirectToArticle(extendedState, eventData, settings) {
  const { slug } = eventData;
  const redirectTo = ["", "article", slug].join("/");

  return {
    updates: allRoutesUpdate([{ url: redirectTo }]),
    outputs: [{ command: REDIRECT, params: redirectTo }]
  };
}

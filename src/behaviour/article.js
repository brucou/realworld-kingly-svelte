import { ACTION_IDENTITY, INIT_EVENT, NO_OUTPUT } from "kingly";
import { articleUpdates, commands, events, loadingStates, routes, routeViewLens } from "../constants";
import { allRoutesViewLens, fetchAuthentication, redirectToHome, updateAuth, updateURL } from "./common";
import { not } from "../shared/hof";
import { getAuthedApiPartialMachine } from "./abstracted"

const { article, allRoutes } = routes;
const articleRouteViewLens = routeViewLens(article);

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  TOGGLED_FAVORITE,
  TOGGLE_FOLLOW_OK,
  TOGGLE_FOLLOW_NOK,
  FAVORITE_NOK,
  FAVORITE_OK,
  UNFAVORITE_NOK,
  UNFAVORITE_OK,
  TOGGLED_FOLLOW,
  FETCHED_ARTICLE,
  FAILED_FETCH_ARTICLE,
  UPDATED_COMMENT,
  FETCH_COMMENTS_OK,
  DELETE_COMMENTS_OK,
  POST_COMMENTS_OK,
  DELETE_ARTICLE_OK,
  API_REQUEST_FAILED,
  CLICKED_CREATE_COMMENT,
  CLICKED_DELETE_COMMENT,
  CLICKED_DELETE_ARTICLE
} = events;
const {
  RENDER_ARTICLE,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
  FETCH_COMMENTS,
  POST_COMMENT,
  DELETE_COMMENT,
  DELETE_ARTICLE,
  FETCH_ARTICLE,
} = commands;

// Machine definition for route

export const initialArticleRouteState = {
  slug: "",
  article: null,
  // true, false or null (pending or unknown)
  favoriteStatus: null,
  following: null,
  comments: null,
  commentText: null,
  eventData: null
};

export const articleStates = {
  "fetching-auth-for-article": "",
  "article-rendering": "",
  "fetching-auth-for-like": "",
  "fetching-auth-for-follow": "",
  "fetching-auth-for-delete-article": "",
  "fetching-auth-for-delete-comment": "",
  "fetching-auth-for-post-comment": "",
  "can-follow": "",
  "can-like": ""
};

// Transitions
export const articleTransitions = [
  {
    from: "article",
    event: INIT_EVENT,
    to: "fetching-auth-for-article",
    action: fetchAuthentication
  },
  {
    from: "fetching-auth-for-article",
    event: AUTH_CHECKED,
    to: "article-rendering",
    action: fetchArticleCommentsAndInitialRender
  },
  {
    from: "article-rendering",
    event: UPDATED_COMMENT,
    to: "article-rendering",
    action: renderUpdatedComment
  },
  {
    from: "article-rendering",
    event: FETCHED_ARTICLE,
    to: "article-rendering",
    action: renderFetchedArticle
  },
  {
    from: "article-rendering",
    event: FAILED_FETCH_ARTICLE,
    to: "article-rendering",
    action: renderFailedFetchArticle
  },
  {
    from: "article-rendering",
    event: FETCH_COMMENTS_OK,
    to: "article-rendering",
    action: renderFetchedComments
  },
  {
    from: "article-rendering",
    event: TOGGLE_FOLLOW_OK,
    to: "article-rendering",
    action: renderToggledFollow
  },
  {
    from: "article-rendering",
    event: TOGGLE_FOLLOW_NOK,
    to: "article-rendering",
    action: renderFailedToggledFollow
  },
  {
    from: "article-rendering",
    event: FAVORITE_OK,
    to: "article-rendering",
    action: renderFavoritedArticle
  },
  {
    from: "article-rendering",
    event: FAVORITE_NOK,
    to: "article-rendering",
    action: renderFailedFavoriteArticle
  },
  {
    from: "article-rendering",
    event: UNFAVORITE_OK,
    to: "article-rendering",
    action: renderUnfavoritedArticle
  },
  {
    from: "article-rendering",
    event: UNFAVORITE_NOK,
    to: "article-rendering",
    action: renderFailedUnfavoriteArticle
  },
  {
    from: "article-rendering",
    event: POST_COMMENTS_OK,
    to: "article-rendering",
    action: renderPostedComment
  },
  {
    from: "article-rendering",
    event: DELETE_COMMENTS_OK,
    to: "article-rendering",
    action: renderDeletedComment
  },
  {
    from: "article-rendering",
    event: API_REQUEST_FAILED,
    to: "article-rendering",
    action: renderFailedApiRequest
  },
  getAuthedApiPartialMachine({
    states: { fetching: "fetching-auth-for-like", next: "can-like" },
    events: { trigger: TOGGLED_FAVORITE },
    actions: { call: updateAuth }
  }),
  getAuthedApiPartialMachine({
    states: { fetching: "fetching-auth-for-follow", next: "can-follow" },
    events: { trigger: TOGGLED_FOLLOW },
    actions: { call: updateAuth }
  }),
  getAuthedApiPartialMachine({
    states: { fetching: "fetching-auth-for-post-comment", next: "article-rendering" },
    events: { trigger: CLICKED_CREATE_COMMENT },
    actions: { call: postCommentUpdateAuthAndRender }
  }),
  getAuthedApiPartialMachine({
    states: { fetching: "fetching-auth-for-delete-comment", next: "article-rendering" },
    events: { trigger: CLICKED_DELETE_COMMENT },
    actions: { call: deleteCommentUpdateAuthAndRender }
  }),
  getAuthedApiPartialMachine({
    states: { fetching: "fetching-auth-for-delete-article", next: "article-rendering" },
    events: { trigger: CLICKED_DELETE_ARTICLE },
    actions: { call: deleteArticleUpdateAuthAndRender }
  }),
  {
    from: "can-like", event: AUTH_CHECKED, guards: [
      { predicate: isArticleLiked, to: "article-rendering", action: unlikeArticleAndRender },
      { predicate: not(isArticleLiked), to: "article-rendering", action: likeArticleAndRender },
    ]
  },
  {
    from: "can-follow", event: AUTH_CHECKED, guards: [
      { predicate: isProfileFollowed, to: "article-rendering", action: unfollowProfileAndRender },
      { predicate: not(isProfileFollowed), to: "article-rendering", action: followProfileAndRender },
    ]
  },
  { from: "article-rendering", event: DELETE_ARTICLE_OK, to: "routing", action: redirectToHome },
  { from: "article", event: ROUTE_CHANGED, to: "routing", action: updateURL }
];

// Guards

export function isArticleLiked(extendedState, eventData, settings) {
  const { article } = articleRouteViewLens(extendedState);

  return article.favorited;
}

export function isProfileFollowed(extendedState, eventData, settings) {
  const { article } = articleRouteViewLens(extendedState);

  return article.author.following;
}

// Action factories
const articleCaptureRegexp = /^article\/(\w+)\/?$/;

export function fetchArticleCommentsAndInitialRender(extendedState, eventData, settings) {
  const user = eventData;
  const { url } = allRoutesViewLens(extendedState);
  // NOTE: by machine construction, the url will match, i.e. `url.match` is not null
  const slug = url.match(articleCaptureRegexp)[1];

  return {
    updates: [].concat(
      updateAuth(extendedState, eventData, settings).updates,
      articleUpdates([initialArticleRouteState, { slug }])
    ),
    outputs: [
      { command: FETCH_ARTICLE, params: slug },
      { command: FETCH_COMMENTS, params: slug },
      {
        command: RENDER_ARTICLE,
        params: {
          route: article,
          user: user,
          article: null,
          comments: null,
          commentText: "",
          following: null,
          favoriteStatus: null,
        }
      }
    ]
  };
}

export function renderUpdatedComment(extendedState, eventData, settings) {
  const commentText = eventData;

  return {
    updates: articleUpdates([{ commentText }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, commentText, }
      }
    ]
  };
}

export function renderFetchedArticle(extendedState, eventData, settings) {
  const article = eventData;

  return {
    updates: articleUpdates([{ article }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, article, }
      }
    ]
  };
}

export function renderFailedFetchArticle(extendedState, eventData, settings) {
  const _ = eventData;
  const articleError = "*Could not fetch article!!*"

  return {
    updates: articleUpdates([{ article: articleError }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, article: articleError }
      }
    ]
  };
}

export function renderFetchedComments(extendedState, eventData, settings) {
  const comments = eventData;

  return {
    updates: articleUpdates([{ comments }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, comments }
      }
    ]
  };
}

export function renderToggledFollow(extendedState, eventData, settings) {
  const profile = eventData;
  const { article } = articleRouteViewLens(extendedState);
  const updatedArticle = Object.assign({}, article, {
    author: {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
      following: profile.following
    }
  });

  // Note that this does not cause a rerender of the article, as we do not pass the updatedArticle
  // to the render command. We isolated and pass the only value that changes which is following
  // We nonetheless have to update the article, to keep trace of the old value, in order to revert
  // to it in case of failur of the following/unfollowing
  return {
    updates: articleUpdates([{ following: profile.following }, { article: updatedArticle }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, following: profile.following }
      }
    ]
  };
}

export function renderFailedToggledFollow(extendedState, eventData, settings) {
  const _ = eventData;
  // Revert to oldest following value
  const { article } = articleRouteViewLens(extendedState);
  const following = article.author.following;

  return {
    updates: articleUpdates([{ following }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, following }
      }
    ]
  };
}

export function renderFavoritedArticle(extendedState, eventData, settings) {
  const { article } = eventData;
  const favorited = article.favorited;

  // Update the local copy of the remote article so it remains local source of truth
  // Update derived favoriteStatus
  // Note that we do not render the new article, we only pass what has changed, and that is
  // the favorite status.
  return {
    updates: articleUpdates([{ favoriteStatus: favorited }], { article }),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, favoriteStatus: favorited }
      }
    ]
  };
}

export function renderFailedFavoriteArticle(extendedState, eventData, settings) {
  const _ = eventData;
  // Revert to oldest favorited value
  const { article } = articleRouteViewLens(extendedState);
  const favorited = article.favorited;

  return {
    updates: articleUpdates([{ favoriteStatus: favorited }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, favoriteStatus: favorited }
      }
    ]
  };
}

export function renderUnfavoritedArticle(extendedState, eventData, settings) {
  // Same behaviour, the value which varies is returned in eventData!
  return renderFavoritedArticle(extendedState, eventData, settings)
}

export function renderFailedUnfavoriteArticle(extendedState, eventData, settings) {
  // Same behaviour, the value to revert to is in extended state!
  return renderFailedFavoriteArticle(extendedState, eventData, settings)
}

export function renderPostedComment(extendedState, eventData, settings) {
  const comment = eventData;
  const { comments } = articleRouteViewLens(extendedState);
  const updatedComments = [].concat(comments, comment);

  return {
    updates: articleUpdates([{ comments: updatedComments, commentText: "" }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, comments: updatedComments, commentText: "" }
      }
    ]
  };
}

export function renderDeletedComment(extendedState, eventData, settings) {
  const deletedId = eventData;
  const { comments } = articleRouteViewLens(extendedState);
  const updatedComments = comments.filter(comment => comment.id !== deletedId);

  return {
    updates: articleUpdates([{ comments: updatedComments }]),
    outputs: [
      {
        command: RENDER_ARTICLE,
        params: { route: article, comments: updatedComments }
      }
    ]
  };
}

export function renderFailedApiRequest(extendedState, eventData, settings) {
  const _ = eventData;

  // Nothing to do, as nothing have been updated as a result of the failure
  // This is in contrast to follow or like where a pending indicator is reflected in the UI
  return {
    updates: [],
    outputs: []
  };
}

export function postCommentUpdateAuthAndRender(extendedState, eventData, settings) {
  const { slug, commentText } = articleRouteViewLens(extendedState);

  return {
    updates: [].concat(
      updateAuth(extendedState, eventData, settings).updates,
      articleUpdates([{ commentText }])
    ),
    outputs: [
      { command: POST_COMMENT, params: { slug, comment: body } },
      // Nothing to render actually
    ]
  };
}

export function deleteCommentUpdateAuthAndRender(extendedState, eventData, settings) {
  const { eventData: { slug, id } } = articleRouteViewLens(extendedState);

  return {
    updates: updateAuth(extendedState, eventData, settings).updates,
    outputs: [
      { command: DELETE_COMMENT, params: { slug, id } },
      // Nothing to render actually
    ]
  };
}

export function deleteArticleUpdateAuthAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { slug } = articleRouteViewLens(extendedState);

  return {
    updates: updateAuth(extendedState, eventData, settings).updates,
    outputs: [
      { command: DELETE_ARTICLE, params: slug },
      // Nothing to render actually. Well, I could render the possibly new user? mmm
    ]
  };
}

export function unlikeArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { slug } = articleRouteViewLens(extendedState);

  return {
    updates: [].concat(
      updateAuth(extendedState, eventData, settings).updates,
      articleUpdates([{ favoriteStatus: null }])
    ),
    outputs: [
      { command: UNFAVORITE_ARTICLE, params: { slug } },
      {
        command: RENDER_ARTICLE,
        params: {
          route: article, favoriteStatus: null, user
        }
      }
    ]
  };
}

export function likeArticleAndRender(extendedState, eventData, settings) {
  const user = eventData;
  const { slug } = articleRouteViewLens(extendedState);

  return {
    updates: [].concat(
      updateAuth(extendedState, eventData, settings).updates,
      articleUpdates([{ favoriteStatus: null }])
    ),
    outputs: [
      { command: FAVORITE_ARTICLE, params: { slug } },
      {
        command: RENDER_ARTICLE,
        params: {
          route: article, favoriteStatus: null, user
        }
      }
    ]
  };
}

function followOrUnfollow(command) {
  return function followOrUnfollow(extendedState, eventData, settings) {
    const user = eventData;
    const { article } = articleRouteViewLens(extendedState);

    return {
      updates: [].concat(
        updateAuth(extendedState, eventData, settings).updates,
        articleUpdates([{ profileStatus: null }])
      ),
      outputs: [
        { command: command, params: article.author.username },
        {
          command: RENDER_ARTICLE,
          params: {
            route: article, profileStatus: null, user
          }
        }
      ]
    };
  }
}

export function unfollowProfileAndRender(extendedState, eventData, settings) {
  return followOrUnfollow(UNFOLLOW_PROFILE)(extendedState, eventData, settings)
}

export function followProfileAndRender(extendedState, eventData, settings) {
  return followOrUnfollow(FOLLOW_PROFILE)(extendedState, eventData, settings)
}


// TODO: check user profile route and the rest of routes that it sets up the right original state on entry
// TODO: the common state part should be updated ANYTIME they change?
// TODO: ok for url (link click or redirect)? ok for user (at every auth checked?)?
// TODO: in TOGGLED_FOLLOW, pass the following value in article.author.following!!
// TODO: it could be that we don't need commentText is state of the machine, it is only statee of the screen!!
// check it and do it and DOC it, that can justify why the machine has separate state from the UI and we do not do a
// moore machine but a mealy transducer

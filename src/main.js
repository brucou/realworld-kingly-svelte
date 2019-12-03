import App from "./App.svelte";
import emitonoff from "emitonoff";
import { fsmContracts } from "kingly";
import sessionRepositoryFactory from "./sessionRepository";
import apiGatewayFactory from "./apiGateway";
import apiRouterFactory from "./apiRouter";
import eventEmitterFactory from "./eventEmitter";
import { fsmFactory } from "./behaviour/fsm";
import { events, commands, routes, USER_PROFILE_PAGE, FAVORITE_PROFILE_PAGE } from "./constants";

const { home, signUp, signIn, editor, settings, profile, article } = routes;

// Commands
const {
  RENDER_HOME,
  RENDER_SIGN_UP,
  RENDER_SIGN_IN,
  RENDER_SETTINGS,
  RENDER_EDITOR,
  RENDER_PROFILE,
  RENDER_ARTICLE,
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
  UPDATE_ARTICLE,
  UPDATE_SETTINGS,
  LOG_OUT,
  FETCH_PROFILE,
  FETCH_AUTHOR_FEED,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE
} = commands;
const {
  ROUTE_CHANGED,
  TAGS_FETCHED_OK,
  TAGS_FETCHED_NOK,
  ARTICLES_FETCHED_OK,
  ARTICLES_FETCHED_NOK,
  AUTH_CHECKED,
  FAVORITE_OK,
  FAVORITE_NOK,
  UNFAVORITE_OK,
  UNFAVORITE_NOK,
  FAILED_SIGN_UP,
  SUCCEEDED_SIGN_UP,
  FAILED_SIGN_IN,
  SUCCEEDED_SIGN_IN,
  FAILED_PUBLISHING,
  SUCCEEDED_PUBLISHING,
  FAILED_FETCH_ARTICLE,
  FETCHED_ARTICLE,
  UPDATED_SETTINGS,
  FAILED_UPDATE_SETTINGS,
  FETCHED_PROFILE,
  FETCH_PROFILE_NOK,
  TOGGLE_FOLLOW_OK,
  TOGGLE_FOLLOW_NOK,
  CLICKED_DELETE_ARTICLE,
  CLICKED_CREATE_COMMENT,
  CLICKED_DELETE_COMMENT,
  UPDATED_COMMENT
} = events;
const env = { debug: { console, checkContracts: fsmContracts } };

// Event emitter
const eventBus = eventEmitterFactory(emitonoff);
const next = eventBus.next.bind(eventBus);

// We set in place the API for storing authentication data
const sessionRepository = sessionRepositoryFactory(window.localStorage, window.addEventListener);

// We set in place the APIs for fetching domain objects
const {
  fetchGlobalFeed,
  fetchUserFeed,
  fetchTagFilteredFeed,
  fetchTags,
  fetchAuthentication,
  favoriteArticle,
  unfavoriteArticle,
  register,
  login,
  fetchArticle,
  saveArticle,
  updateArticle,
  updateSettings,
  fetchProfile,
  follow,
  unfollow,
  fetchAuthorFeed,
  fetchFavoritedFeed
} = apiGatewayFactory(fetch, sessionRepository);

// We set in place route handling
function hashChangeHandler({ newURL, oldURL, hash }) {
  next({ [ROUTE_CHANGED]: { newURL, oldURL, hash } });
}

const { subscribe: hashChangeSubscribe, getCurrentHash, redirect } = apiRouterFactory(
  window.location,
  window.addEventListener
);
hashChangeSubscribe(hashChangeHandler);

function render(route, props) {
  // This allows to toggle rendering when an actual render command has to be executed
  app.$set(Object.assign({}, props, { route, _shouldRender: true }));
}

// Command and effect handlers
const renderRoute = route => (dispatch, params, effectHandlers) => {
  const { render } = effectHandlers;
  render(route, params);
};
const commandHandlers = {
  [RENDER_HOME]: renderRoute(home),
  [RENDER_SIGN_UP]: renderRoute(signUp),
  [RENDER_SIGN_IN]: renderRoute(signIn),
  [RENDER_EDITOR]: renderRoute(editor),
  [RENDER_SETTINGS]: renderRoute(settings),
  [RENDER_PROFILE]: renderRoute(profile),
  [RENDER_ARTICLE]: renderRoute(article),
  [FETCH_GLOBAL_FEED]: (dispatch, params, effectHandlers) => {
    const { page } = params;
    const { fetchGlobalFeed, fetchTags } = effectHandlers;

    fetchGlobalFeed({ page })
      .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));

    fetchTags()
      .then(res => dispatch({ [TAGS_FETCHED_OK]: res }))
      .catch(err => dispatch({ [TAGS_FETCHED_NOK]: err }));
  },
  [FETCH_AUTHENTICATION]: (dispatch, params, effectHandlers) => {
    const { fetchAuthentication } = effectHandlers;
    dispatch({ [AUTH_CHECKED]: fetchAuthentication() });
  },
  [FETCH_ARTICLES_GLOBAL_FEED]: (dispatch, params, effectHandlers) => {
    const { page } = params;
    const { fetchGlobalFeed } = effectHandlers;

    fetchGlobalFeed({ page })
      .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));
  },
  [FETCH_USER_FEED]: (dispatch, params, effectHandlers) => {
    const { page } = params;
    const { fetchUserFeed, fetchTags } = effectHandlers;

    fetchUserFeed({ page })
      .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));

    fetchTags()
      .then(res => dispatch({ [TAGS_FETCHED_OK]: res }))
      .catch(err => dispatch({ [TAGS_FETCHED_NOK]: err }));
  },
  [FETCH_ARTICLES_USER_FEED]: (dispatch, params, effectHandlers) => {
    const { page } = params;
    const { fetchUserFeed } = effectHandlers;

    fetchUserFeed({ page })
      .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));
  },
  [FETCH_FILTERED_FEED]: (dispatch, params, effectHandlers) => {
    const { page, tag } = params;
    const { fetchTagFilteredFeed } = effectHandlers;

    fetchTagFilteredFeed({ page, tag })
      .then(res => dispatch({ [ARTICLES_FETCHED_OK]: res }))
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));
  },
  [FAVORITE_ARTICLE]: (dispatch, params, effectHandlers) => {
    const { slug } = params;
    const { favoriteArticle } = effectHandlers;

    favoriteArticle({ slug })
      .then(res => dispatch({ [FAVORITE_OK]: { article: res.article, slug } }))
      .catch(err => dispatch({ [FAVORITE_NOK]: { err, slug } }));
  },
  [UNFAVORITE_ARTICLE]: (dispatch, params, effectHandlers) => {
    const { slug } = params;
    const { unfavoriteArticle } = effectHandlers;

    unfavoriteArticle({ slug })
      .then(res => dispatch({ [UNFAVORITE_OK]: { article: res.article, slug } }))
      .catch(err => dispatch({ [UNFAVORITE_NOK]: { err, slug } }));
  },
  [REDIRECT]: (dispatch, params, effectHandlers) => {
    const hash = params;
    const { redirect } = effectHandlers;

    redirect(hash);
  },
  [SIGN_UP]: (dispatch, params, effectHandlers) => {
    const { email, username, password } = params;
    const { register, saveUser } = effectHandlers;

    register({ email, password, username })
      .then(res => {
        const { user } = res;
        saveUser(user);
        dispatch({ [SUCCEEDED_SIGN_UP]: user });
      })
      .catch(({ errors }) => {
        dispatch({ [FAILED_SIGN_UP]: errors });
      });
  },
  [SIGN_IN]: (dispatch, params, effectHandlers) => {
    const { email, password } = params;
    const { login, saveUser } = effectHandlers;

    login({ email, password })
      .then(({ user }) => {
        saveUser(user);
        dispatch({ [SUCCEEDED_SIGN_IN]: user });
      })
      .catch(({ errors }) => {
        dispatch({ [FAILED_SIGN_IN]: errors });
      });
  },
  [FETCH_ARTICLE]: (dispatch, params, effectHandlers) => {
    const slug = params;
    const { fetchArticle } = effectHandlers;

    fetchArticle({ slug })
      .then(({ article }) => {
        const { title, description, body, tagList } = article;
        dispatch({ [FETCHED_ARTICLE]: { title, description, body, tagList } });
      })
      .catch(err => {
        dispatch({ [FAILED_FETCH_ARTICLE]: err });
      });
  },
  [PUBLISH_ARTICLE]: (dispatch, params, effectHandlers) => {
    const { title, description, body, tagList } = params;
    const { saveArticle } = effectHandlers;

    saveArticle({ title, description, body, tagList })
      .then(data => {
        dispatch({ [SUCCEEDED_PUBLISHING]: data.article });
      })
      .catch(({ errors }) => {
        dispatch({ [FAILED_PUBLISHING]: errors });
      });
  },
  [UPDATE_ARTICLE]: (dispatch, params, effectHandlers) => {
    const { slug, title, description, body, tagList } = params;
    const { updateArticle } = effectHandlers;

    updateArticle({ slug, title, description, body, tagList })
      .then(({ article }) => {
        dispatch({ [SUCCEEDED_PUBLISHING]: article });
      })
      .catch(({ errors }) => {
        dispatch({ [FAILED_PUBLISHING]: errors });
      });
  },
  [UPDATE_SETTINGS]: (dispatch, params, effectHandlers) => {
    const { image, username, bio, email, password } = params;
    const { updateSettings } = effectHandlers;

    updateSettings({ user: { image, username, bio, email, password } })
      .then(({ user }) => {
        dispatch({ [UPDATED_SETTINGS]: user });
      })
      .catch(({ errors }) => {
        dispatch({ [FAILED_UPDATE_SETTINGS]: errors });
      });
  },
  [LOG_OUT]: (dispatch, params, effectHandlers) => {
    const { removeUserSession } = effectHandlers;
    removeUserSession();
  },
  [FETCH_PROFILE]: (dispatch, params, effectHandlers) => {
    const { fetchProfile } = effectHandlers;
    const username = params;

    fetchProfile({ username })
      .then(({ profile }) => dispatch({ [FETCHED_PROFILE]: profile }))
      .catch(err => dispatch({ [FETCH_PROFILE_NOK]: err }));
  },
  [FETCH_AUTHOR_FEED]: (dispatch, params, effectHandlers) => {
    const { fetchAuthorFeed, fetchFavoritedFeed } = effectHandlers;
    const { username, page, feedType } = params;
    const fetchFn = {
      [USER_PROFILE_PAGE]: fetchAuthorFeed,
      [FAVORITE_PROFILE_PAGE]: fetchFavoritedFeed
    }[feedType];

    fetchFn({ username, page })
      .then(({ articles, articlesCount }) =>
        dispatch({ [ARTICLES_FETCHED_OK]: { articles, articlesCount } })
      )
      .catch(err => dispatch({ [ARTICLES_FETCHED_NOK]: err }));
    // ADR:
    // In the original Conduit demo app, profile and articles are fetched in parallel and displayed together
    // On tab navigation, the profile data is not refetched, but articles are
    // 1. Memoize
    // Ok, but then I do not guarantee at the modelization level that profile data is not fetched twice
    // That is ok if that is not understood to be a part of the specifications.
    // 2. Do the profile API call anew, but do no display a loading indicator while fetching
    // Even better user-wise. And probably makes the most sense too. After all, the profile
    // could have been changed in the meanwhile, so getting fresh data is not a bad thing.
    // Screen-wise, we keep the displayed profile screen till we get the newly fetched profile info.
    // We chose 2!!
  },
  [FOLLOW_PROFILE]: (dispatch, params, effectHandlers) => {
    const { follow } = effectHandlers;
    const username = params;

    follow({ username })
      .then(({ profile }) => dispatch({ [TOGGLE_FOLLOW_OK]: profile }))
      .catch(err => dispatch({ [TOGGLE_FOLLOW_NOK]: err }));
  },
  [UNFOLLOW_PROFILE]: (dispatch, params, effectHandlers) => {
    const { unfollow } = effectHandlers;
    const username = params;

    unfollow({ username })
      .then(({ profile }) => dispatch({ [TOGGLE_FOLLOW_OK]: profile }))
      .catch(err => dispatch({ [TOGGLE_FOLLOW_NOK]: err }));
  }
  // TODO article
};

const effectHandlers = {
  render,
  fetchTags,
  fetchGlobalFeed,
  fetchUserFeed,
  fetchTagFilteredFeed,
  fetchAuthentication,
  favoriteArticle,
  unfavoriteArticle,
  redirect,
  register,
  saveUser: sessionRepository.save,
  login,
  fetchArticle,
  saveArticle,
  updateArticle,
  removeUserSession: sessionRepository.clear,
  updateSettings,
  fetchProfile,
  follow,
  unfollow,
  fetchAuthorFeed,
  fetchFavoritedFeed
};

const app = new App({
  target: document.body,
  props: {
    _shouldRender: false,
    _fsm: {
      fsmFactory,
      env,
      eventBus,
      commandHandlers,
      effectHandlers
    },
    tags: void 0,
    articles: void 0,
    page: void 0,
    activeFeed: void 0,
    user: void 0,
    selectedTag: void 0,
    route: void 0,
    favoriteStatus: void 0,
    inProgress: void 0,
    errors: void 0,
    title: void 0,
    description: void 0,
    body: void 0,
    currentTag: void 0,
    tagList: void 0,
    profile: void 0,
    profileTab: null,
    article: null,
    comments: null,
    commentText: null,
    profileStatus: null
  }
});

// kick start the app with the routing event corresponding to the current route
const initEvent = { [ROUTE_CHANGED]: { hash: getCurrentHash() } };
next(initEvent);

export default app;

// DOC:
// ADR: we chose to inject the dispatcher in the view, and let the view define the event
// handlers.
// Issue: Event handlers for the application must be defined somewhere. Where it is defined has some
// implications for testing and maintainability.
// Options:
// 1. pass the event handlers in fsm.js
// - event handlers have the dispatcher as dependency, so it needs to be passed somehow
//   - they could be computed anew in each action factory
//     - this means that we are computing a new event handler everytime even though it is a constant
//     - could be an issue to detach/attach handlers on each render, specially on large apps
//     - memoization could be used, but then we don't have pure action factories anymore
//       - not a big impact, it is just memoization, but that breaks a design rules
//   - the dispatcher could be injected into the machine as settings
//     - at some init time, the handlers could be computed and put in extended state
//     - the handlers would then be taken from there when necessary, but we would have to be careful
//       - either to repeat them everywhere (maintainability issue, we might forget some places as the app grows)
//       - or put them at strategic places (compound states entry) but same maintainability issue,
//         even though somewhat mitigated
//   - this means we really have a dumb view with no dependency, which can developed independently
//     with a separate team
//   - however testing the event handlers computed by the machine is not so easy to do in a maintainable way
//     - they cannot be tested in a generic way (they take different parameters)
// 2. inject the dispatcher in the view instead
//   - the top level view computes the event handlers, and all lower level view components
//     use callbacks like `onClickTag`
//   - this is easier to test
//     - with storybook
//     - or with ad-hoc automatized testing (render, click button, mock the dispatcher, observe outputs)
//   - this couples the view to the machine dispatcher and the machine events
//   - dispatcher coupling is OK, it is done through parameter passing - that's loose coupling
//   - machine events coupling can be handled by removing the event definition from the machine
//     and putting in a separate module (`constants.js`) accessed by all dependent modules
//     The events definition acts as as interface and we are coupling the view and fsm modules
//     through an interface. That's good!
//     If we change the events name in the future, we modify in one place only
//     If we change the event semantics, then we have changed the specifications, so it is natural
//     that the fsm would need to change, and possibly the view
//     If we change the machine, while keeping event semantics, the view needs not change
//     So the view and the machine are loosely coupled to each other
//     but coupled through the events interface
//   - If that loose coupling is not loose enough it is still possible to add an interface
//     - for instance, the machine computes props for the view. It could compute props for an interface
//       and adapter (machine props -> view props) or compute props directly for the view
//     - same for events. Could have adapter view events -> machine events
//   - The point is to choose a balance between loose coupling and cohesion
// Decision: option 2!
// - using storybook can be a productivity saver vs. ad-hoc testing of machine-computed handlers
// - the cost of having events in a common module is minimal
// - events name changing does not happen that often
// - event semantics changing is likely to involve changing the view too anyways

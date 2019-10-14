import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { signInErrorsFixture, signedInUserFixture, userFixture, signInUserFixture,  } from "./fixtures/user"
import { runUserStories } from "./common"
import { cleanHash } from "../src/shared/helpers"
import { AUTH_USER_ON_HOME_COMMANDS, UNAUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"
import { articleSlugFixture, fetchedArticleFixture } from "./fixtures/article"

QUnit.module("Testing editor route fsm", {});

const {
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
  } = events;
const {
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
  RENDER_EDITOR,
  UPDATE_ARTICLE
  } = commands;

const { home, editor } = routes;

// TODO
// Scenarios
// (Create New Article, Edit Article) x (Auth, NAuth) x (Success, Failure) -x include add_tag and remove_tag
// Unauthenticated user navigates to the editor route (new article) and is redirected to the home route
// Unauthenticated user navigates to the editor route (edit article) and is redirected to the home route
// Authenticated user navigates to the editor route (new article), sees the editor form, adds twice the same tag, fills in the fields, publishes the article, and is redirected to the article page
// Authenticated user navigates to the editor route (edit article), sees the editor form with prefilled values, adds two different tags, removes one tag, publishes the article with empty fields, and sees the editor form with errors and no tag
// failed fetched article not tested? do it by hand in here, only used once

const UNAUTH_USER = null;
const hashFixture = [editor, articleSlugFixture].join('/');
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: editor} },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: hashFixture} },
  { [FETCHED_ARTICLE]: fetchedArticleFixture },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: cleanHash(editor ) } },
  { [AUTH_CHECKED]: userFixture }
];
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: cleanHash(hashFixture) } },
  { [FETCHED_ARTICLE]: fetchedArticleFixture },
  { [AUTH_CHECKED]: userFixture }
];

const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS = [
  [    { [FETCH_AUTHENTICATION]: void 0 },  ],
  [
    { [REDIRECT]: home },
    UNAUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS = [
  [    { [FETCH_AUTHENTICATION]: void 0 },  ],
  [    { [FETCHED_ARTICLE]: articleSlugFixture},  ],
  [
    { [REDIRECT]: home },
    AUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS = [
  [    { [FETCH_AUTHENTICATION]: void 0 },  ],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        currentTag: "",
        tagList: [],
      }
    },
  ]
];
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS = [
  { [ROUTE_CHANGED]: { hash: cleanHash(hashFixture) } },
  { [FETCHED_ARTICLE]: fetchedArticleFixture },
  { [AUTH_CHECKED]: userFixture }
];

// Unauthenticated user navigates to the editor route (new article) and is redirected to the home route
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM = `Unauthenticated user navigates to the editor route (new article) and is redirected to the home route`;
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_INPUTS = [
  UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS,
].flat();
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_COMMANDS = UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS;

// Authenticated user navigates to sign in route and is redirected to home route
// const AUTH_USER_ON_SIGNIN_SEES_FORM = `Authenticated user navigates to sign in route and is redirected to home route`;
// const AUTH_USER_ON_SIGNIN_SEES_FORM_INPUTS = [
//   AUTH_USER_ON_EDITOR_INPUTS,
// ].flat();
// const AUTH_USER_ON_SIGNIN_SEES_FORM_COMMANDS = AUTH_USER_ON_EDITOR_COMMANDS(0);
//
// // Unauthenticated user navigates to sign in route and sees sign in form, successfully signs and is redirected to home
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED = `Unauthenticated user navigates to sign in route and sees sign in form, successfully signs and is redirected to home and sees home feed`;
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_INPUTS= [
//   UNAUTH_USER_ON_EDITOR_INPUTS,
//   {[CLICKED_SIGN_IN]: signInUserFixture},
//   {[AUTH_CHECKED]: null},
//   {[SUCCEEDED_SIGN_IN]: signedInUserFixture}
// ].flat();
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_COMMANDS = UNAUTH_USER_ON_EDITOR_COMMANDS.concat([
//   [
//     {[RENDER_EDITOR]: {route: signIn, inProgress:true, errors: null}},
//     {[FETCH_AUTHENTICATION]: void 0},
//   ],
//   [  {[SIGN_IN]: signInUserFixture}],
//   [
//     {[REDIRECT]: home},
//     AUTH_USER_ON_EDITOR_COMMANDS(0).flat()
//   ].flat()
// ]);
//
// // Unauthenticated user navigates to sign in route and sees sign in form, fails to sign in, sees error messages
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS = `Unauthenticated user navigates to sign in route and sees sign in form, fails to sign in, sees error messages`;
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_INPUTS= [
//   UNAUTH_USER_ON_EDITOR_INPUTS,
//   {[CLICKED_SIGN_IN]: signInUserFixture},
//   {[AUTH_CHECKED]: null},
//   {[FAILED_SIGN_IN]: signInErrorsFixture}
// ].flat();
// const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_COMMANDS= UNAUTH_USER_ON_EDITOR_COMMANDS.concat([
//   [
//     {[RENDER_EDITOR]: {route: signIn, inProgress:true, errors: null}},
//     {[FETCH_AUTHENTICATION]: void 0},
//   ],
//   [  {[SIGN_IN]: signInUserFixture}],
//   [
//     {[FETCH_AUTHENTICATION]: void 0},
//     {[RENDER_EDITOR]: {route: signIn, inProgress:false, errors: signInErrorsFixture}},
//   ].flat()
// ]);

const userStories = [
  [
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM,
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_INPUTS,
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_COMMANDS
  ],
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

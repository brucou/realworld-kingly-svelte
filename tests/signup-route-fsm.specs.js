import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { signedUpUserFixture, signUpErrorsFixture, signUpUserFixture, userFixture } from "./fixtures/user"
import { runUserStories } from "./common"
import { AUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"

QUnit.module("Testing sign up route fsm", {});

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
] = events;
const [
  RENDER_HOME,
  RENDER_SIGN_UP,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  REDIRECT,
  SIGN_UP
] = commands;
const { home, signUp, allRoutes } = routes;

// Scenarios

const UNAUTH_USER = null;
const UNAUTH_USER_ON_SIGNUP_INPUTS = [
  { [ROUTE_CHANGED]: { hash: signUp } },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const AUTH_USER_ON_SIGNUP_INPUTS = [
  { [ROUTE_CHANGED]: { hash: signUp } },
  { [AUTH_CHECKED]: userFixture }
];

const UNAUTH_USER_ON_SIGNUP_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    {
      [RENDER_SIGN_UP]: {
        route: signUp,
        inProgress: false,
        errors: null,
      }
    },
  ]
];
const AUTH_USER_ON_SIGNUP_COMMANDS = page => ([
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [REDIRECT]: home },
    AUTH_USER_ON_HOME_COMMANDS(page)[0]
  ].flat()
]);

// Unauthenticated user navigates to sign up route and sees sign up form
const UNAUTH_USER_ON_SIGNUP_SEES_FORM = `Unauthenticated user navigates to *sign up* route and sees sign up form`;
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_INPUTS = [
  UNAUTH_USER_ON_SIGNUP_INPUTS,
].flat();
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_COMMANDS = UNAUTH_USER_ON_SIGNUP_COMMANDS;

// Authenticated user navigates to sign up route and is redirected to home route
const AUTH_USER_ON_SIGNUP_SEES_FORM = `Authenticated user navigates to sign up route and is redirected to home route`;
const AUTH_USER_ON_SIGNUP_SEES_FORM_INPUTS = [
  AUTH_USER_ON_SIGNUP_INPUTS,
].flat();
const AUTH_USER_ON_SIGNUP_SEES_FORM_COMMANDS = AUTH_USER_ON_SIGNUP_COMMANDS(0);

// Unauthenticated user navigates to sign up route and sees sign up form, successfully signs and is redirected to home
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED = `Unauthenticated user navigates to sign up route and sees sign up form, successfully signs and is redirected to home and sees home feed`;
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED_INPUTS= [
  UNAUTH_USER_ON_SIGNUP_INPUTS,
  {[CLICKED_SIGNUP]: signUpUserFixture},
  {[AUTH_CHECKED]: null},
  {[SUCCEEDED_SIGN_UP]: signedUpUserFixture}
].flat();
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED_COMMANDS = UNAUTH_USER_ON_SIGNUP_COMMANDS.concat([
  [
    {[RENDER_SIGN_UP]: {route: signUp, inProgress:true, errors: null}},
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [  {[SIGN_UP]: signUpUserFixture}],
  [
    {[REDIRECT]: home},
    AUTH_USER_ON_SIGNUP_COMMANDS(0).flat()
    ].flat()
]);

// Unauthenticated user navigates to sign up route and sees sign up form, fails to sign up, sees error messages
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS = `Unauthenticated user navigates to sign up route and sees sign up form, fails to sign up, sees error messages`;
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS_INPUTS= [
  UNAUTH_USER_ON_SIGNUP_INPUTS,
  {[CLICKED_SIGNUP]: signUpUserFixture},
  {[AUTH_CHECKED]: null},
  {[FAILED_SIGN_UP]: signUpErrorsFixture}
].flat();
const UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS_COMMANDS= UNAUTH_USER_ON_SIGNUP_COMMANDS.concat([
  [
    {[RENDER_SIGN_UP]: {route: signUp, inProgress:true, errors: null}},
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [  {[SIGN_UP]: signUpUserFixture}],
  [
    {[FETCH_AUTHENTICATION]: void 0},
    {[RENDER_SIGN_UP]: {route: signUp, inProgress:false, errors: signUpErrorsFixture}},
  ].flat()
]);

const userStories = [
  [
    UNAUTH_USER_ON_SIGNUP_SEES_FORM,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_INPUTS,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_COMMANDS
  ],
  [
    AUTH_USER_ON_SIGNUP_SEES_FORM,
    AUTH_USER_ON_SIGNUP_SEES_FORM_INPUTS,
    AUTH_USER_ON_SIGNUP_SEES_FORM_COMMANDS
  ],
  [
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED_INPUTS,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_SIGNS_UP_AND_SEES_HOME_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS_INPUTS,
    UNAUTH_USER_ON_SIGNUP_SEES_FORM_FAILS_SIGN_UP_AND_SEES_HOME_FEED_WITH_ERRORS_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

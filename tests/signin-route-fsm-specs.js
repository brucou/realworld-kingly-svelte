import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { signedInUserFixture, signInErrorsFixture, signInUserFixture, userFixture } from "./fixtures/user"
import { runUserStories } from "./common"
import { AUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"

QUnit.module("Testing sign in route fsm", {});

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  CLICKED_SIGN_IN,
  FAILED_SIGN_IN,
  SUCCEEDED_SIGN_IN,
} = events;
const {
  RENDER_SIGN_IN,
  FETCH_AUTHENTICATION,
  REDIRECT,
  SIGN_IN
} = commands;
const { home, signIn } = routes;

// Scenarios

const UNAUTH_USER = null;
const UNAUTH_USER_ON_SIGNIN_INPUTS = [
  { [ROUTE_CHANGED]: { hash: signIn } },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const AUTH_USER_ON_SIGNIN_INPUTS = [
  { [ROUTE_CHANGED]: { hash: signIn } },
  { [AUTH_CHECKED]: userFixture }
];

const UNAUTH_USER_ON_SIGNIN_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [{ [RENDER_SIGN_IN]: { route: signIn, user: null, inProgress: false, errors: null, } }]
];
const AUTH_USER_ON_SIGNIN_COMMANDS = page => ([
  [
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [
    { [REDIRECT]: home },
    AUTH_USER_ON_HOME_COMMANDS(page)[0]
  ].flat()
]);

// Unauthenticated user navigates to sign in route and sees sign in form
const UNAUTH_USER_ON_SIGNIN_SEES_FORM = `Unauthenticated user navigates to *sign in* route and sees sign in form`;
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_INPUTS = [
  UNAUTH_USER_ON_SIGNIN_INPUTS,
].flat();
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_COMMANDS = UNAUTH_USER_ON_SIGNIN_COMMANDS;

// Authenticated user navigates to sign in route and is redirected to home route
const AUTH_USER_ON_SIGNIN_IS_REDIRECTED = `Authenticated user navigates to sign in route and is redirected to home route`;
const AUTH_USER_ON_SIGNIN_IS_REDIRECTED_INPUTS = [
  AUTH_USER_ON_SIGNIN_INPUTS,
].flat();
const AUTH_USER_ON_SIGNIN_IS_REDIRECTED_COMMANDS = AUTH_USER_ON_SIGNIN_COMMANDS(0);

// Unauthenticated user navigates to sign in route and sees sign in form, successfully signs and is redirected to home
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED = `Unauthenticated user navigates to sign in route and sees sign in form, successfully signs and is redirected to home and sees home feed`;
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_INPUTS = [
  UNAUTH_USER_ON_SIGNIN_INPUTS,
  { [CLICKED_SIGN_IN]: signInUserFixture },
  { [AUTH_CHECKED]: null },
  { [SUCCEEDED_SIGN_IN]: signedInUserFixture }
].flat();
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_COMMANDS = UNAUTH_USER_ON_SIGNIN_COMMANDS.concat([
  [
    { [RENDER_SIGN_IN]: { route: signIn, user:null, inProgress: true, errors: null } },
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [{ [SIGN_IN]: signInUserFixture }],
  [
    { [REDIRECT]: home },
    AUTH_USER_ON_SIGNIN_COMMANDS(0).flat()
  ].flat()
]);

// Unauthenticated user navigates to sign in route and sees sign in form, fails to sign in, sees error messages
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS = `Unauthenticated user navigates to sign in route and sees sign in form, fails to sign in, sees error messages`;
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_INPUTS = [
  UNAUTH_USER_ON_SIGNIN_INPUTS,
  { [CLICKED_SIGN_IN]: signInUserFixture },
  { [AUTH_CHECKED]: null },
  { [FAILED_SIGN_IN]: signInErrorsFixture }
].flat();
const UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_COMMANDS = UNAUTH_USER_ON_SIGNIN_COMMANDS.concat([
  [
    { [RENDER_SIGN_IN]: { route: signIn, user:null, inProgress: true, errors: null } },
    { [FETCH_AUTHENTICATION]: void 0 },
  ],
  [{ [SIGN_IN]: signInUserFixture }],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_SIGN_IN]: { route: signIn, user:null, inProgress: false, errors: signInErrorsFixture } },
  ].flat()
]);

const userStories = [
  [
    UNAUTH_USER_ON_SIGNIN_SEES_FORM,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_INPUTS,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_COMMANDS
  ],
  [
    AUTH_USER_ON_SIGNIN_IS_REDIRECTED,
    AUTH_USER_ON_SIGNIN_IS_REDIRECTED_INPUTS,
    AUTH_USER_ON_SIGNIN_IS_REDIRECTED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_INPUTS,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_SIGNS_IN_AND_SEES_HOME_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_INPUTS,
    UNAUTH_USER_ON_SIGNIN_SEES_FORM_FAILS_SIGN_IN_AND_SEES_FORM_WITH_ERRORS_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

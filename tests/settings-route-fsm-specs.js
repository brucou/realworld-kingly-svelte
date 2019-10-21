import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { UNAUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"
import { settingsErrorsFixture } from "./fixtures/settings"

QUnit.module("Testing settings route fsm", {});

// Commands
const {
  FETCH_AUTHENTICATION,
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

const { home, settings } = routes;
const updatedUserFixture = {
  image: "another",
  username: "one",
  bio: "bites",
  email: "the@dust.uh",
  password: "123456"
};
const updatedSettingsFixture = { ...updatedUserFixture, password: "123456" };

const UNAUTH_USER = null;

// Unauthenticated user navigates to the settings route and is redirected to the home route
const UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED = `Unauthenticated user navigates to the settings route and is redirected to the home route`;
const UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: UNAUTH_USER }
].flat();
const UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    { [REDIRECT]: home },
    UNAUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];

// Authenticated user navigates to settings route, sees form, successfully updates settings and is redirected to the
// user profile page
const AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS = `Authenticated user navigates to settings route, sees form, successfully updates settings and is redirected to the user profile page`;
const AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: userFixture },
  { [CLICKED_UPDATE_SETTINGS]: updatedSettingsFixture },
  { [AUTH_CHECKED]: userFixture },
  { [UPDATED_SETTINGS]: updatedUserFixture },
];

const AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [{ [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: false, errors: null } },],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: true, errors: null } },
  ],
  [{ [UPDATE_SETTINGS]: { ...updatedSettingsFixture } },],
  [{ [REDIRECT]: `/@${updatedSettingsFixture.username}` },]
];

// Authenticated user navigates to settings route, sees form, fails to update settings and sees errors
const AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS = `Authenticated user navigates to settings route, sees form, fails to update settings and sees errors`;
const AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: userFixture },
  { [CLICKED_UPDATE_SETTINGS]: updatedSettingsFixture },
  { [AUTH_CHECKED]: userFixture },
  { [FAILED_UPDATE_SETTINGS]: settingsErrorsFixture },
];

const AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [{ [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: false, errors: null } },],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: true, errors: null } },
  ],
  [{ [UPDATE_SETTINGS]: { ...updatedSettingsFixture } },],
  [
    {
      [RENDER_SETTINGS]: {
        route: settings, user: userFixture, inProgress: false, errors: settingsErrorsFixture
      }
    },
    { [FETCH_AUTHENTICATION]: void 0 }
  ]
];

// Authenticated user navigates to settings route, sees form, and logs out
const AUTH_USER_ON_SETTINGS_AND_LOGS_OUT = `Authenticated user navigates to settings route, sees form, and logs out`;
const AUTH_USER_ON_SETTINGS_AND_LOGS_OUT_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: userFixture },
  { [CLICKED_LOG_OUT]: void 0 }
];

const AUTH_USER_ON_SETTINGS_AND_LOGS_OUT_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [{ [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: false, errors: null } },],
  [
    { [LOG_OUT]: void 0 },
    { [REDIRECT]: home },
    UNAUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];

const userStories = [
  [
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED,
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_INPUTS,
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_COMMANDS
  ],
  [
    AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS,
    AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS_INPUTS,
    AUTH_USER_ON_SETTINGS_UPDATES_SETTINGS_COMMANDS
  ],
  [
    AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS,
    AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS_INPUTS,
    AUTH_USER_ON_SETTINGS_FAILS_UPDATE_SETTINGS_COMMANDS
  ],
  [
    AUTH_USER_ON_SETTINGS_AND_LOGS_OUT,
    AUTH_USER_ON_SETTINGS_AND_LOGS_OUT_INPUTS,
    AUTH_USER_ON_SETTINGS_AND_LOGS_OUT_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

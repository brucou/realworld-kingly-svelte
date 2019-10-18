import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { UNAUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"
import {
  articleSlugFixture, createdNewArticleFixture, fetchedArticleFixture, newArticleFixture
} from "./fixtures/article"

QUnit.module("Testing settings route fsm", {});

// Commands
const {
  FETCH_AUTHENTICATION,
  REDIRECT,
  PUBLISH_ARTICLE,
  FETCH_ARTICLE,
  RENDER_EDITOR,
  UPDATE_SETTINGS,
  LOG_OUT,
  RENDER_SETTINGS,
} = commands;
const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  SUCCEEDED_PUBLISHING,
  FAILED_FETCH_ARTICLE,
  FETCHED_ARTICLE,
  CLICKED_UPDATE_SETTINGS,
  REMOVED_USER_SESSION,
  UPDATED_SETTINGS,
  FAILED_UPDATE_SETTINGS
} = events;

const { home, settings } = routes;
const settingsFixture = {
  image: userFixture.image,
  username: userFixture.username,
  bio: userFixture.bio,
  email: userFixture.email,
  password: ""
};
const updatedUserFixture = {
  image: "another",
  username: "one",
  bio: "bites",
  email: "the@dust.uh",
  password: "123456"
};
const updatedSettingsFixture = {  ...updatedUserFixture,  password: "123456"};

// TODO: scenarios
// Authenticated user navigates to settings route, sees form, fails to update settings and sees errors
// Authenticated user navigates to settings route, sees form, and logs out

const UNAUTH_USER = null;

const AUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: userFixture }
];
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    {
      [RENDER_EDITOR]: {
        route: settings,
        user: userFixture,
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
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: hashFixture } },
  { [FETCHED_ARTICLE]: fetchedArticleFixture },
  { [AUTH_CHECKED]: userFixture }
];
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS = [
  [{ [FETCH_ARTICLE]: articleSlugFixture }],
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
        user: userFixture,
        inProgress: false,
        errors: null,
        title: fetchedArticleFixture.title,
        description: fetchedArticleFixture.description,
        body: fetchedArticleFixture.body,
        currentTag: "",
        tagList: fetchedArticleFixture.tagList,
      }
    }
  ]
];

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
const AUTH_USER_ON_EDITOR_UPDATES_SETTINGS = `Authenticated user navigates to settings route, sees form, successfully updates settings and is redirected to the user profile page`;
const AUTH_USER_ON_EDITOR_UPDATES_SETTINGS_INPUTS = [
  { [ROUTE_CHANGED]: { hash: settings } },
  { [AUTH_CHECKED]: userFixture },
  { [CLICKED_UPDATE_SETTINGS]: updatedSettingsFixture },
  { [AUTH_CHECKED]: userFixture },
  { [UPDATED_SETTINGS]: updatedUserFixture },
];

const AUTH_USER_ON_EDITOR_UPDATES_SETTINGS_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    { [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: false, errors: null } },
  ],
  [
    { [AUTH_CHECKED]: void 0 },
    { [RENDER_SETTINGS]: { route: settings, user: userFixture, inProgress: true, errors: null } },
  ],
  [
    { [UPDATE_SETTINGS]: { ...updatedSettingsFixture } },
  ],
  // TODO: update when I know the route
  [
    { [REDIRECT]: void 0 },
  ]
];

// Authenticated user navigates to the editor route (new article), sees the editor form, adds twice the same tag, fills
// in the fields, publishes the article, and is redirected to the article page
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES = ` Authenticated user navigates to the editor route (new article), sees the editor form, adds twice the same tag, fills in the fields, publishes the article, and is redirected to the article page`;
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES_INPUTS = [
  AUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS,
  { [EDITED_TAG]: newArticleFixture.tagList[0][0] },
  { [EDITED_TAG]: newArticleFixture.tagList[0] },
  { [ADDED_TAG]: newArticleFixture.tagList[0] },
  { [EDITED_TAG]: newArticleFixture.tagList[0][0] },
  { [EDITED_TAG]: newArticleFixture.tagList[0] },
  { [ADDED_TAG]: newArticleFixture.tagList[0] },
  { [CLICKED_PUBLISH]: newArticleFixture },
  { [AUTH_CHECKED]: userFixture },
  { [SUCCEEDED_PUBLISHING]: createdNewArticleFixture },
].flat();
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES_COMMANDS = AUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS.concat([
  [
    {
      [RENDER_EDITOR]: {
        user: userFixture,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: [],
        currentTag: newArticleFixture.tagList[0][0],
        route: editor,
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        user: userFixture,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: [],
        currentTag: newArticleFixture.tagList[0],
        route: editor,
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        user: userFixture,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: newArticleFixture.tagList,
        currentTag: "",
        route: editor,
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        user: userFixture,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: newArticleFixture.tagList,
        currentTag: newArticleFixture.tagList[0][0],
        route: editor,
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        user: userFixture,
        inProgress: false,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: newArticleFixture.tagList,
        currentTag: newArticleFixture.tagList[0],
        route: editor,
      }
    }
  ],
  [],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
        user: userFixture,
        inProgress: true,
        errors: null,
        title: newArticleFixture.title,
        description: newArticleFixture.description,
        body: newArticleFixture.body,
        tagList: newArticleFixture.tagList,
        currentTag: newArticleFixture.tagList[0],
      }
    },
    { [FETCH_AUTHENTICATION]: void 0 }
  ],
  [{ [PUBLISH_ARTICLE]: newArticleFixture },],
  [{ [REDIRECT]: '/article/' + createdNewArticleFixture.slug },]
]);

const userStories = [
  [
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED,
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_INPUTS,
    UNAUTH_USER_ON_SETTINGS_IS_REDIRECTED_COMMANDS
  ],
  [
    AUTH_USER_ON_EDITOR_UPDATES_SETTINGS,
    AUTH_USER_ON_EDITOR_UPDATES_SETTINGS_INPUTS,
    AUTH_USER_ON_EDITOR_UPDATES_SETTINGS_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

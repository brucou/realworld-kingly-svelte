import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, routes } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { AUTH_USER_ON_HOME_COMMANDS, UNAUTH_USER_ON_HOME_COMMANDS } from "./home-route-fsm.specs"
import {
  articleSlugFixture, createdNewArticleFixture, fetchedArticleFixture, newArticleFixture, submitErrorArticleFixture
} from "./fixtures/article"

QUnit.module("Testing editor route fsm", {});

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  FAILED_FETCH_ARTICLE,
  FETCHED_ARTICLE,
  EDITED_TAG,
  ADDED_TAG,
  CLICKED_PUBLISH,
  SUCCEEDED_PUBLISHING,
  REMOVED_TAG,
  FAILED_PUBLISHING,
} = events;
const { RENDER_EDITOR, FETCH_AUTHENTICATION, REDIRECT, PUBLISH_ARTICLE, FETCH_ARTICLE, UPDATE_ARTICLE } = commands;

const { home, editor } = routes;

const hashFixture = [editor, articleSlugFixture].join('/');

const UNAUTH_USER = null;
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: editor } },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    { [REDIRECT]: home },
    UNAUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: hashFixture } },
  { [FETCHED_ARTICLE]: fetchedArticleFixture },
  { [AUTH_CHECKED]: UNAUTH_USER }
];
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS = [
  [{ [FETCH_ARTICLE]: articleSlugFixture }],
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    { [REDIRECT]: home },
    AUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat()
];

const AUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: editor } },
  { [AUTH_CHECKED]: userFixture }
];
const AUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS = [
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
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

// Unauthenticated user navigates to the editor route (new article) and is redirected to the home route
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED = `Unauthenticated user navigates to the editor route (new article) and is redirected to the home route`;
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED_INPUTS = [
  UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_INPUTS,
].flat();
const UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED_COMMANDS = UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_COMMANDS;

// Unauthenticated user navigates to the editor route (edit article) and is redirected to the home route
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED = `Unauthenticated user navigates to the editor route (edit article) and is redirected to the home route`;
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED_INPUTS = [
  UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS,
].flat();
const UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED_COMMANDS = UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS;

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
  [
    { [REDIRECT]: '/article/' + createdNewArticleFixture.slug },
    { [FETCH_AUTHENTICATION]: void 0}
  ]
]);

// Authenticated user navigates to the editor route (edit article), sees the editor form with prefilled values, adds
// one tag, removes another tag, publishes the article with empty fields, and sees the editor form with errors
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS = `Authenticated user navigates to the editor route (edit article), sees the editor form with prefilled values, removes a tag, publishes the article with empty fields, and sees the editor form with errors and no tag`;
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS_INPUTS = [
  AUTH_USER_ON_EDITOR_EDIT_ARTICLE_INPUTS,
  { [REMOVED_TAG]: fetchedArticleFixture.tagList[0]},
  { [CLICKED_PUBLISH]: { tagList: [fetchedArticleFixture.tagList[1]], description: "", title: "", body: "" } },
  { [AUTH_CHECKED]: userFixture },
  { [FAILED_PUBLISHING]: submitErrorArticleFixture },
  { [AUTH_CHECKED]: userFixture },
].flat();
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS_COMMANDS = AUTH_USER_ON_EDITOR_EDIT_ARTICLE_COMMANDS.concat([
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
        tagList: [fetchedArticleFixture.tagList[1]],
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
        user: userFixture,
        inProgress: true,
        errors: null,
        title: "",
        description: "",
        body: "",
        tagList: [fetchedArticleFixture.tagList[1]],
        currentTag: "",
      }
    },
    { [FETCH_AUTHENTICATION]: void 0 }
  ],
  [{
    [UPDATE_ARTICLE]: {
      slug: articleSlugFixture,
      tagList: [fetchedArticleFixture.tagList[1]],
      description: "",
      title: "",
      body: ""
    }
  }],
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    {
      [RENDER_EDITOR]: {
        route: editor,
        user:userFixture,
        inProgress: false,
        errors: submitErrorArticleFixture,
        title: "",
        description: "",
        body: "",
        tagList: [fetchedArticleFixture.tagList[1]],
        currentTag: "",
      }
    }
  ],
  [
    {
      [RENDER_EDITOR]: {
        route: editor,
        user:userFixture,
        inProgress: false,
        errors: submitErrorArticleFixture,
        title: "",
        description: "",
        body: "",
        tagList: [fetchedArticleFixture.tagList[1]],
        currentTag: "",
      }
    }
  ]
]);

// tag failed fetched article not tested? do it by hand in here, only used once
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED = `Authenticated user navigates to the editor route (edit article), and is redirected to the home route, as the article could not be fetched`;
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED_INPUTS = [
  { [ROUTE_CHANGED]: { hash: hashFixture } },
  { [FAILED_FETCH_ARTICLE]: fetchedArticleFixture },
].flat();
const AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED_COMMANDS = [
  [{ [FETCH_ARTICLE]: articleSlugFixture }],
  [
      { [REDIRECT]: home },
      AUTH_USER_ON_HOME_COMMANDS(0)[0]
  ].flat(),
];

const userStories = [
  [
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED,
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED_INPUTS,
    UNAUTH_USER_ON_EDITOR_NEW_ARTICLE_IS_REDIRECTED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED,
    UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED_INPUTS,
    UNAUTH_USER_ON_EDITOR_EDIT_ARTICLE_IS_REDIRECTED_COMMANDS
  ],
  [
    AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES,
    AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES_INPUTS,
    AUTH_USER_ON_EDITOR_NEW_ARTICLE_SEES_FORM_ADDS_TWICE_SAME_TAGS_AND_PUBLISHES_COMMANDS
  ],
  [
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS,
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS_INPUTS,
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_SEES_FORM_ADDS_TWO_TAGS_REMOVES_ONE_PUBLISHES_EMPTY_SEES_ERRORS_COMMANDS
  ],
  [
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED,
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED_INPUTS,
    AUTH_USER_ON_EDITOR_EDIT_ARTICLE_FAILED_FETCH_AND_IS_REDIRECTED_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);

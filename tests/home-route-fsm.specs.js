import QUnit from "qunit"
import prettyFormat from 'pretty-format'
import {equals as deepEqual} from "ramda"
import { fsmContracts, NO_OUTPUT } from "kingly"
import { commands, events, fsmFactory } from "../src/fsm"
import { loadingStates, routes, viewModel } from "../src/constants"
import {
  articlesErrorFixture, articlesFilteredErrorFixture, articlesFilteredFixture, articlesFixture, articlesPage1Fixture
} from "./fixtures/articles"
import { tagFixture, tagsFixture } from "./fixtures/tags"
import { userFixture } from "./fixtures/user"
import { computeCleanedActualOutputs, formatIndex, processRenderCommands, removeNoOutputs } from "./common"

QUnit.module("Testing home route fsm", {});

const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED],
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

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
] = events;
const [
  RENDER,
  FETCH_GLOBAL_FEED,
  FETCH_ARTICLES_GLOBAL_FEED,
  FETCH_ARTICLES_USER_FEED,
  FETCH_AUTHENTICATION,
  FETCH_USER_FEED,
  FETCH_FILTERED_FEED,
] = commands;
const { home } = routes;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;

// NOTE DOC: for every expected commands, put the whole props for the <App /> as tested in Storybook
// Note that it may not however be useful to include event handlers
const UNAUTH_USER = null;
const UNAUTH_USER_ON_HOME_INPUTS = [
  { [ROUTE_CHANGED]: { hash: home } },
  { [AUTH_CHECKED]: { user: UNAUTH_USER } }
];
const AUTH_USER_ON_HOME_INPUTS = [
  { [ROUTE_CHANGED]: { hash: home } },
  { [AUTH_CHECKED]: { user: userFixture } }
];

const UNAUTH_USER_ON_HOME_COMMANDS = page => ([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER]: {
        tags: TAGS_ARE_LOADING,
        articles: ARTICLES_ARE_LOADING,
        activeFeed: GLOBAL_FEED,
        user: UNAUTH_USER,
        page: 0
      }
    },
    { [FETCH_GLOBAL_FEED]: { page } },
  ]
]);
const AUTH_USER_ON_HOME_COMMANDS = page => ([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER]: {
        tags: TAGS_ARE_LOADING,
        articles: ARTICLES_ARE_LOADING,
        activeFeed: USER_FEED,
        user: userFixture,
        page
      }
    },
    { [FETCH_USER_FEED]: { page, username: userFixture.username } },
  ]
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED = `Unauthenticated user navigates to *Home* page and sees the full global feed`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
  [{ [RENDER]: { articles: articlesFixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
]);

const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED = `Unauthenticated user navigates to *Home* page and sees partial global feed`;
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
  [{ [RENDER]: { articles: articlesErrorFixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED = `Authenticated user navigates to *Home* page and sees the full user feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS = [
  AUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS = AUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED } }],
  [{ [RENDER]: { articles: articlesFixture ,tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED} }],
]);

const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED = `Authenticated user navigates to *Home* page and sees partial user feed`;
const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_INPUTS = [
  AUTH_USER_ON_HOME_INPUTS,
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_COMMANDS = AUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED } }],
  [{ [RENDER]: { articles: articlesErrorFixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED = `Unauthenticated user filters the global feed with a tag`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_OK]: articlesFilteredFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredFixture , tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED} }],
]);

const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED = `Unauthenticated user filters the global feed with a tag, sees incomplete feed`;
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_NOK]: articlesFilteredErrorFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredErrorFixture , tags: tagsFixture, page: 0, user:null, activeFeed: TAG_FILTER_FEED } }],
]);

const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED = `Authenticated user filters the global feed with a tag`;
const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture },
  { [ARTICLES_FETCHED_OK]: articlesFilteredFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:userFixture, activeFeed: TAG_FILTER_FEED } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredFixture, tags: tagsFixture, page: 0, user: userFixture, activeFeed: TAG_FILTER_FEED} }],
]);

const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED = `Authenticated user filters the global feed with a tag, sees incomplete feed`;
const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_TAG]: tagFixture},
  { [ARTICLES_FETCHED_NOK]: articlesFilteredErrorFixture }
].flat();
const AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 0, user:userFixture, activeFeed: TAG_FILTER_FEED } },
    { [FETCH_FILTERED_FEED]: { page: 0, tag: tagFixture } }
  ],
  [{ [RENDER]: { articles: articlesFilteredErrorFixture, tags: tagsFixture, page: 0, user: userFixture, activeFeed: TAG_FILTER_FEED} }],
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE = `Unauthenticated user sees the global feed and updates the page`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 1 } },
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, page: 1, activeFeed: GLOBAL_FEED, user: null, tags:tagsFixture } },
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture,  page: 1, activeFeed: GLOBAL_FEED, user: null, tags:tagsFixture } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE = `Authenticated user sees the user feed and updates the page`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [AUTH_CHECKED]: {user : userFixture} },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FETCH_ARTICLES_USER_FEED]: { page: 1, username: userFixture.username } },
    { [RENDER]: { articles: ARTICLES_ARE_LOADING, page: 1, activeFeed: USER_FEED, user: userFixture, tags:tagsFixture } },
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture,  page: 1, activeFeed: USER_FEED, user: userFixture, tags:tagsFixture } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE = `Unauthenticated user filters the global feed with a tag and changes page`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
  { [CLICKED_PAGE]: 1 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_COMMANDS =
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS.concat([
    [
      { [RENDER]: { articles: ARTICLES_ARE_LOADING, tags: tagsFixture, page: 1, user:null, activeFeed: TAG_FILTER_FEED} },
      { [FETCH_FILTERED_FEED]: { page: 1, tag: tagFixture } }
    ],
    [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 1, user:null, activeFeed: TAG_FILTER_FEED } }]
  ]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE = `Unauthenticated user navigates to *Home* page and sees the full global feed, clicks again on the global feed tab and sees the full global feed`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE = `Authenticated user navigates to *Home* page and sees the full user feed, , clicks again on the user feed tab and sees the full user feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_USER_FEED]: void 0 },
  { [AUTH_CHECKED]: {user: userFixture} },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture }
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [FETCH_ARTICLES_USER_FEED]: { page: 0, username: userFixture.username } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: USER_FEED } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: USER_FEED } }],
]);

const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED = `Unauthenticated user filters the global feed with a tag, sees full feed then click on the global feed and sees unfiltered global feed`;
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_COMMANDS = UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
]);

const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED = `Authenticated user navigates to *Home* page and sees the full user feed, , clicks on the global feed tab and sees the full global feed`;
const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_INPUTS = [
  AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
  { [CLICKED_GLOBAL_FEED]: void 0 },
  { [ARTICLES_FETCHED_OK]: articlesPage1Fixture },
].flat();
const AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_COMMANDS = AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS.concat([
  [
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:userFixture, activeFeed: GLOBAL_FEED } }
  ],
  [{ [RENDER]: { articles: articlesPage1Fixture, tags: tagsFixture, page: 0, user:userFixture, activeFeed: GLOBAL_FEED } }],
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME = `Unauthenticated user navigates to *Home* page and sees the full global feed, then navigates back to the *home* route`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_INPUTS = [
  UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
  UNAUTH_USER_ON_HOME_INPUTS,
  { [ARTICLES_FETCHED_OK]: articlesFixture }
].flat();
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_COMMANDS = UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS.concat([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    { [RENDER]: { tags: tagsFixture, articles: ARTICLES_ARE_LOADING, page: 0, user:null, activeFeed: GLOBAL_FEED } },
    { [FETCH_ARTICLES_GLOBAL_FEED]: { page: 0 } },
  ],
    [{ [RENDER]: { articles: articlesFixture, tags: tagsFixture, page: 0, user:null, activeFeed: GLOBAL_FEED } }],
  ]);

const userStories = [
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_GLOBAL_FEED_COMMANDS,
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED,
    AUTH_USER_ON_HOME_SEES_USER_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED,
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_PARTIAL_USER_FEED_COMMANDS,
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_PARTIAL_TAG_FILTERED_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_CHANGES_PAGE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_TWICE_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE,
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_TWICE_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_TAG_FILTERED_GLOBAL_FEED_THEN_UNFILTERED_COMMANDS
  ],
  [
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED,
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_INPUTS,
    AUTH_USER_ON_HOME_SEES_USER_FEED_THEN_GLOBAL_FEED_COMMANDS
  ],
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_AND_NAVIGATES_HOME_COMMANDS
  ]

];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

userStories.forEach(([scenario, inputSeq, outputsSeq]) => {
  if (inputSeq.length !== outputsSeq.length) throw `Error in test scenario ${scenario}! Input sequences and ouputs sequences must have the same length!`
  QUnit.test(scenario, function exec_test(assert) {
    const fsm = fsmFactory(fsmSettings);
    const rawOutputsSeq = inputSeq.map(fsm);

    const actualOutputsSeq = processRenderCommands(rawOutputsSeq.map(removeNoOutputs));

    const { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } =
      inputSeq.reduce((acc, input, index) => {
        let { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } = acc;
        // outputs: [obj1, obj2] with objx : {command, params}
        const actualOutputs = actualOutputsSeq[index];
        // expected: [obj1, obj2] with objx only one key {[command]: params}
        const expectedOutputsCollapsed = outputsSeq[index];
        // => Array < {[command]: params} >
        const actualOutputsCollapsed = actualOutputs
          .map(output => {
            const { command, params } = output;
            return { [command]: params }
          })
          .reduce((acc, actualOutputCollapsed) => {
            return Object.assign(acc, actualOutputCollapsed)
          }, {})
        ;
        // => Array < {command, params} >   with same order than expectedOutputsCollapsed
        const actualOutputsReordered = expectedOutputsCollapsed
          .map(expectedOutputCollapsed => {
            const command = Object.keys(expectedOutputCollapsed)[0];
            const params = actualOutputsCollapsed[command];

            return command in actualOutputsCollapsed
              ? { command, params }
              : `expected command ${command} not found in actual outputs!!`
          }).concat(actualOutputs.filter(actualOutput => {
            const { command, params } = actualOutput;

            return expectedOutputsCollapsed
              .map(expectedOutputCollapsed => Object.keys(expectedOutputCollapsed)[0])
              .indexOf(command) === -1
          }));
        // => Array < {command, params} >   with same order than expectedOutputsCollapsed
        const expectedOutputsUnfolded = expectedOutputsCollapsed.map(expectedOutputCollapsed => {
          const command = Object.keys(expectedOutputCollapsed)[0];
          const params = expectedOutputCollapsed[command];

          return { command, params }
        });

        const passed = deepEqual(actualOutputsReordered, expectedOutputsUnfolded);

        return {
          isTestPassed: isTestPassed && passed,
          actualOutputsReorderedSeq: actualOutputsReorderedSeq.concat([actualOutputsReordered]),
          expectedOutputsUnfoldedSeq: expectedOutputsUnfoldedSeq.concat([expectedOutputsUnfolded]),
          // Accumulate failing indices
          indexWhenFailed: !passed ? indexWhenFailed.concat(index) : indexWhenFailed
        }
      }, { isTestPassed: true, actualOutputsReorderedSeq: [], expectedOutputsUnfoldedSeq: [], indexWhenFailed: [] });

    const inputSeqFormatted = inputSeq.map(x => Object.keys(x)[0]).join('|');
    const errorMessage = `For a sequence of ${inputSeq.length} inputs (${inputSeqFormatted}), the actual outputs sequence differ from the expected outputs sequence at the ${formatIndex(indexWhenFailed)} value of the sequence`;
    const okMessage = prettyFormat(inputSeq);
    const message = isTestPassed ? okMessage : errorMessage;

    console.debug(`input sequence`, inputSeq);
    console.debug(`raw outputs sequence`, rawOutputsSeq);
    console.debug(`actual outputs sequence`, actualOutputsSeq);
    console.debug(`expected outputs sequence`, outputsSeq);
    // We have already determined if the test fails or not,
    // We run QUnit to get the nice diffs in case of failure!
    assert.deepEqual(actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, message);
  });
});



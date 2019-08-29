import QUnit from "qunit"
import prettyFormat from 'pretty-format'
import { fsmContracts, NO_OUTPUT } from "kingly"
import { commands, events, fsmFactory } from "../src/fsm"
import { loadingStates, routes, viewModel } from "../src/constants"
import { articlesErrorFixture, articlesFixture } from "./fixtures/articles"
import { tagsErrorFixture, tagsFixture } from "./fixtures/tags"

// Cheapest deep equal possible
// Bit beware of caveats of JSON.stringify and the JSON format!
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Remove the NO_OUTPUT from the sequence of actions for comparison
// (NO_OUTPUT is an implementation detail that is not part of the specifications)
// It can occur when the machine traverses transient states and takes a transition without actions
function removeNoOutputs(arr) {
  return arr.filter(x => x !== NO_OUTPUT)
}

function computeCleanedActualOutputs(fsm, inputSeq) {
  return inputSeq.map(fsm).map(removeNoOutputs);
}

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

const HOME_ROUTE_LOADING_SEQ = [
  { [ROUTE_CHANGED]: { hash: home } }
];

const HOME_ROUTE_LOADED_OK_TA_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture },
]);

const HOME_ROUTE_LOADED_OK_AT_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [ARTICLES_FETCHED_OK]: articlesFixture },
  { [TAGS_FETCHED_OK]: tagsFixture },
]);

const HOME_ROUTE_LOADING_NOK_TA_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [TAGS_FETCHED_NOK]: tagsErrorFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture },
]);

const HOME_ROUTE_LOADING_NOK_AT_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture },
  { [TAGS_FETCHED_NOK]: tagsErrorFixture },
]);

const HOME_ROUTE_LOADING_NOK_T$_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [TAGS_FETCHED_NOK]: tagsErrorFixture },
  { [ARTICLES_FETCHED_OK]: articlesFixture },
]);

const HOME_ROUTE_LOADING_NOK_$T_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [ARTICLES_FETCHED_OK]: articlesFixture },
  { [TAGS_FETCHED_NOK]: tagsErrorFixture },
]);

const HOME_ROUTE_LOADING_NOK_A$_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture },
  { [TAGS_FETCHED_OK]: tagsFixture },
]);

const HOME_ROUTE_LOADING_NOK_$A_SEQ = HOME_ROUTE_LOADING_SEQ.concat([
  { [TAGS_FETCHED_OK]: tagsFixture },
  { [ARTICLES_FETCHED_NOK]: articlesErrorFixture },
]);

const HOME_ROUTE_LOADING_SEQ_COMMANDS = [
  [
    { command: FETCH_GLOBAL_FEED, params: { page: 0 } },
    { command: RENDER, params: { tags: TAGS_ARE_LOADING, articles: ARTICLES_ARE_LOADING } }
  ]
];
const HOME_ROUTE_LOADED_OK_TA_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { tags: tagsFixture } }],
  [{ command: RENDER, params: { articles: articlesFixture } }]
]);
const HOME_ROUTE_LOADED_OK_AT_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { articles: articlesFixture } }],
  [{ command: RENDER, params: { tags: tagsFixture } }],
]);
const HOME_ROUTE_LOADING_NOK_TA_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { tags: tagsErrorFixture } }],
  [{ command: RENDER, params: { articles: articlesErrorFixture } }]
]);
const HOME_ROUTE_LOADING_NOK_AT_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { articles: articlesErrorFixture } }],
  [{ command: RENDER, params: { tags: tagsErrorFixture } }],
]);
const HOME_ROUTE_LOADING_NOK_T$_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { tags: tagsErrorFixture } }],
  [{ command: RENDER, params: { articles: articlesFixture } }]
]);
const HOME_ROUTE_LOADING_NOK_$T_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { articles: articlesFixture } }],
  [{ command: RENDER, params: { tags: tagsErrorFixture } }],
]);
const HOME_ROUTE_LOADING_NOK_A$_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { articles: articlesErrorFixture } }],
  [{ command: RENDER, params: { tags: tagsFixture } }],
]);
const HOME_ROUTE_LOADING_NOK_$A_SEQ_COMMANDS = HOME_ROUTE_LOADING_SEQ_COMMANDS.concat([
  [{ command: RENDER, params: { tags: tagsFixture } }],
  [{ command: RENDER, params: { articles: articlesErrorFixture } }]
]);

const UNAUTH_USER = null;
const UNAUTH_USER_ON_HOME_INPUTS = [
  { [ROUTE_CHANGED]: { hash: home } },
  { [AUTH_CHECKED]: { user: UNAUTH_USER } }
];

const UNAUTH_USER_ON_HOME_COMMANDS = page => ([
  [{ [FETCH_AUTHENTICATION]: void 0 }],
  [
    {
      [RENDER]: {
        tags: TAGS_ARE_LOADING,
        articles: ARTICLES_ARE_LOADING,
        activeFeed: GLOBAL_FEED,
        user: UNAUTH_USER
      }
    },
    { [FETCH_GLOBAL_FEED]: { page } },
  ]
]);

const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED = `Unauthenticated user navigates to *Home* page and sees the full global feed`;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS = [
    UNAUTH_USER_ON_HOME_INPUTS,
    { [TAGS_FETCHED_OK]: tagsFixture },
    { [ARTICLES_FETCHED_OK]: articlesFixture }
  ].flat()
;
const UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS = UNAUTH_USER_ON_HOME_COMMANDS(0).concat([
  [{ [RENDER]: { tags: tagsFixture } }],
  [{ [RENDER]: { articles: articlesFixture} }],
]);

const userStories = [
  [
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_INPUTS,
    UNAUTH_USER_ON_HOME_SEES_GLOBAL_FEED_COMMANDS
  ],
  // [`Successfully loading `, HOME_ROUTE_LOADED_OK_TA_SEQ, HOME_ROUTE_LOADED_OK_TA_SEQ_COMMANDS],
  // [`Successfully loading `, HOME_ROUTE_LOADED_OK_AT_SEQ, HOME_ROUTE_LOADED_OK_AT_SEQ_COMMANDS],
  // [`Failed loading - tags and articles`, HOME_ROUTE_LOADING_NOK_TA_SEQ, HOME_ROUTE_LOADING_NOK_TA_SEQ_COMMANDS],
  // [`Failed loading - tags and articles`, HOME_ROUTE_LOADING_NOK_AT_SEQ, HOME_ROUTE_LOADING_NOK_AT_SEQ_COMMANDS],
  // [`Failed loading - tags`, HOME_ROUTE_LOADING_NOK_T$_SEQ, HOME_ROUTE_LOADING_NOK_T$_SEQ_COMMANDS],
  // [`Failed loading - tags`, HOME_ROUTE_LOADING_NOK_$T_SEQ, HOME_ROUTE_LOADING_NOK_$T_SEQ_COMMANDS],
  // [`Failed loading - articles`, HOME_ROUTE_LOADING_NOK_A$_SEQ, HOME_ROUTE_LOADING_NOK_A$_SEQ_COMMANDS],
  // [`Failed loading - articles`, HOME_ROUTE_LOADING_NOK_$A_SEQ, HOME_ROUTE_LOADING_NOK_$A_SEQ_COMMANDS],
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };
// const fsmSettings = { debug: { console } };

userStories.forEach(([scenario, inputSeq, outputsSeq]) => {
  QUnit.test(scenario, function exec_test(assert) {
    const fsm = fsmFactory(fsmSettings);

    const actualOutputsSeq = computeCleanedActualOutputs(fsm, inputSeq);

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
        const actualOutputsReordered = expectedOutputsCollapsed.map(expectedOutputCollapsed => {
          const command = Object.keys(expectedOutputCollapsed)[0];
          const params = actualOutputsCollapsed[command];

          return command in actualOutputsCollapsed
            ? { command, params }
            : void 0
        });
        // => Array < {command, params} >   with same order than expectedOutputsCollapsed
        const expectedOutputsUnfolded = expectedOutputsCollapsed.map(expectedOutputCollapsed => {
          const command = Object.keys(expectedOutputCollapsed)[0];
          const params = expectedOutputCollapsed[command];

          return { command, params }
        });

        const passed = isTestPassed && deepEqual(actualOutputsReordered, expectedOutputsUnfolded);

        return {
          isTestPassed: passed,
          actualOutputsReorderedSeq: actualOutputsReorderedSeq.concat([actualOutputsReordered]),
          expectedOutputsUnfoldedSeq: expectedOutputsUnfoldedSeq.concat([expectedOutputsUnfolded]),
          // Accumulate failing indices
          indexWhenFailed: !passed ? indexWhenFailed.concat(index) : indexWhenFailed
        }
      }, { isTestPassed: true, actualOutputsReorderedSeq: [], expectedOutputsUnfoldedSeq: [], indexWhenFailed: [] });

    const errorMessage = `Actual outputs sequence differ from expected outputs sequence at index ${indexWhenFailed}`;
    const okMessage = prettyFormat(inputSeq);
    const message = isTestPassed ? okMessage : errorMessage;

    console.debug(`input sequence`, inputSeq);
    console.debug(`actual outputs sequence`, actualOutputsSeq);
    console.debug(`expected outputs sequence`, outputsSeq);
    // We have already determined if the test fails or not,
    // We run QUnit to get the nice diffs in case of failure!
    assert.deepEqual(actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, message);
  });
});

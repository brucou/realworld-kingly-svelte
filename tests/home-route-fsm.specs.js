import QUnit from "qunit"
import { NO_OUTPUT, fsmContracts } from "kingly"
import { commands, events, fsmFactory } from "../src/fsm"
import { loadingStates, routes } from "../src/constants"
import { articlesErrorFixture, articlesFixture } from "./fixtures/articles"
import { tagsErrorFixture, tagsFixture } from "./fixtures/tags"

// Cheapest deep equal possible
// Bit beware of caveats of JSON.stringify and the JSON format!
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Remove the NO_OUTPUT from the sequence of actions for comparison
// (NO_OUTPUT is an implementation detail that is not part of the specifications)
// It can occur when the machine traverses transient states and takes a transition without actions
function removeNoOutputs(arr){
  return arr.filter(x => x !== NO_OUTPUT)
}
function computeCleanedActualOutputs(fsm, inputSeq) {
  return inputSeq.map(fsm).map(removeNoOutputs);
}

QUnit.module("Testing home route fsm", {});

const [ROUTE_CHANGED, TAGS_FETCHED_OK, TAGS_FETCHED_NOK, ARTICLES_FETCHED_OK, ARTICLES_FETCHED_NOK] = events;
const [RENDER, FETCH_GLOBAL_FEED] = commands;
const { home } = routes;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;

const HOME_ROUTE_LOADING_SEQ = [
  { [ROUTE_CHANGED]: {hash:home} }
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
    { command: FETCH_GLOBAL_FEED, params: {page: 0} },
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

const fsmMapping = [
  [`Loading `, HOME_ROUTE_LOADING_SEQ, HOME_ROUTE_LOADING_SEQ_COMMANDS],
  [`Successfully loading `, HOME_ROUTE_LOADED_OK_TA_SEQ, HOME_ROUTE_LOADED_OK_TA_SEQ_COMMANDS],
  [`Successfully loading `, HOME_ROUTE_LOADED_OK_AT_SEQ, HOME_ROUTE_LOADED_OK_AT_SEQ_COMMANDS],
  [`Failed loading - tags and articles`, HOME_ROUTE_LOADING_NOK_TA_SEQ, HOME_ROUTE_LOADING_NOK_TA_SEQ_COMMANDS],
  [`Failed loading - tags and articles`, HOME_ROUTE_LOADING_NOK_AT_SEQ, HOME_ROUTE_LOADING_NOK_AT_SEQ_COMMANDS],
  [`Failed loading - tags`, HOME_ROUTE_LOADING_NOK_T$_SEQ, HOME_ROUTE_LOADING_NOK_T$_SEQ_COMMANDS],
  [`Failed loading - tags`, HOME_ROUTE_LOADING_NOK_$T_SEQ, HOME_ROUTE_LOADING_NOK_$T_SEQ_COMMANDS],
  [`Failed loading - articles`, HOME_ROUTE_LOADING_NOK_A$_SEQ, HOME_ROUTE_LOADING_NOK_A$_SEQ_COMMANDS],
  [`Failed loading - articles`, HOME_ROUTE_LOADING_NOK_$A_SEQ, HOME_ROUTE_LOADING_NOK_$A_SEQ_COMMANDS],
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };
// const fsmSettings = { debug: { console } };

fsmMapping.forEach(([scenario, inputSeq, outputsSeq]) => {
  QUnit.test(`Home route: ${scenario}`, function exec_test(assert) {
    const fsm = fsmFactory(fsmSettings);

    const actualOutputsSeq = computeCleanedActualOutputs(fsm, inputSeq);

    let indexWhenFailed = -1;
    const isTestPassed = inputSeq.every((input, index) => {
      const outputs = actualOutputsSeq[index];
      const expected = outputsSeq[index];
      const isTestPassed = deepEqual(outputs, expected);
      if (!isTestPassed) {indexWhenFailed = index}

      return isTestPassed
    });

    const errorMessage = `Actual outputs sequence differ from expected outputs sequence at index ${indexWhenFailed}`;
    const okMessage = `Alles gut!`;
    const message = isTestPassed ? okMessage : errorMessage;

    assert.deepEqual(actualOutputsSeq, outputsSeq, message);
  });
});

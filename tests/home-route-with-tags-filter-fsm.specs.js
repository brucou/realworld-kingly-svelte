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

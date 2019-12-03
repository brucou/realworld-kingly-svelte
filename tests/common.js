import { NO_OUTPUT } from "kingly"
import { renderCommands, routes  } from "../src/constants"
import { equals as deepEqual } from "ramda"
import { fsmFactory } from "../src/behaviour/fsm"
import prettyFormat from 'pretty-format'

export function formatIndex(i) {
  return typeof i === 'number'
    ? i === 0
      ? "1st"
      : i === 1
        ? "2nd"
        : (1 * i + 1) + "th"
    : i.map(formatIndex).join(', ')
}

const { home, signUp, signIn, editor, settings, profile, article } = routes;
const renderCommandRouteMap={
  RENDER_HOME: home,
  RENDER_SIGN_UP: signUp,
  RENDER_SIGN_IN: signIn,
  RENDER_EDITOR: editor,
  RENDER_SETTINGS: settings,
  RENDER_PROFILE: profile,
  RENDER_ARTICLE: article,
};

/**
 * Render commands are processed separately from the rest.
 * We merge props as they come, reproducing the behaviour of the render command of the app
 * (There is thus a dependency here with the render command of the app!!)
 * In the app, render props are merged per route, so we do the same here
 * @param {Array<CleanedMachineOutputs>} cleanedMachineOutputsSeq
 */
export function processRenderCommands(cleanedMachineOutputsSeq) {
  let renderPropsMap = {};
  return cleanedMachineOutputsSeq.map(cleanedMachineOutputs => {
    if (!cleanedMachineOutputs) return cleanedMachineOutputs;

      return cleanedMachineOutputs.map(cleanedMachineOutput => {
      const { command, params } = cleanedMachineOutput;

      if (Object.keys(renderCommands).indexOf(command) === -1) {
        return cleanedMachineOutput
      } else {
        const route = renderCommandRouteMap[command];
        renderPropsMap[route] = Object.assign({}, renderPropsMap[route], {route}, params);
        return { command, params: renderPropsMap[route] }
      }
    })
  })
}

// Remove the NO_OUTPUT from the sequence of actions for comparison
// (NO_OUTPUT is an implementation detail that is not part of the specifications)
// It can occur when the machine traverses transient states and takes a transition without actions
export function removeNoOutputs(arr) {
  return arr ? arr.filter(x => x !== NO_OUTPUT): NO_OUTPUT
}

/**
 * @typedef {[String, InputSeq, OutputsSeq]} UserStory a user story defined as a triple consisting
 * of a string describing the story, the sequence of inputs representing the story, and the expected
 * outputs for the inputs
 * Runs user stories through the machine and compares the machine outputs obtained against the
 * expected outputs.
 * Edge cases:
 * 1. User stories may have inputs which produce no commands (only updates)
 * 2. User stories may have inputs which produce no commands (no transitions available for that input)
 * In both cases, the expected outputs will be considered to be empty arrays.
 * An actual outputs [[null], null] corresponding to inputs for edge cases 1 and 2 will be compared
 * against [[] ,[]]
 * @param {Array<UserStory>} userStories
 * @param QUnit
 * @param {FSM_Settings} fsmSettings
 */
export function runUserStories(userStories, QUnit, fsmSettings){
  userStories.forEach(([scenario, inputSeq, outputsSeq]) => {
    if (inputSeq.length !== outputsSeq.length) {
      console.error(`inputSeq`, inputSeq);
      console.error(`outputsSeq`, outputsSeq);
      throw `Error in test scenario ${scenario}! Input sequences and outputs sequences must have the same length! Every input must map to an outputs array. You probably skip a such mapping! Remember that even if the outputs is the empty array (i.e. no outputs) it must still be set in the test scenario data structure. Cf. logs`
    }

    QUnit.test(scenario, function exec_test(assert) {
      const fsm = fsmFactory(fsmSettings);
      const rawOutputsSeq = inputSeq.map(fsm);

      // transforms [RENDER_HOME]: obj into {command: RENDER_HOME, params: obj}
      // also merge props, just like main.js > render!
      // so I have a dependency here with main.js
      const actualOutputsSeq = processRenderCommands(rawOutputsSeq.map(removeNoOutputs));

      const { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } =
        inputSeq.reduce((acc, input, index) => {
          let { isTestPassed, actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, indexWhenFailed } = acc;
          // outputs: [obj1, obj2] with objx : {command, params} || null || []
          const actualOutputs = actualOutputsSeq[index] || [];
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
          // We reorder so that [a, b] and [b, a] are considered equal
          // Our tests should be resilient to the fact that the implementation of commands may
          // differ in ordering. Ex: [RENDER_HOME, FETCH] same as [REDIRECT, FETCH]
          // In those cases where rendering matter (not happened yet), we will have to modify this
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
      const errorMessage = `For a sequence of ${inputSeq.length} inputs (${inputSeqFormatted}),\n the actual outputs sequence differ from the expected outputs sequence at the ${formatIndex(indexWhenFailed)} value of the sequence`;
      const okMessage = prettyFormat(inputSeq);
      const message = isTestPassed ? okMessage : errorMessage;

      console.debug(`input sequence`, inputSeq);
      console.debug(`raw outputs sequence`, rawOutputsSeq);
      console.debug(`actual outputs sequence`, actualOutputsSeq);
      console.debug(`actualOutputsReorderedSeq sequence`, actualOutputsReorderedSeq);
      console.debug(`expected outputs sequence`, outputsSeq);
      // We have already determined if the test fails or not,
      // We run QUnit to get the nice diffs in case of failure!
      assert.deepEqual(actualOutputsReorderedSeq, expectedOutputsUnfoldedSeq, message);
    });
  });
}

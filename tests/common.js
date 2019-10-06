import { NO_OUTPUT } from "kingly"
import { commands } from "../src/constants"

const [
  RENDER,
] = commands;

export function formatIndex(i) {
  return typeof i === 'number'
    ? i === 0
      ? "1st"
      : i === 1
        ? "2nd"
        : (1 * i + 1) + "th"
    : i.map(formatIndex).join(', ')
}

/**
 *
 * @param {Array<CleanedMachineOutputs>} cleanedMachineOutputsSeq
 */
export function processRenderCommands(cleanedMachineOutputsSeq) {
  let renderProps = {};
  return cleanedMachineOutputsSeq.map(cleanedMachineOutputs => {
    return cleanedMachineOutputs.map(cleanedMachineOutput => {
      const { command, params } = cleanedMachineOutput;

      if (command !== RENDER) {
        return cleanedMachineOutput
      } else {
        renderProps = Object.assign({}, renderProps, params);
        return { command, params: renderProps }
      }
    })
  })
}

// Remove the NO_OUTPUT from the sequence of actions for comparison
// (NO_OUTPUT is an implementation detail that is not part of the specifications)
// It can occur when the machine traverses transient states and takes a transition without actions
export function removeNoOutputs(arr) {
  return arr.filter(x => x !== NO_OUTPUT)
}


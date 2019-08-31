import { commands } from "../src/fsm"

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

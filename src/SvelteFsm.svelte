<script>
import {NO_OUTPUT, createStateMachine, COMMAND_RENDER} from "kingly"
import {commands, events, fsmFactory, fsmDef, properties} from "suspense-fsm"

// props
export let eventHandler;
export let fsmFactory;
export let commandHandlers;
export let effectHandlers;
export let env;

const next = eventHandler;
let data;

const defaultCommandHandlers = {}
const defaultEffectHandlers = {	};
const noop = () => {};
// const initEvent = {[START]: void 0}


// TODO: to refactor later, should force Svelte user to provide a render function
// Special handling of render command: compose default and custom processing
const customRender = commandHandlers && commandHandlers[COMMAND_RENDER] || noop;
const defaultRender = defaultCommandHandlers[COMMAND_RENDER] || noop;
let finalRenderHandler={};
if (customRender){
  finalRenderHandler = {
    [COMMAND_RENDER]: function compose(dispatch, params, effectHandlers){
    defaultRender(dispatch, params, effectHandlers);
    customRender (dispatch, params, effectHandlers);
    }
  }
}

const finalCommandHandlers = Object.assign({}, defaultCommandHandlers, commandHandlers, finalRenderHandler);
const finalEffectHandlers = Object.assign({}, defaultEffectHandlers, effectHandlers);

// Create the machine
const fsm = fsmFactory(Object.assign({}, env, {}));

// Subscribing to machine events
next.subscribe({
	next: event => {
          // 1. Run the input on the machine to obtain the actions to perform
          const actions = fsm(event);

          // 2. Execute the actions, if any
          if (actions === NO_OUTPUT) {return void 0;}
          else {
            const filteredActions = actions.filter(action => action !== NO_OUTPUT);
            filteredActions.forEach(action => {
              const { command, params } = action;

              const commandHandler = finalCommandHandlers[command];
              if (!commandHandler || typeof commandHandler !== "function") {
                throw new Error(
                  `Machine: Could not find command handler for command ${command}!`
                );
              }

              commandHandler(next, params, finalEffectHandlers);
            });

            return void 0;
          }
        },
        error: error => {
          // We may get there for instance if there was a preprocessor throwing an exception
          console.error(
            `<Machine/>: an error in the event processing chain! The machine will not process
            any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`,
            error
          );
        },
        complete: () => {
        }
});

	// initEvent && next(initEvent)

</script>

<slot></slot>

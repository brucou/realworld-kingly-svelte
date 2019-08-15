<script>
  import { NO_OUTPUT } from "kingly";

  // props
  export let eventHandler;
  export let fsmFactory;
  export let commandHandlers;
  export let effectHandlers;
  export let env;
  export let initEvent;

  const defaultCommandHandlers = {};
  const defaultEffectHandlers = {};
  const noop = () => {};

  const finalCommandHandlers = commandHandlers;
  const finalEffectHandlers = Object.assign(
    {},
    defaultEffectHandlers,
    effectHandlers
  );

  // Create the machine
  const fsm = fsmFactory(Object.assign({}, env, {}));
  const next = eventHandler.next.bind(eventHandler);

  // Subscribing to machine events
  eventHandler.subscribe({
    next: event => {
      // 1. Run the input on the machine to obtain the actions to perform
      const actions = fsm(event);

      // 2. Execute the actions, if any
      if (actions === NO_OUTPUT) {
        return void 0;
      } else {
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
    complete: () => {}
  });

  initEvent && next(initEvent);
</script>

<slot />

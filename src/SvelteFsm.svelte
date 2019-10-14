<script>
  import { NO_OUTPUT } from "kingly";

  // Svelte defines props for a component with the `export let` proprietary syntax
  export let eventBus;
  export let fsmFactory;
  export let commandHandlers;
  export let effectHandlers;
  export let env;
  export let initEvent = null;

  // Create the machine
  const fsm = fsmFactory(Object.assign({}, env));
  const next = eventBus.next.bind(eventBus);

  // Subscribing to machine events
  eventBus.subscribe({
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

          const commandHandler = commandHandlers[command];
          if (!commandHandler || typeof commandHandler !== "function") {
            throw new Error(`Machine: Could not find command handler for command ${command}!`);
          }

          commandHandler(next, params, effectHandlers);
        });

        return void 0;
      }
    },
    error: error => {
      // We may get there for instance if there was a preprocessor throwing an exception
      console.error(
        `<Machine/>: an error in the event processing chain! The machine will not process
            any additional events. Remember that command handlers ought never throw,
            but should pass errors as events.`,
        error
      );
    },
    complete: () => {}
  });

  initEvent && next(initEvent);
</script>

<slot />

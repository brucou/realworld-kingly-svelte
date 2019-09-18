<script>
  import { NO_OUTPUT } from "kingly";

  // Svelte defines props for a component with the `export let` proprietary syntax
  export let eventHandler;
  export let fsmFactory;
  export let commandHandlers;
  export let effectHandlers;
  export let env;
  export let initEvent;

  // Create the machine
  const fsm = fsmFactory(Object.assign({}, env));
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
        actions
          .filter(action => action !== NO_OUTPUT)
          .forEach(action => {
            const { command, params } = action;

            const commandHandler = commandHandlers[command];
            if (!commandHandler || typeof commandHandler !== "function") {
              throw new Error(
                `Machine: Could not find command handler for command ${command}!`
              );
            }

            commandHandler(next, params, effectHandlers);
          });

        return void 0;
      }
    },
    error: error => {
      console.error(
        `<SvelteFsm />: an error occurred in the event sources the event bus is subscribed to!`,
        error
      );
    },
    complete: () => {}
  });

  initEvent && next(initEvent);
</script>

<slot />

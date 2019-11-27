export default function eventEmitterFactory(emitonoff) {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  return {
    // NOTE: Next event cannot be on same tick! That destroys the machine semantics
    // Typically, we loose the relation outputss = fsm_h(inputs) because outputss may no longer
    // be in the same order as the inputs. So we schedule emission as a microtask
    next: x => Promise.resolve().then(()=>eventEmitter.emit(DUMMY_NAME_SPACE, x)),
    complete: () => subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
    subscribe: ({ next: f, error: _, complete: __ }) => {
      return subscribers.push(f), eventEmitter.on(DUMMY_NAME_SPACE, f);
    }
  };
}

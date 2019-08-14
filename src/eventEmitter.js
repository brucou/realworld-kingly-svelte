export default function eventEmitterFactory(emitonoff){
    const eventEmitter = emitonoff();
    const DUMMY_NAME_SPACE = "_";
    const subscribers = [];

    return {
      next: x => eventEmitter.emit(DUMMY_NAME_SPACE, x),
      complete: () => subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
      subscribe: ({ next: f, error: _, complete: __ }) => {
        return (subscribers.push(f), eventEmitter.on(DUMMY_NAME_SPACE, f));
      }
    }
}

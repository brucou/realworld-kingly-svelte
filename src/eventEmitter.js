export default function eventEmitterFactory(emitonoff) {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  const subject = {
    next: x => {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x);
      } catch (e) {
        subject.error(e);
      }
    },
    error: e => {
      throw e;
    },
    complete: () =>
      subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
    subscribe: ({next: f, error: errFn, complete: __}) => {
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return {unsubscribe: subject.complete};
    }
  };
  return subject;
}

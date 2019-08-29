export function not(f) {
  return function(...args) {
    return !f(...args);
  };
}

export function not(f) {
  return function(...args) {
    return !f(...args);
  };
}
export function and(f, g) {
  return function(...args) {
    return f(...args) && g(...args)
  };
}

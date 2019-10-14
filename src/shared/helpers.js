export function cleanHash(hash) {
  if (hash && hash.length) {
    return hash[0] === "/" ? hash.slice(1) : hash;
  }

  return hash;
}


/**
 * Returns b in #/a/b
 * @param {String} hash
 * @returns {String}
 */
export function getSlugFromHash(hash){
  if (hash.length === 0) return ""

  const hashParts = hash.split('/');
  return hashParts[1] || ""
}

export function isNot(guard){
  return function(a,b,c){
    return !guard(a,b,c)
  }
}

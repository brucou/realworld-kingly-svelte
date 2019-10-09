export function cleanHash(hash){
  if (hash && hash.length){
    return hash[0] === '/'
    ? hash.slice(1)
      : hash
  }

  return hash
}

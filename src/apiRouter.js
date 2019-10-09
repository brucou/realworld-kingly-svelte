export default function apiRouterFactory(location, addEventListener) {
  const api = {
    subscribe(listener) {
      addEventListener(
        "hashchange",
        ({ newURL, oldURL }) => {
          const hash = location.hash.replace(/^#\/?|\/$/g, "");
          listener({ newURL, oldURL, hash });
        },
        false
      );
    },
    getCurrentHash: () => location.hash.replace(/^#\/?|\/$/g, ""),
    redirect: newHash =>
      history.pushState(null, null, document.location.pathname + "#" + newHash)
  };

  return api;
}

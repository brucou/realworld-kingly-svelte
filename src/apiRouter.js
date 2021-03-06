export default function apiRouterFactory(location, addEventListener) {
  const api = {
    subscribe(listener) {
      addEventListener(
        "hashchange",
        ({ newURL, oldURL }) => {
          const hash = api.getCurrentHash();
          listener({ newURL, oldURL, hash });
        },
        false
      );
    },
    getCurrentHash: () => ["", location.hash.replace(/^#\/?|\/$/g, "")].join("/"),
    redirect: newHash => history.pushState(null, null, document.location.pathname + "#" + newHash)
  };

  return api;
}

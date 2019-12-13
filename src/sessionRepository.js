export default function sessionRepositoryFactory(localStorage, addEventListener) {
  const api = {
    save(user) {
      try {
        localStorage.setItem("session", JSON.stringify(user));
      } catch (e) {
        // console.error(e);
      }
    },
    load() {
      try {
        return JSON.parse(localStorage.getItem("session"));
      } catch (e) {
        return null;
      }
    },
    clear() {
      try {
        localStorage.removeItem("session");
      } catch (e) {
        // console.error(e);
      }
    },
    // NOTE: I haven't used it but it would have been a nice move to do so.
    // In the machine we wrote, we are constantly checking user authentication
    // It was smarter and also better for the bundle size to have the listener
    // update the machine state when a storage event occurs...
    // DOC: add to list of possible refactoring and improvement
    onChange(callback) {
      addEventListener(
        "storage",
        function(event) {
          if (event.storageArea === localStorage && event.key === "session") {
            callback(api.load());
          }
        },
        false
      );
    }
  };

  return api;
}

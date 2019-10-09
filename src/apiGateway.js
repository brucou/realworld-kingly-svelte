const API_ROOT = "https://conduit.productionready.io/api";

const isJson = response =>
  response.headers.get("content-type").indexOf("application/json") !== -1;

const configureFetch = (fetch, sessionRepository) => (url, options = {}) => {
  return fetch(API_ROOT + url, options).then(response => {
    if (isJson(response)) {
      if (response.status === 200) {
        return response.json();
      } else {
        return response.json().then(body => Promise.reject(body));
      }
    }
  });
};

const pagination = ({ page, limit }) => `limit=${limit}&offset=${page * 10}`;

const jsonBody = body => ({
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const apiGateway = (fetch, sessionRepository) => {
  const fetchWithToken = configureFetch(fetch, sessionRepository);
  const { load, clear, save, onChange } = sessionRepository;

  const get = url => fetchWithToken(url);
  const del = url => fetchWithToken(url, { method: "DELETE" });
  const post = (url, body) => {
    const options = Object.assign(
      {},
      { method: "POST" },
      body ? jsonBody(body) : {}
    );
    return fetchWithToken(url, options);
  };

  const fetchGlobalFeed = ({ page }) =>
    get(`/articles?${pagination({ page, limit: 10 })}`);
  const fetchTags = () => get("/tags");

  const fetchUserFeed = ({ page }) =>
    get(`/articles/feed?${pagination({ page, limit: 10 })}`);

  const fetchAuthentication = () => {
    console.debug('fetchAuthentication> user', load())
    return load();
  };

  const fetchTagFilteredFeed = ({ page, tag }) =>
    get(`/articles?tag=${tag}&${pagination({ page, limit: 10 })}`);

  const favoriteArticle = ({ slug }) => post(`/articles/${slug}/favorite`);
  const unfavoriteArticle = ({ slug }) => del(`/articles/${slug}/favorite`);

  const register = ({ email, password, username }) =>
    post("/users", { user: { email, password, username } });

  return {
    fetchGlobalFeed,
    fetchUserFeed,
    fetchTagFilteredFeed,
    fetchTags,
    fetchAuthentication,
    favoriteArticle,
    unfavoriteArticle,
    register
  };
};

export default apiGateway;

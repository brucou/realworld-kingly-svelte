// TODO: analyze size impact of ramda functions... better to get all ramda then rollup tree-shaking?
import mergeDeepWith from "ramda.mergedeepwith";
const concat = Array.prototype.concat;

const API_ROOT = "https://conduit.productionready.io/api";

const authHeader = sessionRepository => {
  const session = sessionRepository.load();
  return session && session.token
    ? {
        headers: {
          Authorization: `Token ${session.token}`
        }
      }
    : {};
};

const isJson = response => response.headers.get("content-type").indexOf("application/json") !== -1;

const configureFetch = (fetch, sessionRepository) => (url, options = {}) => {
  return fetch(API_ROOT + url, mergeDeepWith(concat, authHeader(sessionRepository), options)).then(
    response => {
      if (isJson(response)) {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.json().then(body => Promise.reject(body));
        }
      }
    }
  );
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

  const get = url => fetchWithToken(url);
  const del = url => fetchWithToken(url, { method: "DELETE" });
  const post = (url, body) => {
    const options = Object.assign({}, { method: "POST" }, body ? jsonBody(body) : {});
    return fetchWithToken(url, options);
  };
  const put = (url, body) => {
    const options = Object.assign({}, { method: "PUT" }, body ? jsonBody(body) : {});
    return fetchWithToken(url, options);
  };

  const fetchGlobalFeed = ({ page }) => get(`/articles?${pagination({ page, limit: 10 })}`);
  const fetchTags = () => get("/tags");

  const fetchUserFeed = ({ page }) => get(`/articles/feed?${pagination({ page, limit: 10 })}`);

  // TODO: refactor: move it to a shared.js. This is not part of the Conduit API...
  const { load, clear, save, onChange } = sessionRepository;
  const fetchAuthentication = () => {
    console.debug("fetchAuthentication> user", load());
    return load();
  };

  const fetchTagFilteredFeed = ({ page, tag }) =>
    get(`/articles?tag=${tag}&${pagination({ page, limit: 10 })}`);

  const favoriteArticle = ({ slug }) => post(`/articles/${slug}/favorite`);
  const unfavoriteArticle = ({ slug }) => del(`/articles/${slug}/favorite`);

  const register = ({ email, password, username }) =>
    post("/users", { user: { email, password, username } });
  const login = ({ email, password }) => post("/users/login", { user: { email, password } });

  const fetchArticle = ({ slug }) => get(`/articles/${slug}`);
  const saveArticle = ({ ...article }) => post("/articles", { article });
  const updateArticle = ({ slug, tagList, title, body, description }) =>
    put(`/articles/${slug}`, { tagList, title, body, description });

  const updateSettings = ({ user }) => put(`/user`, { user });

  const fetchProfile = ({ username }) => get(`/profiles/${encodeURIComponent(username)}`);
  const follow = ({ username }) => post(`/profiles/${encodeURIComponent(username)}/follow`);
  const unfollow = ({ username }) => del(`/profiles/${encodeURIComponent(username)}/follow`);
  const fetchAuthorFeed = ({ page, username }) =>
    get(
      `/articles?author=${encodeURIComponent(username)}&${pagination({
        page,
        limit: 5
      })}`
    );
  const fetchFavoritedFeed = ({ page, username }) =>
    get(
      `/articles?favorited=${encodeURIComponent(username)}&${pagination({
        page,
        limit: 5
      })}`
    );

  const fetchComments = ({ slug }) => get(`/articles/${slug}/comments`);
  const createComment = ({ slug, comment }) =>
    post(`/articles/${slug}/comments`, { comment: { body: comment } });
  const deleteComment = ({ slug, id }) => del(`/articles/${slug}/comments/${id}`);

  const deleteArticle = ({ slug }) => del(`/articles/${slug}`);

  return {
    fetchGlobalFeed,
    fetchUserFeed,
    fetchTagFilteredFeed,
    fetchTags,
    fetchAuthentication,
    favoriteArticle,
    unfavoriteArticle,
    register,
    login,
    fetchArticle,
    saveArticle,
    updateArticle,
    updateSettings,
    fetchProfile,
    follow,
    unfollow,
    fetchAuthorFeed,
    fetchFavoritedFeed,
    fetchComments,
    createComment,
    deleteComment,
    deleteArticle
  };
};

export default apiGateway;

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

const apiGateway = (fetch, sessionRepository) => {
  const fetchWithToken = configureFetch(fetch, sessionRepository);
  const {load, clear, save, onChange } = sessionRepository;

  const get = url => fetchWithToken(url);

  const fetchGlobalFeed = ({ page }) =>
    get(`/articles?${pagination({ page, limit: 10 })}`);
  const fetchTags = () => get("/tags");

  const fetchAuthentication = () => {
    return load();
  };

  return {
    fetchGlobalFeed,
    fetchTags,
    fetchAuthentication
  };
};

export default apiGateway;

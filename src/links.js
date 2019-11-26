export const HOME = "#/";
export const LOGIN = "#/login";
export const REGISTER = "#/register";
export const SETTINGS = "#/settings";
export const NEW_EDITOR = "#/editor";
export const EDITOR = "#/editor/:slug";
export const ARTICLE = "#/article/:slug";
export const PROFILE = "#/@:username";
export const PROFILE_FAVORITED = "#/@:username/favorites";

export const editorLink = slug => EDITOR.replace(":slug", slug);
export const userArticlesLink = username => PROFILE.replace(":username", username);
export const favoritedArticlesLink = username => PROFILE_FAVORITED.replace(":username", username);
export const articleLink = slug => ARTICLE.replace(":slug", slug);
export const profileLink = username => PROFILE.replace(":username", username);

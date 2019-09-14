import { articlesFixture } from "./articles"

// Dependency: favorited set to false
export const unfavoritedSlugFixture = articlesFixture.articles[0].slug;
export const updatedLikedArticleFixture = Object.assign({}, articlesFixture.articles[0], {favorited: true, favoritesCount: 1});
export const updatedLikedArticlesFixture = {
  articles: [
    updatedLikedArticleFixture,
    articlesFixture.articles.slice(1)
  ].flat(),
  articlesCount: articlesFixture.articlesCount
};
// Dependency: favorited set to true
export const favoritedSlugFixture = articlesFixture.articles[1].slug;
export const updatedUnlikedArticleFixture = Object.assign({}, articlesFixture.articles[1], {favorited: false, favoritesCount: 0});
export const updatedUnlikedArticlesFixture = {
  articles: [
    articlesFixture.articles[0],
    updatedUnlikedArticleFixture,
    articlesFixture.articles.slice(2)
  ].flat(),
  articlesCount: articlesFixture.articlesCount
};


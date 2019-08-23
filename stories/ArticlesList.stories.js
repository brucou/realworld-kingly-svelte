import { storiesOf } from '@storybook/svelte';
import { articlesErrorFixture, articlesFixture } from "../tests/fixtures/articles"
import { action } from '@storybook/addon-actions';

import ArticleList from '../src/UI/ArticleList.svelte';
import { viewModel } from "../src/constants"

const {
  tabs: [USER_FEED, GLOBAL_FEED],
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};
const { articles, articlesCount } = articlesFixture;
const onClickPage = action('onClickPage');
const onClickFavorite = action('onClickFavorite');

storiesOf('ArticleList', module)
  .add('ArticleList list loading - undefined articles', () => ({
    Component: ArticleList,
    props: { articles: void 0, articlesCount: 999, currentPage: 0, fetchStatus: LOADING },
    on: {},
  }))
  .add('ArticleList list loading - null articles', () => ({
    Component: ArticleList,
    props: { articles: null, articlesCount: 99, currentPage: 0, fetchStatus: LOADING},
    on: {},
  }))
  .add('ArticleList list loading - fetched articles', () => ({
    Component: ArticleList,
    props: { articles, articlesCount, currentPage: 0, fetchStatus: LOADING },
    on: {},
  }))
  .add('ArticleList fetched - non empty article list', () => ({
    Component: ArticleList,
    props: { articles, articlesCount, currentPage: 0, fetchStatus: OK, onClickPage, onClickFavorite },
    on: {},
  }))
  .add('ArticleList fetched - empty article list', () => ({
    Component: ArticleList,
    props: { articles: [], articlesCount, currentPage: 0, fetchStatus: OK , onClickPage, onClickFavorite},
    on: {},
  }))
  .add('ArticleList fetched - undefined article list', () => ({
    Component: ArticleList,
    props: { articles: void 0, articlesCount, currentPage: 0, fetchStatus: OK, onClickPage, onClickFavorite },
    on: {},
  }))
  .add('ArticleList fetch failed ', () => ({
    Component: ArticleList,
    props: { articles: articlesErrorFixture, fetchStatus: NOK },
    on: {},
  }))
  .add('no articles property!', () => ({
    Component: ArticleList,
    props: {},
    on: {},
  }))

import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import {articlesErrorFixture as _aEF, articlesFixture as _aF, articlesEmptyFixture as _aEmF} from "../tests/fixtures/articles"
import {tagsFixture as _tF, tagsErrorFixture as _tEF} from "../tests/fixtures/tags"

import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel } from "../src/constants"

const {
  tabs: [USER_FEED, GLOBAL_FEED, TAG_FILTER_FEED],
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

const userFixture = {
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};
const tagsFixture = {data: _tF.tags, fetchStatus: OK};
const tagsLoadingFixture = {data: void 0, fetchStatus: LOADING};
const tagsErrorFixture = {data: _tEF, fetchStatus: NOK};
const tagFixture = "min";
const articlesFixture = {data: _aF.articles, count:_aF.articlesCount, fetchStatus: OK};
const articlesLoadingFixture = {data: _aF.articles, count:_aF.articlesCount, fetchStatus: LOADING};
const articlesErrorFixture = {data: _aEF, fetchStatus: NOK};
const articlesEmptyFixture = {data: _aEmF.articles, count: _aEmF.articlesCount, fetchStatus: OK};
const favoriteStatusFixture = "someslug";
const dispatch = action('HomeRouteHandlers');

const {articles, articlesCount} = articlesFixture;
const allPropsUndefined = { };
const onClickUserFeedTab = action('onClickUserFeedTab');
const onClickGlobalFeedTab = action('onClickGlobalFeedTab ');
const onClickPage = action('onClickPage');
const onClickFavorite = action('onClickFavorite');

storiesOf('RealWorld - edge cases', module)
  .add('RealWorld - all props undefined', () => ({
    Component: RealWorld,
    props: allPropsUndefined,
    on: { },
  }))
  .add('RealWorld - user not authenticated, no tag filter, correct activeFeed, page 0, loading articles', () => ({
    Component: RealWorld,
    props: { articles: articlesLoadingFixture, tags:null, page: 0, activeFeed: GLOBAL_FEED, user: null  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, no tag filter, correct activeFeed, page 0, loading tags', () => ({
    Component: RealWorld,
    props: { articles: null, tags:tagsLoadingFixture, page: 0, activeFeed: GLOBAL_FEED, user: null  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, no tag filter, incorrect activeFeed, page 0, loading articles', () => ({
    Component: RealWorld,
    props: { articles: articlesLoadingFixture, tags:null, page: 0, activeFeed: USER_FEED, user: null  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, no tag filter, incorrect activeFeed, page 0, loading tags', () => ({
    Component: RealWorld,
    props: { articles: null, tags:tagsLoadingFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: null, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, no tag filter, correct activeFeed, correct page, error fetch tags', () => ({
    Component: RealWorld,
    props: { articles: null, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, tag filter, USER_FEED active, page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0, activeFeed: USER_FEED, user: null, selectedTag: tagFixture, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  // !!! It is possible to display results in violation of app rules
  // precisely because the UI layer knows nothing about app rules
  .add('RealWorld - user not authenticated, tag filter, USER_FEED active, page 0, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: USER_FEED, user: null, selectedTag: tagFixture, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  .add('RealWorld - user not authenticated, tag filter, GLOBAL_FEED active, page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, selectedTag: tagFixture, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  // Wrong feed
  .add('RealWorld - user authenticated, no tag filter, correct activeFeed, page 1, loading tags, loading articles', () => ({
    Component: RealWorld,
    props: { articles: articlesLoadingFixture, tags:tagsLoadingFixture, page: 1, activeFeed: GLOBAL_FEED, user: userFixture, onClickUserFeedTab, onClickGlobalFeedTab, onClickPage, onClickFavorite  },
    on: { },
  }))
  // clicked on articles but no articles
  .add('RealWorld - user authenticated, tag filter, TAG_FILTER_FEED, page 0, fetched tags, no articles, clicked on article', () => ({
    Component: RealWorld,
    props: { articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: userFixture, dispatch, selectedTag: tagFixture, favoriteStatus : favoriteStatusFixture },
    on: { },
  }))

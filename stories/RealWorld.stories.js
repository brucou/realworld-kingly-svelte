import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import {articlesErrorFixture as _aEF, articlesFixture as _aF, articlesEmptyFixture as _aEmF} from "../tests/fixtures/articles"
import {tagsFixture as _tF, tagsErrorFixture as _tEF} from "../tests/fixtures/tags"
import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel, routes } from "../src/constants"

const { home, signUp } = routes;
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
const tagsFixture = _tF;
const tagsLoadingFixture = LOADING;
const tagsErrorFixture = _tEF;
const tagFixture = "min";
const articlesFixture = _aF;
const articlesLoadingFixture = LOADING;
const articlesErrorFixture = _aEF;
const articlesEmptyFixture = _aEmF;
const favoriteStatus = null;
const favoriteStatusFixture= articlesFixture.articles[0].slug;
const dispatch = action('HomeRouteHandlers');

storiesOf('Home route - not authenticated', module)
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 1, loading tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsLoadingFixture, page: 1, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, correct page, fetched tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, dispatch },
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 0, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 1, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 1, activeFeed: GLOBAL_FEED, user: null, dispatch},
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 1, fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsFixture, page: 1, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 0, failed fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, no tag filter, correct activeFeed, page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, tag filter, TAG_FILTER_FEED active, page 0, fetched tags, fetched articles, onClickTag', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: null, selectedTag: tagFixture, dispatch  },
    on: { },
  }))

storiesOf('Home route -authenticated - global feed', module)
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 1, loading tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsLoadingFixture, page: 1, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, correct page, fetched tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: userFixture, dispatch },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 0, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 1, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 1, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 1, fetched tags, fetched articles, like article', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 1, activeFeed: GLOBAL_FEED, user: userFixture, dispatch, favoriteStatus: favoriteStatusFixture  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 1, fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsFixture, page: 1, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter,GLOBAL_FEED, page 0, failed fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))

storiesOf('Home route -authenticated - user feed', module)
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 1, loading tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsLoadingFixture, page: 1, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, correct page, fetched tags, loading articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesLoadingFixture, tags:tagsFixture, page: 0, activeFeed: USER_FEED, user: userFixture, dispatch },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 0, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 1, fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 1, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 1, fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsFixture, page: 1, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 0, failed fetched tags, fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsErrorFixture, page: 0, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 0, failed fetched tags, failed fetched articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesErrorFixture, tags:tagsErrorFixture, page: 0, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, tag filter, TAG_FILTER_FEED active, page 0, fetched tags, fetched articles, onClickTag', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: userFixture, selectedTag: tagFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, tag filter, TAG_FILTER_FEED active, page 0, fetched tags, fetched articles, clicked article', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: userFixture, selectedTag: tagFixture, dispatch, favoriteStatus: favoriteStatusFixture  },
    on: { },
  }))

storiesOf('Home route -no articles', module)
  .add('Home route -user not authenticated, no tag filter, GLOBAL_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: null, dispatch  },
    on: { },
  }))
  .add('Home route -user not authenticated, tag filter, TAG_FILTER_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: null, dispatch, selectedTag: tagFixture  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, GLOBAL_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: GLOBAL_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, no tag filter, USER_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: USER_FEED, user: userFixture, dispatch  },
    on: { },
  }))
  .add('Home route -user authenticated, tag filter, TAG_FILTER_FEED, page 0, fetched tags, no articles', () => ({
    Component: RealWorld,
    props: { route: home, articles: articlesEmptyFixture, tags:tagsFixture, page: 0, activeFeed: TAG_FILTER_FEED, user: userFixture, dispatch, selectedTag: tagFixture  },
    on: { },
  }))

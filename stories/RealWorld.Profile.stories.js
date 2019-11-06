import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import {articlesErrorFixture as _aEF, articlesFixture as _aF, articlesEmptyFixture as _aEmF} from "../tests/fixtures/articles"
import RealWorld from '../src/UI/RealWorld.svelte';
import { viewModel, routes, FAVORITE_PROFILE_PAGE, USER_PROFILE_PAGE } from "../src/constants"

const { home, profile } = routes;
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
const profileFixtureNotFollowing = {
  "username": userFixture.username,
  "bio": userFixture.bio,
  "image": userFixture.image,
  "following": false
};
const profileFixtureFollowing = {
  "username": "saed",
  "bio": "fake bio",
  "image": null,
  "following": true
};
const profileFixtureUnfollowingPending = {
  "username": "saed",
  "bio": "fake bio",
  "image": null,
  "following": null
};
const articlesFixture = _aF;
const articlesLoadingFixture = LOADING;
const articlesErrorFixture = _aEF;
const articlesEmptyFixture = _aEmF;
const favoriteStatus = null;
const favoriteStatusFixture= articlesFixture.articles[0].slug;
const dispatch = action('ProfileRouteHandlers');

storiesOf('Profile route - not authenticated', module)
  .add('Profile route - user not authenticated, page 0, My articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - user not authenticated, page 0, Favorited articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - user not authenticated, page 0, My articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - user not authenticated, page 0, Favorited articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - user not authenticated, page 0, My articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - user not authenticated, page 0, Favorited articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: null, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))

storiesOf('Profile route - own profile', module)
  .add('Profile route - user authenticated, page 0, My articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - own profile, page 0, Favorited articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - own profile, page 0, My articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - own profile, page 0, Favorited articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - own profile, page 0, My articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - own profile, page 0, Favorited articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureNotFollowing, favoriteStatus: null  },
    on: { },
  }))

storiesOf('Profile route - not own profile', module)
  .add('Profile route - user authenticated, page 0, My articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, My articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, My articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureFollowing, favoriteStatus: null  },
    on: { },
  }))

storiesOf('Profile route - not own profile - pending unfollow', module)
  .add('Profile route - user authenticated, page 0, My articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesLoadingFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, My articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, articles loaded', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, My articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: USER_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))
  .add('Profile route - not own profile, page 0, Favorited articles, error loading articles', () => ({
    Component: RealWorld,
    props: { route: profile, profileTab: FAVORITE_PROFILE_PAGE, articles: articlesErrorFixture, page: 0, user: userFixture, dispatch, profile: profileFixtureUnfollowingPending, favoriteStatus: null  },
    on: { },
  }))

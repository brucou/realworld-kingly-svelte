import QUnit from "qunit"
import { fsmContracts } from "kingly"
import { commands, events, FAVORITE_PROFILE_PAGE, loadingStates, routes, USER_PROFILE_PAGE } from "../src/constants"
import { userFixture, } from "./fixtures/user"
import { runUserStories } from "./common"
import { articlesErrorFixture, articlesFixture, articlesPage1Fixture } from "./fixtures/articles"
import {
  favoritedSlugFixture, unfavoritedSlugFixture, updatedLikedArticleFixture, updatedLikedArticlesFixture
} from "./fixtures/slugs"

QUnit.module("Testing user profile route fsm", {});

const {
  ROUTE_CHANGED,
  AUTH_CHECKED,
  CLICKED_PAGE,
  ARTICLES_FETCHED_OK,
  ARTICLES_FETCHED_NOK,
  TOGGLED_FAVORITE,
  FETCHED_PROFILE,
  FETCH_PROFILE_NOK,
  FOLLOW_OK,
  FOLLOW_NOK,
  UNFOLLOW_OK,
  UNFOLLOW_NOK,
  FAVORITE_NOK,
  FAVORITE_OK,
  UNFAVORITE_NOK,
  UNFAVORITE_OK,
  TOGGLED_FOLLOW,
} = events;
const {
  RENDER_PROFILE,
  FETCH_AUTHENTICATION,
  REDIRECT,
  FAVORITE_ARTICLE,
  UNFAVORITE_ARTICLE,
  FETCH_PROFILE,
  FETCH_AUTHOR_FEED,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
} = commands;

const { signUp, profile } = routes;
const profileError = new Error(`profile error`);
const articlesError = new Error(`articles error`);
const userProfileFixture = {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: false
};
const pendingUserProfileFixture= {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: false,
  pending: true
};
const followedProfileFixture = {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: true
};
const pendingFollowedProfileFixture= {
  username: 'sanders',
  bio: `bioinformatics`,
  image: null,
  following: true,
  pending: true
};
const OWN_PROFILE_MY_ARTICLES = `/@` + userFixture.username;
const PROFILE_MY_ARTICLES = `/@` + userProfileFixture.username;
const OWN_PROFILE_FAVORITED_ARTICLES = OWN_PROFILE_MY_ARTICLES + '/favorites';
const PROFILE_FAVORITED_ARTICLES = PROFILE_MY_ARTICLES + '/favorites';
const ownUserProfileFixture = {
  username: userFixture.username,
  bio: userFixture.bio,
  image: userFixture.image,
  following: false
};
const UNAUTH_USER = null;
const [TAGS_ARE_LOADING, ARTICLES_ARE_LOADING] = loadingStates;


// |(own profile, my articles)| like article, unlike article, change page|
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE = `User navigates to the profile route (My articles), sees own profile, own articles, likes and unlikes an article, and change page`;
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: OWN_PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false}},
  { [AUTH_CHECKED]: userFixture },
  {[FAVORITE_OK]: {article: updatedLikedArticleFixture, slug: unfavoritedSlugFixture}},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: true}},
  { [AUTH_CHECKED]: userFixture },
  {[UNFAVORITE_OK]: {article: articlesFixture.articles[0], slug: unfavoritedSlugFixture}},
  {[CLICKED_PAGE]: 1},
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesPage1Fixture},
].flat();
const USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
      route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
      },
    ],
    [
      {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
      route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: articlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
    }
  },
    {[FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: updatedLikedArticlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: updatedLikedArticlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
      }
    },
    {[UNFAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 1, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesPage1Fixture, favoriteStatus: null, page: 1}
    },
  ],
];

// |(own profile, favorite articles)| like article, unlike article, change page|
const USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE = `User navigates to the profile route (Favorite articles), sees own profile, own articles, likes and unlikes an article, and change page`;
const USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: OWN_PROFILE_FAVORITED_ARTICLES } },
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false}},
  { [AUTH_CHECKED]: userFixture },
  {[FAVORITE_OK]: {article: updatedLikedArticleFixture, slug: unfavoritedSlugFixture}},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: true}},
  { [AUTH_CHECKED]: userFixture },
  {[UNFAVORITE_OK]: {article: articlesFixture.articles[0], slug: unfavoritedSlugFixture}},
  {[CLICKED_PAGE]: 1},
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: ownUserProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesPage1Fixture},
].flat();
const USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 0, feedType: FAVORITE_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: FAVORITE_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: articlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
      }
    },
    {[FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: updatedLikedArticlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: FAVORITE_PROFILE_PAGE,
        user: userFixture,
        profile: ownUserProfileFixture,
        articles: updatedLikedArticlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
      }
    },
    {[UNFAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [{ [FETCH_AUTHENTICATION]: void 0 },],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 1, feedType: FAVORITE_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 1}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: userFixture, profile: ownUserProfileFixture, articles: articlesPage1Fixture, favoriteStatus: null, page: 1}
    },
  ],
];

// |(≠ profile, my articles)| follow user, unfollow user|
const USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS = `User navigates to the profile route (My articles), sees profile articles, follows and unfollows profile`;
const USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS_INPUTS = [
  { [ROUTE_CHANGED]: { hash: PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: UNAUTH_USER },
  {[FETCHED_PROFILE]: userProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FOLLOW]: {username: userProfileFixture.username}},
  {[FOLLOW_OK]: followedProfileFixture},
  {[TOGGLED_FOLLOW]: {username: userProfileFixture.username}},
  {[UNFOLLOW_OK]: userProfileFixture},
].flat();
const USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userProfileFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userProfileFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FOLLOW_PROFILE]: userProfileFixture.username},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: pendingUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0
      }},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: followedProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[UNFOLLOW_PROFILE]: userProfileFixture.username},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: pendingFollowedProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0
      }},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ]
];

// |(≠ profile, favorite articles)| follow user, unfollow user|
const USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS = `User navigates to the profile route (Favorite articles), sees profile articles, follows and unfollows profile`;
const USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS_INPUTS = [
  { [ROUTE_CHANGED]: { hash: PROFILE_FAVORITED_ARTICLES } },
  { [AUTH_CHECKED]: UNAUTH_USER },
  {[FETCHED_PROFILE]: userProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FOLLOW]: {username: userProfileFixture.username}},
  {[FOLLOW_OK]: followedProfileFixture},
  {[TOGGLED_FOLLOW]: {username: userProfileFixture.username}},
  {[UNFOLLOW_OK]: userProfileFixture},
].flat();
const USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userProfileFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userProfileFixture.username, page: 0, feedType: FAVORITE_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FOLLOW_PROFILE]: userProfileFixture.username},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: pendingUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0
      }},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: followedProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[UNFOLLOW_PROFILE]: userProfileFixture.username},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: pendingFollowedProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0
      }},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: FAVORITE_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ]
];

// |(own profile, my articles)| profile fetch fails, article fetch fails|
const USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE = `User navigates to his own profile route (My articles), fails to see own profile and articles`;
const USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: OWN_PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: userFixture },
  {[FETCH_PROFILE_NOK]: profileError},
  {[ARTICLES_FETCHED_NOK]: articlesError},
].flat();
const USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: articlesError, favoriteStatus: null, page: 0}
    },
  ],
];


// |(own profile, my articles)| follow user fails, like article fails, unlike article fails|
const USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE = `User navigates to own profile route (My articles), sees articles and fails to follow profile, fails to like and unlike articles`;
const USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE_INPUTS = [
  { [ROUTE_CHANGED]: { hash: PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: userFixture },
  {[FETCHED_PROFILE]: userProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FOLLOW]: {username: userProfileFixture.username}},
  {[FOLLOW_NOK]: new Error(`follow error`)},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false}},
  { [AUTH_CHECKED]: userFixture },
  {[FAVORITE_NOK]: {err: new Error(`favorite error`), slug: unfavoritedSlugFixture}},
  {[TOGGLED_FAVORITE]: {slug: favoritedSlugFixture, isFavorited: true}},
  { [AUTH_CHECKED]: userFixture },
  {[UNFAVORITE_NOK]: {err: new Error(`unfavorite error`), slug: favoritedSlugFixture}},
].flat();
const USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userProfileFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userProfileFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: userProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FOLLOW_PROFILE]: userProfileFixture.username},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: pendingUserProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0
      }},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: userFixture, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: userProfileFixture,
        articles: articlesFixture,
        favoriteStatus: unfavoritedSlugFixture,
        page: 0
      }
    },
    {[FAVORITE_ARTICLE]: { slug: unfavoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: userProfileFixture,
        articles: articlesFixture,
        favoriteStatus: null,
        page: 0
      }
    },
  ],
 [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: userProfileFixture,
        articles: articlesFixture,
        favoriteStatus: favoritedSlugFixture,
        page: 0
      }
    },
    {[UNFAVORITE_ARTICLE]: { slug: favoritedSlugFixture}},
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile,
        profileTab: USER_PROFILE_PAGE,
        user: userFixture,
        profile: userProfileFixture,
        articles: articlesFixture,
        favoriteStatus: null,
        page: 0
      }
    },
  ],
];

// |(# profile, my articles)| like article fails|
const USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED = `User navigates to a profile route (My articles), sees articles, attempts to like an article and is redirected to sign up page`;
const USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED_INPUTS = [
  { [ROUTE_CHANGED]: { hash: PROFILE_MY_ARTICLES } },
  { [AUTH_CHECKED]: UNAUTH_USER },
  {[FETCHED_PROFILE]: userProfileFixture},
  {[ARTICLES_FETCHED_OK]: articlesFixture},
  {[TOGGLED_FAVORITE]: {slug: unfavoritedSlugFixture, isFavorited: false}},
  { [AUTH_CHECKED]: UNAUTH_USER},
].flat();
const USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED_COMMANDS = [
  [
    { [FETCH_AUTHENTICATION]: void 0 },
    { [RENDER_PROFILE]: {
        "articles": null,
        "favoriteStatus": null,
        "page": 0,
        "profile": null,
        "profileTab": null,
        "route": profile,
        "user": null
      } },
  ],
  [
    {[FETCH_PROFILE]: userProfileFixture.username},
    {[FETCH_AUTHOR_FEED]: {username: userProfileFixture.username, page: 0, feedType: USER_PROFILE_PAGE }},
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: null, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: ARTICLES_ARE_LOADING, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[RENDER_PROFILE]: {
        route: profile, profileTab: USER_PROFILE_PAGE, user: UNAUTH_USER, profile: userProfileFixture, articles: articlesFixture, favoriteStatus: null, page: 0}
    },
  ],
  [
    {[FETCH_AUTHENTICATION]: void 0},
  ],
  [
    {[REDIRECT]: signUp},
    {[FETCH_AUTHENTICATION]: void 0},
  ],
];

const userStories = [
  [
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE,
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS,
    USER_SEES_OWN_PROFILE_AND_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS
  ],
  [
    USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE,
    USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_INPUTS,
    USER_SEES_OWN_PROFILE_AND_FAVORITE_ARTICLES_LIKES_UNLIKES_CHANGES_PAGE_COMMANDS
  ],
  [
    USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS,
    USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS_INPUTS,
    USER_SEES_PROFILE_ARTICLES_FOLLOWS_UNFOLLOWS_COMMANDS
  ],
  [
    USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS,
    USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS_INPUTS,
    USER_SEES_PROFILE_FAVORITE_ARTICLES_FOLLOWS_UNFOLLOWS_COMMANDS
  ],
  [
    USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE,
    USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE_INPUTS,
    USER_NAVIGATES_TO_OWN_PROFILE_SEES_NONE_COMMANDS
  ],
  [
    USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE,
    USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE_INPUTS,
    USER_NAVIGATES_TO_PROFILE_FAILS_FOLLOW_LIKE_UNLIKE_COMMANDS
  ],
  [
    USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED,
    USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED_INPUTS,
    USER_NAVIGATES_TO_PROFILE_LIKES_AND_IS_REDIRECTED_COMMANDS
  ]
];

const fsmSettings = { debug: { console, checkContracts: fsmContracts } };

runUserStories(userStories, QUnit, fsmSettings);
